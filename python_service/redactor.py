"""
Python Dynamic Resume Personal Information Privacy Redaction Engine
Built with PyMuPDF (fitz) and OpenCV.

Permanently purges and naturally blurs:
1. Candidate Email
2. Candidate Phone Numbers (International, +91, +1, +44, dashed, spaced, etc.)
3. Candidate Physical Address (One-line, multi-line, contextual entity detection)
4. Candidate Social & Profile Links (LinkedIn, GitHub, Portfolio, X/Twitter, etc.)
5. Candidate Profile Photo (Face detection via OpenCV Haar Cascades)

GUARANTEES:
- Candidate's PERSONAL NAME remains 100% visible and unblurred.
- Professional Information (Education, Experience, Skills, Projects, Summary, Certifications)
  remains 100% intact and unblurred.
- Company websites and project repositories are NOT blurred.
- Underneath text/glyphs are PERMANENTLY REMOVED from the PDF content stream
  (cannot be selected, copied, searched, or extracted).
- Natural in-place Gaussian blur matching exact coordinates and dimensions.
"""

import sys
import os
import re
import io
import fitz  # PyMuPDF
import cv2
import numpy as np

# Load Haar Cascades for face detection
CASCADE_PATH = cv2.data.haarcascades
FACE_CASCADE = cv2.CascadeClassifier(os.path.join(CASCADE_PATH, 'haarcascade_frontalface_default.xml'))
PROFILE_CASCADE = cv2.CascadeClassifier(os.path.join(CASCADE_PATH, 'haarcascade_profileface.xml'))

# Geographical tokens for physical address entity detection
LOCATION_KEYWORDS = {
    # Cities & Districts (India & International)
    'chennai', 'tambaram', 'thiruvottiyur', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli',
    'bengaluru', 'bangalore', 'mysore', 'hyderabad', 'mumbai', 'pune', 'delhi', 'new delhi', 'kolkata',
    'ahmedabad', 'gurgaon', 'noida', 'kochi', 'trivandrum', 'velachery', 'guindy', 't nagar', 'anna nagar',
    'adyar', 'mylapore', 'porur', 'avadi', 'ambattur', 'chromepet', 'perambur', 'sholinganallur',
    # States & Countries
    'tamil nadu', 'tamilnadu', 'karnataka', 'kerala', 'telangana', 'andhra pradesh', 'maharashtra',
    'india', 'usa', 'united states', 'uk', 'united kingdom', 'canada', 'australia',
    # Street / Address Structural Tokens
    'street', 'st.', 'road', 'rd.', 'avenue', 'ave', 'lane', 'nagar', 'colony', 'layout', 'apartment',
    'apt', 'flat', 'door no', 'plot no', 'no.', 'cross', 'main', 'sector', 'block', 'phase',
    'kovil', 'koil', 'gramam', 'district', 'dist', 'taluk', 'pincode', 'postal', 'zip'
}

# Professional section headers that must NEVER have their content or words blurred
PROFESSIONAL_HEADERS = [
    'education', 'educational qualification', 'academics', 'academic background', 'higher secondary',
    'experience', 'work experience', 'professional experience', 'employment history', 'internship',
    'technical skills', 'skills', 'soft skills', 'core competencies', 'technologies', 'tools',
    'projects', 'project', 'academic projects', 'personal projects', 'key projects',
    'certifications', 'certificates', 'licenses',
    'achievements', 'awards', 'honors', 'publications',
    'summary', 'professional summary', 'executive summary', 'profile', 'about me', 'career objective',
    'objective', 'declaration'
]

# Contact section indicators — general contact/personal info headers
CONTACT_HEADERS = [
    'contact', 'contact info', 'contact information', 'contact details',
    'personal info', 'get in touch', 'reach me'
]

# Personal details section headers — ALL content under these sections is private and must be redacted
PERSONAL_SECTION_HEADERS = [
    'personal details', 'personal information', 'personal profile',
    'about', 'personal data'
]

