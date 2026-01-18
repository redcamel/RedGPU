const fs = require('fs');
const path = require('path');

const filterLanguageFiles = (dir, currentLang) => {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            filterLanguageFiles(fullPath, currentLang);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');

            const processed = lines
                .map(line => {
                    let tempLine = line;

                    if (currentLang === 'ko') {
                        // [KO] 모드: [EN] 태그가 보이면 그 지점부터 줄 끝까지 삭제
                        if (tempLine.includes('[EN]')) {
                            tempLine = tempLine.split('[EN]')[0].trimEnd();
                        }
                        // [KO] 태그 자체와 그 뒤의 공백 하나를 제거
                        tempLine = tempLine.replace('[KO] ', '').replace('[KO]', '');
                    } else {
                        // [EN] 모드:
                        // 1. [KO]와 [EN]이 한 줄에 모두 있는 경우 (예: @param)
                        if (tempLine.includes('[KO]') && tempLine.includes('[EN]')) {
                            // [KO]부터 [EN] 태그(및 뒤의 공백)까지를 통째로 삭제
                            tempLine = tempLine.replace(/\[KO\].*?\[EN\]\s?/, '');
                        }
                        // 2. [KO]만 있는 줄은 한글 전용 설명이므로 줄 자체를 삭제
                        else if (tempLine.includes('[KO]')) {
                            tempLine = '';
                        }

                        // 남아있는 [EN] 태그 자체와 그 뒤의 공백 하나를 제거
                        tempLine = tempLine.replace('[EN] ', '').replace('[EN]', '');
                    }

                    // 줄 끝의 공백만 제거하여 반환 (빈 줄 유지)
                    return tempLine.trimEnd();
                })
                .join('\n');

            fs.writeFileSync(fullPath, processed);
        }
    });
};

const target = process.argv[2]; // 'ko' 또는 'en'
filterLanguageFiles(`manual/${target}/api`, target);
console.log(`✅ Finished post-processing for ${target}`);