export interface VolunteerSubtopic {
  id: string;
  title: string;
  sectionKey: string;
  isHighlighted: boolean;
  command: string;
  isReviewed: boolean;
  category?: 'suggestion' | 'must_fix' | 'praise' | 'question';
  suggestedRewrite?: { before: string; after: string };
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  score: string;
}

export interface ProjectItem {
  title: string;
  tech: string;
  period: string;
  description: string;
}

export interface ResumeSection {
  key: string;
  title: string;
  type: 'text' | 'education' | 'chips' | 'projects' | 'list';
  content?: string;
  items?: string[] | EducationItem[] | ProjectItem[];
}

export interface Student {
  id: string;
  name: string;
  degree: string;
  institution: string;
  graduationYear: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  avatar: string;
  status: 'pending' | 'in_review' | 'changes_required' | 'approved';
  assignedDate: string;
  completedDate?: string;
  otp: string;
  totalPages: number;
  rating: number;
  improveTags: string[];
  generalFeedback: string;
  volunteerSubtopics: VolunteerSubtopic[];
  resumeSections: ResumeSection[];
  audioNote?: { recorded: boolean; duration: string; timestamp: string };
  rubricScores?: Record<string, number>;
}

export interface VolunteerProfile {
  name: string;
  role: string;
  organization: string;
  avatar: string;
  email: string;
  assignedCount: number;
  pendingCount: number;
  completedCount: number;
}