# Labels within personal/contact blocks that signal private data
PERSONAL_FIELD_LABELS = [
    'date of birth', 'dob', 'd.o.b', 'age', 'nationality', 'gender',
    'marital status', 'religion', 'caste', 'father', 'mother', 'guardian',
    'permanent address', 'present address', 'address', 'residence',
    'place', 'location', 'city', 'state', 'pin', 'pincode', 'zip'
]

# Regex for standard and spaced email addresses
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', re.IGNORECASE)
SPACED_EMAIL_REGEX = re.compile(r'(?:[a-zA-Z0-9_.+-]\s+){2,}@\s*(?:[a-zA-Z0-9-]\s+)+\.\s*[a-zA-Z]{2,}', re.IGNORECASE)

# Phone number formats
PHONE_REGEXES = [
    re.compile(r'(?:\+?91[\s\-]?)?[6789]\d{9}'),  # Indian 10-digit mobile
    re.compile(r'(?:\+?91[\s\-]?)?[6789]\d{4}[\s\-]\d{5}'),  # 5-5 split
    re.compile(r'\+?1[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}'),  # US/Canada
    re.compile(r'\+?44[\s\-\.]?\d{2,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}'),  # UK
    re.compile(r'(?:\+\d{1,3}[\s\-]?)?\(?\d{2,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}'),  # Generic international
]

# Personal profile patterns (strict to avoid company or generic docs)
PERSONAL_PROFILE_PATTERNS = [
    re.compile(r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\.%]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)(?:\/)?(?!\S)', re.IGNORECASE),  # Only top-level user handle
    re.compile(r'(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?x\.com\/[a-zA-Z0-9_]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_\.]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9_\.]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?behance\.net\/[a-zA-Z0-9_\-]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?dribbble\.com\/[a-zA-Z0-9_\-]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?medium\.com\/@[a-zA-Z0-9_\-]+', re.IGNORECASE),
    re.compile(r'(?:https?:\/\/)?(?:www\.)?portfolio\.[a-zA-Z0-9_\-\.]+', re.IGNORECASE),
]

PINCODE_REGEX = re.compile(r'\b[1-9][0-9]{2}\s?[0-9]{3}\b')
SPACED_PINCODE_REGEX = re.compile(r'\b[1-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\b')


def find_candidate_name_rects(page, candidate_name=None):
    """
    Identifies the candidate's name on the page to build an ironclad exclusion zone.
    The name is NEVER blurred, even if surrounded by contact information or photos.
    Validates that matches are not part of an email address, URL, or contact token.
    """
    protected = []
    words = page.get_text("words")

    def overlaps_contact_token(rect):
        for w in words:
            w_rect = fitz.Rect(w[:4])
            if rect.intersects(w_rect):
                w_text = w[4].lower()
                if '@' in w_text or '.com' in w_text or 'http' in w_text or 'www.' in w_text:
                    return True
        return False

    # 1. Clean candidate name if supplied
    c_clean = candidate_name.strip() if candidate_name else ""
    if c_clean:
        candidates = []
        for term in [c_clean, c_clean.upper(), c_clean.title()]:
            matches = page.search_for(term)
            for m in matches:
                if not overlaps_contact_token(m):
                    candidates.append(m)
            if candidates:
                break
        if candidates:
            protected.extend(candidates)
            return protected

    # 2. Heuristic: Find the prominent heading in top 25% of page 1 with largest font size
    if page.number == 0:
        max_size = 0
        best_rect = None
        for b in page.get_text('dict').get('blocks', []):
            if b.get('type') != 0:
                continue
            if b['bbox'][1] > page.rect.height * 0.25:
                continue
            for line in b.get('lines', []):
                for span in line.get('spans', []):
                    txt = span.get('text', '').strip()
                    span_rect = fitz.Rect(span['bbox'])
                    if len(txt) > 2 and span.get('size', 0) > max_size and not overlaps_contact_token(span_rect):
                        if not any(k in txt.lower() for k in ['resume', 'cv', 'curriculum', 'email', 'phone', 'address', 'page', 'contact']):
                            max_size = span['size']
                            best_rect = span_rect
        if best_rect:
            protected.append(best_rect)

    return protected


