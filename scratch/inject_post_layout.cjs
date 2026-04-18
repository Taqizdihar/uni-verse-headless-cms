const fs = require('fs');
const path = require('path');

const dir = 'e:/College/Telkom University/Associate Degree of Information Systems/Projects/Uni-Inside CMS/src/templates';

function getFiles(d) {
    let results = [];
    if (!fs.existsSync(d)) return results;
    const list = fs.readdirSync(d);
    list.forEach((file) => {
        const fullPath = path.join(d, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else if (file.endsWith('.tsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const templates = getFiles(dir);

templates.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Inject import
    if (!content.includes('UnifiedPostLayout')) {
        const importStr = "import UnifiedPostLayout from '../components/UnifiedPostLayout';\n";
        // fallback for nested folders
        const relativePath = file.includes('corporate') || file.includes('creative') || file.includes('minimalist') ? "../../components/UnifiedPostLayout" : "../components/UnifiedPostLayout";
        const finalImportStr = `import UnifiedPostLayout from '${relativePath}';\n`;

        content = content.replace(/(import React.*?;\n)/, `$1${finalImportStr}`);
        changed = true;
    }

    // Replace {postData ? ( ... ) : ( ... )}
    // We will find "{postData ?" and manually run a balancer.
    let searchStr = '{postData ? (';
    let idx = content.indexOf(searchStr);
    
    if (idx !== -1) {
        let insideStr = '';
        let stack = 0;
        let pFoundEnd = false;
        let endIndex = idx + searchStr.length;
        
        for (let i = endIndex; i < content.length; i++) {
            if (content[i] === '(') stack++;
            if (content[i] === ')') {
                if (stack === 0) {
                    endIndex = i;
                    pFoundEnd = true;
                    break;
                }
                stack--;
            }
        }
        
        if (pFoundEnd) {
            // Replace the contents
            const subReplace = content.substring(0, idx) + "{postData ? (\n          <UnifiedPostLayout postData={postData} palette={palette || palette_data || p || {}} currentSlug={currentSlug} />\n        " + content.substring(endIndex);
            
            // let's check what palette variable is used in this template.
            let pVar = 'palette';
            if (content.includes('const p = palette')) pVar = 'p';
            if (content.includes('const palette_data = palette')) pVar = 'palette_data';
            
            content = content.substring(0, idx) + `{postData ? (\n          <UnifiedPostLayout postData={postData} palette={${pVar}} currentSlug={currentSlug} />\n        ` + content.substring(endIndex);
            changed = true;
            console.log(`Updated ternary in ${path.basename(file)}`);
        }
    }

    // Handle `if (postData) return <PostDetail />;`
    if (content.includes('if (postData) return <PostDetail />;')) {
        // Find p variable
        let pVar = 'palette';
        if (content.includes('const p = palette')) pVar = 'p';
        
        content = content.replace('if (postData) return <PostDetail />;', `if (postData) return <UnifiedPostLayout postData={postData} palette={${pVar}} currentSlug={currentSlug} />;`);
        changed = true;
        console.log(`Updated return in ${path.basename(file)}`);
    } else if (content.includes('if (postData) return <PostDetail />')) {
        let pVar = 'palette';
        if (content.includes('const p = palette')) pVar = 'p';
        content = content.replace(/if\s*\(postData\)\s*return\s*<PostDetail\s*\/>;?/, `if (postData) return <UnifiedPostLayout postData={postData} palette={${pVar}} currentSlug={currentSlug} />;`);
        changed = true;
        console.log(`Updated return pattern 2 in ${path.basename(file)}`);
    }

    if (changed) {
        fs.writeFileSync(file, content);
    }
});
