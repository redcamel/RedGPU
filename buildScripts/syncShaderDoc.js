const fs = require('fs');
const path = require('path');

const SYSTEM_CODE_MANAGER_PATH = path.join(__dirname, '../src/systemCodeManager/SystemCodeManager.ts');
const BASE_DIR = path.dirname(SYSTEM_CODE_MANAGER_PATH);

function syncShaderDoc() {
    console.log('🚀 Syncing WGSL to SystemCodeManager (Full Auto JSDoc Mode)...');
    
    if (!fs.existsSync(SYSTEM_CODE_MANAGER_PATH)) {
        console.error('❌ SystemCodeManager.ts not found');
        return;
    }

    const tsContent = fs.readFileSync(SYSTEM_CODE_MANAGER_PATH, 'utf8');
    const tsLines = tsContent.split(/\r?\n/);
    
    const shaderMap = {};
    tsLines.forEach(line => {
        const match = line.match(/import\s+(\w+)\s+from\s+'(.+\.wgsl)';/);
        if (match) {
            const [_, varName, relativePath] = match;
            const fullPath = path.resolve(BASE_DIR, relativePath);
            if (fs.existsSync(fullPath)) {
                shaderMap[varName] = fs.readFileSync(fullPath, 'utf8').trim();
            }
        }
    });

    const newLines = [];
    let updatedCount = 0;

    for (let i = 0; i < tsLines.length; i++) {
        let line = tsLines[i];
        const exportMatch = line.match(/^(\s*)(?:export\s+)?(?:const|import)\s+(\w+)\s*=\s*(\w+);/);
        
        if (exportMatch && shaderMap[exportMatch[3]]) {
            const indent = exportMatch[1];
            const shaderSource = shaderMap[exportMatch[3]];
            
            while (newLines.length > 0) {
                const prevLine = newLines[newLines.length - 1].trim();
                if (prevLine.endsWith('*/') || prevLine.startsWith('*') || prevLine.startsWith('/**')) {
                    newLines.pop();
                } else {
                    break;
                }
            }

            const sourceLines = shaderSource.split(/\r?\n/);
            const description = [];
            const codeLines = [];
            let isCodeStarted = false;

            sourceLines.forEach(sLine => {
                if (!isCodeStarted && sLine.trim().startsWith('//')) {
                    description.push(sLine.trim().replace(/^\/\/\s*/, ''));
                } else {
                    isCodeStarted = true;
                    codeLines.push(sLine);
                }
            });

            newLines.push(`${indent}/**`);
            description.forEach(desc => newLines.push(`${indent} * ${desc}`));
            if (description.length > 0) newLines.push(`${indent} *`);
            newLines.push(`${indent} * \`\`\`wgsl`);
            codeLines.forEach(cLine => newLines.push(`${indent} * ${cLine}`));
            newLines.push(`${indent} * \`\`\``);
            newLines.push(`${indent} */`);
            newLines.push(line);
            updatedCount++;
        } else {
            newLines.push(line);
        }
    }

    fs.writeFileSync(SYSTEM_CODE_MANAGER_PATH, newLines.join('\n'), 'utf8');
    console.log(`✅ Auto-JSDoc sync complete. ${updatedCount} properties documented.`);
}

syncShaderDoc();