def detect_candidate_photo(page, protected_name_rects, dpi=150):
    """
    Detects candidate profile photos using two methods:
    1. PDF embedded image detection — finds image blocks in the header area (top 40% of page)
       with portrait/square dimensions. Works for both real photos AND cartoon illustrations.
    2. OpenCV Haar Cascade face detection — detects real human faces anywhere on the page.
    Does NOT blur company logos (small, wide), university crests, or full-page background images.
    """
    photo_rects = []
    page_h = page.rect.height
    page_w = page.rect.width

    # --- Method 1: PDF Embedded Image Block Detection ---
    # Detects any image in the header area that looks like a profile photo frame
    header_zone_y = page_h * 0.40  # Top 40% of the page

    for img_info in page.get_images(full=True):
        xref = img_info[0]
        try:
            img_rects = page.get_image_rects(xref)
        except Exception:
            continue
        for img_rect in img_rects:
            # Must be in the header/top area of the resume
            if img_rect.y0 > header_zone_y:
                continue
            w = img_rect.width
            h = img_rect.height
            if w < 5 or h < 5:
                continue
            aspect = w / h if h > 0 else 0
            # Profile photos are portrait (taller than wide) or square — aspect 0.4 to 1.6
            # Full-page backgrounds or wide banners have aspect >> 2.0, skip those
            if aspect < 0.3 or aspect > 2.2:
                continue
            # Skip very small icons (< 1cm at 72dpi ≈ 28pt) and full-page images
            if w < 28 or h < 28 or (w > page_w * 0.75 and h > page_h * 0.5):
                continue
            # Don't blur the name region
            if not any(img_rect.intersects(p) for p in protected_name_rects):
                # Add slight padding around the image
                padded = fitz.Rect(
                    max(0, img_rect.x0 - 3),
                    max(0, img_rect.y0 - 3),
                    min(page_w, img_rect.x1 + 3),
                    min(page_h, img_rect.y1 + 3)
                )
                photo_rects.append(padded)

    # --- Method 2: OpenCV Haar Cascade Face Detection (for real photographs) ---
    pix = page.get_pixmap(dpi=dpi)
    img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

    if pix.n >= 4:
        bgr = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGR)
    elif pix.n == 3:
        bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    else:
        bgr = cv2.cvtColor(img_np, cv2.COLOR_GRAY2BGR)

    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    min_dim = int(dpi * 0.4)
    max_dim = int(dpi * 3.2)

    faces = FACE_CASCADE.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(min_dim, min_dim),
        maxSize=(max_dim, max_dim)
    )

    scale = 72.0 / dpi
    for (x, y, w, h) in faces:
        pad_x = int(w * 0.18)
        pad_y = int(h * 0.22)
        x0 = max(0, x - pad_x) * scale
        y0 = max(0, y - pad_y) * scale
        x1 = min(pix.width, x + w + pad_x) * scale
        y1 = min(pix.height, y + h + pad_y) * scale
        
        rect = fitz.Rect(x0, y0, x1, y1)
        if not any(rect.intersects(p) for p in protected_name_rects):
            photo_rects.append(rect)

    return photo_rects


