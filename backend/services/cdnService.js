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
    return physicalUrl || `${CDN_BASE_URL}/view/${fileId}`;
  }

  // Videos & Documents: prefer the physical/direct URL
  if (physicalUrl) {
    return physicalUrl;
  }

  return `${CDN_BASE_URL}/view/${fileId}`;
}

const cdnService = {
  /**
   * Upload a file to Kroombox CDN.
   * @param {Buffer} fileBuffer - Raw file data
   * @param {string} originalName - Original filename
   * @param {string} mimeType - MIME type
   * @param {string} projectName - Full hierarchical path (e.g. "tenant_9/Aset_Promosi/Jan_2026")
   * @returns {Object} { fileId, url, status, mimeType, size, originalName }
   */
  upload: async (fileBuffer, originalName, mimeType, projectName) => {
    try {
      const apiKey = process.env.CDN_API_KEY;
      if (!apiKey) throw new Error('CDN_API_KEY is not configured in environment variables');

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: originalName,
        contentType: mimeType,
      });
      formData.append('projectName', projectName);

      // Include PROJECT_ID if available (registered project identifier)
      const projectId = process.env.CDN_PROJECT_ID;
      if (projectId) {
        formData.append('projectId', projectId);
      }

      console.log(`[CDN] ▶ Uploading "${originalName}" (${mimeType}, ${fileBuffer.length} bytes)`);
      console.log(`[CDN]   projectName: "${projectName}"${projectId ? `, projectId: "${projectId}"` : ''}`);

      const response = await axios.post(`${CDN_BASE_URL}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': apiKey,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const data = response.data;

      // Task 5: Full response logging for debugging
      console.log(`[CDN] ✅ Kroombox Response:`, JSON.stringify(data, null, 2));

      const fileId = data.fileId || data.id;

      if (!fileId) {
        console.error('[CDN] ❌ CRITICAL: Kroombox returned no fileId! Full response:', data);
        throw new Error('CDN returned no file identifier');
      }

      // Smart URL resolution based on file type
      const resolvedUrl = resolveFileUrl(data, mimeType);

      return {
        fileId,
        url: resolvedUrl,
        status: data.status || 'ready',
        mimeType: data.mimeType || mimeType,
        size: data.size || data.fileSize || null,
        originalName: data.originalName || data.fileName || originalName,
      };
    } catch (error) {
      // Task 5: Detailed error logging
      console.error('[CDN] ❌ Upload FAILED for:', originalName);
      console.error('[CDN]   Status:', error.response?.status || 'N/A');
      console.error('[CDN]   Response Body:', JSON.stringify(error.response?.data || {}, null, 2));
      console.error('[CDN]   Message:', error.message);

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

      console.log(`[CDN] 🗑 Deleting file: ${fileId}`);

      const response = await axios.delete(`${CDN_BASE_URL}/files/${fileId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      console.log(`[CDN] ✅ Deleted:`, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('[CDN] ❌ Delete FAILED:', error.response?.data || error.message);
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
      console.error('[CDN] Status Check Error:', error.response?.data || error.message);
      return { status: 'unknown' };
    }
  }
};

module.exports = cdnService;
