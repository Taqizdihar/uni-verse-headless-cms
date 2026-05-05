const axios = require('axios');
const FormData = require('form-data');

const CDN_BASE_URL = 'https://api-cdn.kroombox.com/api/bridge';

const cdnService = {
  upload: async (fileBuffer, originalName, mimeType, projectName) => {
    try {
      const apiKey = process.env.CDN_API_KEY;
      if (!apiKey) throw new Error('CDN_API_KEY is not configured');

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: originalName,
        contentType: mimeType,
      });
      formData.append('projectName', projectName.toString());

      const response = await axios.post(`${CDN_BASE_URL}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': apiKey,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return response.data; // Should return { fileId, url, ... } based on description
    } catch (error) {
      console.error('Kroombox CDN Upload Error:', error.response?.data || error.message);
      throw new Error('Failed to upload to CDN');
    }
  },

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
      console.error('Kroombox CDN Delete Error:', error.response?.data || error.message);
      throw new Error('Failed to delete from CDN');
    }
  }
};

module.exports = cdnService;
