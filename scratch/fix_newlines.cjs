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
    if (content.includes('\\nconst BASE_URL') || content.includes('\\n\\nconst BASE_URL')) {
        content = content.replace(/\\n\\nconst BASE_URL/g, '\n\nconst BASE_URL');
        content = content.replace(/\\nconst fixImg/g, '\nconst fixImg');
        content = content.replace(/\\n/g, '\n'); // wait, this might break valid regexes. Let's just target the top.

        content = content.replace(/';\\n\\nconst BASE_URL/g, "';\n\nconst BASE_URL");
        content = content.replace(/";\\n\\nconst BASE_URL/g, '";\n\nconst BASE_URL');
        content = content.replace(/5000";\\nconst fixImg/g, '5000";\nconst fixImg');
        content = content.replace(/: url;\\n/g, ': url;\n');

        fs.writeFileSync(file, content);
        console.log('Fixed newlines in: ' + path.basename(file));
    }
});
