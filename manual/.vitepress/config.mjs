import {defineConfig} from 'vitepress'
import {generateSidebar} from 'vitepress-sidebar';
import {withMermaid} from 'vitepress-plugin-mermaid';
import fs from 'fs';
import path from 'path';

const isClassesFolder = (item) => {
    if (!item || !item.items) return false;
    const text = (item.text || '').toLowerCase().replace(/[\s\-_]/g, '');
    return text === 'classes' || text.endsWith('classes');
};

const isVariablesFolder = (item) => {
    if (!item || !item.items) return false;
    const text = (item.text || '').toLowerCase().replace(/[\s\-_]/g, '');
    return text === 'variables' || text.endsWith('variables');
};

const FOLDER_TITLE_MAP = {
    'interfaces': '📁 Interfaces',
    'functions': '📁 Functions',
    'typealiases': '📁 Type Aliases',
    'namespaces': '📁 Namespaces',
    'enums': '📁 Enums',
    'enumerations': '📁 Enumerations'
};

const formatFolderTitle = (text) => {
    if (!text) return text;
    const normalized = text.toLowerCase().replace(/[\s\-_]/g, '');
    return FOLDER_TITLE_MAP[normalized] || text;
};

/**
 * 1. Sidebar Sorting & Classes/Variables Unwrap Utility
 * - 'classes' 및 'variables' 폴더는 언랩하여 상위 네임스페이스 바로 아래로 승격
 * - 하위 그룹 폴더(interfaces, functions 등)에는 📁 아이콘 및 타이틀 케이스 적용
 * - 정렬 순서:
 *   1) README / Index (최상단)
 *   2) 클래스(Class) 문서 목록
 *   3) 변수/상수(Variable) 문서 목록
 *   4) 기타 일반 문서
 *   5) 하위 폴더(📁 Interfaces, 📁 Functions 등)
 */
const sortSidebar = (sidebar) => {
    if (!Array.isArray(sidebar) && typeof sidebar === 'object' && sidebar !== null) {
        return Object.fromEntries(
            Object.entries(sidebar).map(([key, value]) => [key, sortSidebar(value)])
        );
    }

    if (Array.isArray(sidebar)) {
        const processed = sidebar.flatMap(item => {
            const processedItem = {
                ...item,
                items: item.items ? sortSidebar(item.items) : undefined
            };

            // classes 폴더인 경우 자식들을 상위로 승격 (isClass 플래그)
            if (isClassesFolder(processedItem)) {
                return (processedItem.items || []).map(child => ({
                    ...child,
                    isClass: true
                }));
            }

            // variables 폴더인 경우 자식들을 상위로 승격 (isVariable 플래그)
            if (isVariablesFolder(processedItem)) {
                return (processedItem.items || []).map(child => ({
                    ...child,
                    isVariable: true
                }));
            }

            // 하위 폴더(interfaces, functions 등)인 경우 시각적 구분을 위해 📁 아이콘 및 타이틀 케이스 적용
            if (processedItem.items && !processedItem.link) {
                processedItem.text = formatFolderTitle(processedItem.text);
            }

            return [processedItem];
        });

        const isIndex = (item) => {
            const text = item.text || '';
            const link = item.link || '';
            return text.toLowerCase().includes('readme') || link.endsWith('/') || link.endsWith('README');
        };

        const isClassItem = (item) => {
            if (item.isClass) return true;
            const link = item.link || '';
            return link.includes('/classes/') || link.startsWith('classes/');
        };

        const isVariableItem = (item) => {
            if (item.isVariable) return true;
            const link = item.link || '';
            return link.includes('/variables/') || link.startsWith('variables/');
        };

        const isNamespacesFolder = (item) => {
            if (!item.items) return false;
            return (item.text || '').toLowerCase().includes('namespaces');
        };

        return processed.sort((a, b) => {
            // 1. README 최우선
            const aIsIndex = isIndex(a);
            const bIsIndex = isIndex(b);
            if (aIsIndex && !bIsIndex) return -1;
            if (!aIsIndex && bIsIndex) return 1;

            // 2. 클래스(Class) 목록
            const aIsClass = isClassItem(a);
            const bIsClass = isClassItem(b);
            if (aIsClass && !bIsClass) return -1;
            if (!aIsClass && bIsClass) return 1;

            // 3. 변수/상수(Variable) 목록
            const aIsVar = isVariableItem(a);
            const bIsVar = isVariableItem(b);
            if (aIsVar && !bIsVar) return -1;
            if (!aIsVar && bIsVar) return 1;

            // 4. 단일 문서를 하위 폴더(그룹)보다 먼저 배치
            const aHasItems = Boolean(a.items);
            const bHasItems = Boolean(b.items);
            if (!aHasItems && bHasItems) return -1;
            if (aHasItems && !bHasItems) return 1;

            // 5. 폴더 그룹 중에서는 '📁 Namespaces'를 가장 먼저 배치
            const aIsNS = isNamespacesFolder(a);
            const bIsNS = isNamespacesFolder(b);
            if (aIsNS && !bIsNS) return -1;
            if (!aIsNS && bIsNS) return 1;

            // 6. 동일 분류 내에서는 알파벳 순 정렬
            return (a.text || '').localeCompare(b.text || '');
        });
    }

    return sidebar;
};

