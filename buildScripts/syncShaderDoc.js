const fs = require('fs');
const path = require('path');

const SYSTEM_CODE_MANAGER_PATH = path.join(__dirname, '../src/systemCodeManager/ShaderLibrary.ts');
const BASE_DIR = path.dirname(SYSTEM_CODE_MANAGER_PATH);

function syncShaderDoc() {
    console.log('🚀 Syncing WGSL to ShaderLibrary (Full Auto JSDoc Mode)...');

    if (!fs.existsSync(SYSTEM_CODE_MANAGER_PATH)) {
        console.error('❌ ShaderLibrary.ts not found');
        return;
    }

    const tsContent = fs.readFileSync(SYSTEM_CODE_MANAGER_PATH, 'utf8');
    const tsLines = tsContent.split(/\r?\n/);

    // gather all WGSL imports using a multi-line regex
    const shaderMap = {};
    const fullContent = tsLines.join('\n');
    const importRegex = /import\s+(\w+)\s+from\s+'([^']+\.wgsl)';/gs;
    let match;
    while ((match = importRegex.exec(fullContent)) !== null) {
        const [_, varName, relativePath] = match;
        const cleanPath = relativePath.replace(/\s+/g, '');
        const fullPath = path.resolve(BASE_DIR, cleanPath);
        if (fs.existsSync(fullPath)) {
            shaderMap[varName] = fs.readFileSync(fullPath, 'utf8').trim();
        }
    }

    const newLines = [];
    let updatedCount = 0;

    for (let i = 0; i < tsLines.length; i++) {
        let line = tsLines[i];
        const exportMatch = line.match(/^(\s*)(?:export\s+)?(?:const|import)\s+(\w+)\s*=\s*(\w+);/);

        if (exportMatch && shaderMap[exportMatch[3]]) {
            const indent = exportMatch[1];
            const shaderSource = shaderMap[exportMatch[3]];

            // remove existing preceding comments and empty lines
            while (newLines.length > 0) {
                const prevLine = newLines[newLines.length - 1].trim();
                if (prevLine === '' || prevLine.startsWith('//') || prevLine.startsWith('/*') || prevLine.startsWith('*') || prevLine.endsWith('*/')) {
                    newLines.pop();
                } else {
                    break;
                }
            }

            const sourceLines = shaderSource.split(/\r?\n/);
            const description = [];
            const codeLines = [];
            let isCodeStarted = false;
            let inBlockComment = false;

            sourceLines.forEach(sLine => {
                const trimmed = sLine.trim();

                // Block comment state management
                if (inBlockComment) {
                    if (trimmed.endsWith('*/')) {
                        inBlockComment = false;
                        let content = trimmed.replace(/\s*\*\/$/, '').replace(/^\s*\*\s?/, '');
                        description.push(content);
                    } else {
                        let content = trimmed.replace(/^\s*\*\s?/, '');
                        description.push(content);
                    }
                    return;
                }

                if (!isCodeStarted) {
                    if (trimmed.startsWith('/**') || trimmed.startsWith('/*')) {
                        inBlockComment = true;
                        let content = trimmed.replace(/^\/\*\*?\s*/, '').replace(/\s*\*\/$/, '');
                        if (content) description.push(content);
                        if (trimmed.endsWith('*/')) inBlockComment = false;
                        return;
                    }

                    if (trimmed.startsWith('//')) {
                        description.push(trimmed.replace(/^\/\/\s*/, ''));
                        return;
                    }

                    if (trimmed === '') {
                        // Preserve empty lines in codeLines only if we've already hit some includes/code
                        if (codeLines.length > 0) codeLines.push(sLine);
                        return;
                    }

                    if (trimmed.startsWith('#redgpu_include')) {
                        codeLines.push(sLine);
                        return;
                    }

                    // Any other non-empty line starts the actual code block
                    isCodeStarted = true;
                    codeLines.push(sLine);
                } else {
                    // Already in code block mode
                    codeLines.push(sLine);
                }
            });

            newLines.push(`${indent}/**`);
            description.forEach(desc => {
                if (desc.trim() === '') newLines.push(`${indent} *`);
                else newLines.push(`${indent} * ${desc}`);
            });
            if (description.length > 0) newLines.push(`${indent} *`);
            newLines.push(`${indent} * \`\`\`wgsl`);
            codeLines.forEach(cLine => {
                // Escape */ and /* to avoid breaking JSDoc and confusing the highlighter
                let escapedLine = cLine.replace(/\*\//g, '* /').replace(/\/\*/g, '/ *');
                newLines.push(`${indent} * ${escapedLine}`);
            });
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
