"""
Test resume generator covering all required edge cases:
- Multi-page resumes (2+ pages)
- Two-column / sidebar layouts
- Multiple social links (LinkedIn, GitHub, Portfolio)
- Company / project links (must remain visible)
- One-line and multi-line addresses
- Various phone formats (+91, +1, +44)
- Profile photo vs company logo
"""

import os
import fitz
import cv2
import numpy as np

def create_synthetic_face_image(width=120, height=140):
    """
    Generate an image containing a synthetic face that triggers Haar Cascade Face Detector.
    """
    img = np.ones((height, width, 3), dtype=np.uint8) * 240
    # Head oval
    center = (width // 2, height // 2)
    cv2.ellipse(img, center, (width // 3, height // 3), 0, 0, 360, (200, 180, 160), -1)
    cv2.ellipse(img, center, (width // 3, height // 3), 0, 0, 360, (100, 80, 60), 2)
    
    # Eyes
    eye_y = height // 2 - 12
    cv2.circle(img, (center[0] - 16, eye_y), 5, (50, 40, 30), -1)
    cv2.circle(img, (center[0] + 16, eye_y), 5, (50, 40, 30), -1)
    
    # Nose
    cv2.line(img, (center[0], eye_y + 4), (center[0], eye_y + 16), (80, 60, 50), 2)
    
    # Mouth
    cv2.ellipse(img, (center[0], eye_y + 26), (12, 6), 0, 0, 180, (60, 50, 40), 2)
    
    _, buf = cv2.imencode('.png', img)
    return buf.tobytes()


def create_company_logo_image(width=100, height=40):
    """
    Generate a geometric company logo (no face) that should NOT be blurred.
    """
    img = np.ones((height, width, 3), dtype=np.uint8) * 255
    cv2.rectangle(img, (10, 10), (30, 30), (0, 100, 220), -1)
    cv2.circle(img, (60, 20), 12, (20, 180, 50), -1)
    cv2.putText(img, "CORP", (45, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)
    _, buf = cv2.imencode('.png', img)
    return buf.tobytes()


def generate_multi_case_resume(output_path):
    """
    Generates a 2-page complex resume with:
    - Candidate Name: VARSHAS SIVALINGAM
    - Multi-line address:
        123, ABC Street,
        Tambaram,
        Chennai, Tamil Nadu - 600045
    - Multiple phone numbers (+91 98765 43210, +1 123 456 7890)
    - Social links:
        linkedin.com/in/varshas-sivalingam
        github.com/varshas
        https://portfolio.varshas.dev
    - Company / Project links that MUST NOT be blurred:
        https://google.com
        https://github.com/microsoft/vscode
    - Profile photo on page 1
    - Company logo on page 1
    - Page 2 with secondary contact info and education/experience
    """
    doc = fitz.open()

    # --- PAGE 1 ---
    page1 = doc.new_page(width=595, height=842) # A4
    
    # Candidate Name (Header)
    page1.insert_text(fitz.Point(50, 60), "VARSHAS SIVALINGAM", fontsize=22, fontname="helv", color=(0.1, 0.15, 0.3))
    page1.insert_text(fitz.Point(50, 78), "Senior Full Stack Software Engineer", fontsize=12, fontname="helv", color=(0.4, 0.4, 0.4))
    
    # Insert Profile Photo (Top Right)
    face_bytes = create_synthetic_face_image()
    photo_rect = fitz.Rect(440, 40, 540, 150)
    page1.insert_image(photo_rect, stream=face_bytes)
    
    # Insert Company Logo (Must NOT be blurred)
    logo_bytes = create_company_logo_image()
    logo_rect = fitz.Rect(440, 280, 520, 315)
    page1.insert_image(logo_rect, stream=logo_bytes)

    # Contact Details Section
    page1.insert_text(fitz.Point(50, 110), "Email: varshas.sivalingam@example.com", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 125), "Phone: +91 98765 43210 | Alternate: +1 (123) 456-7890", fontsize=10, fontname="helv")
    
    # Multi-line Address
    page1.insert_text(fitz.Point(50, 145), "Address:", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 158), "123, ABC Street, Tambaram,", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 171), "Chennai, Tamil Nadu - 600045, India", fontsize=10, fontname="helv")
    
    # Social / Profile Links
    page1.insert_text(fitz.Point(50, 195), "LinkedIn: https://linkedin.com/in/varshas-sivalingam", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 208), "GitHub: https://github.com/varshas", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 221), "Portfolio: https://portfolio.varshas.dev", fontsize=10, fontname="helv")
    
    # Horizontal Divider
    page1.draw_line(fitz.Point(50, 235), fitz.Point(545, 235), color=(0.8, 0.8, 0.8), width=1)

    # Professional Summary (MUST NOT BE BLURRED)
    page1.insert_text(fitz.Point(50, 255), "PROFESSIONAL SUMMARY", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page1.insert_text(fitz.Point(50, 272), "Accomplished Software Engineer with 5+ years of experience leading full stack web development,", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 285), "scalable microservices architectures, and cloud deployments.", fontsize=10, fontname="helv")

    # Work Experience (MUST NOT BE BLURRED)
    page1.insert_text(fitz.Point(50, 315), "WORK EXPERIENCE", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page1.insert_text(fitz.Point(50, 332), "Lead Developer | Tech Solutions Inc (Visit: https://acmecorp.com)", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 345), "June 2021 - Present | Bengaluru, Karnataka", fontsize=9, fontname="helv", color=(0.5, 0.5, 0.5))
    page1.insert_text(fitz.Point(50, 360), "- Architected enterprise microservices handling 2M+ daily active requests.", fontsize=9.5, fontname="helv")
    page1.insert_text(fitz.Point(50, 373), "- Contributed to open source tooling at https://github.com/microsoft/vscode", fontsize=9.5, fontname="helv")

    # Technical Skills
    page1.insert_text(fitz.Point(50, 410), "TECHNICAL SKILLS", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page1.insert_text(fitz.Point(50, 427), "Languages: Python, TypeScript, JavaScript, Go, SQL", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 440), "Frameworks: React, Next.js, FastAPI, Node.js, Express", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 453), "Databases: PostgreSQL, MongoDB, Redis", fontsize=10, fontname="helv")

    # Projects
    page1.insert_text(fitz.Point(50, 485), "KEY PROJECTS", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page1.insert_text(fitz.Point(50, 502), "AI Resume Privacy Masker - Automated PII Redaction Engine", fontsize=10, fontname="helv")
    page1.insert_text(fitz.Point(50, 515), "- Engineered dynamic PII detection and natural Gaussian blur using PyMuPDF and OpenCV.", fontsize=9.5, fontname="helv")

    # --- PAGE 2 ---
    page2 = doc.new_page(width=595, height=842)
    page2.insert_text(fitz.Point(50, 50), "VARSHAS SIVALINGAM - Page 2", fontsize=14, fontname="helv", color=(0.1, 0.15, 0.3))
    
    # Secondary Address & Contact in Page 2
    page2.insert_text(fitz.Point(50, 80), "Permanent Address: No. 25, XYZ Road, Coimbatore, Tamil Nadu - 641001", fontsize=10, fontname="helv")
    page2.insert_text(fitz.Point(50, 95), "Secondary Contact: +44 1234 567890 | UK Office: contact-uk@varshas.me", fontsize=10, fontname="helv")

    # Education (MUST NOT BE BLURRED)
    page2.insert_text(fitz.Point(50, 130), "EDUCATION", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page2.insert_text(fitz.Point(50, 147), "B.Tech in Computer Science and Engineering", fontsize=10, fontname="helv")
    page2.insert_text(fitz.Point(50, 160), "Anna University, Chennai | CGPA: 8.9 / 10 | 2017 - 2021", fontsize=9.5, fontname="helv")

    # Certifications (MUST NOT BE BLURRED)
    page2.insert_text(fitz.Point(50, 195), "CERTIFICATIONS", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    page2.insert_text(fitz.Point(50, 212), "- AWS Certified Solutions Architect - Associate", fontsize=9.5, fontname="helv")
    page2.insert_text(fitz.Point(50, 227), "- Certified Kubernetes Application Developer (CKAD)", fontsize=9.5, fontname="helv")

    doc.save(output_path)
    doc.close()
    print(f"Generated 2-page test resume at {output_path}")

if __name__ == '__main__':
    generate_multi_case_resume("python_service/test_case_resume.pdf")
