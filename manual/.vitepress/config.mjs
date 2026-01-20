import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid';

// 지원 언어 설정
const languages = [
    { code: 'en', label: 'English', entry: '/en/introduction/getting-started' },
    { code: 'ko', label: '한국어', entry: '/ko/introduction/getting-started' }
];

/**
 * 1. API 문서 사이드바 자동 생성
 * 매뉴얼 부분은 수동으로 정의하고, 방대한 API 문서는 자동 생성을 활용합니다.
 */
const apiSidebarEntries = [];
languages.forEach(lang => {
    apiSidebarEntries.push({
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
    });
});
const rawApiSidebar = generateSidebar(apiSidebarEntries);

/**
 * 2. 매뉴얼 사이드바 수동 정의
 * 학습 순서에 맞춰 문서 목록을 직접 지정합니다.
 */
const manualSidebar = {
    '/ko/': [
        {
            text: '시작하기',
            collapsed: false,
            items: [
                { text: 'RedGPU 시작하기', link: '/ko/introduction/getting-started' }
            ]
        },
        {
            text: '핵심 개념',
            collapsed: false,
            items: [
                { text: 'RedGPU Context', link: '/ko/core-concepts/redgpu-context' },
                { text: 'Scene', link: '/ko/core-concepts/scene' },
                { text: 'Camera', link: '/ko/core-concepts/camera' },
                { text: 'Controller', link: '/ko/core-concepts/controller' },
                { text: 'Mesh', link: '/ko/core-concepts/mesh' },
                { text: 'Scene Graph', link: '/ko/core-concepts/scene-graph' },
                { text: 'Texture', link: '/ko/core-concepts/texture' },
                { text: 'Light', link: '/ko/core-concepts/light' },
                { text: 'Shadow)', link: '/ko/core-concepts/shadow' },
                { text: 'Model Loading (GLTF)', link: '/ko/core-concepts/gltf-loader' },
            ]
        }
    ],
    '/en/': [
        {
            text: 'Introduction',
            collapsed: false,
            items: [
                { text: 'Getting Started', link: '/en/introduction/getting-started' }
            ]
        },
        {
            text: 'Core Concepts',
            collapsed: false,
            items: [
                { text: 'RedGPU Context', link: '/en/core-concepts/redgpu-context' },
                { text: 'Scene', link: '/en/core-concepts/scene' },
                { text: 'Camera', link: '/en/core-concepts/camera' },
                { text: 'Controller', link: '/en/core-concepts/controller' },
                { text: 'Mesh', link: '/en/core-concepts/mesh' },
                { text: 'Scene Graph', link: '/en/core-concepts/scene-graph' },
                { text: 'Texture', link: '/en/core-concepts/texture' },
                { text: 'Light', link: '/en/core-concepts/light' },
                { text: 'Shadow', link: '/en/core-concepts/shadow' },
                { text: 'Model Loading (GLTF)', link: '/en/core-concepts/gltf-loader' },
            ]
        }
    ]
};

/**
 * 3. 사이드바 병합 (Manual + API)
 */
const finalSidebar = {};
// generateSidebar가 '/ko/', '/en/' 키가 아닌 '/ko', '/en' (슬래시 없음) 또는 다른 형태로 반환할 수 있으므로 확인 필요.
// 보통 vitepress-sidebar는 path에 맞게 키를 생성함.
// 안전하게 병합하기 위해 languages 루프 사용.

languages.forEach(lang => {
    const key = `/${lang.code}/`;
    // API 사이드바가 존재하면 가져오고, 없으면 빈 배열
    const apiItems = rawApiSidebar[key] || rawApiSidebar[`/${lang.code}`] || [];
    
    // API 섹션에 제목 추가
    const formattedApiItems = apiItems.length > 0 ? [{
        text: 'API Reference',
        collapsed: true,
        items: apiItems
    }] : [];

    // 최종 병합: 매뉴얼 -> API 순서
    finalSidebar[key] = [
        ...manualSidebar[key],
        ...apiItems // API 사이드바 구조 자체가 섹션 배열이므로 그대로 붙임
    ];
});


/**
 * 4. VitePress Main Configuration
 */
export default withMermaid(defineConfig({
    title: 'RedGPU',
    description: 'RedGPU - WebGPU based 3D Graphics Engine',
    base: '/RedGPU/manual/',
    ignoreDeadLinks: true,
    lastUpdated: true,

    // 다국어 로케일 설정
    locales: Object.fromEntries(
        languages.map(lang => [
            lang.code === 'en' ? 'root' : lang.code, // 영어를 기본(root)으로 설정
            {
                label: lang.label,
                lang: lang.code,
                link: `/${lang.code}/`,
                themeConfig: {
                    nav: [
                        { text: 'Getting Started', link: lang.entry },
                        { text: 'API Reference', link: `/${lang.code}/api/RedGPU-API/namespaces/RedGPU/README` },
                        { text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/' },
                    ],
                }
            }
        ])
    ),

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
        if (pageData.relativePath.includes('api/RedGPU-API/')) {
            pageData.frontmatter.pageClass = 'api-page-layout';
        }
    },
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
    themeConfig: {
        logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
        logoLink: '/RedGPU/manual',

        sidebar: finalSidebar,

        socialLinks: [
            { icon: 'github', link: 'https://github.com/redcamel/RedGPU' },
            { icon: 'x', link: 'https://x.com/redcamel15' }
        ],

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