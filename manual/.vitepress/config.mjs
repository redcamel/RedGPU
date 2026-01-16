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
        sortMenusByName: true,
        collapseDepth: 2,
    }
]);

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

        sidebar: sidebarConfig,

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