// 지원 언어 설정 (이 배열을 기준으로 모든 설정이 생성됨)
const languages = [
    { code: 'en', label: 'English', entry: '/en/introduction/' },
    { code: 'ko', label: '한국어', entry: '/ko/introduction/' }
];

// --------------------------------------------------------------------------
// Sidebar Configuration Groups
// --------------------------------------------------------------------------

const isInsideManual = !fs.existsSync('manual');
const docRoot = isInsideManual ? '.' : 'manual';

// [Group 1] 일반 매뉴얼 사이드바 설정 (General Manual)
// API 폴더를 제외한 일반 문서(Getting Started, Core Concepts 등)를 처리합니다.
const manualSidebarConfigs = languages.map(lang => ({
    documentRootPath: docRoot,
    scanStartPath: lang.code,
    resolvePath: `/${lang.code}/`,
    useTitleFromFileHeading: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    hyphenToSpace: true,
    // API 폴더는 일반 매뉴얼 사이드바에서 제외 (중요)
    excludePattern: ['api/**'],
    useFolderLinkFromIndexFile: true,
    sortMenusByFrontmatterOrder: true,
        // 폴더 및 파일 정렬 순서 지정
    manualSortFileNameByPriority: ['introduction', 'context', 'view-system', 'basic-objects', 'lighting-and-shadow', 'environment', 'assets', 'interaction', 'post-effect', 'lod', 'antialiasing', 'plugins', 'inspector']
    }));

// [Group 2] API 문서 사이드바 설정 (API Reference)
// TypeDoc으로 생성된 API 문서 폴더를 처리합니다.
const apiSidebarConfigs = languages.map(lang => ({
    documentRootPath: docRoot,
    scanStartPath: `${lang.code}/api/RedGPU-API/namespaces/RedGPU`,
    resolvePath: `/${lang.code}/api/RedGPU-API/namespaces/RedGPU/`,
    useFolderTitleFromIndexFile: true,
    indexFile: 'README.md',
    useFolderLinkFromIndexFile: true,
    recursive: true,
    collapsed: true,
    collapseDepth: 2,
    sortMenusByFrontmatterOrder: true
}));

// 전체 사이드바 설정 합치기
const sidebarEntries = [...manualSidebarConfigs, ...apiSidebarConfigs];

const rawSidebarConfig = generateSidebar(sidebarEntries);
const finalSidebar = sortSidebar(rawSidebarConfig);

/**
 * 3. VitePress Main Configuration
 */