export const initialStudents: Student[] = [
  {
    id: "student-1",
    name: "Arun Kumar",
    degree: "B.Sc Computer Science",
    institution: "ABC College, Chennai",
    graduationYear: "2022 - 2025",
    email: "arunkumar@email.com",
    phone: "+91 98765 43210",
    location: "Chennai, Tamil Nadu",
    github: "github.com/arunkumar",
    linkedin: "linkedin.com/in/arunkumar",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    status: "pending",
    assignedDate: "06 Sep 2026",
    otp: "101010",
    totalPages: 2,
    rating: 4,
    improveTags: ["Formatting"],
    generalFeedback: "Clean resume layout. Provide more measurable impact metrics for projects and quantify achievements.",
    
    volunteerSubtopics: [
      {
        id: "sub-1",
        title: "Projective Skills & Web Stack",
        sectionKey: "skills",
        isHighlighted: true,
        command: "Group into Frontend, Backend, and Database. Add Git workflow tools.",
        isReviewed: true
      },
      {
        id: "sub-2",
        title: "Academic Projects",
        sectionKey: "projects",
        isHighlighted: true,
        command: "Quantify impact with numbers (e.g., 'Automated attendance for 400+ students') and include GitHub URL.",
        isReviewed: false
      },
      {
        id: "sub-3",
        title: "Certifications & Badges",
        sectionKey: "certifications",
        isHighlighted: false,
        command: "Mention the issuing organization and credential verification link.",
        isReviewed: false
      }
    ],

    resumeSections: [
      {
        key: "objective",
        title: "CAREER OBJECTIVE",
        type: "text",
        content: "Passionate and detail-oriented Computer Science graduate with strong fundamentals in data structures, algorithms, and web development. Seeking an entry-level software engineer role to leverage technical skills in building scalable applications."
      },
      {
        key: "education",
        title: "EDUCATION",
        type: "education",
        items: [
          {
            degree: "B.Sc Computer Science",
            institution: "ABC College, Chennai",
            period: "2022 - 2025",
            score: "Expected 8.2 CGPA"
          },
          {
            degree: "Higher Secondary Certificate (HSC)",
            institution: "St. Thomas Higher Secondary School",
            period: "2020 - 2022",
            score: "91.5%"
          }
        ]
      },
      {
        key: "skills",
        title: "PROJECTIVE SKILLS & WEB STACK",
        type: "chips",
        items: ["Python", "Java", "HTML5", "CSS3", "SQL", "JavaScript (ES6+)", "Git & GitHub"]
      },
      {
        key: "projects",
        title: "ACADEMIC PROJECTS",
        type: "projects",
        items: [
          {
            title: "Student Management System",
            tech: "Python, MySQL, Tkinter",
            period: "Jan 2025 - Mar 2025",
            description: "Built a GUI desktop application using Python and MySQL to automate attendance tracking, marks recording, and report card generation for over 400 college students."
          },
          {
            title: "E-Commerce Web Portal",
            tech: "HTML5, CSS3, JavaScript, LocalStorage",
            period: "Aug 2024 - Oct 2024",
            description: "Engineered a responsive single-page store with product filtering, cart calculations, and responsive mobile-first UI."
          }
        ]
      },
      {
        key: "certifications",
        title: "CERTIFICATIONS & BADGES",
        type: "list",
        items: [
          "Python Programming Masterclass - Coursera (2024)",
          "Responsive Web Design Certification - freeCodeCamp (2023)"
        ]
      }
    ]
  },
  {
    id: "student-2",
    name: "Priyadharshini R",
    degree: "B.Com",
    institution: "Loyola College, Chennai",
    graduationYear: "2022 - 2025",
    email: "priyadharshini.r@email.com",
    phone: "+91 98123 45678",
    location: "Chennai, Tamil Nadu",
    github: "",
    linkedin: "linkedin.com/in/priyadharshini-r",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    status: "in_review",
    assignedDate: "07 Sep 2026",
    otp: "202020",
    totalPages: 1,
    rating: 3,
    improveTags: ["Grammar", "Formatting"],
    generalFeedback: "Reviewing accounting certifications and corporate internship experience.",
    
    volunteerSubtopics: [
      {
        id: "sub-p1",
        title: "Corporate Internships",
        sectionKey: "internships",
        isHighlighted: true,
        command: "Detail the specific accounting reconciliation tools and volume of invoices handled.",
        isReviewed: true
      },
      {
        id: "sub-p2",
        title: "Extra-Curricular Activities & Volunteering",
        sectionKey: "extracurricular",
        isHighlighted: true,
        command: "Highlight leadership roles and finance committee treasurer responsibilities.",
        isReviewed: false
      }
    ],

    resumeSections: [
      {
        key: "summary",
        title: "PROFESSIONAL SUMMARY",
        type: "text",
        content: "Proactive commerce graduate with strong acumen in corporate finance, auditing, and ledger accounting. Seeking an associate role in financial services or auditing."
      },
      {
        key: "education",
        title: "EDUCATION",
        type: "education",
        items: [
          {
            degree: "Bachelor of Commerce (B.Com)",
            institution: "Loyola College, Chennai",
            period: "2022 - 2025",
            score: "9.1 CGPA (Top 5%)"
          }
        ]
      },
      {
        key: "skills",
        title: "ACCOUNTING & FINANCE TOOLS",
        type: "chips",
        items: ["Financial Accounting", "Tally Prime", "MS Excel (VLOOKUP, Pivots)", "Taxation (GST)", "Cost Accounting"]
      },
      {
        key: "internships",
        title: "CORPORATE INTERNSHIPS",
        type: "projects",
        items: [
          {
            title: "Finance Intern - Sundaram Finance",
            tech: "Excel, Internal Audit Tools",
            period: "May 2024 - Jul 2024",
            description: "Assisted senior auditors in verifying 1,200+ vendor invoices and reconciliations, reducing reporting discrepancies by 15%."
          }
        ]
      },
      {
        key: "extracurricular",
        title: "EXTRA-CURRICULAR ACTIVITIES & VOLUNTEERING",
        type: "list",
        items: [
          "Treasurer, Loyola Commerce Student Association (2024 - Present)",
          "Volunteer Coordinator, Youth Financial Literacy Camp Chennai (2023)",
          "First Prize, Inter-College Business Quiz Competition (2024)"
        ]
      }
    ]
  },
  {
    id: "student-3",
    name: "Meena S",
    degree: "BCA",
    institution: "Madras Christian College",
    graduationYear: "2021 - 2024",
    email: "meena.s@email.com",
    phone: "+91 97654 32109",
    location: "Tambaram, Chennai",
    github: "github.com/meenas",
    linkedin: "linkedin.com/in/meena-s",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    status: "changes_required",
    assignedDate: "05 Sep 2026",
    otp: "303030",
    totalPages: 2,
    rating: 2,
    improveTags: ["Grammar", "Projects", "Formatting"],
    generalFeedback: "Action verbs are missing in project bullets. Formatting is inconsistent between headers.",
    
    volunteerSubtopics: [
      {
        id: "sub-m1",
        title: "Projective Skills & Web Stack",
        sectionKey: "skills",
        isHighlighted: true,
        command: "Highlight hands-on full stack project experience and REST API development.",
        isReviewed: true
      },
      {
        id: "sub-m2",
        title: "Workshops & Technical Seminars",
        sectionKey: "workshops",
        isHighlighted: false,
        command: "Specify the duration and practical hands-on takeaways.",
        isReviewed: false
      }
    ],

    resumeSections: [
      {
        key: "profile",
        title: "CAREER PROFILE",
        type: "text",
        content: "Energetic BCA graduate passionate about Full Stack JavaScript engineering and responsive UI development."
      },
      {
        key: "education",
        title: "EDUCATION",
        type: "education",
        items: [
          {
            degree: "Bachelor of Computer Applications (BCA)",
            institution: "Madras Christian College",
            period: "2021 - 2024",
            score: "7.8 CGPA"
          }
        ]
      },
      {
        key: "skills",
        title: "PROJECTIVE SKILLS & WEB STACK",
        type: "chips",
        items: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript", "REST APIs"]
      },
      {
        key: "projects",
        title: "PORTFOLIO PROJECTS",
        type: "projects",
        items: [
          {
            title: "Online Book Library",
            tech: "MERN Stack",
            period: "Feb 2024 - Apr 2024",
            description: "Developed a book catalog platform where users can browse, borrow books, and leave star ratings."
          }
        ]
      },
      {
        key: "workshops",
        title: "WORKSHOPS & TECHNICAL SEMINARS",
        type: "list",
        items: [
          "Hands-on Microservices Architecture Workshop - IIT Madras Shaastra (2024)",
          "Modern Frontend Performance Seminar - GDG Chennai (2023)"
        ]
      }
    ]
  },
  {
    id: "student-4",
    name: "Deepak Kumar",
    degree: "B.Sc Computer Science",
    institution: "DG Vaishnav College, Chennai",
    graduationYear: "2022 - 2025",
    email: "deepak.kumar@email.com",
    phone: "+91 96543 21098",
    location: "Anna Nagar, Chennai",
    github: "github.com/deepak-kumar-cs",
    linkedin: "linkedin.com/in/deepak-kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    status: "approved",
    assignedDate: "04 Sep 2026",
    completedDate: "08 Sep 2026",
    otp: "404040",
    totalPages: 2,
    rating: 5,
    improveTags: [],
    generalFeedback: "Outstanding resume! Clean formatting, strong action verbs, well-structured projects with GitHub links and verifiable metrics.",
    
    volunteerSubtopics: [
      {
        id: "sub-d1",
        title: "Cloud & Backend Engineering",
        sectionKey: "skills",
        isHighlighted: true,
        command: "Strong AWS and Go skills listed. Excellent technical alignment.",
        isReviewed: true
      },
      {
        id: "sub-d2",
        title: "Hackathons & Achievements",
        sectionKey: "hackathons",
        isHighlighted: true,
        command: "Great national-level ranking and hackathon wins.",
        isReviewed: true
      }
    ],

    resumeSections: [
      {
        key: "objective",
        title: "CAREER OBJECTIVE",
        type: "text",
        content: "Result-driven Computer Science student with expertise in Cloud Computing (AWS) and Distributed Backend Systems. Aiming to contribute to high-availability distributed systems."
      },
      {
        key: "education",
        title: "EDUCATION",
        type: "education",
        items: [
          {
            degree: "B.Sc Computer Science",
            institution: "DG Vaishnav College, Chennai",
            period: "2022 - 2025",
            score: "9.3 CGPA (University Rank Holder)"
          }
        ]
      },
      {
        key: "skills",
        title: "CLOUD & BACKEND ENGINEERING",
        type: "chips",
        items: ["Go (Golang)", "Python", "AWS (EC2, S3, Lambda)", "Docker", "PostgreSQL", "Redis", "gRPC"]
      },
      {
        key: "projects",
        title: "OPEN-SOURCE PROJECTS",
        type: "projects",
        items: [
          {
            title: "Serverless Image Optimization Pipeline",
            tech: "AWS Lambda, S3, Node.js",
            period: "Nov 2024 - Jan 2025",
            description: "Architected event-driven microservices processing 10,000+ daily uploads with automated compression."
          }
        ]
      },
      {
        key: "hackathons",
        title: "HACKATHONS & ACHIEVEMENTS",
        type: "list",
        items: [
          "Winner - Smart India Hackathon Internal College Round (2024)",
          "AWS Certified Solutions Architect – Associate (2024)"
        ]
      }
    ]
  }
];

export const volunteerProfile: VolunteerProfile = {
  name: "Sarath",
  role: "Senior Software Engineer & Volunteer",
  organization: "TechMentors Initiative",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  email: "sarath.mentor@portal.org",
  assignedCount: 4,
  pendingCount: 3,
  completedCount: 1
};