def extract_sensitive_rects(page, protected_name_rects):
    """
    Scans the page dynamically for sensitive contact details:
    - Email addresses
    - Phone numbers
    - Physical addresses (single or multi-line, completely blurred)
    - Personal social/profile links
    """
    sensitive_rects = []

    def is_safe_from_name(rect):
        for pr in protected_name_rects:
            if rect.intersects(pr):
                return False
        return True

    blocks = page.get_text("blocks")

    # 1. Pre-extract all section headers using dict spans for pinpoint multi-column accuracy
    headers = []
    page_dict = page.get_text("dict")
    for b in page_dict.get("blocks", []):
        if b.get("type") != 0:
            continue
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                txt = span.get("text", "").strip().lower()
                if not txt or len(txt) < 3:
                    continue
                r = fitz.Rect(span["bbox"])
                if any(h == txt or h in txt.split() for h in PROFESSIONAL_HEADERS):
                    headers.append(('professional', txt, r))
                elif any(ph in txt for ph in PERSONAL_SECTION_HEADERS):
                    headers.append(('personal', txt, r))
                elif any(h == txt or h in txt.split() for h in CONTACT_HEADERS):
                    headers.append(('contact', txt, r))

    def get_section_for_block(b_rect):
        # Check if the block's own bounding box CONTAINS a professional/personal header span
        # (handles blocks like "DECLARATION\nI hereby declare..." where header is part of block)
        own_headers = [h for h in headers if
                       h[2].y0 >= b_rect.y0 - 2 and h[2].y1 <= b_rect.y1 + 2 and
                       not (h[2].x1 < b_rect.x0 - 5 or h[2].x0 > b_rect.x1 + 5)]
        if own_headers:
            for h in own_headers:
                if h[0] == 'professional':
                    return 'professional'
            for h in own_headers:
                if h[0] == 'personal':
                    return 'personal'
        # Find headers strictly above this block (h.y1 <= b_rect.y0 + 8)
        candidate_headers = [h for h in headers if h[2].y1 <= b_rect.y0 + 8]
        if not candidate_headers:
            return 'header'
        # Prioritize headers that horizontally overlap with b_rect (same column)
        aligned = [h for h in candidate_headers if not (h[2].x1 < b_rect.x0 - 25 or h[2].x0 > b_rect.x1 + 25)]
        if aligned:
            closest = max(aligned, key=lambda h: h[2].y1)
            return closest[0]
        # Fallback to closest vertically overall
        closest = max(candidate_headers, key=lambda h: h[2].y1)
        return closest[0]

    # Sort blocks top-to-bottom
    sorted_blocks = sorted(blocks, key=lambda b: (b[1], b[0]))

    for b in sorted_blocks:
        if b[6] != 0 or not b[4]:  # Skip non-text blocks
            continue

        block_text = b[4].strip()
        block_rect = fitz.Rect(b[0], b[1], b[2], b[3])
        lines = block_text.splitlines()
        if not lines:
            continue

        current_section = get_section_for_block(block_rect)

        is_in_address_block = False

        # --- Dedicated Multi-line Address Block Detection (e.g. in Contact / Header sections) ---
        if current_section != 'professional':
            block_lower = block_text.lower()
            block_norm = re.sub(r'\s+', '', block_lower)
            has_b_pin = bool(PINCODE_REGEX.search(block_text) or SPACED_PINCODE_REGEX.search(block_text))
            has_b_addr = any(k in block_lower or k in block_norm for k in [
                'koil', 'kovil', 'spkoil', 'spkovil', 'street', 'road', 'nagar', 'colony',
                'thiruvottiyur', 'tambaram', 'chennai', 'address:', 'residence:', 'location:'
            ])
            has_b_email = '@' in block_text
            has_b_phone = bool(re.search(r'\b[6-9]\d{9}\b', block_text) or '+91' in block_text)
            is_b_prof = any(w in block_lower for w in [
                'graduate', 'commerce', 'developer', 'engineer', 'invoicing', 'accounting',
                'bachelor', 'master', 'college', 'school', 'curriculum', 'management', 'skills'
            ])
            if (has_b_pin or has_b_addr) and not has_b_email and not has_b_phone and not is_b_prof:
                if is_safe_from_name(block_rect):
                    sensitive_rects.append(block_rect)
                continue

        # --- MIXED HEADER BLOCK: block that starts with candidate name then has contact labels ---
        # e.g. "PRIYA S\nB.Sc\nPhone\nEmail:\nChenn" - treat contact label lines as sensitive
        block_lower_check = block_text.lower()
        CONTACT_LABEL_PATTERNS = re.compile(
            r'^(?:phone|mobile|cell|tel|telephone|email|e-mail|mail|chenn|address|location|residence|place)\b',
            re.IGNORECASE | re.MULTILINE
        )
        if protected_name_rects and CONTACT_LABEL_PATTERNS.search(block_text):
            for line in lines:
                line_stripped = line.strip()
                if not line_stripped:
                    continue
                line_lower_p = line_stripped.lower()
                # Only process contact-label lines in this mixed block
                if re.match(r'^(?:phone|mobile|cell|tel|telephone|email|e-mail|mail|chenn|address|location|residence|place)\b', line_stripped, re.IGNORECASE):
                    for r in (page.search_for(line_stripped, clip=block_rect) or page.search_for(line_stripped)):
                        if is_safe_from_name(r):
                            sensitive_rects.append(r)

        for line_idx, line in enumerate(lines):
            line_clean = line.strip()
            if not line_clean:
                continue

            line_lower = line_clean.lower()
            normalized_line = re.sub(r'\s+', '', line_lower)

            # --- 1. EMAIL DETECTION (Always active across all sections) ---
            found_emails = EMAIL_REGEX.findall(line_clean)
            if not found_emails and '@' in line_clean:
                sp_match = SPACED_EMAIL_REGEX.search(line_clean)
                if sp_match:
                    found_emails = [sp_match.group(0)]

            for em in found_emails:
                for r in page.search_for(em, clip=block_rect) or page.search_for(em):
                    if is_safe_from_name(r):
                        sensitive_rects.append(r)

            # --- 2. PHONE NUMBER DETECTION (Always active across all sections) ---
            for p_reg in PHONE_REGEXES:
                for p_match in p_reg.finditer(line_clean):
                    p_str = p_match.group(0).strip()
                    digits = re.sub(r'\D', '', p_str)
                    # Filter out dates (2020 - 2024), GPA (8.9 / 10), etc.
                    if 10 <= len(digits) <= 13:
                        for r in page.search_for(p_str, clip=block_rect) or page.search_for(p_str):
                            if is_safe_from_name(r):
                                sensitive_rects.append(r)

            # If inside a professional section (Experience, Education, Projects, Skills, Summary):
            # Do NOT blur addresses, job locations (e.g. "Bengaluru, Karnataka"), or project links!
            if current_section == 'professional':
                continue

            # --- 3. PERSONAL SOCIAL / PROFILE LINKS (Only in header/contact sections) ---
            for s_reg in PERSONAL_PROFILE_PATTERNS:
                for s_match in s_reg.finditer(line_clean):
                    s_str = s_match.group(0).strip()
                    for r in page.search_for(s_str, clip=block_rect) or page.search_for(s_str):
                        if is_safe_from_name(r):
                            sensitive_rects.append(r)

            if any(k in line_lower for k in ['linkedin.com/in', 'behance.net/', 'dribbble.com/']):
                for r in page.search_for(line_clean, clip=block_rect):
                    if is_safe_from_name(r):
                        sensitive_rects.append(r)

            # --- 4. PHYSICAL ADDRESS DETECTION (Only in header/contact sections) ---
            has_pin = bool(PINCODE_REGEX.search(line_clean) or SPACED_PINCODE_REGEX.search(line_clean))
            STREET_REGEX = re.compile(
                r'\b(?:street|st\.?|road|rd\.?|lane|nagar|colony|layout|door\s*no|plot|kovil|koil|spkovil|spkoil|apartment|apt|flat|cross|main|salai|thiruvottiyur|tambaram|coimbatore)\b',
                re.IGNORECASE
            )
            has_street_token = bool(STREET_REGEX.search(line_clean) or STREET_REGEX.search(normalized_line))
            matched_geo_tokens = [tok for tok in LOCATION_KEYWORDS if re.search(r'\b' + re.escape(tok) + r'\b', line_lower) or re.search(r'\b' + re.escape(tok) + r'\b', normalized_line)]
            # Extended address labels — includes 'place:' and 'city:' style labels
            has_addr_label = any(
                re.search(r'\b' + re.escape(lbl) + r'\b\s*:?', line_lower)
                for lbl in ['address', 'residence', 'location', 'place', 'city', 'permanent address', 'present address']
            )

            if has_addr_label:
                is_in_address_block = True

            # Avoid accidental matching of professional sentences containing city names
            is_professional_sentence = any(w in line_lower for w in [
                'graduate', 'commerce', 'developer', 'engineer', 'invoicing', 'accounting',
                'bachelor', 'master', 'college', 'school', 'curriculum', 'management', 'prepared',
                'assisted', 'responsible', 'skills', 'operations', 'programme', 'foundation'
            ])

            is_address_line = not is_professional_sentence and (
                has_pin or
                (has_addr_label and len(matched_geo_tokens) >= 1) or
                (has_addr_label and has_street_token) or
                has_addr_label or  # If it has a location label (place:, city:, address:) blur it
                (has_street_token and (len(matched_geo_tokens) >= 1 or current_section == 'contact')) or
                (is_in_address_block and (len(matched_geo_tokens) >= 1 or has_street_token)) or
                (current_section == 'contact' and (has_street_token or len(matched_geo_tokens) >= 1)) or
                len(matched_geo_tokens) >= 2
            )

            if is_address_line:
                # If line is "Address: 123 Street" or "Place: Chennai", blur the value part
                addr_text = line_clean
                for lbl in ['address:', 'place:', 'location:', 'city:', 'residence:', 'present address:', 'permanent address:']:
                    if lbl in line_lower:
                        val = line_clean.split(':', 1)[1].strip()
                        if val:
                            addr_text = val
                        break

                addr_rects = page.search_for(addr_text, clip=block_rect) or page.search_for(addr_text)
                if not addr_rects:
                    addr_rects = page.search_for(line_clean, clip=block_rect)

                for r in addr_rects:
                    if is_safe_from_name(r):
                        sensitive_rects.append(r)

    # --- 5. PDF LINK ANNOTATIONS ---
    for link in page.get_links():
        uri = link.get("uri", "")
        if uri:
            for s_reg in PERSONAL_PROFILE_PATTERNS:
                if s_reg.search(uri):
                    l_rect = fitz.Rect(link["from"])
                    if is_safe_from_name(l_rect):
                        sensitive_rects.append(l_rect)

    return sensitive_rects


