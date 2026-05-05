require('dotenv').config();
const db = require('./server/lib/db');
const cdnService = require('./services/cdnService');
const { v2: cloudinary } = require('cloudinary');
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrateCloudinaryToKroombox() {
    console.log('Starting migration from Cloudinary to Kroombox CDN...');
    
    try {
        const [rows] = await db.execute('SELECT * FROM media WHERE file_url LIKE ?', ['%cloudinary%']);
        console.log(`Found ${rows.length} media assets hosted on Cloudinary.`);

        for (let i = 0; i < rows.length; i++) {
            const media = rows[i];
            console.log(`Migrating (${i + 1}/${rows.length}): ${media.file_name || media.filename}`);
            
            try {
                // 1. Download from Cloudinary
                const response = await axios.get(media.file_url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                
                // 2. Upload to Kroombox CDN
                const cdnResponse = await cdnService.upload(buffer, media.file_name || media.filename, media.file_type || 'image/jpeg', media.tenant_id);
                
                const cdnFileId = cdnResponse.fileId || cdnResponse.id;
                const newUrl = cdnResponse.url || `https://api-cdn.kroombox.com/api/bridge/view/${cdnFileId}`;
                
                // 3. Update Database
                await db.execute('UPDATE media SET filename = ?, file_url = ? WHERE id = ?', [cdnFileId, newUrl, media.id]);
                
                // 4. Delete from Cloudinary
                if (media.filename && !media.filename.startsWith('http')) {
                    await cloudinary.uploader.destroy(media.filename);
                }
                
                console.log(`✅ Success: ${media.file_name}`);
            } catch (err) {
                console.error(`❌ Failed to migrate ${media.file_name}:`, err.message);
            }
        }
        
        console.log('Migration process completed.');
        process.exit(0);
    } catch (error) {
        console.error('Fatal Migration Error:', error);
        process.exit(1);
    }
}

migrateCloudinaryToKroombox();
