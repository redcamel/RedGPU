/**
 * [KO] 예제 파일들의 버전 관리 및 정적 SEO 콘텐츠 주입을 위한 스크립트입니다.
 * [EN] Script for version management and static SEO content injection of example files.
 *
 * [KO] examples 폴더 내의 HTML 파일에 SEO, 소셜 메타 태그, JSON-LD, 그리고 Googlebot 크롤링용 정적 시맨틱 HTML 본문을 삽입하고 자산 경로에 타임스탬프를 추가합니다.
 * [EN] Inserts SEO, social meta tags, JSON-LD, and static semantic HTML body content for Googlebot crawling into HTML files within the examples folder, and adds timestamps to asset paths.
 *
 * @category Utility
 */
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();
const targetFolder = path.join(process.cwd(), 'examples');
const baseUrl = 'https://redcamel.github.io/RedGPU/examples/';

const stripHtml = (str = '') => String(str)
    .replace(/[<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtml = (str = '') => stripHtml(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');

// 1. Load example list from exampleList.ts
const pathMap = {};
const allExamples = [];
let rawExampleTree = [];

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
        rawExampleTree = new Function(listContent)();
        const flatten = (list, breadcrumbs = []) => {
            if (!list) return;
            const siblings = list.filter(item => item.path);
            list.forEach(item => {
                const currentCrumbs = item.name ? [...breadcrumbs, item.name] : breadcrumbs;
                if (item.path) {
                    const entry = {
                        path: item.path,
                        title: item.name,
                        descriptionEn: item.description?.en || item.description || item.name,
                        descriptionKo: item.description?.ko || '',
                        categoryChain: breadcrumbs.join(' > '),
                        related: siblings
                            .filter(s => s.path !== item.path)
                            .slice(0, 6)
                            .map(s => ({title: s.name, path: s.path}))
                    };
                    pathMap[item.path] = entry;
                    allExamples.push(entry);
                }
                if (item.list) flatten(item.list, currentCrumbs);
            });
        };
        flatten(rawExampleTree);
        console.log(`📖 Loaded ${Object.keys(pathMap).length} examples from exampleList.ts`);
    } catch (e) {
        console.error('❌ Failed to parse exampleList.ts:', e.message);
    }
}

function getAllFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file === 'node_modules' || file === 'exampleHelper') return;
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

function buildHubStaticHtml() {
    const grouped = new Map();
    for (const ex of allExamples) {
        const groupKey = ex.categoryChain || 'Examples';
        if (!grouped.has(groupKey)) grouped.set(groupKey, []);
        grouped.get(groupKey).push(ex);
    }

    const sectionsHtml = Array.from(grouped.entries()).map(([groupName, items]) => {
        const listItems = items.map(item => {
            const safeTitle = escapeHtml(item.title);
            const safeDescEn = escapeHtml(item.descriptionEn);
            const safeDescKo = escapeHtml(item.descriptionKo);
            return `                <li><a href="/RedGPU/examples/${item.path}/">${safeTitle}</a> — ${safeDescEn}${safeDescKo ? ` (${safeDescKo})` : ''}</li>`;
        }).join('\n');
        return [
            '        <section>',
            `            <h2>${escapeHtml(groupName)}</h2>`,
            '            <ul>',
            listItems,
            '            </ul>',
            '        </section>'
        ].join('\n');
    }).join('\n');

    return [
        '<main id="seo-static-content" style="position:fixed;inset:0;z-index:-2;overflow:hidden;opacity:0;pointer-events:none;user-select:none;">',
        '    <article>',
        '        <h1>RedGPU WebGPU Examples</h1>',
        '        <p>Explore 280+ interactive WebGPU 3D &amp; 2D graphics examples built with RedGPU, including PBR materials, glTF 2.0 animation, atmospheric scattering, terrain, water, post-processing, and Rapier physics.</p>',
        '        <p lang="ko">RedGPU 기반의 280개 이상 인터랙티브 WebGPU 3D/2D 그래픽스 예제 모음입니다.</p>',
        '        <nav aria-label="RedGPU Main Navigation">',
        '            <ul>',
        '                <li><a href="https://redcamel.github.io/RedGPU/">RedGPU Home</a></li>',
        '                <li><a href="https://redcamel.github.io/RedGPU/manual/">Documentation (Manual)</a></li>',
        '                <li><a href="https://redcamel.github.io/RedGPU/manual/ko/api/RedGPU-API/README.html">API Reference</a></li>',
        '            </ul>',
        '        </nav>',
        sectionsHtml,
        '    </article>',
        '</main>'
    ].join('\n');
}

