import AboutApp from "../../apps/About/AboutApp";
import ContactApp from "../../apps/Contact/ContactApp";
import FilesApp from "../../apps/Files/FilesApp";
import ApiTesterApp from "../../apps/Postman/PostmanApp";
import ProjectsApp from "../../apps/Projects/ProjectsApp";
import ResumeApp from "../../apps/Resume/ResumeApp";
import SkillsApp from "../../apps/Skills/SkillsApp";
import TerminalApp from "../../apps/Terminal/TerminalApp";

export const WINDOW_DEFAULTS = {
  about: {
    id: "about",
    app: AboutApp,
    title: "About Me",
    icon: "👤",
    w: 820,
    h: 680,
    titleBarColor: "#f5f4dc",
  },
  projects: {
    id: "projects",
    app: ProjectsApp,
    title: "My Projects",
    icon: "📁",
    w: 900,
    h: 680,
  },
  resume: {
    id: "resume",
    app: ResumeApp,
    title: "Resume",
    icon: "📄",
    w: 820,
    h: 760,
  },
  terminal: {
    id: "terminal",
    app: TerminalApp,
    title: "Terminal — visitor @ portfolio:~",
    icon: "💻",
    w: 820,
    h: 580,
  },
  contact: {
    id: "contact",
    app: ContactApp,
    title: "Contact Me",
    icon: "📡",
    w: 760,
    h: 720,
  },
  files: {
    id: "files",
    app: FilesApp,
    title: "Files",
    icon: "🗂",
    w: 800,
    h: 580,
  },
  skills: {
    id: "skills",
    app: SkillsApp,
    title: "Skills Matrix",
    icon: "⚡",
    w: 820,
    h: 700,
  },
  api_tester: {
    id: "api_tester",
    app: ApiTesterApp,
    title: "ApiTester",
    icon: "🧪",
    w: 980,
    h: 760,
  },
};
