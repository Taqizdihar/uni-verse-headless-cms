import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;

        // Replace template literals: `http://localhost:5000...` -> `${import.meta.env.VITE_API_URL}...`
        content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL}');

        // Replace single quotes: 'http://localhost:5000...' -> `${import.meta.env.VITE_API_URL}...`
        content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        // Replace double quotes: "http://localhost:5000..." -> `${import.meta.env.VITE_API_URL}...`
        content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');

        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated', file);
            changedCount++;
        }
    }
});

console.log(`Finished updating ${changedCount} files.`);
