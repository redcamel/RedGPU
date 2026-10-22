import {defineConfig} from 'vitepress'
import {generateSidebar} from 'vitepress-sidebar';
import {withMermaid} from 'vitepress-plugin-mermaid';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

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

const isNamespacesFolder = (item) => {
    if (!item || !item.items) return false;
    const text = (item.text || '').toLowerCase().replace(/<[^>]*>/g, '').replace(/[\s\-_]/g, '');
    return text === 'namespaces' || text.endsWith('namespaces');
};

const BADGES = {
    class: '<span class="api-badge badge-c">C</span>',
    variable: '<span class="api-badge badge-v">V</span>',
    namespace: '<span class="api-badge badge-n">N</span>',
    interface: '<span class="api-badge badge-i">I</span>',
    function: '<span class="api-badge badge-f">F</span>',
    typeAlias: '<span class="api-badge badge-t">T</span>',
    enum: '<span class="api-badge badge-e">E</span>'
};

const FOLDER_ICON = '<span class="api-badge badge-folder">📁</span>';

const FOLDER_TITLE_MAP = {
    'interfaces': `${FOLDER_ICON} Interfaces`,
    'functions': `${FOLDER_ICON} Functions`,
    'typealiases': `${FOLDER_ICON} Type Aliases`,
    'namespaces': `${FOLDER_ICON} Namespaces`,
    'enums': `${FOLDER_ICON} Enums`,
    'enumerations': `${FOLDER_ICON} Enumerations`
};

const formatFolderTitle = (text) => {
    if (!text) return text;
    const normalized = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[\s\-_]/g, '');
    return FOLDER_TITLE_MAP[normalized] || text;
};

/**
 * 실제 엔티티 항목에 적절한 뱃지(N, C, I, V, F, T, E)를 부여
 */
const applyBadgeToItem = (item, parentContext = {}) => {
    const rawText = (item.text || '').replace(/<[^>]*>/g, '').trim();
    if (!rawText || rawText.toLowerCase().includes('readme') || (item.text || '').includes('api-badge')) {
        return item;
    }

    const link = item.link || '';
    let badge = null;

    if (link.includes('/classes/') || link.startsWith('classes/') || item.isClass) {
        badge = BADGES.class;
    } else if (link.includes('/variables/') || link.startsWith('variables/') || item.isVariable) {
        badge = BADGES.variable;
    } else if (link.includes('/interfaces/') || link.startsWith('interfaces/')) {
        badge = BADGES.interface;
    } else if (link.includes('/functions/') || link.startsWith('functions/')) {
        badge = BADGES.function;
    } else if (link.includes('/type-aliases/') || link.startsWith('type-aliases/')) {
        badge = BADGES.typeAlias;
    } else if (link.includes('/enums/') || link.startsWith('enums/')) {
        badge = BADGES.enum;
    } else if (parentContext.isNamespacesGroup || link.includes('/namespaces/')) {
        // 실제 서브 네임스페이스 (Core, Foliage, Grass 등)
        if (item.items && !FOLDER_TITLE_MAP[rawText.toLowerCase().replace(/[\s\-_]/g, '')]) {
            badge = BADGES.namespace;
        }
    }

    if (badge) {
        return {
            ...item,
            text: `${badge} ${rawText}`
        };
    }

    return item;
};

/**
 * 1. Sidebar Sorting & Classes/Variables Unwrap Utility
 * - 'classes' 및 'variables' 폴더는 언랩하여 상위 네임스페이스 바로 아래로 승격
 * - 폴더 그룹은 '📁' 아이콘으로 표시하고, 실제 네이밍에 N, C, I, V, F, T 배지 적용
 * - 정렬 순서:
 *   1) README / Index (최상단)
 *   2) 클래스(Class) 문서 목록
 *   3) 변수/상수(Variable) 문서 목록
 *   4) 기타 일반 문서
 *   5) 하위 폴더(Namespaces ➔ Interfaces, Functions 등)
 */
