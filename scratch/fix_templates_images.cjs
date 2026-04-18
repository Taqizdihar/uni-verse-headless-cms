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

    // 1. Add BASE_URL and fixImg if not present
    if (!content.includes('const fixImg')) {
        const injectStr = '\\n\\nconst BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";\\nconst fixImg = (url: string) => url && url.startsWith("/uploads") ? BASE_URL + url : url;\\n';
        
        let lastImportIndex = 0;
        const importRegex = /^import .+?;/gm;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            lastImportIndex = match.index + match[0].length;
        }
        
        if (lastImportIndex > 0) {
            content = content.substring(0, lastImportIndex) + injectStr + content.substring(lastImportIndex);
        } else {
            content = injectStr + content;
        }
        changed = true;
    }

    // 2. Wrap img src in fixImg
    const srcRegex = /<img([^>]+?)src=\\{([^}]+)\\}/g;
    content = content.replace(srcRegex, (match, prefix, srcExp) => {
        if (srcExp.includes('fixImg') || srcExp.includes('BASE_URL')) {
            return match;
        }
        if (srcExp.startsWith('"') || srcExp.startsWith("'") || srcExp.startsWith('\`')) return match;
        
        changed = true;
        return '<img' + prefix + 'src={fixImg(' + srcExp + ')}';
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed ' + path.basename(file));
    }
});
