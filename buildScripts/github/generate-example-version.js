/**
 * [KO] 예제 파일들의 캐시 방지 및 버전 관리를 위한 스크립트입니다.
 * [EN] Script for cache prevention and version management of example files.
 *
 * [KO] examples 폴더 내의 HTML 파일에 캐시 제어 메타 태그를 삽입하고, JS 참조 경로에 타임스탬프 쿼리 파라미터를 추가합니다.
 * [EN] Inserts cache control meta tags into HTML files within the examples folder and adds timestamp query parameters to JS reference paths.
 *
 * @category Utility
 */
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();
// 실행 위치(root)를 기준으로 examples 폴더 지정
const targetFolder = path.join(process.cwd(), 'examples');

function getAllFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
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

        // 1. HTML 파일인 경우 메타 태그 추가 로직
        if (filePath.endsWith('.html')) {
            const metaTags = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">`;

            // 이미 메타 태그가 있는지 확인 (중복 방지)
            if (!content.includes('http-equiv="Cache-Control"')) {
                // <head> 태그 바로 다음에 메타 태그 주입
                content = content.replace(/<head>/i, `<head>${metaTags}`);
            }
        }

        // 2. 기존 .js 경로 치환 기능 (기존 로직 유지)
        const updated = content.replace(
          /(['"])(.+?\.js)(\?[^'"]*)?(\1)/g,
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

    console.log(`\n✨ Success! Meta tags added and .js references updated with t=${timestamp}`);
} catch (error) {
    console.error('❌ Error:', error.message);
}
