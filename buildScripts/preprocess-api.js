
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../manual/api');

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf8');

            // 1. 이미 백틱으로 감싸져 있지 않은 <Type> 패턴을 찾아 이스케이프 (&lt; &gt;)
            // 또는 간단하게 <를 &lt;로만 바꿔도 VitePress 컴파일러는 조용해집니다.
            const fixedContent = content.replace(/(?<!`)(<)(?![ \d])([^>]+?)(>)(?!`)/g, (match, p1, p2, p3) => {
                return `&lt;${p2}&gt;`;
            });

            if (content !== fixedContent) {
                fs.writeFileSync(filePath, fixedContent);
                console.log(`Fixed: ${file}`);
            }
        }
    });
}

console.log('Preprocessing API markdown files...');
walk(apiDir);