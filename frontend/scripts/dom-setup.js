/**
 * Installs a real DOM on globalThis, as a side effect, at import time.
 *
 * This is a separate module ON PURPOSE, and it must be the FIRST import in
 * render-check.jsx.
 *
 * `import.meta.glob(..., { eager: true })` is compiled by Vite into ordinary
 * static import statements. Those are hoisted and evaluated before any code in
 * the importing module's body — so setting up the DOM inline in render-check
 * ran too late: the page modules, and the libraries they pull in, had already
 * been evaluated against a bare Node global scope.
 *
 * Imports are evaluated in source order, so putting the setup in its own module
 * and importing it first guarantees the DOM exists before anything else loads.
 *
 * Several libraries need this at IMPORT time rather than render time —
 * react-hot-toast builds its keyframes through goober the moment it is loaded,
 * and zustand's auth store reads localStorage while the store is being created.
 */

import { Window } from "happy-dom";

const browser = new Window({ url: "http://localhost:5173/" });

const GLOBALS = [
  "window",
  "document",
  "navigator",
  "location",
  "history",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "CustomEvent",
  "MutationObserver",
  "ResizeObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "matchMedia",
];

for (const key of GLOBALS) {
  if (browser[key] !== undefined && globalThis[key] === undefined) {
    globalThis[key] = browser[key];
  }
}

globalThis.localStorage = browser.localStorage;
globalThis.sessionStorage = browser.sessionStorage;

// Pretend to be signed in, so pages that short-circuit on a missing token
// render their real content instead of a redirect.
globalThis.localStorage.setItem("token", "render-check");
globalThis.localStorage.setItem(
  "user",
  JSON.stringify({ id: 2, name: "System Admin", role: "admin" })
);

export default browser;
