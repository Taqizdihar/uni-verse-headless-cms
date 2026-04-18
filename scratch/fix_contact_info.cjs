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

    // We look for a line or block that maps contact_info.email 
    // And duplicate it for whatsapp and service_hours if they don't already exist.
    const emailRegex = /(\{\s*(?:[a-zA-Z0-9_\.\?]+)?contact_info\?\.email\s*&&[\s\S]*?(?:contact_info\.email)[\s\S]*?(?:<\/([^>]+)>)\s*\})/g;

    content = content.replace(emailRegex, (match) => {
        // Build whatsapp
        let whatsappMatch = match.replace(/email/g, 'whatsapp');
        // Let's replace 'Mail' or 'Envelope' with 'Phone' or 'MessageCircle' if present in the tag
        whatsappMatch = whatsappMatch.replace(/Mail/g, 'Phone').replace(/Envelope/g, 'Phone');

        // Build service_hours
        let serviceHoursMatch = match.replace(/email/g, 'service_hours');
        serviceHoursMatch = serviceHoursMatch.replace(/Mail/g, 'Clock').replace(/Envelope/g, 'Clock');

        let out = match;
        if (!content.includes('contact_info?.whatsapp')) {
            out += '\n' + whatsappMatch;
            changed = true;
        }
        if (!content.includes('contact_info?.service_hours')) {
            out += '\n' + serviceHoursMatch;
            changed = true;
        }

        return out;
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Injected missing contact_info fields into: ' + path.basename(file));
    }
});
