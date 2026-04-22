// =============================================================
// Legacy Compatibility Bridge
// =============================================================
// The canonical public data routes have moved to: server/routes/data.js
// This file re-exports them so any lingering imports continue to work.
// =============================================================

module.exports = require('../server/routes/data');
