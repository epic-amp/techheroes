/**
 * TechHeroes API client.
 * Talks to the serverless API on the same origin (/api). Stores the JWT in
 * localStorage. Import these helpers into the UI to replace the sample data.
 *
 * Example wiring inside App.jsx:
 *   import { api } from "./lib/api";
 *   const { user } = await api.login.tutor("tutor@techheroes.io", "demo1234");
 *   const { students } = await api.students.list();
 */
import { upload } from "@vercel/blob/client";

const BASE = import.meta.env.VITE_API_BASE || "/api";
const TOKEN_KEY = "th_token";

// Keep these in sync with ALLOWED / MAX_UPLOAD_BYTES in lib/routes/upload.js.
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // 200 MB
export const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/zip", "application/x-zip-compressed",
  "image/jpeg", "image/png",
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", // mp4, webm, mov, avi
];

// Extensions matching ALLOWED_UPLOAD_TYPES above, used as a fallback because
// (a) native file-picker dialogs on Windows/macOS often only grey files in/out
// by extension, not MIME type, so an accept list of MIME types alone can hide
// valid videos, and (b) some browsers report an empty or nonstandard file.type
// for certain video containers (.mov in particular), which would otherwise
// fail a MIME-only check even though the file is fine.
export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".pdf", ".docx", ".pptx", ".xlsx", ".zip",
  ".jpg", ".jpeg", ".png",
  ".mp4", ".webm", ".mov", ".avi",
];

// Pass this to <input accept=...>. Listing exact subtypes like "video/mp4" is
// NOT reliable on its own: macOS's native Open panel (used by both Safari and
// Chrome) matches files by UTI, and phone-exported videos (e.g. WhatsApp's
// .mp4 export) don't always resolve to the exact subtype we listed, so they
// show up greyed out even though the extension is right there in the accept
// list. The "video/*" / "image/*" wildcards are what the OS reliably expands
// to "any video/image file" regardless of the specific codec or container, so
// we lead with those and keep the precise types/extensions as a supplement
// for the document types that don't have a safe wildcard category.
export const UPLOAD_ACCEPT = [
  "video/*", "image/*",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip", "application/x-zip-compressed",
  ...ALLOWED_UPLOAD_EXTENSIONS,
].join(",");

// True if `file` looks like an allowed type, checking MIME type first and
// falling back to its extension when the browser didn't report a MIME type
// we recognize (common for .mov/.avi). The server re-validates the real
// content type regardless, so this is just a fast client-side sanity check.
export function isAllowedUploadFile(file) {
  if (file.type && ALLOWED_UPLOAD_TYPES.includes(file.type)) return true;
  const name = (file.name || "").toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.some((ext) => name.endsWith(ext));
}

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  setToken,
  getToken,
  logout: () => setToken(null),

  setup: {
    status: () => request("/setup/status", { auth: false }),
    create: async (name, email, password) => {
      const data = await request("/setup", { method: "POST", auth: false, body: { name, email, password } });
      setToken(data.token);
      return data;
    },
  },

  login: {
    student: async (studentId, password) => {
      const data = await request("/auth/login/student", { method: "POST", auth: false, body: { studentId, password } });
      setToken(data.token);
      return data;
    },
    tutor: async (email, password) => {
      const data = await request("/auth/login/tutor", { method: "POST", auth: false, body: { email, password } });
      setToken(data.token);
      return data;
    },
  },
  me: () => request("/auth/me"),
  updateProfile: (b) => request("/auth/me", { method: "PUT", body: b }),

  // Upload a real file straight to Vercel Blob (browser -> Blob), returns its URL.
  // The Date.now() prefix guarantees a unique pathname, so re-uploading a file
  // with the same name never throws "This blob already exists". The server route
  // (lib/routes/upload.js) also sets addRandomSuffix: true as a second safeguard.
  // Files (including video, up to MAX_UPLOAD_BYTES) go directly to Blob storage,
  // bypassing this server, so large uploads never hit a function body-size limit.
  // Pass onProgress({ percentage }) to drive a progress bar in the UI.
  uploadFile: async (file, onProgress) => {
    const blob = await upload(`${Date.now()}-${file.name}`, file, {
      access: "public",
      handleUploadUrl: `${BASE}/upload`,
      clientPayload: JSON.stringify({ token: getToken() }),
      onUploadProgress: onProgress,
    });
    return blob.url;
  },

  students: {
    list: (params = {}) => request(`/students${qs(params)}`),
    create: (b) => request("/students", { method: "POST", body: b }),
    update: (id, b) => request(`/students/${id}`, { method: "PUT", body: b }),
    remove: (id) => request(`/students/${id}`, { method: "DELETE" }),
  },
  groups: {
    list: () => request("/groups"),
    create: (b) => request("/groups", { method: "POST", body: b }),
    update: (id, b) => request(`/groups/${id}`, { method: "PUT", body: b }),
    remove: (id) => request(`/groups/${id}`, { method: "DELETE" }),
    addMember: (id, userId) => request(`/groups/${id}/members`, { method: "POST", body: { userId } }),
    removeMember: (id, userId) => request(`/groups/${id}/members/${userId}`, { method: "DELETE" }),
  },
  materials: {
    list: () => request("/materials"),
    create: (b) => request("/materials", { method: "POST", body: b }),
    remove: (id) => request(`/materials/${id}`, { method: "DELETE" }),
  },
  assignments: {
    list: () => request("/assignments"),
    create: (b) => request("/assignments", { method: "POST", body: b }),
    remove: (id) => request(`/assignments/${id}`, { method: "DELETE" }),
  },
  submissions: {
    create: (b) => request("/submissions", { method: "POST", body: b }),
    list: (assignmentId) => request(`/submissions${assignmentId ? `?assignmentId=${assignmentId}` : ""}`),
  },
  grades: {
    list: () => request("/grades"),
    grade: (b) => request("/grades", { method: "POST", body: b }),
  },
  messages: {
    send: (b) => request("/messages", { method: "POST", body: b }),
    personal: (otherUserId, after) => request(`/messages/personal/${otherUserId}${after ? `?after=${after}` : ""}`),
    group: (groupId, after) => request(`/messages/group/${groupId}${after ? `?after=${after}` : ""}`),
  },
  notifications: {
    list: () => request("/notifications"),
    markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
  },
  contacts: () => request("/contacts"),
};

function qs(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  return entries.length ? "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&") : "";
}