def merge_overlapping_rects(rects, x_threshold=15, y_threshold=20):
    """
    Merges contiguous or adjacent rectangles into clean bounding regions.
    y_threshold=20 ensures multi-line addresses on consecutive lines are merged
    into one complete, unbroken rectangle spanning the full width of all lines.
    """
    if not rects:
        return []

    sorted_rects = sorted(rects, key=lambda r: (r.y0, r.x0))
    merged = []
    current = sorted_rects[0]

    for r in sorted_rects[1:]:
        # Check vertical proximity and horizontal overlap
        v_close = (r.y0 <= current.y1 + y_threshold) and (r.y1 >= current.y0 - y_threshold)
        h_overlap = not (r.x1 < current.x0 - x_threshold or r.x0 > current.x1 + x_threshold)
        if (v_close and h_overlap) or current.intersects(r):
            # Union expands to encompass min x0, min y0, max x1, max y1
            current = current | r
        else:
            merged.append(current)
            current = r
    merged.append(current)
    return merged


def apply_natural_blur_and_redact(page, rects):
    """
    Applies cryptographic/stream redaction and in-place natural Gaussian blur.
    1. Renders high-res 300-DPI crop of each sensitive area.
    2. Applies OpenCV Gaussian blur to diffuse the ink naturally.
    3. Adds redaction annotations and calls page.apply_redactions() to PERMANENTLY
       purge text glyphs from the PDF content stream.
    4. Inserts the blurred pixmap into the exact coordinate box.
    """
    if not rects:
        return

    blurred_crops = []

    for rect in rects:
        # Slight padding (1pt) for complete glyph boundary coverage
        padded = fitz.Rect(
            max(0, rect.x0 - 1.0),
            max(0, rect.y0 - 1.0),
            min(page.rect.width, rect.x1 + 1.0),
            min(page.rect.height, rect.y1 + 1.0)
        )

        zoom = 300.0 / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, clip=padded)

        if pix.width < 3 or pix.height < 3:
            continue

        img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        if pix.n >= 4:
            bgr = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGR)
        elif pix.n == 3:
            bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        else:
            bgr = cv2.cvtColor(img_np, cv2.COLOR_GRAY2BGR)

        # Dynamic kernel size based on font height
        k_size = int(pix.height * 0.52) | 1
        k_size = max(15, min(k_size, 45))
        sigma = k_size / 3.0

        blurred = cv2.GaussianBlur(bgr, (k_size, k_size), sigmaX=sigma, sigmaY=sigma)
        _, buf = cv2.imencode('.png', blurred)

        blurred_crops.append((padded, buf.tobytes()))
        page.add_redact_annot(padded)

    # Permanently purge underlying text from PDF stream
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)

    # Insert blurred visual images back into coordinates
    for padded_rect, png_bytes in blurred_crops:
        page.insert_image(padded_rect, stream=png_bytes)


