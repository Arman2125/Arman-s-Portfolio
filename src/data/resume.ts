// Single source of truth for portfolio content.
// Source: Arman_Shaikh_resume.docx (October 2026). Nothing here should claim more than that document does:
// skills the resume lists as "fundamentals"/"basics" are tagged `fundamentals`, and the usage table only
// links a skill to a place when that experience or project entry names it.

export interface Profile {
  name: string;
  headline: string[];
  currentRole: string;
  currentCompany: string;
  location: string;
  phone: string;
  email: string;
  intro: string;
  resumeFile: string;
}

export const profile: Profile = {
  name: "Arman Shaikh",
  headline: ["Software Engineer", "Full Stack Developer", "AI Application Developer"],
  currentRole: "Software Engineering / Full Stack Intern",
  currentCompany: "SharpFlux Technologies",
  location: "Ahmednagar, Maharashtra",
  phone: "+91 9561943782",
  email: "armanshaikh0710@gmail.com",
  intro:
    "Computer Science undergraduate building full-stack web applications with TypeScript, REST APIs and SQL/NoSQL databases. At SharpFlux Technologies I work on backend services and LLM-powered workflows, including MCP tool integration.",
  // Same filename as before so links that were already shared keep working; it now holds the October 2026 resume.
  resumeFile: "/Arman_Shaikh_ATS_Resume.pdf",
};

/** Profile links. Leave a value empty and every button that uses it is hidden. */
export const socials = {
  github: "https://github.com/Arman2125",
  linkedin: "",
};

export const contactLinks = {
  email: `mailto:${profile.email}`,
  phone: `tel:${profile.phone.replace(/\s+/g, "")}`,
};

/**
 * The contact form posts to FormSubmit (https://formsubmit.co), which emails each message to this inbox.
 * One-time setup: the first submission sends an "Activate Form" email to the address below; click it once.
 */
export const contactForm = {
  endpoint: `https://formsubmit.co/ajax/${profile.email}`,
  subject: "New message from your portfolio",
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "ai", label: "AI" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------------------------------ */
/* Skills                                                                                     */
/* ------------------------------------------------------------------------------------------ */

export interface Skill {
  name: string;
  /** Listed on the resume as "fundamentals" / "basics" / "concepts": working knowledge, not production experience. */
  fundamentals?: boolean;
}

export type SkillGroupId = "programming" | "frontend" | "backend" | "databases" | "ai" | "testing" | "tools" | "practices";

export interface SkillGroup {
  id: SkillGroupId;
  label: string;
  blurb: string;
  skills: Skill[];
}

const s = (name: string, fundamentals = false): Skill => (fundamentals ? { name, fundamentals } : { name });

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Web interfaces with HTML5, CSS3 and responsive layouts.",
    skills: [s("HTML5"), s("CSS3"), s("Responsive UI")],
  },
  {
    id: "programming",
    label: "Programming",
    blurb: "General-purpose and query languages, plus Java 17 fundamentals.",
    skills: [s("TypeScript"), s("JavaScript"), s("Python"), s("SQL"), s("C"), s("Java 17", true)],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "REST services in Node.js and Python, with a Core Java and OOP foundation.",
    skills: [s("Node.js"), s("Express.js"), s("Python / FastAPI"), s("REST APIs"), s("API integration"), s("Core Java & OOP")],
  },
  {
    id: "ai",
    label: "AI application development",
    blurb: "Putting LLMs to work inside real applications, with tools and structured output.",
    skills: [
      s("LLM APIs"),
      s("AI application development"),
      s("Prompt engineering"),
      s("MCP"),
      s("AI workflows"),
      s("Tool orchestration"),
      s("AI-assisted coding & code validation"),
    ],
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Relational and document stores behind the APIs.",
    skills: [s("PostgreSQL"), s("MongoDB"), s("SQL"), s("Database design"), s("CRUD operations")],
  },
  {
    id: "testing",
    label: "Testing & quality",
    blurb: "Making sure it works, and finding out why when it doesn't.",
    skills: [s("API testing"), s("Debugging"), s("Error handling"), s("Code validation"), s("Unit testing", true)],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    blurb: "Everyday tooling and deployment basics.",
    skills: [s("Git"), s("GitHub"), s("Postman"), s("npm"), s("Vite"), s("Docker"), s("AWS", true), s("Deployment", true)],
  },
  {
    id: "practices",
    label: "Practices",
    blurb: "How the code is organised.",
    skills: [s("MVC"), s("Layered architecture"), s("RESTful design"), s("OOP"), s("Clean code"), s("Design patterns", true)],
  },
];

