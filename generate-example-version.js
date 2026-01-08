const fs = require('fs');
const path = require('path');

const timestamp = Date.now();

// 특정 폴더 경로 지정
const targetFolder = path.join(__dirname, './examples'); // 원하는 폴더로 변경

// 재귀적으로 모든 HTML 파일 찾기
function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 하위 폴더 재귀 탐색
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            // HTML 파일 추가
            fileList.push(filePath);
        }
    });

    return fileList;
}

// 모든 HTML 파일 처리
try {
    const htmlFiles = getAllHtmlFiles(targetFolder);

    console.log(`Found ${htmlFiles.length} HTML files`);

    htmlFiles.forEach(filePath => {
        let html = fs.readFileSync(filePath, 'utf8');

        // 기존 쿼리 파라미터 제거 후 새로운 타임스탬프 추가
        const updated = html.replace(/\.js(\?[^"]*)?"/g, `.js?t=${timestamp}"`);

        // 변경사항이 있을 때만 저장
        if (html !== updated) {
            fs.writeFileSync(filePath, updated);
            console.log(`✓ Updated: ${path.relative(__dirname, filePath)}`);
        }
    });

    console.log(`\nCache busting applied: ${timestamp}`);
} catch (error) {
    console.error('Error:', error.message);
}
