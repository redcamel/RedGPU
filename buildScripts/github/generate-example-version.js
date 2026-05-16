/**
 * [KO] 예제 파일들의 버전 관리를 위한 스크립트입니다.
 * [EN] Script for version management of example files.
 *
 * [KO] examples 폴더 내의 HTML 파일에 title과 description, keywords를 삽입하고, JS 및 CSS 참조 경로에 타임스탬프 쿼리 파라미터를 추가합니다.
 * [EN] Inserts title, description, and keywords into HTML files within the examples folder and adds timestamp query parameters to JS and CSS reference paths.
 *
 * @category Utility
 */
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();
// 실행 위치(root)를 기준으로 examples 폴더 지정
const targetFolder = path.join(process.cwd(), 'examples');
const baseUrl = 'https://redcamel.github.io/RedGPU/examples/';

// 1. Load example list from exampleList.ts
const pathMap = {};
const listPath = path.join(process.cwd(), 'examples/exampleHelper/src/data/exampleList.ts');
if (fs.existsSync(listPath)) {
    let listContent = fs.readFileSync(listPath, 'utf8');
    // Basic TS to JS conversion for parsing
    listContent = listContent.replace(/import[\s\S]*?;/g, '');
    listContent = listContent.replace(/:\s*ExampleListType/g, ''); // Remove type annotation
    listContent = listContent.replace(/export\s+default\s+[\s\S]*?;/g, ''); // Remove export default
    listContent = listContent.replace(/export\s+/g, ''); // Remove other export keywords
    listContent = listContent.replace(/Object\.freeze\([\s\S]*?\);/g, ''); // Remove Object.freeze
    listContent += '\nreturn ExampleList;';

    try {
        const exampleList = new Function(listContent)();
        const flatten = (list) => {
            if (!list) return;
            list.forEach(item => {
                if (item.path) {
                    pathMap[item.path] = {
                        title: item.name,
                        description: item.description?.en || item.description || item.name
                    };
                }
                if (item.list) flatten(item.list);
            });
        };
        flatten(exampleList);
        console.log(`📖 Loaded ${Object.keys(pathMap).length} examples from exampleList.ts`);
    } catch (e) {
        console.error('❌ Failed to parse exampleList.ts:', e.message);
    }
}

function getAllFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

console.log(`\n✨ Start! with t=${timestamp}`);
try {
    const files = getAllFiles(targetFolder);
    console.log(`🔍 Scanning ${files.length} files in /examples...`);

    files.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 1. HTML 파일인 경우 메타 태그, CSS, JS 자동 삽입 로직
        if (filePath.endsWith('.html')) {
            const dirPath = path.dirname(filePath);
            const relPath = path.relative(targetFolder, dirPath).replace(/\\/g, '/');
            const fileRelPath = path.relative(targetFolder, filePath).replace(/\\/g, '/');

            let title = '';
            let description = '';

            if (pathMap[relPath]) {
                title = pathMap[relPath].title;
                description = pathMap[relPath].description;
            } else {
                // Fallback: Extract from JS file
                const jsFilePath = path.join(dirPath, 'index.js');
                if (fs.existsSync(jsFilePath)) {
                    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
                    const jsDocMatch = jsContent.match(/\/\*\*([\s\S]*?)\*\//);
                    if (jsDocMatch) {
                        const jsDoc = jsDocMatch[1];
                        const lines = jsDoc.split('\n')
                            .map(line => line.trim().replace(/^\*?\s*/, '').trim())
                            .filter(line => line.length > 0);

                        const enLines = lines.filter(line => line.startsWith('[EN]'))
                            .map(line => line.replace('[EN]', '').trim());

                        if (enLines.length > 0) {
                            title = enLines[0];
                            description = enLines.slice(1).join(' ').trim() || title;
                        }
                    }
                }
            }

            if (title) {
                // Clean description: remove HTML tags, normalize spaces, and escape quotes
                description = description
                    .replace(/<[^>]*>?/gm, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/"/g, '&quot;')
                    .trim();

                // Generate keywords
                const baseKeywords = ['RedGPU', 'WebGPU', 'Graphics', '3D', '2D', 'JavaScript', 'TypeScript', 'Computer Graphics'];
                const specificKeywords = relPath.split('/').filter(v => v && !['3d', '2d'].includes(v.toLowerCase()));
                const keywords = [...new Set([...baseKeywords, ...specificKeywords, title])].join(', ');

                // Remove ALL existing meta tags, title, canonical link, stylesheet links, and script tags pointing to index.js
                content = content.replace(/<meta[\s\S]*?>/gi, '');
                content = content.replace(/<title>[\s\S]*?<\/title>/gi, '');
                content = content.replace(/<link\s+[^>]*rel="canonical"[\s\S]*?>/gi, '');
                content = content.replace(/<link\s+[^>]*rel="stylesheet"[\s\S]*?>/gi, '');
                content = content.replace(/<script\s+[^>]*src="index\.js[^>]*><\/script>/gi, '');

                // Calculate relative path to example.css
                const cssPath = path.join(targetFolder, 'assets/css/example.css');
                const cssRelPath = path.relative(dirPath, cssPath).replace(/\\/g, '/');

                // Define standard tags in order: Title First
                const canonicalUrl = baseUrl + fileRelPath;
                const standardTags = [
                    `    <title>${title}</title>`,
                    '    <meta charset="UTF-8">',
                    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                    `    <meta name="description" content="${description}">`,
                    `    <meta name="keywords" content="${keywords}">`,
                    `    <link rel="canonical" href="${canonicalUrl}">`,
                    `    <link rel="stylesheet" href="${cssRelPath}?t=${timestamp}">`,
                    `    <script src="index.js?t=${timestamp}" type="module"></script>`
                ].join('\n');

                // Insert into head
                content = content.replace(/<head>/i, `<head>\n${standardTags}`);
                
                // Clean up excessive empty lines within <head> section
                content = content.replace(/(<head>[\s\S]*?<\/head>)/i, (match, head) => {
                    return head.replace(/\n\s*\n/g, '\n');
                });
            }
        }

        // 2. 자산 경로 치환 기능 (.js 및 .css 경로에 타임스탬프 추가)
        const updated = content.replace(
          /(['"])(.+?\.(js|css))(\?[^'"]*)?(\1)/g,
          (match, quote, pathOnly, oldQuery) => {
              return `${quote}${pathOnly}?t=${timestamp}${quote}`;
          }
        );

        // 변경사항이 있을 때만 파일 쓰기
        if (originalContent !== updated) {
            fs.writeFileSync(filePath, updated, 'utf8');
            console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
        }
    });

    console.log(`\n✨ Success! Meta tags, CSS links, and JS scripts updated and versioned with t=${timestamp}`);
} catch (error) {
    console.error('❌ Error:', error.message);
}
