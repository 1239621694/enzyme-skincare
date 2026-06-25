"use client";

import DOMPurify from "dompurify";

export function sanitizeHTML(dirty: string): string {
  if (typeof window === "undefined") return escapeHTML(dirty);
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "a", "ul", "ol", "li", "br", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}