/**
 * Shared content contract. Every section reads from here — no copy is hard-coded in components.
 *
 * Sources (verified only):
 *  - Experience, client projects, contact links: the previous vargheseshibu.com site (legacy/index.html).
 *  - Kerasobha: the KeraSobha repository (README, DESIGN.md, wrangler.jsonc, migrations, worker/).
 *  - Stack categories: the owner's brief.
 * Do not add metrics, client claims or features that are not in those sources.
 */

export const profile = {
  name: "Varghese Shibu",
  first: "Varghese",
  last: "Shibu",
  role: "Full-Stack Developer",
  discipline: "Creative Engineering",
  title: "Senior Software Engineer",
  employer: "BlueOptima",
  specialism: "Plugin, web & backend development",
  location: "Bengaluru, India",
  region: "Kerala, IN",
  coords: "10.85° N · 76.27° E",
  since: 2019,
  email: "thevargheseshibu@gmail.com",
  phone: "+91 94962 29341",
  phoneHref: "tel:+919496229341",
  resumeUrl: "/Varghese_Shibu_Resume.pdf" as string | null,
  intro:
    "I design and build digital products end to end — expressive interfaces on the front, dependable services and data underneath.",
  about: [
    "I'm a senior software engineer at BlueOptima, working across plugin, web and backend development. Since 2019, my work has spanned research labs, airline platforms and payment infrastructure.",
    "I care about the whole path a request travels: the interface someone touches, the API that answers, the database that remembers and the pipeline that ships it.",
  ],
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/thevargheseshibu", handle: "@thevargheseshibu" },
  { label: "LinkedIn", href: "https://linkedin.com/in/thevargheseshibu", handle: "in/thevargheseshibu" },
  { label: "Instagram", href: "https://www.instagram.com/thewargiz/", handle: "@thewargiz" },
] as const;

export const nav = [
  { id: "about", num: "01", label: "About" },
  { id: "work", num: "02", label: "Work" },
  { id: "engineering", num: "03", label: "Systems" },
  { id: "experience", num: "05", label: "Experience" },
  { id: "education", num: "06", label: "Education" },
  { id: "contact", num: "07", label: "Contact" },
] as const;

/** Section index labels — keep section headers and nav in sync. */
export const sectionIndex = {
  about: "01",
  work: "02",
  engineering: "03",
  stack: "04",
  experience: "05",
  education: "06",
  contact: "07",
} as const;

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  yearLabel: string;
  summary: string;
  responsibilities: string[];
  arrangement?: string;
  logo?: string;
  positions?: { role: string; start: string; end: string; summary: string }[];
  /** Named programmes within the role (Panasonic). */
  programmes?: { name: string; where?: string; points: string[] }[];
  clients: string[];
};