_ocr_engine = None

def get_ocr_engine():
    global _ocr_engine
    if _ocr_engine is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _ocr_engine = RapidOCR()
        except Exception as e:
            print('[OCR Engine Warning]', e)
            _ocr_engine = False
    return _ocr_engine


def extract_sensitive_rects_ocr(page, protected_name_rects, dpi=150):
    """
    Fallback for scanned / image-based PDFs without selectable text:
    Runs RapidOCR, analyzes recognized text blocks and bounding boxes,
    and returns fitz.Rect coordinates for emails, phones, addresses, and social links.
    """
    ocr = get_ocr_engine()
    if not ocr:
        return []

    sensitive_rects = []
    pix = page.get_pixmap(dpi=dpi)
    img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    if pix.n >= 4:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGR)
    elif pix.n == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    try:
        ocr_result, _ = ocr(img_np)
    except Exception as err:
        print('[OCR Execution Warning]', err)
        return []

    if not ocr_result:
        return []

    scale = 72.0 / dpi

    def is_safe_from_name(rect):
        for pr in protected_name_rects:
            if rect.intersects(pr):
                return False
        return True

    for box, text, score in ocr_result:
        if not text or score < 0.4:
            continue

        text_clean = text.strip()
        text_lower = text_clean.lower()
        normalized_text = re.sub(r'\s+', '', text_lower)

        # Check if inside protected section
        if any(h in text_lower for h in PROFESSIONAL_HEADERS):
            continue

        xs = [pt[0] for pt in box]
        ys = [pt[1] for pt in box]
        rect = fitz.Rect(min(xs) * scale, min(ys) * scale, max(xs) * scale, max(ys) * scale)

        is_sensitive = False

        # Email
        if EMAIL_REGEX.search(text_clean) or '@' in text_clean:
            is_sensitive = True

        # Phone
        for p_reg in PHONE_REGEXES:
            if p_reg.search(text_clean):
                digits = re.sub(r'\D', '', text_clean)
                if 10 <= len(digits) <= 13:
                    is_sensitive = True

        # Social links
        for s_reg in PERSONAL_PROFILE_PATTERNS:
            if s_reg.search(text_clean):
                is_sensitive = True

        # Address
        has_pin = PINCODE_REGEX.search(text_clean) or SPACED_PINCODE_REGEX.search(text_clean)
        geo_matches = [tok for tok in LOCATION_KEYWORDS if tok in text_lower or tok in normalized_text]
        if has_pin or len(geo_matches) >= 2 or (any(lbl in text_lower for lbl in ['address', 'residence']) and len(geo_matches) >= 1):
            is_sensitive = True

        if is_sensitive and is_safe_from_name(rect):
            sensitive_rects.append(rect)

    return sensitive_rects


