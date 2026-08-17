/**
 * Render every page once and report the ones that throw.
 *
 * WHY THIS EXISTS
 * ---------------
 * The two endpoint sweeps (scripts/sweep.cjs and scripts/sweep-writes.cjs at
 * the repository root) prove the SERVER works. They say nothing about whether
 * a screen renders.
 *
 * That blind spot is not hypothetical. Two pages — CreateBill and Orders —
 * were completely blank while a full sweep reported everything green, because
 * both faults were runtime scope errors:
 *
 *     handleCreateBill is not defined     (declared inside items.map())
 *     ordersData is not defined           (left over from the hardcoded array)
 *
 * `vite build` does not catch these either. They are not import errors — the
 * identifiers parse perfectly well, they simply do not exist at the point they
 * are used. React throws during render, unmounts the whole tree, and leaves a
 * white page whose only clue is in the browser console.
 *
 * This is the third guard: server reads, server writes, and now screens.
 *
 * WHAT PASSING DOES AND DOES NOT MEAN
 * -----------------------------------
 * It means every page mounts and completes one render without throwing. It
 * does NOT mean the page is correct, the data is right, or it looks the way it
 * should. It is a smoke test for "does this screen exist at all", which is
 * exactly the failure it was written for.
 *
 * Pages are DISCOVERED, not listed. A new page under src/pages is covered from
 * the moment it is created — a hand-maintained list silently stops covering
 * whatever nobody remembered to add, which is the same failure mode as the
 * status report that started this project.
 *
 *     npm run check:render        (from frontend/)
 *
 * Exits non-zero if any page throws, so it can gate a commit or a build.
 */

// MUST be first: it installs the DOM that the imports below depend on.
// See the comment in dom-setup.js for why this cannot be inlined here.
import "./dom-setup.js";

import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

/*
 * LAZY glob (no `eager`), deliberately.
 *
 * With `eager: true` Vite rewrites the glob into ordinary static imports, and
 * those are hoisted above every import in this file — including the DOM setup
 * above, which then runs too late to be of any use. The lazy form returns
 * loader functions instead, so nothing under src/pages is evaluated until the
 * awaits below, long after the DOM exists.
 *
 * Loading is inside the same try/catch as rendering: a page that cannot even
 * be imported is at least as broken as one that throws while rendering, and
 * both show up as the same blank screen.
 */
const loaders = import.meta.glob("../src/pages/**/*.jsx");

const pages = Object.entries(loaders)
  .map(([path, load]) => [path.replace("../src/pages/", "").replace(/\.jsx$/, ""), load])
  .sort(([a], [b]) => a.localeCompare(b));

if (pages.length === 0) {
  console.error("\nrender-check found no pages under src/pages — has the folder moved?\n");
  process.exit(2);
}

console.log("");
console.log("PAGE RENDER CHECK");
console.log("-".repeat(72));

let failures = 0;

for (const [name, load] of pages) {
  try {
    const mod = await load();
    const Page = mod?.default;

    if (typeof Page !== "function") {
      failures++;
      console.log(`FAIL  ${name.padEnd(34)} default export is ${typeof Page}, not a component`);
      continue;
    }

    renderToString(
      React.createElement(MemoryRouter, null, React.createElement(Page))
    );
    console.log(`ok    ${name}`);
  } catch (error) {
    failures++;
    console.log(`FAIL  ${name.padEnd(34)} ${String(error.message).split("\n")[0]}`);

    const frame = String(error.stack || "")
      .split("\n")
      .find((line) => line.includes("src/pages") || line.includes("src\\pages"));

    if (frame) console.log(`      ${frame.trim()}`);
  }
}

console.log("");
console.log(`${pages.length} page(s) checked, ${failures} crashing`);

if (failures > 0) {
  console.log("");
  console.log("A crashing page shows as a blank white screen in the browser.");
  console.log("The message above is what the browser console would have shown.");
}

process.exit(failures === 0 ? 0 : 1);
