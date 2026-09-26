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
                        if (trimmed.startsWith('|')) {
                            // 테이블 행인 경우: [EN]부터 다음 컬럼 구분자('|') 직전까지만 제거하여 이후 컬럼(Defined in 등) 및 테이블 구조 보존
                            tempLine = tempLine.replace(/\s*\[EN\].*?(?=\s*(?<!\\)\|)/g, '');
                            tempLine = tempLine.replace(/\[KO\]\s?/g, '');
                        } else {
                            // 일반 라인인 경우: [EN] 이후 끝까지 제거
                            tempLine = tempLine.split('[EN]')[0].trimEnd();
                            tempLine = tempLine.replace('[KO] ', '').replace('[KO]', '');
                        }
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

            // Constructor 이전의 클래스 대표 Example만 H3로 유지하고,
            // Constructor 이후(생성자, 프로퍼티, 메서드)의 ### Example은 #### Example로 변환하여 우측 목차(H2, H3)에서 제외
            if (processed.includes('## Constructors') || processed.includes('## 생성자')) {
                const linesAfterFilter = processed.split('\n');
                let pastConstructors = false;
                for (let i = 0; i < linesAfterFilter.length; i++) {
                    const l = linesAfterFilter[i].trim();
                    if (l.startsWith('## Constructors') || l.startsWith('## 생성자')) {
                        pastConstructors = true;
                    } else if (pastConstructors && (l === '### Example' || l === '### 예제')) {
                        linesAfterFilter[i] = '#' + linesAfterFilter[i]; // '### Example' -> '#### Example'
                    }
                }
                processed = linesAfterFilter.join('\n');
            }

            // 상속된 속성과 메서드를 분리하여 각각 '상속받은 속성', '상속받은 메서드' H2 아래로 배치하는 로직
            if (processed.includes('Inherited from') || processed.includes('#### Inherited from')) {
                const lines = processed.split('\n');
                const mainSections = [];
                let currentH2 = '';
                let currentMemberLines = [];
                let currentMemberIsH3 = false;
                const inheritedProperties = [];
                const inheritedMethods = [];

                const finalizeMember = () => {
                    if (currentMemberLines.length === 0) return;
                    const memberText = currentMemberLines.join('\n');
                    const trimmed = memberText.trim();

                    if (currentMemberIsH3) {
                        const isInherited = (memberText.includes('Inherited from') || memberText.includes('#### Inherited from'))
                            && !trimmed.startsWith('### Constructor');
                        if (isInherited) {
                            const isMethod = currentH2.toLowerCase().includes('method') || currentH2.includes('메서드');
                            if (isMethod) {
                                inheritedMethods.push(trimmed);
                            } else {
                                inheritedProperties.push(trimmed);
                            }
                        } else {
                            if (mainSections.length === 0) {
                                mainSections.push({h2: currentH2, members: []});
                            }
                            mainSections[mainSections.length - 1].members.push(trimmed);
                        }
                    } else {
                        if (mainSections.length === 0) {
                            mainSections.push({h2: currentH2, members: []});
                        }
                        mainSections[mainSections.length - 1].members.push(trimmed);
                    }
                    currentMemberLines = [];
                    currentMemberIsH3 = false;
                };

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmed = line.trim();

                    if (trimmed.startsWith('## ')) {
                        finalizeMember();
                        currentH2 = trimmed;
                        mainSections.push({h2: currentH2, members: []});
                    } else if (trimmed.startsWith('### ')) {
                        finalizeMember();
                        currentMemberIsH3 = true;
                        currentMemberLines.push(line);
                    } else {
                        currentMemberLines.push(line);
                    }
                }
                finalizeMember();

                // 메인 본문 재구성 (자식이 모두 상속으로 빠져나가 껍데기만 남은 빈 H2 섹션은 제거)
                const finalMainParts = [];
                for (const sec of mainSections) {
                    if (sec.members.length > 0) {
                        if (sec.h2) finalMainParts.push(sec.h2);
                        finalMainParts.push(sec.members.join('\n\n***\n\n'));
                    }
                }

                let finalContent = finalMainParts.join('\n\n');
                const isKo = currentLang === 'ko';

                if (inheritedProperties.length > 0) {
                    const sectionTitle = isKo ? '상속받은 속성' : 'Inherited Properties';
                    const summaryText = isKo
                        ? '상속받은 속성 보기 (클릭하여 확장)'
                        : 'View inherited properties (Click to expand)';

                    finalContent += `\n\n***\n\n## ${sectionTitle}\n\n<details>\n<summary>${summaryText}</summary>\n\n${inheritedProperties.join('\n\n***\n\n')}\n\n</details>\n`;
                }

                if (inheritedMethods.length > 0) {
                    const sectionTitle = isKo ? '상속받은 메서드' : 'Inherited Methods';
                    const summaryText = isKo
                        ? '상속받은 메서드 보기 (클릭하여 확장)'
                        : 'View inherited methods (Click to expand)';

                    finalContent += `\n\n***\n\n## ${sectionTitle}\n\n<details>\n<summary>${summaryText}</summary>\n\n${inheritedMethods.join('\n\n***\n\n')}\n\n</details>\n`;
                }

                processed = finalContent;
            }

            fs.writeFileSync(fullPath, processed);
        }
    });
};

const target = process.argv[2]; // 'ko' 또는 'en'
const targetDir = fs.existsSync(`manual/${target}/api`) ? `manual/${target}/api` : `${target}/api`;
filterLanguageFiles(targetDir, target);
console.log(`✅ Finished post-processing for ${target}`);