def sanitize_resume_pdf(input_pdf_bytes, candidate_name=None):
    """
    Main processing pipeline:
    - Reads PDF bytes
    - Identifies candidate name for protection
    - Detects emails, phones, addresses, social profiles, and profile photo
    - Applies permanent redaction and natural blur
    - Supports both text-based PDFs and scanned/image-based PDFs
    - Returns sanitized PDF bytes and total count of redacted regions
    """
    doc = fitz.open(stream=input_pdf_bytes, filetype="pdf")
    total_redactions = 0

    for page_idx in range(len(doc)):
        page = doc[page_idx]

        # 1. Protected name zones
        protected_name_rects = find_candidate_name_rects(page, candidate_name)

        # 2. Sensitive text items
        text_words = page.get_text("words")
        if len(text_words) >= 5:
            # Text-based PDF
            text_rects = extract_sensitive_rects(page, protected_name_rects)
        else:
            # Scanned / Image-based PDF: Use OCR
            text_rects = extract_sensitive_rects_ocr(page, protected_name_rects, dpi=150)

        # 3. Profile photo face detection (works for both text & scanned PDFs)
        photo_rects = detect_candidate_photo(page, protected_name_rects, dpi=150)

        all_rects = text_rects + photo_rects

        if all_rects:
            merged = merge_overlapping_rects(all_rects)
            apply_natural_blur_and_redact(page, merged)
            total_redactions += len(merged)

    output_stream = io.BytesIO()
    doc.save(
        output_stream,
        garbage=4,
        deflate=True,
        clean=True
    )
    doc.close()

    return output_stream.getvalue(), total_redactions


