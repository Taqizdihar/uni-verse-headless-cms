// =============================================================
// Legacy Compatibility Bridge
// =============================================================
// The canonical apiAuth middleware has moved to: server/routes/auth.js
// This file re-exports it so existing imports continue to work.
// =============================================================

module.exports = require('../server/routes/auth').apiAuth;
