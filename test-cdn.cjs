const cdnService = require('./backend/services/cdnService');
require('dotenv').config({ path: './backend/.env' });

async function test() {
    console.log('Uploading...');
    const buffer = Buffer.from('test image data ' + Date.now());
    const res = await cdnService.upload(buffer, 'test.txt', 'text/plain', 'test_project');
    console.log('Upload res:', res);

    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const status = await cdnService.getStatus(res.fileId, 'text/plain');
        console.log(`Status attempt ${i+1}:`, status);
        if (status.status === 'ready' || status.status === 'completed' || status.status === 'success') {
            break;
        }
    }
}
test().catch(console.error);