export default withMermaid(defineConfig({
    title: 'RedGPU',
    description: 'RedGPU - WebGPU based 3D Graphics Engine',
    base: process.env.NODE_ENV === 'production' ? '/RedGPU/manual/' : '/',
    ignoreDeadLinks: true,
    lastUpdated: true,

    // 로컬 개발 서버 환경에서 /RedGPU/examples/ 요청을 실제 examples 폴더로 라우팅하는 설정
    vite: {
        server: {
            fs: {
                // 프로젝트 루트 상위 디렉토리 파일 접근 허용 (보안 해제)
                allow: ['..']
            }
        },
        plugins: [
            {
                name: 'serve-examples',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        let targetFile = null;
                        if (req.url.startsWith('/RedGPU/examples/')) {
                            const relativePath = req.url.replace('/RedGPU/examples/', '').split('?')[0];
                            const filePath = path.resolve(process.cwd(), 'examples', relativePath);
                            targetFile = filePath;
                            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                                targetFile = path.join(filePath, 'index.html');
                            }
                        } else if (req.url.startsWith('/RedGPU/dist/')) {
                            const relativePath = req.url.replace('/RedGPU/dist/', '').split('?')[0];
                            const filePath = path.resolve(process.cwd(), 'dist', relativePath);
                            targetFile = filePath;
                            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                                targetFile = path.join(filePath, 'index.html');
                            }
                        }

                        if (targetFile && fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
                            const ext = path.extname(targetFile);
                            let contentType = 'text/plain';
                            if (ext === '.html') contentType = 'text/html';
                            else if (ext === '.js' || ext === '.mjs') contentType = 'application/javascript';
                            else if (ext === '.css') contentType = 'text/css';
                            else if (ext === '.png') contentType = 'image/png';
                            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                            else if (ext === '.svg') contentType = 'image/svg+xml';
                            else if (ext === '.json') contentType = 'application/json';
                            else if (ext === '.wasm') contentType = 'application/wasm';

                            res.setHeader('Content-Type', contentType);
                            res.end(fs.readFileSync(targetFile));
                            return;
                        }
                        next();
                    });
                }
            }
        ]
    },

    // SEO Configuration
    sitemap: {
        hostname: 'https://redcamel.github.io/RedGPU/manual/',
        transformItems: (items) => {
            return items.map((item) => ({
                ...item,
                url: encodeURI(item.url)
            }));
        }
    },
    head: [
        ['meta', { name: 'keywords', content: 'WebGPU, RedGPU, 3D Engine, Graphics, Javascript, Typescript' }],
        ['meta', { name: 'author', content: 'RedCamel' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'RedGPU Documentation' }],
        ['meta', { property: 'og:title', content: 'RedGPU' }],
        ['meta', { property: 'og:description', content: 'RedGPU - WebGPU based 3D Graphics Engine' }],
    ],

    // 다국어 로케일 설정 (자동 생성)
    locales: Object.fromEntries(
        languages.map(lang => [
            lang.code, 
            {
                label: lang.label,
                lang: lang.code,
                link: `/${lang.code}/`, // 언어 전환의 기준점이 되는 경로
                themeConfig: {
                    logoLink: `/RedGPU/manual/${lang.code}/`,
                    // 언어별 네비게이션 바
                    nav: [
                        { text: 'Getting Started', link: lang.entry },
                        { text: 'API Reference', link: `/${lang.code}/api/RedGPU-API/namespaces/RedGPU/README` },
                        {text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/', target: '_blank'},
                    ],
                }
            }
        ])
    ),

    // 마크다운 커스텀 규칙
    markdown: {
        config: (md) => {
            const defaultRender = md.renderer.rules.html_block || ((tokens, idx) => tokens[idx].content);
            md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
                const content = tokens[idx].content.trim();
                if (content.startsWith('<iframe')) {
                    return content.replace(/<iframe/g, '<ExampleFrame').replace(/<\/iframe>/g, '</ExampleFrame>');
                }
                return defaultRender(tokens, idx, options, env, self);
            };

            // 링크 규칙 커스터마이징 (외부 링크나 특정 경로에 대해 target 설정)
            const defaultLinkRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => {
                return self.renderToken(tokens, idx, options);
            });
            md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                const aIndex = tokens[idx].attrIndex('href');
                if (aIndex >= 0) {
                    const href = tokens[idx].attrs[aIndex][1];
                    // 만약 링크가 /RedGPU/examples/ 로 시작한다면 target="_blank"를 지정하여 SPA 라우터를 우회
                    if (href.startsWith('/RedGPU/examples/') || href.startsWith('/RedGPU/dist/')) {
                        const targetIndex = tokens[idx].attrIndex('target');
                        if (targetIndex >= 0) {
                            tokens[idx].attrs[targetIndex][1] = '_blank';
                        } else {
                            tokens[idx].attrs.push(['target', '_blank']);
                        }
                        const relIndex = tokens[idx].attrIndex('rel');
                        if (relIndex >= 0) {
                            tokens[idx].attrs[relIndex][1] = 'noopener noreferrer';
                        } else {
                            tokens[idx].attrs.push(['rel', 'noopener noreferrer']);
                        }
                    }
                }
                return defaultLinkRender(tokens, idx, options, env, self);
            };
        }
    },
    async transformPageData(pageData) {
        // 1. 현재 페이지의 경로가 'api/'로 시작하는지 확인
        if (pageData.relativePath.includes('api/RedGPU-API/')) {
            // 2. 해당 페이지의 frontmatter에 'api-page' 클래스 추가
            pageData.frontmatter.pageClass = 'api-page-layout';
        }
    },
    // Mermaid 설정
    mermaid: {
        theme: 'base',
        themeVariables: {
            darkMode: true,
            background: '#1b1b1f',

            primaryColor: '#252529',
            primaryTextColor: '#F2F2F2',
            primaryBorderColor: '#00CC99',

            lineColor: '#6e6e73',
            secondaryColor: '#161618',
            tertiaryColor: '#161618',

            mainBkg: '#1b1b1f',
            nodeBorder: '#00CC99',

            fontFamily: 'var(--vp-font-family-base)',
            fontSize: '15px'
        }
    },
    // 공통 테마 설정
    themeConfig: {
        // logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },

        // 공통 사이드바 (finalSidebar 내부의 키가 /ko/, /en/로 나뉘어 있어 자동 매칭됨)
        sidebar: finalSidebar,

        socialLinks: [
            { icon: 'github', link: 'https://github.com/redcamel/RedGPU' },
            { icon: 'x', link: 'https://x.com/redcamel15' }
        ],

        // 하단 및 기타 텍스트 설정
        lastUpdated: {
            text: 'Last Updated',
            formatOptions: { dateStyle: 'full', timeStyle: 'medium' }
        },

        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: { buttonText: 'Search' },
                            modal: {
                                displayDetails: 'Display detailed list',
                                resetButtonTitle: 'Reset query',
                                backButtonTitle: 'Go back',
                                noResultsText: 'No results for',
                                footer: { selectText: 'to select', navigateText: 'to navigate', closeText: 'to close' }
                            }
                        }
                    }
                }
            }
        },

        docFooter: {
            prev: 'Previous page',
            next: 'Next page'
        },

        outline: {
            label: 'On this page'
        }
    }
}));
