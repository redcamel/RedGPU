import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid';

/**
 * 1. Sidebar Sorting Utility
 * README/Index 파일을 항상 최상단에 배치하고 객체/배열 구조를 재귀적으로 정렬합니다.
 */
const sortSidebar = (sidebar) => {
    if (!Array.isArray(sidebar) && typeof sidebar === 'object' && sidebar !== null) {
        return Object.fromEntries(
            Object.entries(sidebar).map(([key, value]) => [key, sortSidebar(value)])
        );
    }

    if (Array.isArray(sidebar)) {
        return sidebar
            .map(item => ({
                ...item,
                items: item.items ? sortSidebar(item.items) : undefined
            }))
            .sort((a, b) => {
                const isIndex = (text = '', link = '') =>
                    text.toLowerCase().includes('readme') || link.endsWith('/') || link.endsWith('README');

                const aIsIndex = isIndex(a.text, a.link);
                const bIsIndex = isIndex(b.text, b.link);

                return aIsIndex && !bIsIndex ? -1 : !aIsIndex && bIsIndex ? 1 : 0;
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

// [Group 1] 일반 매뉴얼 사이드바 설정 (General Manual)
// API 폴더를 제외한 일반 문서(Getting Started, Core Concepts 등)를 처리합니다.
const manualSidebarConfigs = languages.map(lang => ({
    documentRootPath: 'manual',
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
        manualSortFileNameByPriority: ['introduction', 'context', 'view-system', 'basic-objects', 'lighting-and-shadow', 'environment', 'assets', 'interaction', 'post-effect', 'lod', 'antialiasing']
    }));

// [Group 2] API 문서 사이드바 설정 (API Reference)
// TypeDoc으로 생성된 API 문서 폴더를 처리합니다.
const apiSidebarConfigs = languages.map(lang => ({
    documentRootPath: 'manual',
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
    base: '/RedGPU/manual/',
    ignoreDeadLinks: true,
    lastUpdated: true,

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
                        { text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/' },
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