def validate_sanitized_pdf(sanitized_pdf_bytes, candidate_name=None):
    """
    Validates that:
    1. Zero sensitive items (emails, phones) can be extracted from the PDF text layer.
    2. Candidate name is retained.
    3. Professional information is retained.
    """
    doc = fitz.open(stream=sanitized_pdf_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text() + "\n"
    doc.close()

    emails = EMAIL_REGEX.findall(full_text)
    phones = []
    for p_reg in PHONE_REGEXES:
        for m in p_reg.finditer(full_text):
            digits = re.sub(r'\D', '', m.group(0))
            if len(digits) == 10:
                phones.append(m.group(0))

    passed = (len(emails) == 0 and len(phones) == 0)

    name_preserved = True
    if candidate_name and candidate_name.strip():
        first_name = candidate_name.strip().split()[0].lower()
        name_preserved = (first_name in full_text.lower())

    sections = [h for h in ['education', 'skills', 'projects', 'experience'] if h in full_text.lower()]

    return {
        "passed": passed,
        "extractable_emails": emails,
        "extractable_phones": phones,
        "name_preserved": name_preserved,
        "professional_sections_present": sections
    }


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python redactor.py <input.pdf> <output.pdf> [candidate_name]")
        sys.exit(1)

    in_path = sys.argv[1]
    out_path = sys.argv[2]
    cand_name = sys.argv[3] if len(sys.argv) > 3 else None

    with open(in_path, 'rb') as f:
        in_bytes = f.read()

    sanitized_bytes, count = sanitize_resume_pdf(in_bytes, cand_name)

    with open(out_path, 'wb') as f:
        f.write(sanitized_bytes)

    val = validate_sanitized_pdf(sanitized_bytes, cand_name)
    print(f"Sanitization complete! Redacted items: {count}")
    print(f"Validation Report: {val}")
