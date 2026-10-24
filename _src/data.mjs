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
  // Course fees, shown on every course card and page as "From ₹999 / month".
  priceFrom: "₹999",
  pricePeriod: "month",
  ogImage: "/assets/images/og-image.png",
  lastUpdated: "24 October 2026",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/courses/", label: "Courses" },
  { href: "/exam-preparation/", label: "Exam Preparation" },
  { href: "/communication-skills/", label: "Communication Skills" },
  { href: "/learning-resources/", label: "Learning Resources" },
  { href: "/about/", label: "About Us" },
  { href: "/contact/", label: "Contact" },
];

// Courses. Each one gets a card and a page at /courses/<slug>/ (page file:
// _src/pages/courses/<slug>.html with "layout": "course"). `goal` must match an
// option in the contact form's "Learning goal" list so enquiries pre-select it.
export const courses = [
  {
    slug: "ielts-preparation",
    title: "IELTS Preparation",
    goal: "IELTS preparation",
    icon: "graduation-cap",
    colour: "c-violet",
    short: "Structured preparation for IELTS Academic and General Training, with personal feedback on every skill.",
    duration: "8–12 weeks",
    level: "Intermediate and above",
    forWho: [
      "Students applying to universities that ask for an IELTS score",
      "Professionals and families preparing for work or migration",
      "Anyone who needs a specific band score by a deadline",
    ],
    outcomes: [
      "Understand the test format and what examiners reward in each band",
      "Plan and write Task 1 and Task 2 answers within the time limit",
      "Speak fluently and naturally across all three Speaking parts",
      "Use proven strategies for Reading and Listening question types",
      "Manage your time and nerves on test day",
    ],
    plan: [
      { when: "Weeks 1–2", title: "Know the test, know your level", text: "Test format and band descriptors, plus a practice task in each skill to find your starting point and set a target." },
      { when: "Weeks 3–5", title: "Build the core skills", text: "Reading and Listening strategies, Writing Task 1 and Task 2 structures, and Speaking Parts 1 and 2." },
      { when: "Weeks 6–8", title: "Practise with feedback", text: "Timed writing with detailed feedback, Speaking Part 3 discussions, and topic vocabulary for common themes." },
      { when: "Weeks 9–12", title: "Get test-ready", text: "Full practice tests under exam conditions, a review of your personal error patterns, and a test-day plan." },
    ],
    includes: ["Live, interactive sessions", "Detailed feedback on writing and speaking", "Practice materials and worksheets", "Timed practice tests"],
    resources: ["common-ielts-speaking-mistakes", "how-to-structure-an-ielts-writing-task-2-essay", "listening-practice-for-english-learners"],
  },
  {
    slug: "toefl-preparation",
    title: "TOEFL Preparation",
    goal: "TOEFL preparation",
    icon: "book-open",
    colour: "c-sky",
    short: "Academic English, note-taking and timed practice for every section of the TOEFL iBT.",
    duration: "8–12 weeks",
    level: "Intermediate and above",
    forWho: [
      "Students applying to universities that accept TOEFL",
      "Learners who want to build strong academic English",
      "Test-takers who find timed, on-screen tasks stressful",
    ],
    outcomes: [
      "Understand the current TOEFL iBT format and task types",
      "Take useful notes from lectures and conversations",
      "Give clear, organised spoken answers within short time limits",
      "Write well-structured responses on screen",
      "Build the academic vocabulary the test relies on",
    ],
    plan: [
      { when: "Weeks 1–2", title: "Understand the test", text: "Current format and task types, a diagnostic in each section, and your academic vocabulary baseline." },
      { when: "Weeks 3–5", title: "Academic reading and listening", text: "Reading academic texts efficiently, and note-taking from lectures, conversations and announcements." },
      { when: "Weeks 6–8", title: "Speaking and writing", text: "Timed spoken responses and written tasks with feedback, plus building comfortable typing speed." },
      { when: "Weeks 9–12", title: "Get test-ready", text: "Full practice tests, a review of weak areas, and a clear plan for test day." },
    ],
    includes: ["Live, interactive sessions", "Feedback on spoken and written responses", "Academic vocabulary and note-taking practice", "Timed practice tests"],
    resources: ["listening-practice-for-english-learners", "how-to-structure-an-ielts-writing-task-2-essay", "essential-vocabulary-for-everyday-conversations"],
  },
  {
    slug: "spoken-english",
    title: "Spoken English & Fluency",
    goal: "Spoken English & communication",
    icon: "messages-square",
    colour: "c-coral",
    short: "Speak naturally and confidently in everyday conversation, with clearer pronunciation and less hesitation.",
    duration: "3 months suggested, monthly",
    level: "All levels, beginner to advanced",
    forWho: [
      "Learners who understand English but hesitate when speaking",
      "Beginners who want to start speaking from the first lesson",
      "Anyone preparing to study, work or live in an English-speaking setting",
    ],
    outcomes: [
      "Hold everyday conversations with confidence",
      "Pronounce English sounds, stress and rhythm more clearly",
      "Use natural phrases instead of translating word by word",
      "Tell stories, share opinions and join discussions",
      "Keep talking when you don't know a word",
    ],
    plan: [
      { when: "Month 1", title: "Foundations", text: "Everyday conversation, useful phrases, the sounds of English, and strategies to stop translating in your head." },
      { when: "Month 2", title: "Fluency", text: "Storytelling, giving opinions, follow-up questions, and listening to natural-speed English." },
      { when: "Month 3", title: "Confidence", text: "Real-life role plays, spontaneous speaking, group discussion, and comparing your recordings to see progress." },
    ],
    includes: ["Live conversation practice", "Pronunciation feedback", "Phrase lists and speaking tasks", "Progress recordings you can compare"],
    resources: ["five-ways-to-improve-your-english-speaking", "essential-vocabulary-for-everyday-conversations", "listening-practice-for-english-learners"],
  },
  {
    slug: "professional-communication",
    title: "Professional Communication",
    goal: "Professional English",
    icon: "briefcase",
    colour: "c-teal",
    short: "English for interviews, meetings, presentations and emails, built around your own job and goals.",
    duration: "6–8 weeks",
    level: "Intermediate and above",
    forWho: [
      "Job seekers preparing for interviews in English",
      "Professionals who lead meetings, give updates or present",
      "Graduates moving from study into the workplace",
    ],
    outcomes: [
      "Introduce yourself and your experience clearly and confidently",
      "Answer interview questions with focused, structured examples",
      "Take part in meetings: give updates, agree, disagree and summarise",
      "Write clear, appropriately formal emails and messages",
      "Structure and deliver a short presentation",
    ],
    plan: [
      { when: "Weeks 1–2", title: "Professional presence", text: "Your one-minute introduction, workplace vocabulary, and choosing the right tone and level of formality." },
      { when: "Weeks 3–4", title: "Everyday workplace English", text: "Emails and messages, plus meeting language for updates, opinions, polite disagreement and next steps." },
      { when: "Weeks 5–6", title: "Interviews and presentations", text: "STAR answers for experience questions, and structuring and signposting a short talk." },
      { when: "Weeks 7–8", title: "Practise for real", text: "Mock interviews and presentations with detailed feedback, and a personal plan for what comes next." },
    ],
    includes: ["Live, interactive sessions", "Mock interviews with feedback", "Email and presentation templates", "Practice using your own work situations"],
    resources: ["english-for-interviews-and-professional-introductions", "five-ways-to-improve-your-english-speaking", "essential-vocabulary-for-everyday-conversations"],
  },
  {
    slug: "public-speaking-personality-development",
    title: "Public Speaking & Personality Development",
    goal: "Public speaking & personality development",
    icon: "presentation",
    colour: "c-pink",
    short: "Build confidence, presence and a clear speaking voice, from overcoming stage fear to persuasive delivery.",
    duration: "6–8 weeks",
    level: "All levels",
    forWho: [
      "Students preparing for presentations, debates or group discussions",
      "Professionals who want more presence when they speak",
      "Anyone who feels nervous speaking in front of others",
    ],
    outcomes: [
      "Manage nerves and speak with calm confidence",
      "Use voice, pace, pausing and body language effectively",
      "Structure a talk with a strong opening and a clear message",
      "Engage an audience through storytelling",
      "Speak well without preparation, in impromptu talks and group discussions",
    ],
    plan: [
      { when: "Weeks 1–2", title: "Confidence and self-expression", text: "Voice, posture and body language, and practical techniques for managing stage fear." },
      { when: "Weeks 3–4", title: "Structure your message", text: "Openings that hook, storytelling, and simple structures for informative and persuasive talks." },
      { when: "Weeks 5–6", title: "Delivery", text: "Articulation, pace, pausing and emphasis, engaging an audience, and handling questions." },
      { when: "Weeks 7–8", title: "Showcase", text: "A prepared speech and impromptu speaking with feedback, plus group discussion skills." },
    ],
    includes: ["Live, interactive sessions", "Recorded practice with feedback", "Speech structures and exercises", "Group discussion practice"],
    resources: ["english-for-interviews-and-professional-introductions", "five-ways-to-improve-your-english-speaking", "listening-practice-for-english-learners"],
  },
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