/** Places a skill was actually used, as named in the resume's experience and project entries. */
export const usagePlaces = [
  { id: "sharpflux", label: "SharpFlux", detail: "Current internship" },
  { id: "proazure", label: "ProAzure", detail: "Previous internship" },
] as const;

export type UsagePlaceId = (typeof usagePlaces)[number]["id"];

export interface SkillUsage {
  skill: string;
  usedIn: UsagePlaceId[];
}

export const skillUsage: SkillUsage[] = [
  { skill: "TypeScript", usedIn: ["proazure"] },
  { skill: "JavaScript", usedIn: ["proazure"] },
  { skill: "HTML & CSS", usedIn: ["proazure"] },
  { skill: "React.js", usedIn: ["sharpflux"] },
  { skill: "Node.js", usedIn: ["sharpflux", "proazure"] },
  { skill: "Express.js", usedIn: ["proazure"] },
  { skill: "Python / FastAPI", usedIn: ["sharpflux"] },
  { skill: "REST APIs", usedIn: ["sharpflux", "proazure"] },
  { skill: "PostgreSQL", usedIn: ["sharpflux"] },
  { skill: "MongoDB", usedIn: ["sharpflux", "proazure"] },
  { skill: "Authorization", usedIn: ["sharpflux"] },
  { skill: "LLM APIs & prompt design", usedIn: ["sharpflux"] },
  { skill: "MCP tool integration", usedIn: ["sharpflux"] },
  { skill: "Testing", usedIn: ["sharpflux"] },
  { skill: "Debugging", usedIn: ["sharpflux", "proazure"] },
  { skill: "Git", usedIn: ["sharpflux", "proazure"] },
  { skill: "RPA automation", usedIn: ["proazure"] },
];

/** The scrolling stack strip under the hero: only technologies the usage table above backs up. */
export const heroStack = [
  "TypeScript",
  "Node.js",
  "Express.js",
  "Python",
  "FastAPI",
  "React.js",
  "REST APIs",
  "PostgreSQL",
  "MongoDB",
  "LLM APIs",
  "MCP",
  "Git",
];

/* ------------------------------------------------------------------------------------------ */
/* About                                                                                      */
/* ------------------------------------------------------------------------------------------ */

export const aboutParagraphs = [
  "I'm a Computer Science undergraduate at Sanjivani University and a Software Engineering / Full Stack Intern at SharpFlux Technologies, where I contribute to Playground and Sugam AI OS: backend services, REST APIs, integrations and LLM-powered workflows.",
  "Before that, at ProAzure Software Solutions, I built full-stack web applications with TypeScript and JavaScript on top of Node.js/Express REST APIs and MongoDB, and automated document workflows with RPA.",
  "My Java foundation is Core Java and object-oriented programming, with Java 17 fundamentals.",
];

