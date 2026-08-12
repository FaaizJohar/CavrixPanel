const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const extensions = new Set(['.js', '.map', '.json']);

const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
        } else if (extensions.has(path.extname(entry.name))) {
            fs.unlinkSync(full);
        }
    }
};

if (fs.existsSync(assetsDir)) {
    walk(assetsDir);
}
