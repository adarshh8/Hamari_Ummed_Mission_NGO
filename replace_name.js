const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('Humari Umeed')) {
            const newContent = content.replace(/Humari Umeed/g, 'Hamari Ummeed');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (e) {
        // Ignore errors
    }
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'build', 'dist', '.vercel', '.gemini'].includes(file)) {
                walkSync(filePath);
            }
        } else {
            if (/\.(js|jsx|ts|tsx|html|md|json|txt|css)$/.test(file)) {
                replaceInFile(filePath);
            }
        }
    }
};

walkSync(__dirname);
