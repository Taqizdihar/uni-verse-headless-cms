/**
 * Path Helper — Builds hierarchical CDN paths from MySQL media_folders.
 * 
 * Target Format: ${PROJECT_ID}_tenant_${tid}[_${folderName}]
 * This forces Kroombox to group assets in an isolated "Project" string.
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
 * @returns {Promise<string>} e.g. "kd59zf94_tenant_9_Aset_Promosi"
 */
async function buildCdnPath(tenantId, folderId) {
  const projectId = process.env.CDN_PROJECT_ID || 'kd59zf94';
  let path = `${projectId}_tenant_${tenantId}`;

  if (folderId) {
    try {
      const [rows] = await db.execute(
        'SELECT name FROM media_folders WHERE id = ?',
        [folderId]
      );
      
      if (rows.length > 0) {
        const folderName = sanitizeFolderName(rows[0].name);
        path += `_${folderName}`;
      }
    } catch (err) {
      console.error('[PATH] Error fetching folder name:', err);
    }
  }

  console.log(`[PATH] Final projectName: ${path}`);
  return path;
}

module.exports = { buildCdnPath, sanitizeFolderName };