const sortSidebar = (sidebar, parentContext = {}) => {
    if (!Array.isArray(sidebar) && typeof sidebar === 'object' && sidebar !== null) {
        return Object.fromEntries(
            Object.entries(sidebar).map(([key, value]) => [key, sortSidebar(value, parentContext)])
        );
    }

    if (Array.isArray(sidebar)) {
        const processed = sidebar.flatMap(item => {
            const rawNormalized = (item.text || '').toLowerCase().replace(/<[^>]*>/g, '').replace(/[\s\-_]/g, '');
            const isCurrentNamespacesGroup = rawNormalized === 'namespaces';

            const processedItem = {
                ...item,
                items: item.items ? sortSidebar(item.items, {isNamespacesGroup: isCurrentNamespacesGroup}) : undefined
            };

            // classes 폴더인 경우 자식들을 상위로 승격 (isClass 플래그 부착)
            if (isClassesFolder(processedItem)) {
                return (processedItem.items || []).map(child => applyBadgeToItem({
                    ...child,
                    isClass: true
                }));
            }

            // variables 폴더인 경우 자식들을 상위로 승격 (isVariable 플래그 부착)
            if (isVariablesFolder(processedItem)) {
                return (processedItem.items || []).map(child => applyBadgeToItem({
                    ...child,
                    isVariable: true
                }));
            }

            // namespaces 폴더인 경우 자식들을 상위로 승격 (isNamespace 플래그 부착)
            if (isNamespacesFolder(processedItem)) {
                return (processedItem.items || []).map(child => applyBadgeToItem({
                    ...child,
                    isNamespace: true
                }));
            }

            // 하위 폴더(interfaces, functions 등)인 경우 📁 폴더 헤더 적용
            if (processedItem.items && !processedItem.link) {
                processedItem.text = formatFolderTitle(processedItem.text);
            }

            // 실제 엔티티 아이템(인터페이스, 함수, 네임스페이스 등)에 뱃지 부착
            return [applyBadgeToItem(processedItem, parentContext)];
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

        const isNamespaceItem = (item) => {
            if (item.isNamespace) return true;
            const text = item.text || '';
            const link = item.link || '';
            return text.includes('badge-n') || link.includes('/namespaces/');
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

            // 4. 네임스페이스(Namespace) 목록
            const aIsNS = isNamespaceItem(a);
            const bIsNS = isNamespaceItem(b);
            if (aIsNS && !bIsNS) return -1;
            if (!aIsNS && bIsNS) return 1;

            // 5. 단일 문서를 하위 폴더(그룹)보다 먼저 배치
            const aHasItems = Boolean(a.items);
            const bHasItems = Boolean(b.items);
            if (!aHasItems && bHasItems) return -1;
            if (aHasItems && !bHasItems) return 1;

            // 6. 동일 분류 내에서는 HTML 태그를 제외한 순수 알파벳 순 정렬
            const aCleanText = (a.text || '').replace(/<[^>]*>/g, '').replace(/^\[[CVN]\]\s*/, '').trim();
            const bCleanText = (b.text || '').replace(/<[^>]*>/g, '').replace(/^\[[CVN]\]\s*/, '').trim();
            return aCleanText.localeCompare(bCleanText);
        });
    }

    return sidebar;
};

// 지원 언어 설정 (이 배열을 기준으로 모든 설정이 생성됨)
const languages = [
    {code: 'en', label: 'English', entry: '/en/introduction/', outlineTitle: 'On this page'},
    {code: 'ko', label: '한국어', entry: '/ko/introduction/', outlineTitle: '페이지 목차'}
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
    manualSortFileNameByPriority: ['introduction', 'context', 'view-system', 'basic-objects', 'lighting-and-shadow', 'environment', 'assets', 'interaction', 'post-effect', 'lod', 'antialiasing', 'landscape', 'water', 'plugins', 'inspector', 'model-loading', 'instanced-mesh', 'sprite', 'text-field', 'particle']
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


const finalSidebar = {...generateSidebar(manualSidebarConfigs), ...sortSidebar(generateSidebar(apiSidebarConfigs))};

/**
 * 3. VitePress Main Configuration
 */
export default withMermaid(defineConfig({
    title: 'RedGPU',
    description: 'RedGPU - WebGPU based 3D Graphics Engine',
    base: '/RedGPU/manual/',
    ignoreDeadLinks: true,
    lastUpdated: true,

    // 로컬 개발 서버 환경에서 /RedGPU/examples/ 및 /RedGPU/dist/ 요청을 실제 프로젝트 루트 폴더로 라우팅하는 설정
    vite: {
        server: {
            fs: {
                // 프로젝트 루트 상위 디렉토리 파일 접근 허용 (보안 해제)
                allow: ['..', projectRoot]
            }
        },
        plugins: [
            {
                name: 'serve-examples',
                configureServer(server) {
                    const MIME_TYPES = {
                        '.html': 'text/html; charset=utf-8',
                        '.js': 'application/javascript; charset=utf-8',
                        '.mjs': 'application/javascript; charset=utf-8',
                        '.css': 'text/css; charset=utf-8',
                        '.json': 'application/json; charset=utf-8',
                        '.gltf': 'model/gltf+json',
                        '.map': 'application/json; charset=utf-8',
                        '.png': 'image/png',
                        '.jpg': 'image/jpeg',
                        '.jpeg': 'image/jpeg',
                        '.webp': 'image/webp',
                        '.gif': 'image/gif',
                        '.svg': 'image/svg+xml',
                        '.ico': 'image/x-icon',
                        '.wasm': 'application/wasm',
                        '.glb': 'model/gltf-binary',
                        '.bin': 'application/octet-stream',
                        '.hdr': 'application/octet-stream',
                        '.ktx2': 'image/ktx2',
                        '.mp3': 'audio/mpeg',
                        '.ogg': 'audio/ogg',
                        '.wav': 'audio/wav',
                        '.mp4': 'video/mp4',
                        '.webm': 'video/webm',
                        '.woff': 'font/woff',
                        '.woff2': 'font/woff2',
                        '.ttf': 'font/ttf',
                        '.wgsl': 'text/plain; charset=utf-8'
                    };

                    server.middlewares.use((req, res, next) => {
                        if (!req.url) return next();

                        const [rawPath, queryString] = req.url.split('?');
                        const cleanPath = decodeURIComponent(rawPath);
                        let filePath = null;

                        if (cleanPath.startsWith('/RedGPU/examples/')) {
                            const relativePath = cleanPath.slice('/RedGPU/examples/'.length);
                            filePath = path.resolve(projectRoot, 'examples', relativePath);
                        } else if (cleanPath.startsWith('/RedGPU/dist/')) {
                            const relativePath = cleanPath.slice('/RedGPU/dist/'.length);
                            filePath = path.resolve(projectRoot, 'dist', relativePath);
                        } else if (cleanPath.startsWith('/RedGPU/src/')) {
                            const relativePath = cleanPath.slice('/RedGPU/src/'.length);
                            filePath = path.resolve(projectRoot, 'src', relativePath);
                        }

                        if (filePath && fs.existsSync(filePath)) {
                            const stat = fs.statSync(filePath);
                            if (stat.isDirectory()) {
                                if (!cleanPath.endsWith('/')) {
                                    res.statusCode = 302;
                                    res.setHeader('Location', `${cleanPath}/${queryString ? '?' + queryString : ''}`);
                                    res.end();
                                    return;
                                }
                                filePath = path.join(filePath, 'index.html');
                            }

                            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                                const ext = path.extname(filePath).toLowerCase();
                                const contentType = MIME_TYPES[ext] || 'application/octet-stream';

                                res.setHeader('Content-Type', contentType);
                                res.end(fs.readFileSync(filePath));
                                return;
                            }
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
        ['meta', {
            property: 'og:image',
            content: 'https://repository-images.githubusercontent.com/223094122/24f03a80-cdcb-11ea-8297-408bf897ad1e'
        }],
        ['meta', {name: 'twitter:card', content: 'summary_large_image'}],
        ['meta', {
            name: 'twitter:image',
            content: 'https://repository-images.githubusercontent.com/223094122/24f03a80-cdcb-11ea-8297-408bf897ad1e'
        }],
    ],
    transformHead({pageData}) {
        const canonicalUrl = `https://redcamel.github.io/RedGPU/manual/${pageData.relativePath}`
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '.html');
        const pageTitle = pageData.title ? `${pageData.title} | RedGPU` : 'RedGPU Documentation';
        const pageDescription = pageData.description || 'RedGPU - WebGPU based 3D Graphics Engine';
        return [
            ['link', {rel: 'canonical', href: canonicalUrl}],
            ['meta', {property: 'og:url', content: canonicalUrl}],
            ['meta', {property: 'og:title', content: pageTitle}],
            ['meta', {property: 'og:description', content: pageDescription}],
            ['meta', {name: 'twitter:title', content: pageTitle}],
            ['meta', {name: 'twitter:description', content: pageDescription}],
        ];
    },

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
                    outline: {
                        level: [2, 3],
                        label: lang.outlineTitle || 'On this page'
                    },
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
            level: [2, 3],
            label: 'On this page'
        }
    }
}));
