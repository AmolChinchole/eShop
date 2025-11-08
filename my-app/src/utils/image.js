// Utility to resolve image URLs and provide a safe embedded placeholder
import api from "../api/api";

const makePlaceholder = (w = 400, h = 300, text = "No image") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='100%' height='100%' fill='%23eeeeee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-size='20'>${text}</text></svg>`
  );

const isValidUrl = (value) => {
  try {
    if (!value) return false;
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const getApiRoot = () => {
  try {
    const base = api?.defaults?.baseURL || "";
    return base.replace(/\/api\/?$/, "");
  } catch (e) {
    return "";
  }
};

export function resolveImageUrl(img, opts = {}) {
  const { w = 400, h = 300, text = "No image" } = opts;
  const placeholder = makePlaceholder(w, h, text);
  if (!img) return placeholder;

  // If img is an object (e.g., { url, path, secure_url, filename }), try to extract a string
  if (typeof img === "object") {
    const candidates = ["url", "src", "path", "filename", "fileName", "secure_url", "name", "publicUrl", "public_url"];
    for (const k of candidates) {
      if (img[k] && typeof img[k] === "string") {
        img = img[k];
        break;
      }
    }
    // If still an object but has a 0 index (array-like), try that
    if (typeof img !== "string" && img[0] && typeof img[0] === "string") {
      img = img[0];
    }
    // If still not string, fallback to placeholder
    if (typeof img !== "string") return placeholder;
  }
  if (isValidUrl(img)) return img;

  // Handle protocol-relative URLs (//host/path)
  if (img.startsWith("//")) return "http:" + img;

  // Handle host:port/path like "localhost:5000/uploads/.." -> prepend http://
  if (/^[^\/]+:\d+/.test(img)) {
    return "http://" + img;
  }

  const apiRoot = getApiRoot();
  // If starts with slash, join to apiRoot
  if (img.startsWith("/")) return apiRoot + img;
  // If relative path without protocol
  if (!img.startsWith("http")) return apiRoot + "/" + img;

  return placeholder;
}

export { makePlaceholder };
