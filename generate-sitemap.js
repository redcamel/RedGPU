const fs = require('fs');
const path = require('path');

// 기본 URL 설정
const baseUrl = 'https://redcamel.github.io/RedGPU/examples';
// 대상 디렉토리 경로
const examplesDir = path.join(__dirname, 'examples');
// 탐색할 카테고리
const categories = ['2d', '3d', 'gltf'];

// 현재 날짜 가져오기 (lastmod용)
const today = new Date().toISOString().split('T')[0];

// URL 카운터
let urlCount = 0;

// XML 헤더 생성
let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
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
    <url>
    <loc>https://redcamel.github.io/RedGPU/docs/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;
let num=0
// 폴더 구조 재귀적으로 탐색
function exploreDirectory(dirPath, urlPath) {
    // index.html 파일이 있는지 확인
    if (fs.existsSync(path.join(dirPath, 'index.html'))) {
        // index.html이 있는 경우만 사이트맵에 추가
        sitemapXML += `  <url>
    <loc>${urlPath}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;
        urlCount++;
        console.log(`추가됨: ${urlPath}/`,++num);
    }

    // 하위 디렉토리 읽기
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        // 디렉토리만 처리
        if (stat.isDirectory()) {
            exploreDirectory(itemPath, `${urlPath}/${item}`);
        }
    }
}

// 각 카테고리 탐색
for (const category of categories) {
    const categoryPath = path.join(examplesDir, category);

    // 카테고리 폴더가 존재하는지 확인
    if (fs.existsSync(categoryPath)) {
        exploreDirectory(categoryPath, `${baseUrl}/${category}`);
    }
}

// XML 닫기
sitemapXML += `</urlset>`;

// 파일로 저장
fs.writeFileSync('sitemap.xml', sitemapXML);
console.log(`사이트맵이 생성되었습니다: sitemap.xml (총 ${urlCount}개 URL)`);