export const workingPrinciples = [
  {
    title: "End-to-end features",
    text: "Interfaces, the REST API behind them and the database underneath, as in the full-stack web applications I built at ProAzure.",
  },
  {
    title: "Careful APIs",
    text: "Request/response design, validation and error handling on the services I work on at SharpFlux.",
  },
  {
    title: "Tested and debugged",
    text: "API testing with Postman, debugging across services, and Git-based workflows.",
  },
  {
    title: "AI inside applications",
    text: "LLM APIs, tool calling and MCP inside applications, plus AI-assisted coding backed by code validation.",
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Experience                                                                                 */
/* ------------------------------------------------------------------------------------------ */

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  current: boolean;
  summary: string;
  groups: { title: string; points: string[] }[];
  stack: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: "sharpflux",
    company: "SharpFlux Technologies",
    role: "Software Engineering / Full Stack Intern",
    period: "Current",
    current: true,
    summary:
      "Contributing to Playground and Sugam AI OS, an AI intelligence layer that connects existing applications with conversational AI capabilities.",
    groups: [
      {
        title: "Backend & full stack",
        points: [
          "Developing and debugging backend services, REST APIs, integrations and full-stack workflows with Python/FastAPI, Node.js, React.js, PostgreSQL and MongoDB.",
          "API design, request/response handling, validation, error handling, database operations, Git workflows, testing and debugging.",
        ],
      },
      {
        title: "AI & LLM workflows",
        points: [
          "LLM-powered workflows: model integration, prompt design, tool calling, structured AI responses and API integrations.",
          "MCP-based tool integration so AI agents can discover and execute application capabilities through standardized tool interfaces.",
          "Multi-turn WhatsApp AI workflows with message processing, media handling, deduplication, conversation state and action execution.",
        ],
      },
      {
        title: "Reliability",
        points: ["Authorization, state management, testing and reliable execution across applications and workflows."],
      },
    ],
    stack: ["Python / FastAPI", "Node.js", "React.js", "PostgreSQL", "MongoDB", "LLM APIs", "MCP", "Git"],
  },
  {
    id: "proazure",
    company: "ProAzure Software Solutions",
    role: "Full Stack Web Developer Intern",
    period: "09/2025 · Earlier internship",
    current: false,
    summary:
      "Full-stack web applications with TypeScript, JavaScript, HTML and CSS on the front end and Node.js, Express.js and MongoDB behind REST APIs, in a Git-based workflow.",
    groups: [
      {
        title: "APIs & data",
        points: ["Built and integrated REST APIs, and worked on debugging, application development, database operations and Git workflows."],
      },
      {
        title: "Automation",
        points: ["RPA automation for repetitive business processes and document workflows involving Word, Excel and email."],
      },
    ],
    stack: ["TypeScript", "JavaScript", "HTML / CSS", "Node.js", "Express.js", "MongoDB", "REST APIs", "Git", "RPA"],
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Projects                                                                                   */
/* ------------------------------------------------------------------------------------------ */

export type PreviewKind = "sugam" | "farmers" | "meals";

export interface ArchitectureLayer {
  name: string;
  tech: string;
  items: string[];
  /** A service used alongside the request flow rather than a step in it. */
  side?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  context: string;
  summary: string;
  /** Long-form fields; a project gets a "View details" dialog only when these exist. */
  details?: {
    role: string;
    problem: string;
    features: { title: string; text: string }[];
    architecture: ArchitectureLayer[];
    crossCutting?: string[];
    architectureNote: string;
  };
  highlights: string[];
  /** Technologies the resume names for this project. */
  stack: string[];
  /** Used instead of `stack` when the resume names no technologies. */
  topics?: string[];
  /** Only real URLs. Empty means the button is not shown. */
  links: { github?: string; demo?: string };
  preview: PreviewKind;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "sugam",
    title: "Sugam AI OS / Playground",
    tagline: "AI integration platform",
    context: "SharpFlux Technologies · internship",
    summary:
      "An AI-powered platform that brings conversational intelligence to existing applications. I contribute to LLM execution, MCP tools, WhatsApp workflows, authorization, conversation state, orchestration and API integrations.",
    highlights: [
      "MCP tool integration: agents discover and execute application capabilities through standardized tool interfaces",
      "Multi-turn WhatsApp AI workflows with media handling, deduplication and conversation state",
      "LLM execution with prompt design, tool calling and structured AI responses",
      "Authorization, state management, error handling and testing across applications",
    ],
    details: {
      role: "Contributor as a Software Engineering Intern, working on backend architecture, workflows and testing.",
      problem:
        "Let people use existing applications through conversation: AI agents discover and run each application's capabilities through standardized tool interfaces.",
      features: [
        { title: "MCP tools", text: "Application capabilities exposed as MCP tools that AI agents can discover and execute." },
        { title: "WhatsApp workflows", text: "Multi-turn conversations with message processing, media handling, deduplication and action execution." },
        { title: "LLM execution", text: "Model integration, prompt design, tool calling and structured AI responses." },
        { title: "Conversation state", text: "State management that keeps multi-turn workflows consistent." },
        { title: "Authorization", text: "Authorization across roles, applications and workflows." },
        { title: "Reliability", text: "Error handling, testing and debugging for production-oriented workflows." },
      ],
      architecture: [
        { name: "Channel", tech: "WhatsApp", items: ["Multi-turn messages", "Media handling"] },
        { name: "Processing", tech: "Backend services", items: ["Message processing", "Deduplication", "Conversation state"] },
        { name: "LLM execution", tech: "LLM APIs", items: ["Prompt design", "Tool calling", "Structured responses"] },
        { name: "Tools", tech: "MCP", items: ["Tool discovery", "Tool execution"] },
        { name: "Applications", tech: "REST APIs", items: ["Existing application APIs", "Action execution"] },
      ],
      crossCutting: ["Authorization", "Error handling", "Testing"],
      architectureNote: "A simplified view of the areas I work on, not a complete system diagram.",
    },
    stack: ["Python / FastAPI", "Node.js", "React.js", "PostgreSQL", "MongoDB", "LLM APIs", "MCP"],
    links: {},
    preview: "sugam",
    featured: true,
  },
  {
    id: "farmers-ecommerce",
    title: "E-Commerce Website for Farmers",
    tagline: "Accessible e-commerce",
    context: "Web project",
    summary: "An accessible web platform that lets farmers purchase fertilizers through a simple online interface.",
    highlights: [],
    stack: [],
    topics: ["Accessibility", "E-commerce"],
    links: {},
    preview: "farmers",
    featured: false,
  },
  {
    id: "better-meals",
    title: "Better Meals Platform",
    tagline: "Meal discovery",
    context: "Web project",
    summary: "A web platform that helps users discover suitable meals based on their dietary preferences, with feedback functionality.",
    highlights: [],
    stack: [],
    topics: ["Dietary preferences", "Feedback"],
    links: {},
    preview: "meals",
    featured: false,
  },
];

/* ------------------------------------------------------------------------------------------ */
/* AI application development                                                                 */
/* ------------------------------------------------------------------------------------------ */
// Everything here restates the resume's SharpFlux entries and "AI-Assisted Development" skills.

export type AiFlowIcon = "whatsapp" | "state" | "llm" | "mcp" | "apps";

export interface AiFlowNode {
  id: AiFlowIcon;
  label: string;
  detail: string;
}

/** The path a request takes through the AI workflows I work on (simplified). */
export const aiFlow: AiFlowNode[] = [
  { id: "whatsapp", label: "WhatsApp", detail: "Multi-turn messages and media" },
  { id: "state", label: "Conversation state", detail: "Deduplication and context" },
  { id: "llm", label: "LLM", detail: "Prompts, tool calls, structured output" },
  { id: "mcp", label: "MCP tools", detail: "Discover and execute capabilities" },
  { id: "apps", label: "Applications", detail: "Existing APIs and actions" },
];

export interface AiCapability {
  title: string;
  text: string;
  tags: string[];
}

export const aiCapabilities: AiCapability[] = [
  {
    title: "LLM integration",
    text: "Model integration, prompt design and structured AI responses inside application workflows.",
    tags: ["LLM APIs", "Prompt engineering"],
  },
  {
    title: "Tool calling & MCP",
    text: "MCP-based tool integration so AI agents can discover and execute application capabilities through standardized tool interfaces.",
    tags: ["MCP", "Tool orchestration"],
  },
  {
    title: "Conversational workflows",
    text: "Multi-turn WhatsApp AI workflows with message processing, media handling, deduplication, conversation state and action execution.",
    tags: ["AI workflows"],
  },
  {
    title: "Reliable execution",
    text: "Authorization, state management, error handling and testing across applications and workflows.",
    tags: ["Testing", "Error handling"],
  },
];

export const aiFoundation = {
  practice: "AI-assisted coding, backed by code validation",
  certification: "Artificial Intelligence with Machine Learning",
};

/* ------------------------------------------------------------------------------------------ */
/* Education & certifications                                                                 */
/* ------------------------------------------------------------------------------------------ */

export interface EducationItem {
  degree: string;
  school: string;
  place: string;
  period: string;
  current: boolean;
}

export const education: EducationItem[] = [
  {
    degree: "B.Tech in Computer Science and Engineering",
    school: "Sanjivani University",
    place: "Kopargaon",
    period: "Expected 01/2027",
    current: true,
  },
  {
    degree: "Diploma in Computer Technology",
    school: "P. Dr. V. V. P. Institute of Technology and Engineering",
    place: "Loni",
    period: "Completed 01/2024",
    current: false,
  },
];

export interface Certification {
  name: string;
  issuer?: string;
}

export const certifications: Certification[] = [
  { name: "Artificial Intelligence with Machine Learning" },
  { name: "MongoDB Developer Certification" },
  { name: "Java Fundamentals" },
  { name: "Introduction to Python" },
  { name: "C Language Programming" },
  { name: "SpectraVision Workshop", issuer: "National Chung Cheng University, Taiwan" },
];
