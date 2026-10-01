import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxied to localhost:8080 by Vite
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// ── Terminal ──────────────────────────────────────────────
/**
 * Send a command string to the Spring Boot command engine.
 * POST /api/terminal  { command: "help" }
 * Returns { output: "...", action?: "openApp", appId?: "projects" }
 */
export const sendCommand = async (command) => {
  const { data } = await api.post("/terminal", { command });
  return data;
};

// ── Projects ─────────────────────────────────────────────
/**
 * Fetch all projects.
 * GET /api/projects
 * Returns [ { id, name, description, tags, githubUrl, demoUrl } ]
 */
export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

// ── Contact ───────────────────────────────────────────────
/**
 * Send a contact message. Spring Boot forwards it via Spring Mail.
 * POST /api/contact  { name, email, subject, message }
 */
export const sendContact = async (form) => {
  const { data } = await api.post("/contact", form);
  return data;
};

// ── Resume ────────────────────────────────────────────────
/**
 * Fetch resume data (experience, education, certs).
 * GET /api/resume
 */
export const getResume = async () => {
  const { data } = await api.get("/resume");
  return data;
};

// ── Skills ────────────────────────────────────────────────
/**
 * GET /api/skills
 * Returns { skills: { languages: [{name, description, level?}], ... }, tools: [...], environment: {...} }
 */
export const getSkills = async () => {
  const { data } = await api.get("/skills");
  return data;
};

// ── Profile ───────────────────────────────────────────────
/**
 * Name, bio, contact links and stats shown across the UI.
 * GET /api/profile
 * Returns { username, name, speciality, bio, college, openTo, email, linkedin, github, blog, stats: {...} }
 */
export const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

export default api;
