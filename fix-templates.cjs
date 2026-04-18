/**
 * fix-templates.cjs
 * Applies safe optional chaining across all 23 templates.
 * Run with: node fix-templates.cjs
 */
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');

// ─── REGEX REPLACEMENT RULES ─────────────────────────────────────────────────
// Each entry: [regex, replacement, description]
const rules = [
  // 1. SocialIcon: type.toLowerCase() crashes if type is undefined
  [
    /switch\s*\(type\.toLowerCase\(\)\)/g,
    'switch ((type || \'\').toLowerCase())',
    'Safe SocialIcon type switch'
  ],

  // 2. content.X → content?.X  (where content is a local const, not settings)
  // Pattern: content.WORD where WORD is a known field
  [
    /\bcontent\.([a-zA-Z_]+)\b(?!\s*=(?!=))/g,
    'content?.$1',
    'Optional chain content fields'
  ],

  // 3. postData.content.X → postData.content?.X
  [
    /postData\.content\.([a-zA-Z_]+)\b(?!\s*=(?!=))/g,
    'postData.content?.$1',
    'Optional chain postData.content fields'
  ],

  // 4. settings.global_options.contact_info → settings?.global_options?.footer_config?.contact_info
  //    (catches the most common wrong path in SaaSTemplate footer)
  [
    /settings\.global_options\.contact_info/g,
    'settings?.global_options?.footer_config?.contact_info',
    'Fix wrong contact_info path (missing footer_config)'
  ],

  // 5. settings.global_options.footer_config.X → settings?.global_options?.footer_config?.X  (no ?. on chain)
  [
    /settings\.global_options\.footer_config\.([a-zA-Z_]+)/g,
    'settings?.global_options?.footer_config?.$1',
    'Optional chain footer_config access'
  ],

  // 6. settings.global_options?.footer_config.X → add ?. before field
  [
    /settings\.global_options\?\.footer_config\.([a-zA-Z_]+)/g,
    'settings?.global_options?.footer_config?.$1',
    'Optional chain footer_config (partial existing chain)'
  ],

  // 7. new Date(postData.created_at) — wrap to guard undefined
  [
    /new Date\(postData\.created_at\)/g,
    'postData?.created_at ? new Date(postData.created_at) : new Date()',
    'Guard postData.created_at in Date constructor'
  ],

  // 8. new Date(post.created_at) in posts.map — guard
  [
    /new Date\(post\.created_at\)/g,
    'post?.created_at ? new Date(post.created_at) : new Date()',
    'Guard post.created_at in Date constructor'
  ],

  // 9. navPages.map(... nav.slug.replace — nav.slug?.replace
  [
    /nav\.slug\.replace/g,
    'nav.slug?.replace',
    'Optional chain nav.slug.replace'
  ],

  // 10. currentSlug === nav.slug.replace → already fixed by rule 9, but guard the comparison too
  [
    /currentSlug === nav\.slug\?\.replace/g,
    'currentSlug === (nav.slug?.replace(/^\\/+/, \'\') ?? \'\')',
    'Guard nav.slug comparison'
  ],
];

// ─── PROCESS FILES ────────────────────────────────────────────────────────────
function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const filename = path.relative(__dirname, filePath);

  for (const [regex, replacement, desc] of rules) {
    const before = src;
    src = src.replace(regex, replacement);
    if (src !== before) {
      console.log(`  ✅ [${filename}] ${desc}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log(`  💾 Saved: ${filename}\n`);
  } else {
    console.log(`  ⬛ No changes needed: ${filename}\n`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

console.log('🔧 Applying optional chaining fixes to all templates...\n');
walk(TEMPLATES_DIR);
console.log('\n✅ Done. All templates patched.');
