// =============================================================
// HTML Content Sanitizer — &nbsp; Normalization Pipeline
// =============================================================
// Rich text editors (e.g., ReactQuill) frequently inject &nbsp;
// entities in place of regular spaces. When stored in the database,
// these non-breaking spaces cause word-wrapping failures on public
// frontends, creating layout overflow issues.
//
// This module provides a recursive sanitizer that normalizes all
// &nbsp; entities back to standard spaces across any content shape
// (strings, objects, arrays) before database persistence.
// =============================================================

/**
 * Replaces all &nbsp; HTML entities (and their numeric equivalents)
 * with standard space characters in a plain string.
 *
 * @param {string} str - The input string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeNbsp(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&nbsp;/g, ' ')
        .replace(/&#160;/g, ' ')
        .replace(/\u00A0/g, ' ');
}

/**
 * Recursively traverses an object or array and sanitizes all
 * string values by replacing &nbsp; with regular spaces.
 *
 * @param {*} data - The data structure to sanitize (string, object, or array).
 * @returns {*} The sanitized data structure.
 */
function deepSanitizeContent(data) {
    if (typeof data === 'string') {
        return sanitizeNbsp(data);
    }

    if (Array.isArray(data)) {
        return data.map(item => deepSanitizeContent(item));
    }

    if (typeof data === 'object' && data !== null) {
        const cleaned = {};
        for (const key of Object.keys(data)) {
            cleaned[key] = deepSanitizeContent(data[key]);
        }
        return cleaned;
    }

    // Numbers, booleans, null — pass through unchanged
    return data;
}

module.exports = { sanitizeNbsp, deepSanitizeContent };