/** Qualitative facts from the 2026 résumé. Percentage claims are intentionally omitted (owner's choice). */
export const experience: Experience[] = [
  {
    id: "blueoptima",
    company: "BlueOptima",
    role: "Senior Software Engineer",
    location: "Bengaluru, Karnataka, India",
    arrangement: "Full-time",
    start: "Aug 2025",
    end: "Present",
    yearLabel: "2025",
    summary: "Plugin development, web development and backend development at BlueOptima.",
    responsibilities: ["Plugin development", "Web development", "Backend development"],
    clients: [],
  },
  {
    id: "zemoso",
    company: "Zemoso Technologies",
    role: "Senior Software Engineer 3",
    location: "Hyderabad, Telangana, India",
    arrangement: "Full-time · Remote",
    start: "Jun 2025",
    end: "Jul 2025",
    yearLabel: "2025",
    summary: "Senior software engineering across web technologies and frontend development.",
    responsibilities: [
      "React.js and frontend development",
      "JavaScript libraries and middleware",
      "GitHub and version control",
    ],
    clients: [],
  },
  {
    id: "cloudberry360",
    company: "CloudBerry360",
    role: "Lead Solution Engineer",
    arrangement: "Full-time · Hybrid",
    start: "Jan 2024",
    end: "Jul 2025",
    yearLabel: "2024",
    summary: "Led teams and delivered payment, content and dynamic-frontend platforms for international clients.",
    responsibilities: [
      "Engineered a JavaScript payment SDK supporting PayPal, Volt, Google Pay and Apple Pay",
      "Led cross-functional architecture discussions aligning frontend and backend strategy",
      "Optimised frontend architecture: smaller bundles and no redundant API calls",
      "Pioneered a JSON-driven web architecture where the backend controls UI styling and business logic",
      "Integrated BunnyCDN for faster content delivery",
      "Built a fully featured rich text editor from scratch",
      "Mentored junior developers and set code-review standards",
      "Introduced milestone-based project management for on-time delivery",
    ],
    clients: ["Lyca Productions", "Apexx Global"],
  },
  {
    id: "ibs",
    company: "IBS Software",
    role: "Lead Solution Engineer",
    location: "Kochi, Kerala, India",
    arrangement: "Full-time · Hybrid",
    start: "Nov 2021",
    end: "Jan 2024",
    yearLabel: "2021",
    summary: "Led web and mobile application development for airline and travel platforms.",
    positions: [
      { role: "Lead Solution Engineer", start: "Jul 2023", end: "Jan 2024", summary: "Team lead." },
      { role: "Senior Solution Engineer", start: "Nov 2021", end: "Aug 2023", summary: "Senior software engineer." },
    ],
    responsibilities: [
      "Architected a complex React application combining Redux, Flux and Recoil for state management",
      "Led the redevelopment of a critical mobile application in React Native",
      "Scaled Node.js, Express and MongoDB services for reliability under high load",
      "Integrated automated Jenkins CI/CD pipelines",
      "Worked directly with clients and cross-functional teams on requirements and solutions",
    ],
    clients: ["Korean Air", "Japan Airlines", "Skypak Tours"],
  },
  {
    id: "panasonic",
    company: "Panasonic",
    role: "Engineer / Systems & Software Architect",
    location: "Kochi, Kerala, India",
    arrangement: "Full-time",
    start: "May 2019",
    end: "Oct 2021",
    yearLabel: "2019",
    summary:
      "Designed high-complexity research systems across web, Android and blockchain for teams in India, Japan and Singapore.",
    positions: [
      {
        role: "Engineer / Systems & Software Architect",
        start: "Jan 2020",
        end: "Oct 2021",
        summary: "Junior architect and developer · On-site, Kochi.",
      },
      {
        role: "Software Engineer",
        start: "May 2019",
        end: "Dec 2019",
        summary: "Hardware and software administration; ASP.NET and Python development · Hybrid, Kochi.",
      },
    ],
    responsibilities: [
      "Led design and implementation of high-complexity software systems",
      "Optimised MySQL and MongoDB queries",
      "Advanced R&D in blockchain, Python, Unity 3D and AI, producing working prototypes",
    ],
    programmes: [
      {
        name: "Human Thermal Simulation Platform",
        where: "Kochi · Osaka · Singapore",
        points: ["Web apps with React, ASP.NET, Node.js and Express", "Blockchain integration for data security"],
      },
      {
        name: "Human Clone & Digital Mobile Assistant",
        where: "Panasonic Kochi · Squas Solutions",
        points: [
          "Secure Android applications with blockchain and a trusted execution environment (TEE)",
          "Prototype built and deployed from Android Studio",
          "UI built with Material UI and Firebase",
        ],
      },
    ],
    clients: ["Panasonic Life", "Squas", "Redenatics"],
  },
];

export const education = [
  {
    id: "mgu",
    board: "Mahatma Gandhi University, Keralam",
    degree: "Dual Degree Master of Computer Applications",
    field: "Computer Programming and Applications",
    start: "Jun 2014",
    end: "May 2019",
    institution: "Sree Narayana Guru Institute of Science and Technology",
    location: "North Paravur, Kerala",
    note: "Integrated bachelor's and master's programme.",
    skills: ["Front-End Development", "SQL"],
    href: "https://www.linkedin.com/school/2390820/",
    mark: "MGU",
  },
  {
    id: "cbse-senior",
    board: "Central Board of Secondary Education",
    degree: "Senior Secondary Education",
    field: "Physics, Chemistry, Mathematics & Biology",
    start: "Jun 2010",
    end: "May 2014",
    institution: "St. Xavier's International Public School",
    location: "Angamaly, Kerala",
    note: "A foundation in the sciences.",
    skills: [],
    href: "https://www.linkedin.com/school/15137044/",
    mark: "CBSE",
  },
  {
    id: "cbse-school",
    board: "Central Board of Secondary Education",
    degree: "Primary & Secondary Education",
    field: "School education",
    start: "Jan 2000",
    end: "Jun 2010",
    institution: "Sree Sarada Vidyalaya (Sainik School)",
    location: "Kalady, Kerala",
    note: "The beginning of the journey.",
    skills: [],
    href: "https://www.linkedin.com/school/15137044/",
    mark: "CBSE",
  },
] as const;

export const educationResearch = {
  focus: "Advanced cryptography and blockchain technologies",
  title: "MEMNP authentication research",
  body: "A cryptographically secure authentication system using negative passwords, published in the university journal.",
};

export const certifications = [
  { title: "Certified Ethereum Developer", issuer: "Kerala Blockchain Academy", year: "2021" },
  { title: "Certified Blockchain Associate", issuer: "Kerala Blockchain Academy", year: "2019" },
  { title: "Certified Full Stack Developer", issuer: "ICT Academy of Kerala", year: "2018" },
  { title: "Certified ASP.NET Developer", issuer: "LCC, Aluva", year: "2018" },
] as const;

