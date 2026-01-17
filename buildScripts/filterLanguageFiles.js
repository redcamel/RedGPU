const fs = require('fs');
const path = require('path');

const filterLanguageFiles = (dir, currentLang) => {
    if (!fs.existsSync(dir)) return;
    const removeTag = currentLang === 'ko' ? '[EN]' : '[KO]';
    const keepTag = currentLang === 'ko' ? '[KO]' : '[EN]';

    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            filterLanguageFiles(fullPath, currentLang);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');

            // 1. 반대 언어 태그가 포함된 라인 삭제
            // 2. 현재 언어 태그([KO] 등) 자체를 삭제하여 깔끔하게 만듦
            const processed = lines
                .filter(line => !line.includes(removeTag))
                .map(line => line.replace(keepTag, '').trimStart())
                .join('\n');

            fs.writeFileSync(fullPath, processed);
        }
    });
};

const target = process.argv[2]; // 'ko' 또는 'en'
filterLanguageFiles(`manual/${target}/api`, target);
console.log(`✅ Finished post-processing for ${target}`);