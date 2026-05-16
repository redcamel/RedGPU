/**
 * [KO] 예제 파일들의 버전 관리를 위한 스크립트입니다.
 * [EN] Script for version management of example files.
 *
 * [KO] examples 폴더 내의 HTML 파일에 SEO, 소셜 메타 태그, JSON-LD, H1 태그를 삽입하고 자산 경로에 타임스탬프를 추가합니다.
 * [EN] Inserts SEO, social meta tags, JSON-LD, H1 tags into HTML files within the examples folder, and adds timestamps to asset paths.
 *
 * @category Utility
 */
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();
const targetFolder = path.join(process.cwd(), 'examples');
const baseUrl = 'https://redcamel.github.io/RedGPU/examples/';

// 1. Load example list from exampleList.ts
const pathMap = {};
const listPath = path.join(process.cwd(), 'examples/exampleHelper/src/data/exampleList.ts');
if (fs.existsSync(listPath)) {
    let listContent = fs.readFileSync(listPath, 'utf8');
    listContent = listContent.replace(/import[\s\S]*?;/g, '');
    listContent = listContent.replace(/:\s*ExampleListType/g, '');
    listContent = listContent.replace(/export\s+default\s+[\s\S]*?;/g, '');
    listContent = listContent.replace(/export\s+/g, '');
    listContent = listContent.replace(/Object\.freeze\([\s\S]*?\);/g, '');
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
                const cleanDescription = description
                    .replace(/<[^>]*>?/gm, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/"/g, '&quot;')
                    .trim();

                const baseKeywords = ['RedGPU', 'WebGPU', 'Graphics', '3D', '2D', 'JavaScript', 'TypeScript', 'Computer Graphics'];
                const specificKeywords = relPath.split('/').filter(v => v && !['3d', '2d'].includes(v.toLowerCase()));
                const keywords = [...new Set([...baseKeywords, ...specificKeywords, title])].join(', ');

                let socialImage = 'https://redcamel.github.io/RedGPU/examples/assets/documentBody.png';
                if (fs.existsSync(path.join(dirPath, 'thumb.webp'))) {
                    socialImage = baseUrl + relPath + '/thumb.webp';
                }

                const cssPath = path.join(targetFolder, 'assets/css/example.css');
                const cssRelPath = path.relative(dirPath, cssPath).replace(/\\/g, '/');
                const canonicalUrl = baseUrl + fileRelPath;

                // Cleanup existing SEO elements
                content = content.replace(/<meta[\s\S]*?>/gi, '');
                content = content.replace(/<title>[\s\S]*?<\/title>/gi, '');
                content = content.replace(/<link\s+[^>]*rel="(canonical|stylesheet|preload|modulepreload)"[\s\S]*?>/gi, '');
                content = content.replace(/<script\s+[^>]*src="index\.js[^>]*><\/script>/gi, '');
                content = content.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
                content = content.replace(/<!--[\s\S]*?-->/gi, '');
                content = content.replace(/<h1>[\s\S]*?<\/h1>/gi, '');

                // 1. Generate JSON-LD
                const jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": title,
                    "applicationCategory": "DeveloperApplication",
                    "operatingSystem": "Web",
                    "description": cleanDescription,
                    "url": canonicalUrl,
                    "screenshot": socialImage,
                    "author": {
                        "@type": "Person",
                        "name": "redcamel"
                    }
                };

                const standardTags = [
                    `    <title>${title}</title>`,
                    '    <meta charset="UTF-8">',
                    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                    `    <meta name="description" content="${cleanDescription}">`,
                    `    <meta name="keywords" content="${keywords}">`,
                    `    <link rel="canonical" href="${canonicalUrl}">`,
                    '',
                    '    <!-- Open Graph / Facebook -->',
                    '    <meta property="og:type" content="website">',
                    `    <meta property="og:url" content="${canonicalUrl}">`,
                    `    <meta property="og:title" content="${title}">`,
                    `    <meta property="og:description" content="${cleanDescription}">`,
                    `    <meta property="og:image" content="${socialImage}">`,
                    '',
                    '    <!-- Twitter -->',
                    '    <meta property="twitter:card" content="summary_large_image">',
                    `    <meta property="twitter:url" content="${canonicalUrl}">`,
                    `    <meta property="twitter:title" content="${title}">`,
                    `    <meta property="twitter:description" content="${cleanDescription}">`,
                    `    <meta property="twitter:image" content="${socialImage}">`,
                    '',
                    '    <!-- Structured Data -->',
                    `    <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`,
                    '',
                    '    <!-- Assets Preload -->',
                    `    <link rel="preload" href="${cssRelPath}?t=${timestamp}" as="style">`,
                    `    <link rel="modulepreload" href="index.js?t=${timestamp}">`,
                    '',
                    '    <!-- Assets -->',
                    `    <link rel="stylesheet" href="${cssRelPath}?t=${timestamp}">`,
                    `    <script src="index.js?t=${timestamp}" type="module"></script>`
                ].join('\n');

                // Update Head
                content = content.replace(/<head>/i, `<head>\n${standardTags}`);
                content = content.replace(/(<head>[\s\S]*?<\/head>)/i, (match, head) => {
                    return head.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\n\s*\n$/g, '\n');
                });

                // 2. Update Body (Add H1)
                // Remove redundant spaces and hidden H1
                const h1Tag = `<h1 style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">${title}</h1>`;
                content = content.replace(/<body[^>]*>/i, (match) => `${match}\n${h1Tag}`);
            }
        }

        const updated = content.replace(
          /(['"])(.+?\.(js|css))(\?[^'"]*)?(\1)/g,
          (match, quote, pathOnly, oldQuery) => {
              return `${quote}${pathOnly}?t=${timestamp}${quote}`;
          }
        );

        if (originalContent !== updated) {
            fs.writeFileSync(filePath, updated, 'utf8');
            console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
        }
    });

    console.log(`\n✨ Success! All meta tags, JSON-LD, H1, and references updated with t=${timestamp}`);
} catch (error) {
    console.error('❌ Error:', error.message);
}
