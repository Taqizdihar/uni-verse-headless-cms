require('dotenv').config();
const db = require('./server/lib/db');
const cdnService = require('./services/cdnService');
const { buildCdnPath } = require('./utils/pathHelper');
const axios = require('axios');

// Optional: only needed if you want to clean up Cloudinary after migration
let cloudinary = null;
try {
    const { v2: _cloudinary } = require('cloudinary');
    _cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    cloudinary = _cloudinary;
    console.log('[MIGRATE] Cloudinary SDK loaded — will purge originals after successful migration.');
} catch (e) {
    console.log('[MIGRATE] Cloudinary SDK not available — skipping cleanup of originals.');
}

async function migrateCloudinaryToKroombox() {
    console.log('========================================');
    console.log(' Cloudinary → Kroombox CDN Migration');
    console.log('========================================\n');
    
    try {
        const [rows] = await db.execute('SELECT * FROM media WHERE file_url LIKE ?', ['%cloudinary%']);
        console.log(`Found ${rows.length} media assets hosted on Cloudinary.\n`);

        if (rows.length === 0) {
            console.log('Nothing to migrate. All assets are already on Kroombox CDN.');
            process.exit(0);
        }

        let success = 0;
        let failed = 0;

        for (let i = 0; i < rows.length; i++) {
            const media = rows[i];
            const displayName = media.file_name || media.filename || `ID:${media.id}`;
            console.log(`[${i + 1}/${rows.length}] Migrating: ${displayName}`);
            
            try {
                // 1. Download from Cloudinary
                const response = await axios.get(media.file_url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                
                // 2. Build CDN path (respects folder hierarchy)
                const cdnPath = await buildCdnPath(media.tenant_id, media.folder_id || null);
                
                // 3. Upload to Kroombox CDN
                const cdnResponse = await cdnService.upload(
                    buffer,
                    media.file_name || media.filename,
                    media.file_type || 'image/jpeg',
                    cdnPath
                );
                
                // 3. Update Database with new CDN data + metadata
                await db.execute(
                    'UPDATE media SET filename = ?, file_url = ?, file_type = ?, file_size = COALESCE(?, file_size), cdn_status = ? WHERE id = ?',
                    [
                        cdnResponse.fileId,
                        cdnResponse.url,
                        cdnResponse.mimeType || media.file_type,
                        cdnResponse.size,
                        cdnResponse.status || 'ready',
                        media.id
                    ]
                );
                
                // 4. Delete from Cloudinary (optional)
                if (cloudinary && media.filename && !media.filename.startsWith('http')) {
                    try {
                        await cloudinary.uploader.destroy(media.filename);
                    } catch (cleanupErr) {
                        console.warn(`   ⚠ Cloudinary cleanup failed for ${media.filename}: ${cleanupErr.message}`);
                    }
                }
                
                console.log(`   ✅ Success → CDN ID: ${cdnResponse.fileId}`);
                success++;
            } catch (err) {
                console.error(`   ❌ Failed: ${err.message}`);
                failed++;
            }
        }
        
        console.log('\n========================================');
        console.log(` Migration Complete`);
        console.log(` ✅ Success: ${success}  ❌ Failed: ${failed}`);
        console.log('========================================');
        process.exit(failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('Fatal Migration Error:', error);
        process.exit(1);
    }
}

migrateCloudinaryToKroombox();
