const axios = require('axios');
const FormData = require('form-data');

const CDN_BASE_URL = 'https://api-cdn.kroombox.com/api/bridge';

/**
 * Helper: Determines the best URL to store based on file type.
 * - Images → optimized view endpoint (supports preview/embed)
 * - Videos & Documents → physical url from response (bypasses Google Drive preview restrictions)
 */
function resolveFileUrl(cdnResponse, mimeType) {
  const fileId = cdnResponse.fileId || cdnResponse.id;
  const physicalUrl = cdnResponse.url || cdnResponse.webContentLink || cdnResponse.directUrl;
  const isImage = mimeType && mimeType.startsWith('image/');

  if (isImage) {
    // Images: use the optimized view endpoint for embedding/preview
    return physicalUrl || `${CDN_BASE_URL}/view/${fileId}`;
  }

  // Videos & Documents: prefer the physical/direct URL to avoid Google 404/redirect errors
  if (physicalUrl) {
    return physicalUrl;
  }

  // Fallback: construct download-style URL if no physical url was returned
  return `${CDN_BASE_URL}/view/${fileId}`;
}

const cdnService = {
  /**
   * Upload a file to Kroombox CDN.
   * @param {Buffer} fileBuffer - Raw file data
   * @param {string} originalName - Original filename
   * @param {string} mimeType - MIME type
   * @param {string|number} tenantId - Tenant ID (will be prefixed with "tenant_")
   * @returns {Object} { fileId, url, status, mimeType, size, originalName }
   */
  upload: async (fileBuffer, originalName, mimeType, tenantId) => {
    try {
      const apiKey = process.env.CDN_API_KEY;
      if (!apiKey) throw new Error('CDN_API_KEY is not configured');

      // Task 1: Dynamic Folder Isolation — force tenant-prefixed project name
      const projectName = `tenant_${tenantId}`;

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: originalName,
        contentType: mimeType,
      });
      formData.append('projectName', projectName);

      console.log(`[CDN] Uploading "${originalName}" to project "${projectName}"`);

      const response = await axios.post(`${CDN_BASE_URL}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': apiKey,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const data = response.data;
      const fileId = data.fileId || data.id;

      // Task 2: Smart URL resolution based on file type
      const resolvedUrl = resolveFileUrl(data, mimeType);

      // Task 3 & 4: Normalize the response with detailed metadata
      return {
        fileId,
        url: resolvedUrl,
        status: data.status || 'ready',        // 'ready' | 'processing'
        mimeType: data.mimeType || mimeType,
        size: data.size || data.fileSize || null,
        originalName: data.originalName || data.fileName || originalName,
      };
    } catch (error) {
      console.error('[CDN] Kroombox Upload Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || error.response?.data?.error || 'Failed to upload to CDN'
      );
    }
  },

  /**
   * Delete a file from Kroombox CDN.
   * @param {string} fileId - The Kroombox file ID
   */
  delete: async (fileId) => {
    try {
      const apiKey = process.env.CDN_API_KEY;
      if (!apiKey) throw new Error('CDN_API_KEY is not configured');

      const response = await axios.delete(`${CDN_BASE_URL}/files/${fileId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[CDN] Kroombox Delete Error:', error.response?.data || error.message);
      throw new Error('Failed to delete from CDN');
    }
  },

  /**
   * Check file status from Kroombox CDN (for processing state).
   * @param {string} fileId - The Kroombox file ID
   * @returns {Object} { status, url }
   */
  getStatus: async (fileId) => {
    try {
      const apiKey = process.env.CDN_API_KEY;
      if (!apiKey) throw new Error('CDN_API_KEY is not configured');

      const response = await axios.get(`${CDN_BASE_URL}/files/${fileId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[CDN] Kroombox Status Check Error:', error.response?.data || error.message);
      return { status: 'unknown' };
    }
  }
};

module.exports = cdnService;
