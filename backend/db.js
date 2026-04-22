// =============================================================
// Legacy Compatibility Bridge
// =============================================================
// The canonical database pool has moved to: server/lib/db.js
// This file re-exports it so existing imports (e.g. routes/public.js)
// continue to work without modification.
// =============================================================

module.exports = require('./server/lib/db');
