/**
 * fix-array-and-nav.cjs
 * Fixes two classes of bugs across all 26 template files:
 *
 * Bug 1: Broken isActive comparison — the previous script's "Guard nav.slug comparison"
 *   rule turned:  currentSlug === nav.slug.replace(...)
 *   into:         currentSlug === (nav.slug?.replace(...) ?? '')(/^\/+/, '')
 *   which is a runtime crash "... is not a function"
 *
 * Bug 2: .map() called on content fields that could be a JSON string or null
 *   instead of the expected array.
 *
 * Run with:  node fix-array-and-nav.cjs
 */
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');

// ─── RULE SET ────────────────────────────────────────────────────────────────

const rules = [
  // ── Bug 1 ───────────────────────────────────────────────────────────────────
  // Pattern produced by the previous bad rule:
  //   currentSlug === (nav.slug?.replace(/^\/+/, '') ?? '')(/^\/+/, '')
  // Correct form:
  //   currentSlug === nav.slug?.replace(/^\/+/, '')
  {
    // The ?? '' was wrongly added AND a second replace call was appended.
    // Match the whole broken expression and replace cleanly.
    regex: /currentSlug === \(nav\.slug\?\.replace\(([^)]+)\) \?\? ''\)\(([^)]+)\)/g,
    replacement: "currentSlug === nav.slug?.replace($1)",
    desc: "Fix broken isActive comparison (Bug 1)"
  },

  // ── Bug 2 ───────────────────────────────────────────────────────────────────
  // Any direct (someVar).map(...) where someVar came from content and could
  // be a JSON string instead of an array.
  // Guard pattern: ensure content field arrays are always real arrays.

  // content?.images  used with .map — ensure array
  {
    regex: /\(content\?\.images\s*\|\|\s*\[\]\)\.map/g,
    replacement: '(Array.isArray(content?.images) ? content.images : []).map',
    desc: "Safe content.images array guard"
  },
  {
    regex: /content\?\.images\?\.map/g,
    replacement: '(Array.isArray(content?.images) ? content.images : []).map',
    desc: "Safe content?.images?.map guard"
  },
  {
    regex: /content\.images\?\.map/g,
    replacement: '(Array.isArray(content?.images) ? content.images : []).map',
    desc: "Safe content.images?.map guard"
  },

  // content?.gallery  used with .map
  {
    regex: /\(content\?\.gallery\s*\|\|\s*\[\]\)\.map/g,
    replacement: '(Array.isArray(content?.gallery) ? content.gallery : []).map',
    desc: "Safe content.gallery array guard"
  },
  {
    regex: /content\?\.gallery\?\.map/g,
    replacement: '(Array.isArray(content?.gallery) ? content.gallery : []).map',
    desc: "Safe content?.gallery?.map guard"
  },

  // content?.features / content?.items / content?.cards — generic list fields
  {
    regex: /\(content\?\.features\s*\|\|\s*\[\]\)\.map/g,
    replacement: '(Array.isArray(content?.features) ? content.features : []).map',
    desc: "Safe content.features array guard"
  },
  {
    regex: /content\?\.features\?\.map/g,
    replacement: '(Array.isArray(content?.features) ? content.features : []).map',
    desc: "Safe content?.features?.map guard"
  },
  {
    regex: /\(content\?\.items\s*\|\|\s*\[\]\)\.map/g,
    replacement: '(Array.isArray(content?.items) ? content.items : []).map',
    desc: "Safe content.items array guard"
  },
  {
    regex: /content\?\.items\?\.map/g,
    replacement: '(Array.isArray(content?.items) ? content.items : []).map',
    desc: "Safe content?.items?.map guard"
  },

  // posts.map (posts prop could be undefined — already defaulted in props but guard anyway)
  {
    regex: /\bposts\.map\b/g,
    replacement: '(Array.isArray(posts) ? posts : []).map',
    desc: "Safe posts.map guard"
  },

  // navPages.map (navPages could be undefined without default)
  {
    regex: /\bnavPages\.map\b/g,
    replacement: '(Array.isArray(navPages) ? navPages : []).map',
    desc: "Safe navPages.map guard"
  },

  // settings?.global_options?.footer_config?.social_links?.map — already chained with ?., leave as is.
  // But ensure any unwrapped version is fixed:
  {
    regex: /settings\.global_options\.footer_config\.social_links\.map/g,
    replacement: 'settings?.global_options?.footer_config?.social_links?.map',
    desc: "Safe social_links.map guard"
  },
  {
    regex: /settings\.global_options\.footer_config\.quick_links\.map/g,
    replacement: 'settings?.global_options?.footer_config?.quick_links?.map',
    desc: "Safe quick_links.map guard"
  },
];

// ─── FILE PROCESSOR ──────────────────────────────────────────────────────────

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const filename = path.relative(__dirname, filePath);

  for (const { regex, replacement, desc } of rules) {
    const before = src;
    src = src.replace(regex, replacement);
    if (src !== before) {
      console.log(`  ✅  ${desc}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log(`  💾  Saved: ${filename}\n`);
  } else {
    console.log(`  ⬛  No changes: ${filename}\n`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) processFile(fullPath);
  }
}

console.log('🔧  Fixing broken isActive comparison + array fallbacks in all templates...\n');
walk(TEMPLATES_DIR);
console.log('\n✅  Done.\n');
