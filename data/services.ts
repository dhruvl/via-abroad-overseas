export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  icon: "Compass" | "GraduationCap" | "FileCheck2" | "Briefcase" | "FileText" | "Award";
  heroDescription: string;
  problem: string;
  includes: string[];
  process: string[];
  whoFor: string[];
  faq: ServiceFaq[];
  relatedSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "study-abroad",
    title: "Study Abroad Counseling",
    shortDescription:
      "Personalized guidance to choose the right country, university, and course.",
    icon: "Compass",
    heroDescription:
      "One-on-one counseling to help you decide where to study, what to study, and why — based on your academic profile, budget, and career goals.",
    problem:
      "Choosing among thousands of universities and dozens of countries is overwhelming without structured guidance. Students often shortlist options based on incomplete or outdated information.",
    includes: [
      "In-depth profile assessment covering academics, budget, and goals",
      "Country and course shortlisting aligned with your career direction",
      "University comparison based on curriculum, cost, and outcomes",
      "Ongoing counseling through every decision point in the journey",
    ],
    process: [
      "Book a free consultation to discuss your goals",
      "Complete a detailed profile evaluation with your counselor",
      "Review a shortlist of countries, universities, and courses",
      "Finalize your preferred options with counselor guidance",
    ],
    whoFor: [
      "Students who are early in their study abroad research",
      "Students choosing between multiple countries or courses",
      "Parents seeking a structured, transparent process",
    ],
    faq: [
      {
        question: "How early should I start the counseling process?",
        answer:
          "We recommend starting at least 8–12 months before your intended intake, so there is enough time for shortlisting, applications, and visa preparation. Earlier starts give you more options.",
      },
      {
        question: "Is the first consultation really free?",
        answer:
          "Yes. Your first consultation is free and is used to understand your background and goals so we can advise on realistic next steps.",
      },
      {
        question: "Do you help with course selection if I am undecided?",
        answer:
          "Yes, our career counseling process is designed for students who have not finalized a course, helping you align your choice with your interests and career goals.",
      },
    ],
    relatedSlugs: ["university-admissions", "career-counseling"],
  },
  {
    slug: "university-admissions",
    title: "University Admissions",
    shortDescription:
      "Complete assistance with applications, documentation, and admissions.",
    icon: "GraduationCap",
    heroDescription:
      "End-to-end support through the university application process — from shortlisting to submission — so nothing is missed and every application reflects your strongest profile.",
    problem:
      "University application portals, requirements, and deadlines vary widely. Missing a document or a deadline can cost you an admission cycle.",
    includes: [
      "Application form guidance for each shortlisted university",
      "Document checklist tracking so nothing is missed",
      "Application review before submission",
      "Coordination support for admission follow-ups",
    ],
    process: [
      "Finalize your university shortlist with your counselor",
      "Gather and prepare required academic and identity documents",
      "Complete applications with guided review at each step",
      "Track submissions and respond to university requests",
    ],
    whoFor: [
      "Students ready to apply to shortlisted universities",
      "Students applying to multiple universities in parallel",
      "Students who want a second review before submitting",
    ],
    faq: [
      {
        question: "How many universities should I apply to?",
        answer:
          "This depends on your profile and goals. Your counselor will help you build a balanced list across reach, match, and safe options.",
      },
      {
        question: "Can you guarantee admission to a specific university?",
        answer:
          "No. Admission decisions are made solely by universities. We help you build the strongest possible application, but we cannot guarantee an outcome.",
      },
    ],
    relatedSlugs: ["study-abroad", "application-support"],
  },
  {
    slug: "visa-assistance",
    title: "Student Visa Services",
    shortDescription:
      "Expert support for student visa documentation and interview preparation.",
    icon: "FileCheck2",
    heroDescription:
      "Structured guidance through the student visa documentation and preparation process, so you approach your application with clarity and confidence.",
    problem:
      "Visa requirements differ by country and change over time. Incomplete documentation or unclear interview answers are common reasons for delays.",
    includes: [
      "Guidance on the general visa documentation checklist for your destination",
      "Review of your financial and academic documentation for consistency",
      "Mock visa interview preparation and common-question practice",
      "Guidance on submission timelines relative to your intake",
    ],
    process: [
      "Review your destination country's general visa category and process",
      "Prepare your documentation checklist with your counselor",
      "Practice interview preparation where applicable",
      "Submit your application within recommended timelines",
    ],
    whoFor: [
      "Students who have received an admission offer",
      "Students preparing financial and supporting documents",
      "Students who want interview practice before their appointment",
    ],
    faq: [
      {
        question: "Can you guarantee my visa will be approved?",
        answer:
          "No consultancy can guarantee visa approval — this decision rests solely with the relevant government authority. We help you prepare a complete, well-organized application.",
      },
      {
        question: "Do visa requirements change often?",
        answer:
          "Yes, immigration policies can change. We advise students to always confirm current requirements with official government sources in addition to our guidance.",
      },
    ],
    relatedSlugs: ["study-abroad", "application-support"],
  },
  {
    slug: "career-counseling",
    title: "Career Counseling",
    shortDescription:
      "Helping students select courses aligned with their career goals.",
    icon: "Briefcase",
    heroDescription:
      "Structured career counseling to help you connect your interests, strengths, and long-term goals to the right course and country decision.",
    problem:
      "Many students choose a course based on trends or peer choices rather than genuine fit, which can lead to disengagement or a difficult career transition later.",
    includes: [
      "Assessment of academic strengths and interests",
      "Discussion of long-term career goals and pathways",
      "Course and specialization recommendations",
      "Guidance on how course choice affects future opportunities",
    ],
    process: [
      "Complete a career-focused profile discussion",
      "Explore course and specialization options together",
      "Narrow down recommendations aligned with your goals",
      "Carry your finalized direction into study abroad counseling",
    ],
    whoFor: [
      "Students undecided about their field of study",
      "Students considering a career-focused course change",
      "Parents seeking clarity on long-term outcomes",
    ],
    faq: [
      {
        question: "Is career counseling only for students changing fields?",
        answer:
          "No, it is also useful for students who want confirmation that their intended course aligns with their long-term goals before committing significant time and resources.",
      },
    ],
    relatedSlugs: ["study-abroad", "scholarship-guidance"],
  },
  {
    slug: "application-support",
    title: "Application Support",
    shortDescription:
      "Assistance with SOP, LOR, resume, and application documents.",
    icon: "FileText",
    heroDescription:
      "Guidance to help you prepare a Statement of Purpose, Letters of Recommendation, resume, and supporting documents that authentically represent your profile.",
    problem:
      "A strong academic profile can be undersold by a generic or poorly structured SOP, resume, or recommendation letter.",
    includes: [
      "SOP structuring and review guidance",
      "LOR guidance for requesting and structuring recommendations",
      "Resume and CV preparation support for academic applications",
      "Consistency review across all application documents",
    ],
    process: [
      "Discuss your academic and professional background",
      "Draft your SOP and supporting documents with guidance",
      "Review and refine drafts for clarity and consistency",
      "Finalize documents ahead of your application deadlines",
    ],
    whoFor: [
      "Students preparing their first study abroad application",
      "Students who want a structured review of existing drafts",
      "Students requesting recommendation letters for the first time",
    ],
    faq: [
      {
        question: "Do you write the SOP for me?",
        answer:
          "We guide and review your SOP so it authentically reflects your voice and experiences — the content and story must come from you.",
      },
    ],
    relatedSlugs: ["university-admissions", "visa-assistance"],
  },
  {
    slug: "scholarship-guidance",
    title: "Scholarship Guidance",
    shortDescription: "Scholarship information and financial planning assistance.",
    icon: "Award",
    heroDescription:
      "Guidance on identifying relevant scholarship opportunities and planning your overall study abroad finances with clarity.",
    problem:
      "Scholarship information is scattered across university, government, and private sources, making it hard for students to identify what they may be eligible for.",
    includes: [
      "Guidance on university-specific scholarship and aid options",
      "Overview of general external scholarship opportunities",
      "Financial planning discussion for tuition and living costs",
      "Guidance on scholarship application timelines",
    ],
    process: [
      "Review your academic profile and target destinations",
      "Identify potentially relevant scholarship categories",
      "Plan application timelines alongside your admission process",
      "Prepare required scholarship application materials",
    ],
    whoFor: [
      "Students seeking to reduce the overall cost of studying abroad",
      "Students with a strong academic or extracurricular profile",
      "Families planning their overall education budget",
    ],
    faq: [
      {
        question: "Can you guarantee I will receive a scholarship?",
        answer:
          "No. Scholarships are awarded at the discretion of universities and third-party organizations based on their own criteria. We help you identify and apply to relevant opportunities.",
      },
    ],
    relatedSlugs: ["study-abroad", "career-counseling"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