export const awards = [
  { title: "Performance Award — Debutant (H2)", issuer: "IBS Software" },
  { title: "Team Champ Award", issuer: "IBS Software", year: "2022" },
  { title: "Team Champ Award", issuer: "IBS Software", year: "2023" },
] as const;

export type ProjectImage = { src: string; alt: string; caption?: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year?: string;
  category: string;
  summary: string;
  tech: string[];
  /** Only projects with a case-study page set this. */
  caseStudy?: boolean;
  liveUrl?: string;
  repoUrl?: string;
  cover?: ProjectImage;
};

/** Featured product — the only project with a full case study. */
export const kerasobha = {
  slug: "kerasobha",
  index: "01",
  title: "Kerasobha",
  client: "Kerasobha — Kerala coconut care",
  year: "2026",
  category: "Brand · Commerce · Platform",
  summary:
    "A cinematic commerce experience for a Kerala coconut-care brand, with its own edge API, database, admin CRM and order journey.",
  liveUrl: "https://kerasobha.com",
  role: "Product design and full-stack engineering",
  stack: {
    frontend: ["Next.js (static export)", "React", "TypeScript", "Tailwind CSS", "Radix UI", "GSAP", "Motion", "Lenis"],
    backend: ["Cloudflare Workers", "Cloudflare D1 (SQLite)", "Cron triggers", "Resend email"],
    quality: ["Playwright end-to-end", "Playwright API tests on a local D1", "TypeScript strict checks"],
  },
  problem:
    "A small, heritage-led brand needed to tell its Kerala origin story with the richness of a film, while still taking enquiries and orders reliably — without the cost and weight of a traditional commerce backend.",
  overview: [
    "Five scroll-linked chapters introduce the collection — virgin coconut oil, rosemary hair oil and herbal hair oil — with separate bottle layers, native Malayalam labels and interactive care rituals.",
    "Behind the static site, a Cloudflare Worker serves only /api/* routes, backed by a D1 database that has grown through 18 versioned migrations.",
  ],
  decisions: [
    {
      title: "Static export + edge worker",
      body: "Pages are pre-rendered and served as assets; the Worker runs first only for /api/*. Content is fast and cacheable while the API stays small.",
    },
    {
      title: "Versioned SQL migrations",
      body: "D1 schema changes ship as numbered migrations — enquiries, checkout funnel, visitor CRM, segments and checkout autosave — applied before each deploy.",
    },
    {
      title: "Defence on public endpoints",
      body: "Enquiries require consent, server validation, same-origin requests, a honeypot and a per-IP limit of five attempts per hour. Submission IDs make retries idempotent.",
    },
    {
      title: "Protected admin",
      body: "An admin inbox with filters, search, pagination and private notes runs on an authenticated session with CSRF checks and an activity log.",
    },
    {
      title: "Scheduled maintenance",
      body: "A cron trigger every 15 minutes retries unsent emails and purges abandoned data.",
    },
    {
      title: "Honest payments",
      body: "Payment uses the owner's UPI QR with manual confirmation — no automatic verification is implied to customers.",
    },
  ],
  challenges: [
    "Keeping cinematic, scroll-linked scenes smooth on mid-range Android phones — mobile gets its own sticky-stage composition with native touch scrolling.",
    "Respecting reduced-motion preferences: every chapter falls back to a document-flow version with all content intact.",
    "Writing copy without invented reviews, certifications or clinical claims — only owner-confirmed product facts.",
  ],
  outcomes: [
    "Live at kerasobha.com on Cloudflare.",
    "16 desktop and mobile regression checks passing, with label framing verified from 320 px up to 2540 px wide.",
    "Enquiry and admin flows covered by API tests against a throwaway local D1 database.",
  ],
} as const;