function buildExampleStaticBody(entry, relPath, hasThumb) {
    const safeTitle = escapeHtml(entry.title);
    const safeDescEn = escapeHtml(entry.descriptionEn);
    const safeDescKo = escapeHtml(entry.descriptionKo);
    const safeCategory = escapeHtml(entry.categoryChain || relPath.split('/').slice(0, -1).join(' / '));

    const relatedLinks = (entry.related || []).map(r =>
        `                    <li><a href="/RedGPU/examples/${r.path}/">${escapeHtml(r.title)}</a></li>`
    ).join('\n');

    const lines = [
        '<main id="seo-static-content" class="seo-static-content">',
        '    <article>',
        `        <p>${safeCategory || 'RedGPU WebGPU Example'}</p>`,
        `        <h1>${safeTitle} - RedGPU WebGPU Example</h1>`,
        `        <p>${safeDescEn}</p>`
    ];

    if (safeDescKo) {
        lines.push(`        <p lang="ko">${safeDescKo}</p>`);
    }

    if (hasThumb) {
        lines.push(`        <img src="thumb.webp" alt="${safeTitle} - RedGPU WebGPU Example" width="600" height="450" loading="eager">`);
    }

    lines.push(
        '        <nav aria-label="Example Navigation">',
        '            <ul>',
        '                <li><a href="/RedGPU/examples/">All RedGPU Examples</a></li>',
        '                <li><a href="/RedGPU/manual/">RedGPU Manual</a></li>',
        ...(relatedLinks ? [relatedLinks] : []),
        '            </ul>',
        '        </nav>',
        '    </article>',
        '</main>'
    );

    return lines.join('\n');
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

            if (fileRelPath === 'index.html') {
                // Hub page (examples/index.html)
                const hubSeoHtml = buildHubStaticHtml();
                content = content.replace(/<main id="seo-static-content"[\s\S]*?<\/main>\s*/gi, '');
                content = content.replace(
                    /(<canvas id="bg-canvas"><\/canvas>)/i,
                    `$1\n${hubSeoHtml}`
                );
            } else {
                let entry = pathMap[relPath] || null;
                if (!entry) {
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
                            const koLines = lines.filter(line => line.startsWith('[KO]'))
                                .map(line => line.replace('[KO]', '').trim());
                            if (enLines.length > 0) {
                                entry = {
                                    path: relPath,
                                    title: enLines[0],
                                    descriptionEn: enLines.slice(1).join(' ').trim() || enLines[0],
                                    descriptionKo: koLines.slice(1).join(' ').trim() || koLines[0] || '',
                                    categoryChain: relPath.split('/').slice(0, -1).join(' > '),
                                    related: []
                                };
                            }
                        }
                    }
                }

                if (entry && entry.title) {
                    const title = entry.title;
                    const pageTitle = `${escapeHtml(title)} - RedGPU WebGPU Example`;
                    const cleanDescription = escapeHtml(entry.descriptionEn);

                    const baseKeywords = ['RedGPU', 'WebGPU', 'Graphics', '3D', '2D', 'JavaScript', 'TypeScript', 'Computer Graphics'];
                    const specificKeywords = relPath.split('/').filter(v => v && !['3d', '2d'].includes(v.toLowerCase()));
                    const keywords = [...new Set([...baseKeywords, ...specificKeywords, title])].map(escapeHtml).join(', ');

                    const hasThumb = fs.existsSync(path.join(dirPath, 'thumb.webp'));
                    let socialImage = 'https://redcamel.github.io/RedGPU/examples/assets/documentBody.png';
                    if (hasThumb) {
                        socialImage = baseUrl + relPath + '/thumb.webp';
                    }

                    const cssPath = path.join(targetFolder, 'assets/css/example.css');
                    const cssRelPath = path.relative(dirPath, cssPath).replace(/\\/g, '/');
                    const distPath = path.join(process.cwd(), 'dist/index.js');
                    const distRelPath = path.relative(dirPath, distPath).replace(/\\/g, '/');
                    const helperPath = path.join(targetFolder, 'exampleHelper/dist/index.js');
                    const helperRelPath = path.relative(dirPath, helperPath).replace(/\\/g, '/');
                    const canonicalUrl = (baseUrl + fileRelPath).replace(/\/index\.html$/, '/');

                    // 1. Generate JSON-LD (SoftwareApplication + BreadcrumbList)
                    const crumbSegments = (entry.categoryChain ? entry.categoryChain.split(' > ') : relPath.split('/').slice(0, -1))
                        .map(s => s.trim())
                        .filter(Boolean);
                    if (crumbSegments.length > 0 && crumbSegments[crumbSegments.length - 1] === title) {
                        crumbSegments.pop();
                    }

                    const breadcrumbItems = [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "RedGPU",
                            "item": "https://redcamel.github.io/RedGPU/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Examples",
                            "item": "https://redcamel.github.io/RedGPU/examples/"
                        }
                    ];

                    crumbSegments.forEach((seg, idx) => {
                        breadcrumbItems.push({
                            "@type": "ListItem",
                            "position": idx + 3,
                            "name": seg
                        });
                    });

                    breadcrumbItems.push({
                        "@type": "ListItem",
                        "position": breadcrumbItems.length + 1,
                        "name": title,
                        "item": canonicalUrl
                    });

                    const jsonLd = {
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "SoftwareApplication",
                                "name": title,
                                "applicationCategory": "DeveloperApplication",
                                "operatingSystem": "Web",
                                "description": stripHtml(entry.descriptionEn),
                                "url": canonicalUrl,
                                "screenshot": socialImage,
                                "isPartOf": {
                                    "@type": "CollectionPage",
                                    "name": "RedGPU Examples",
                                    "url": "https://redcamel.github.io/RedGPU/examples/"
                                },
                                "author": {
                                    "@type": "Person",
                                    "name": "redcamel"
                                }
                            },
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": breadcrumbItems
                            }
                        ]
                    };

                    const standardTags = [
                        '    <meta charset="UTF-8">',
                        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                        `    <title>${pageTitle}</title>`,
                        `    <meta name="description" content="${cleanDescription}">`,
                        `    <meta name="keywords" content="${keywords}">`,
                        `    <link rel="canonical" href="${canonicalUrl}">`,
                        '',
                        '    <!-- Open Graph / Facebook -->',
                        '    <meta property="og:type" content="website">',
                        `    <meta property="og:url" content="${canonicalUrl}">`,
                        `    <meta property="og:title" content="${pageTitle}">`,
                        `    <meta property="og:description" content="${cleanDescription}">`,
                        `    <meta property="og:image" content="${socialImage}">`,
                        '',
                        '    <!-- Twitter -->',
                        '    <meta property="twitter:card" content="summary_large_image">',
                        `    <meta property="twitter:url" content="${canonicalUrl}">`,
                        `    <meta property="twitter:title" content="${pageTitle}">`,
                        `    <meta property="twitter:description" content="${cleanDescription}">`,
                        `    <meta property="twitter:image" content="${socialImage}">`,
                        '',
                        '    <!-- Structured Data -->',
                        `    <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`,
                        '',
                        '    <!-- Module Preload -->',
                        `    <link rel="modulepreload" href="${distRelPath}?t=${timestamp}">`,
                        `    <link rel="modulepreload" href="${helperRelPath}?t=${timestamp}">`,
                        '',
                        '    <!-- Assets -->',
                        `    <link rel="stylesheet" href="${cssRelPath}?t=${timestamp}">`,
                        `    <script src="index.js?t=${timestamp}" type="module"></script>`
                    ].join('\n');

                    // Update Head & Static Body
                    content = content.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n${standardTags}\n</head>`);
                    const staticBodyHtml = buildExampleStaticBody(entry, relPath, hasThumb);
                    content = content.replace(/<body>[\s\S]*?<\/body>/i, `<body>\n${staticBodyHtml}\n</body>`);
                }
            }
        }

        const updated = content.replace(
            /(['"])(\.{1,2}\/.+?\.(js|css))(\?[^'"]*)?(\1)/g,
            (match, quote, pathOnly, extension, oldQuery) => {
                return `${quote}${pathOnly}?t=${timestamp}${quote}`;
            }
        );

        if (originalContent !== updated) {
            fs.writeFileSync(filePath, updated, 'utf8');
        }
    });

    console.log(`\n✨ Success! All meta tags, JSON-LD, static SEO body content, and references updated with t=${timestamp}`);
} catch (error) {
    console.error('❌ Error:', error.message);
}
