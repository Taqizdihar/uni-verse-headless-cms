/**
 * Path Helper — Builds hierarchical CDN paths from MySQL media_folders.
 * 
 * Given a folder_id, walks up the parent_id chain to construct a path like:
 *   tenant_9/Aset_Promosi/Januari_2026
 * 
 * This path is used as the `projectName` for Kroombox CDN uploads,
 * ensuring files are organized into sub-folders mirroring the CMS structure.
 */

const db = require('../server/lib/db');

/**
 * Sanitize a folder name for use in a CDN path segment.
 * Replaces spaces and special characters with underscores.
 * @param {string} name
 * @returns {string}
 */
function sanitizeFolderName(name) {
  return name
    .trim()
    .replace(/[\/\\:*?"<>|]/g, '') // remove illegal path chars
    .replace(/\s+/g, '_');          // spaces → underscores
}

/**
 * Build the full CDN project path for a given tenant + optional folder.
 * 
 * @param {number} tenantId - The tenant ID (root segment: tenant_{id})
 * @param {number|null} folderId - The CMS media_folders.id (null = root)
 * @returns {Promise<string>} e.g. "tenant_9/Aset_Promosi/Januari_2026"
 */
async function buildCdnPath(tenantId, folderId) {
  const rootSegment = `tenant_${tenantId}`;

  // If no folder, upload goes to tenant root
  if (!folderId) {
    return rootSegment;
  }

  // Walk up the parent chain to collect folder names (deepest → shallowest)
  const segments = [];
  let currentId = folderId;
  const MAX_DEPTH = 20; // safety guard against circular references
  let depth = 0;

  while (currentId && depth < MAX_DEPTH) {
    const [rows] = await db.execute(
      'SELECT id, name, parent_id FROM media_folders WHERE id = ?',
      [currentId]
    );

    if (rows.length === 0) {
      console.warn(`[PATH] Folder ID ${currentId} not found in database, stopping walk.`);
      break;
    }

    const folder = rows[0];
    segments.unshift(sanitizeFolderName(folder.name)); // prepend (we're walking up)
    currentId = folder.parent_id;
    depth++;
  }

  if (depth >= MAX_DEPTH) {
    console.error(`[PATH] Max folder depth (${MAX_DEPTH}) exceeded for folder_id=${folderId}. Possible circular reference.`);
  }

  // Final path: tenant_9/FolderA/SubFolderB
  const fullPath = [rootSegment, ...segments].join('/');
  console.log(`[PATH] Built CDN path: ${fullPath} (folder_id: ${folderId})`);
  return fullPath;
}

module.exports = { buildCdnPath, sanitizeFolderName };