/** Engineering work from client engagements (from the previous portfolio). No imagery supplied — typographic presentation only. */
export const engineeringProjects: Project[] = [
  {
    slug: "payment-sdk",
    index: "02",
    title: "Multi-Gateway Payment Rendering SDK",
    client: "Apexx Global",
    category: "Payments · SDK",
    summary:
      "A payment SDK supporting PayPal, Google Pay, Apple Pay and Volt, enabling secure multi-gateway integration with PCI-DSS compliance.",
    tech: ["JavaScript", "Node.js", "Web3.js"],
  },
  {
    slug: "cargo-platform",
    index: "03",
    title: "Cargo Operations Platform",
    client: "Korean Air",
    category: "Logistics · Web",
    summary: "A full-stack cargo management platform to streamline shipment tracking and airline logistics.",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    slug: "cargo-mobile",
    index: "04",
    title: "Mobile Cargo Management App",
    client: "Korean Air",
    category: "Logistics · Mobile",
    summary:
      "A rebuilt mission-critical mobile cargo app with improved performance, reliability and Jenkins CI/CD delivery.",
    tech: ["React Native", "Node.js", "MongoDB"],
  },
  {
    slug: "it-monitoring",
    index: "05",
    title: "IT Monitoring Dashboard",
    client: "JAL",
    category: "Observability · Web",
    summary: "A real-time system-health dashboard visualising infrastructure performance for critical airline systems.",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    slug: "news-cms",
    index: "06",
    title: "Digital News & CMS Platform",
    client: "Lyca Productions",
    category: "Media · SSR",
    summary: "A news platform on Next.js with server-side rendering and a custom CMS for SEO and rapid publishing.",
    tech: ["Next.js", "Node.js", "CMS"],
  },
  {
    slug: "travel-commerce",
    index: "07",
    title: "Travel Booking Portal",
    client: "Skypak",
    category: "Commerce · Travel",
    summary: "A full-stack flight and hotel booking site with VeriTrans payments and scalable e-commerce architecture.",
    tech: ["React", "Node.js", "VeriTrans"],
  },
  {
    slug: "memorial",
    index: "08",
    title: "Online Memorial Platform",
    client: "OwnStory",
    category: "Product · Editor",
    summary: "An obituary platform with a custom rich text editor and a dynamic frontend tied to backend APIs.",
    tech: ["React", "TypeScript", "Node.js"],
  },
  {
    slug: "thermal-bim",
    index: "09",
    title: "BIM Thermal Simulation Platform",
    client: "Panasonic",
    category: "R&D · Simulation",
    summary:
      "A platform analysing human thermal comfort in BIM environments using sensors, a React UI and blockchain-secured data.",
    tech: ["React", "Node.js", "MySQL", "Blockchain", "Unity"],
  },
  {
    slug: "thermal-app",
    index: "10",
    title: "Secure Thermal Comfort App",
    client: "Panasonic",
    category: "R&D · Android",
    summary:
      "A blockchain-secured Android app for thermal preferences, using a trusted execution environment for privacy.",
    tech: ["Android", "Blockchain", "Firebase"],
  },
  {
    slug: "organ-donation",
    index: "11",
    title: "Decentralised Organ Donation",
    client: "Kerala Blockchain Academy",
    category: "Blockchain · Health",
    summary: "An Ethereum platform to manage organ donation and matching with Solidity smart contracts and Web3.",
    tech: ["Solidity", "Node.js", "Truffle", "Web3.js"],
  },
  {
    slug: "memnp",
    index: "12",
    title: "MEMNP Authentication Research",
    client: "Mahatma Gandhi University",
    category: "Research · Cryptography",
    summary:
      "Multi Secured Encrypted Mirror Negative Password — an authentication system built on negative passwords, published in the university journal.",
    tech: ["Python", "Cryptography"],
  },
];

export type StackGroup = { id: string; label: string; builds: string; items: string[] };

export const stack: StackGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    builds: "Cinematic, accessible interfaces and dynamic, JSON-driven UIs.",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "GSAP",
      "Redux",
      "React Native",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    builds: "APIs, payment integrations and services that stay correct under retries.",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "Authentication",
      "GraphQL",
      "WebSocket",
      "Distributed services",
      "ASP.NET / C#",
      "Cloudflare Workers",
    ],
  },
  {
    id: "data",
    label: "Data",
    builds: "Schemas, geospatial queries, caching and versioned migrations.",
    items: ["PostgreSQL", "PostGIS", "Redis", "MongoDB", "MySQL", "Cloudflare D1", "Prisma", "Supabase"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    builds: "Containerised deploys, pipelines and edge hosting with monitoring.",
    items: ["AWS", "Docker", "CI/CD", "Jenkins", "Monitoring", "Cloudflare", "BunnyCDN"],
  },
  {
    id: "tooling",
    label: "Tooling",
    builds: "Test-backed delivery with AI-assisted development.",
    items: ["Git", "Testing", "Playwright", "AI-assisted development"],
  },
  {
    id: "research",
    label: "R&D",
    builds: "Prototypes from research labs: ledgers, simulations and secure devices.",
    items: ["Solidity", "Web3.js", "Unity", "Python", "Firebase"],
  },
];

export const honors = [
  { src: "/images/honors/Varghese Shibu_Award.png", alt: "Varghese Shibu award certificate" },
  { src: "/images/honors/Varghese_Shibu_Team_Champ.png", alt: "Team champion award" },
  { src: "/images/honors/Varghese_Shibu_Team_Champ2023.png", alt: "Team champion award, 2023" },
];
