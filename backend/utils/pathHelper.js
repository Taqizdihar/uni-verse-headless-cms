/**
 * Path Helper — Builds hierarchical CDN paths from MySQL media_folders.
 * 
 * Target Format: ${PROJECT_ID}/tenant_${tid}[/${folderName}]
 * This forces Kroombox to create isolated folders mirroring the CMS structure.
 */

const db = require('../server/lib/db');

/**
 * Sanitize a folder name for use in a CDN path segment.
 */
function sanitizeFolderName(name) {
  if (!name) return '';
  return name
    .trim()
    .replace(/[\/\\:*?"<>|]/g, '') // remove illegal path chars
    .replace(/\s+/g, '_');          // spaces → underscores
}

/**
 * Build the full CDN project path for a given tenant + optional folder.
 * 
 * @param {number} tenantId - The tenant ID
 * @param {number|null} folderId - The CMS media_folders.id (null = root)
 * @returns {Promise<string>} e.g. "kd59zf94/tenant_9/Aset_Promosi"
 */
async function buildCdnPath(tenantId, folderId) {
  const projectId = process.env.CDN_PROJECT_ID || 'kd59zf94';
  let path = `${projectId}/tenant_${tenantId}`;

  if (folderId) {
    try {
      const [rows] = await db.execute(
        'SELECT name FROM media_folders WHERE id = ?',
        [folderId]
      );
      
      if (rows.length > 0) {
        // Task 2: Append sub-folder name with a slash
        const folderName = sanitizeFolderName(rows[0].name);
        path += `/${folderName}`;
      }
    } catch (err) {
      console.error('[PATH] Error fetching folder name:', err);
    }
  }

  console.log(`[PATH] Final projectName (CDN Path): ${path}`);
  return path;
}

module.exports = { buildCdnPath, sanitizeFolderName };
