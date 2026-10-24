// Single source of truth for site-wide settings and listed content.
// After editing, run:  node tools/build.mjs

export const site = {
  name: "Humans of English",
  tagline: "Learn English. Find Your Voice.",
  url: "https://humansofenglish.com",
  // Contact details. Leave a value empty to hide it everywhere on the site.
  // With contactEmail set (and no formEndpoint), the contact form opens the
  // visitor's email app with their details pre-filled, addressed to this inbox.
  contactEmail: "mansi@humansofenglish.com",
  instagram: "humansofenglish", // handle without the @
  // Optional form service endpoint (e.g. a Formspree form URL). When set, the
  // contact form POSTs to it; otherwise it falls back to email, then demo mode.
  formEndpoint: "",
  ogImage: "/assets/images/og-image.png",
  lastUpdated: "24 October 2026",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/exam-preparation/", label: "Exam Preparation" },
  { href: "/communication-skills/", label: "Communication Skills" },
  { href: "/learning-resources/", label: "Learning Resources" },
  { href: "/case-studies/", label: "Case Studies" },
  { href: "/about/", label: "About Us" },
  { href: "/contact/", label: "Contact" },
];

export const categories = [
  { id: "exam", label: "Exam Prep" },
  { id: "speaking", label: "Speaking" },
  { id: "listening", label: "Listening" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "writing", label: "Writing" },
  { id: "professional", label: "Professional" },
];

export const resources = [
  {
    slug: "five-ways-to-improve-your-english-speaking",
    title: "Five Ways to Improve Your English Speaking",
    description: "Simple daily habits that build fluency, from shadowing to speaking notes, without needing a partner every day.",
    category: "speaking",
    tags: ["fluency", "pronunciation", "practice", "habits"],
    minutes: 6,
    level: "All levels",
  },
  {
    slug: "common-ielts-speaking-mistakes",
    title: "Common IELTS Speaking Mistakes",
    description: "Memorised answers, one-word replies and over-correcting: what holds candidates back and what to do instead.",
    category: "exam",
    tags: ["ielts", "speaking", "test day"],
    minutes: 7,
    level: "Intermediate+",
  },
  {
    slug: "essential-vocabulary-for-everyday-conversations",
    title: "Essential Vocabulary for Everyday Conversations",
    description: "Useful phrases for greetings, small talk, asking for help and keeping a conversation going naturally.",
    category: "vocabulary",
    tags: ["phrases", "small talk", "beginner", "conversation"],
    minutes: 6,
    level: "Beginner+",
  },
  {
    slug: "how-to-structure-an-ielts-writing-task-2-essay",
    title: "How to Structure an IELTS Writing Task 2 Essay",
    description: "A clear four-paragraph plan, with an annotated example, that helps you answer the question fully and on time.",
    category: "writing",
    tags: ["ielts", "essay", "academic", "exam"],
    minutes: 8,
    level: "Intermediate+",
  },
  {
    slug: "listening-practice-for-english-learners",
    title: "Listening Practice for English Learners",
    description: "How to choose audio at the right level and use a three-step routine that trains your ear, not just your patience.",
    category: "listening",
    tags: ["listening", "pronunciation", "podcasts", "routine"],
    minutes: 6,
    level: "All levels",
  },
  {
    slug: "english-for-interviews-and-professional-introductions",
    title: "English for Interviews and Professional Introductions",
    description: "Introduce yourself with confidence, answer common interview questions and close the conversation professionally.",
    category: "professional",
    tags: ["interview", "career", "workplace", "introductions"],
    minutes: 7,
    level: "Intermediate+",
  },
];

// Example learning journeys. These are illustrative plans, not real students.
export const caseStudies = [
  {
    slug: "ielts-for-university-study",
    title: "Preparing for IELTS Academic for university study",
    learner: "The university applicant",
    summary: "Strong reader who freezes in Speaking and runs out of time in Writing Task 2. A ten-week plan focused on timing, structure and spoken confidence.",
    focus: ["IELTS Academic", "Writing Task 2", "Speaking"],
    weeks: 10,
    icon: "graduation-cap",
  },
  {
    slug: "from-hesitant-to-conversational",
    title: "From hesitant speaker to everyday conversation",
    learner: "The quiet understander",
    summary: "Understands far more than they say. An eight-week plan that turns passive knowledge into everyday speaking through short, regular practice.",
    focus: ["Spoken English", "Fluency", "Listening"],
    weeks: 8,
    icon: "messages-square",
  },
  {
    slug: "interview-ready-professional-english",
    title: "Getting interview-ready in professional English",
    learner: "The career changer",
    summary: "Experienced in their field but unsure how to present it in English. A six-week plan for introductions, interview answers and follow-up emails.",
    focus: ["Professional English", "Interviews", "Presentation"],
    weeks: 6,
    icon: "briefcase",
  },
];

export const categoryLabel = (id) => (categories.find((c) => c.id === id) || {}).label || id;
