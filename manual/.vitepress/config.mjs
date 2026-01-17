import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';

// 1. 사이드바 자동 생성 설정
const sidebarConfig = generateSidebar([
    {
        // 한국어 매뉴얼 설정
        documentRootPath: 'manual',
        scanStartPath: 'ko',
        resolvePath: '/ko/',
        useTitleFromFileHeading: true,
        useFolderTitleFromIndexFile: true,
        hyphenToSpace: true,
    },
    {
        // API 문서 설정
        documentRootPath: 'manual',
        scanStartPath: 'api/RedGPU-API/namespaces/RedGPU',
        resolvePath: '/api/RedGPU-API/namespaces/RedGPU/',
        capitalizeFirst: true,
        useFolderTitleFromIndexFile: true,
        indexFile: 'README.md',
        useFolderLinkFromIndexFile:true,

        recursive: true,
        collapsed: true,
        // sortMenusByName: true,
        collapseDepth: 2,
        sortMenusByFrontmatterOrder:true
    }
]);
// 1. 정렬 함수 수정: 객체와 배열 구조 모두 대응
const sortSidebar = (sidebar) => {
    // 사이드바가 객체 형태인 경우 (VitePress Multi-sidebar 구조)
    if (!Array.isArray(sidebar) && typeof sidebar === 'object') {
        const newSidebar = {};
        for (const [key, value] of Object.entries(sidebar)) {
            newSidebar[key] = sortSidebar(value); // 재귀 호출
        }
        return newSidebar;
    }

    // 배열인 경우 실제 아이템 정렬
    if (Array.isArray(sidebar)) {
        return sidebar
            .map(item => {
                if (item.items) {
                    item.items = sortSidebar(item.items);
                }
                return item;
            })
            .sort((a, b) => {
                // README.md 또는 index.md 인지 확인
                // vitepress-sidebar는 index 파일을 보통 link: "/path/" 형태로 만듭니다.
                const aIsIndex = a.text.toLowerCase().includes('readme') || a.link?.endsWith('/') || a.link?.endsWith('README');
                const bIsIndex = b.text.toLowerCase().includes('readme') || b.link?.endsWith('/') || b.link?.endsWith('README');

                if (aIsIndex && !bIsIndex) return -1;
                if (!aIsIndex && bIsIndex) return 1;
                return 0;
            });
    }

    return sidebar;
};

export default defineConfig({
    title: 'RedGPU',
    description: 'RedGPU WebGPU 기반 3D 그래픽 엔진',

    base: '/RedGPU/manual/',
    ignoreDeadLinks: true,

    markdown: {
        config: (md) => {
            const defaultRender = md.renderer.rules.html_block || ((tokens, idx) => tokens[idx].content);

            md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
                const content = tokens[idx].content;

                // <iframe> 태그를 찾아서 <ExampleFrame>으로 교체
                if (content.trim().startsWith('<iframe')) {
                    return content
                        .replace(/<iframe/g, '<ExampleFrame')
                        .replace(/<\/iframe>/g, '</ExampleFrame>');
                }

                return defaultRender(tokens, idx, options, env, self);
            };
        }
    },

    locales: {
        root: {
            label: '한국어',
            lang: 'ko',
            link: '/ko/'
        }
    },

    lastUpdated: true,

    themeConfig: {
        logo: {
            light: '/logo-light.svg',
            dark: '/logo-dark.svg',
        },
        logoLink: 'https://redcamel.github.io/RedGPU/',
        lastUpdated: {
            text: '마지막 업데이트',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/redcamel/RedGPU' },
            { icon: 'x', link: 'https://x.com/redcamel15' }
        ],
        nav: [
            { text: 'Manual home', link: '/' },
            { text: '시작하기', link: '/ko/introduction/getting-started' },
            { text: 'API', link: '/api/RedGPU-API/namespaces/RedGPU/README' },
            { text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/', target: '_self' },
        ],

        sidebar: sortSidebar(sidebarConfig),

        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: 'Search',
                                buttonAriaLabel: 'Search'
                            },
                            modal: {
                                displayDetails: 'Display detailed list',
                                resetButtonTitle: 'Reset query',
                                backButtonTitle: 'Go back',
                                noResultsText: 'No results for',
                                footer: {
                                    selectText: 'to select',
                                    navigateText: 'to navigate',
                                    closeText: 'to close'
                                }
                            }
                        }
                    }
                }
            }
        },
    }
})