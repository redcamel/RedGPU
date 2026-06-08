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

            let processed = processedLines.join('\n');

            // 프로덕션 빌드 환경(배포)에서만 GitHub Pages 외부 도메인 경로로 치환합니다.
            if (process.env.NODE_ENV === 'production') {
                processed = processed.replace(/([\(\"\'])\/RedGPU\//g, '$1https://redcamel.github.io/RedGPU/');
            }

            // 상속된 속성/메서드를 따로 추출하여 맨 아래 details(드롭다운)로 묶는 로직
            if (processed.includes('\n### ')) {
                const parts = processed.split('\n### ');
                const mainParts = [];
                const inheritedParts = [];
                mainParts.push(parts[0]); // 첫 번째 클래스 헤더 정보 파트는 무조건 보존

                for (let i = 1; i < parts.length; i++) {
                    const part = parts[i];
                    const trimmedPart = part.trim();

                    // "Inherited from" 또는 "#### Inherited from"이 명시되어 있는 상속받은 멤버인 경우
                    if (part.includes('Inherited from') || part.includes('#### Inherited from')) {
                        // 생성자(Constructor) 정보는 지우지 않고 무조건 메인 본문에 보존
                        if (trimmedPart.startsWith('Constructor')) {
                            mainParts.push('### ' + part);
                        } else {
                            // 그 외의 상속 프로퍼티 및 메서드는 따로 모아둡니다.
                            inheritedParts.push('### ' + part);
                        }
                    } else {
                        mainParts.push('### ' + part);
                    }
                }

                let finalContent = mainParts.join('\n');

                // 모아둔 상속 멤버가 있다면 본문 맨 아래에 접고 펼칠 수 있는 details 태그로 묶어서 추가
                if (inheritedParts.length > 0) {
                    const isKo = currentLang === 'ko';
                    const sectionTitle = isKo ? '상속받은 멤버' : 'Inherited Members';
                    const summaryText = isKo
                        ? '상속받은 속성 및 메서드 보기 (클릭하여 확장)'
                        : 'View inherited properties and methods (Click to expand)';

                    finalContent += `\n\n***\n\n## ${sectionTitle}\n\n<details>\n<summary>${summaryText}</summary>\n\n${inheritedParts.join('\n')}\n\n</details>\n`;
                }

                processed = finalContent;
            }

            fs.writeFileSync(fullPath, processed);
        }
    });
};

const target = process.argv[2]; // 'ko' 또는 'en'
filterLanguageFiles(`manual/${target}/api`, target);
console.log(`✅ Finished post-processing for ${target}`);