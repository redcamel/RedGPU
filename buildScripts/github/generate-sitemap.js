const fs = require('fs');
const path = require('path');

// 기본 URL 설정
const baseUrl = 'https://redcamel.github.io/RedGPU/examples';
// 대상 디렉토리 경로
const examplesDir = path.join(__dirname, '../../examples');

// 현재 날짜 가져오기 (lastmod용)
const today = new Date().toISOString().split('T')[0];

// 1. exampleList.ts에서 정식 등록된 예제 경로 목록 추출
const registeredPaths = new Set();
const listPath = path.join(examplesDir, 'exampleHelper/src/data/exampleList.ts');
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
            list.forEach((item) => {
                if (item.path) registeredPaths.add(item.path);
                if (item.list) flatten(item.list);
            });
        };
        flatten(exampleList);
    } catch (e) {
        console.error('Failed to parse exampleList.ts:', e.message);
    }
}

// URL 카운터
let urlCount = 0;

// 2. Examples Sitemap 생성 (sitemap-examples.xml)
let examplesSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://redcamel.github.io/RedGPU/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://redcamel.github.io/RedGPU/examples/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

const sortedPaths = Array.from(registeredPaths).sort();

for (const relPath of sortedPaths) {
    const dirPath = path.join(examplesDir, relPath);
    const indexHtmlPath = path.join(dirPath, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
        const indexJsPath = path.join(dirPath, 'index.js');
        const targetPath = fs.existsSync(indexJsPath) ? indexJsPath : indexHtmlPath;
        const lastModDate = fs.statSync(targetPath).mtime.toISOString().split('T')[0];
        const urlPath = `${baseUrl}/${relPath}`;

        examplesSitemapXML += `  <url>
    <loc>${urlPath}/</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        urlCount++;
    }
}

// XML 닫기
examplesSitemapXML += `</urlset>`;

// 사이트맵 저장 경로 (프로젝트 루트)
const sitemapDir = path.join(__dirname, '../../');

// Examples 사이트맵 파일 저장
fs.writeFileSync(path.join(sitemapDir, 'sitemap-examples.xml'), examplesSitemapXML);
console.log(`Examples 사이트맵이 생성되었습니다: sitemap-examples.xml (총 ${urlCount}개 정식 예제 URL)`);

// 3. Root Sitemap Index 생성 (sitemap.xml)
const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://redcamel.github.io/RedGPU/sitemap-examples.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://redcamel.github.io/RedGPU/manual/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

// Root 사이트맵 인덱스 파일 저장
fs.writeFileSync(path.join(sitemapDir, 'sitemap.xml'), sitemapIndexXML);
console.log(`루트 사이트맵 인덱스가 생성되었습니다: sitemap.xml`);
