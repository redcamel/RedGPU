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
            let currentBlock = 'none'; // 'none', 'ko', 'en'
            let isInCodeBlock = false;
            const processedLines = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let tempLine = line;
                const trimmed = tempLine.trim();

                // 코드 블록 진입/탈출 감지
                if (trimmed.startsWith('```')) {
                    isInCodeBlock = !isInCodeBlock;
                    currentBlock = 'none';
                }

                // 마크다운 구조 기호, 빈 줄, 또는 주석 닫는 기호를 만나면 블록 상태 초기화
                if (trimmed === '' ||
                    trimmed.includes('*/') ||
                    trimmed.includes('*\\/') ||
                    trimmed.startsWith('#') ||
                    trimmed.startsWith(':::') ||
                    trimmed.startsWith('|') ||
                    trimmed.startsWith('---') || 
                    trimmed.startsWith('***') ||
                    trimmed.startsWith('>') ||
                    trimmed.startsWith('`')) {
                    currentBlock = 'none';
                }

                // 코드 블록 내부에서 주석 기호로 시작하지 않는 실제 코드 라인은 블록 상태 초기화
                if (isInCodeBlock) {
                    const isCommentLine = trimmed.startsWith('//') ||
                        trimmed.startsWith('*') ||
                        trimmed.startsWith('/*') ||
                        trimmed.startsWith('#');
                    if (!isCommentLine) {
                        currentBlock = 'none';
                    }
                }

                let isSkipped = false;

                if (currentLang === 'ko') {
                    // [KO] 모드
                    if (tempLine.includes('[KO]') && tempLine.includes('[EN]')) {
                        // 한 줄에 모두 있는 인라인 케이스
                        tempLine = tempLine.split('[EN]')[0].trimEnd();
                        tempLine = tempLine.replace('[KO] ', '').replace('[KO]', '');
                        currentBlock = 'none';
                    } else if (tempLine.includes('[KO]')) {
                        // [KO] 시작 블록
                        currentBlock = 'ko';
                        if (isInCodeBlock) {
                            // 코드 블록 내부에서는 주석 기호(*, //)를 보존하고 태그만 지움
                            tempLine = tempLine.replace('[KO] ', '').replace('[KO]', '');
                        } else {
                            // 코드 블록 외부에서는 주석 기호를 함께 지움
                            tempLine = tempLine.replace(/(?:\/\/|\*|#)?\s*\[KO\]\s?/, '');
                        }
                    } else if (tempLine.includes('[EN]')) {
                        // [EN] 시작 블록
                        currentBlock = 'en';
                        isSkipped = true;
                    } else {
                        // 태그가 없는 줄
                        if (currentBlock === 'en') {
                            isSkipped = true;
                        }
                    }
                } else {
                    // [EN] 모드
                    if (tempLine.includes('[KO]') && tempLine.includes('[EN]')) {
                        // 한 줄에 모두 있는 인라인 케이스
                        tempLine = tempLine.replace(/\[KO\].*?\[EN\]\s?/, '');
                        tempLine = tempLine.replace('[EN] ', '').replace('[EN]', '');
                        currentBlock = 'none';
                    } else if (tempLine.includes('[KO]')) {
                        // [KO] 시작 블록
                        currentBlock = 'ko';
                        isSkipped = true;
                    } else if (tempLine.includes('[EN]')) {
                        // [EN] 시작 블록
                        currentBlock = 'en';
                        if (isInCodeBlock) {
                            // 코드 블록 내부에서는 주석 기호를 보존하고 태그만 지움
                            tempLine = tempLine.replace('[EN] ', '').replace('[EN]', '');
                        } else {
                            // 코드 블록 외부에서는 주석 기호를 함께 지움
                            tempLine = tempLine.replace(/(?:\/\/|\*|#)?\s*\[EN\]\s?/, '');
                        }
                    } else {
                        // 태그가 없는 줄
                        if (currentBlock === 'ko') {
                            isSkipped = true;
                        }
                    }
                }

                if (!isSkipped) {
                    processedLines.push(tempLine.trimEnd());
                }
            }

            const processed = processedLines.join('\n')
                // 외부 링크(http)가 아니면서 /RedGPU/로 시작하는 경로만 절대 경로로 변환
                // (앞에 (, ", ' 가 오고 바로 뒤에 /RedGPU/가 붙는 경우만 매칭)
                .replace(/([\(\"\'])\/RedGPU\//g, '$1https://redcamel.github.io/RedGPU/');

            fs.writeFileSync(fullPath, processed);
        }
    });
};

const target = process.argv[2]; // 'ko' 또는 'en'
filterLanguageFiles(`manual/${target}/api`, target);
console.log(`✅ Finished post-processing for ${target}`);