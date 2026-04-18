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

    if (content.includes('<Clock')) {
        const lucideRegex = /import\s+\{[^}]+\}\s+from\s+['"]lucide-react['"]/;
        const match = content.match(lucideRegex);
        if (match && !match[0].includes('Clock')) {
            const injected = match[0].replace('import {', 'import { Clock,');
            content = content.replace(match[0], injected);
            changed = true;
        }
    }
    
    if (content.includes('<Phone')) {
        const lucideRegex = /import\s+\{[^}]+\}\s+from\s+['"]lucide-react['"]/;
        const match = content.match(lucideRegex);
        if (match && !match[0].includes('Phone')) {
            const injected = match[0].replace('import {', 'import { Phone,');
            content = content.replace(match[0], injected);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed imports in: ' + path.basename(file));
    }
});
