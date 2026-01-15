import {defineConfig} from 'vitepress'
import {generateSidebar} from 'vitepress-sidebar';

export default defineConfig({
    title: 'RedGPU',
    description: 'RedGPU WebGPU 기반 3D 그래픽 엔진',


    base: '/RedGPU/manual/',
    ignoreDeadLinks: true,
    cleanUrls: true,

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

    sidebar: generateSidebar([
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
            // API 문서 설정 (가장 중요한 부분)
            documentRootPath: 'manual',
            scanStartPath: 'api',
            resolvePath: '/api/',
            // 폴더명을 제목으로 쓸 때 첫 글자 대문자화
            capitalizeFirst: true,
            // index.md가 있으면 폴더 제목으로 사용
            useFolderTitleFromIndexFile: true,
            // 모든 하위 폴더를 재귀적으로 스캔 (기본값 true)
            recursive: true,
            // 사이드바를 기본적으로 접어둠
            collapsed: true,
            // 'index'라는 글자를 'Overview'로 치환하거나 정렬 제어 가능
            sortMenusByName: true,
        }
    ]),

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
            {icon: 'github', link: 'https://github.com/redcamel/RedGPU'},
            {icon: 'x', link: 'https://x.com/redcamel15'}
        ],
        nav: [
            {text: 'Manual home', link: '/'},
            {text: '시작하기', link: '/ko/introduction/getting-started'},
            {text: 'API', link: '/api/README'},
            {text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/', target: '_self'},
        ],

        sidebar: {
            '/ko/': [
                {
                    text: '소개',
                    items: [
                        {text: '시작하기', link: '/ko/introduction/getting-started'}
                    ]
                },
                {
                    text: '핵심 개념',
                    items: [
                        {text: 'RedGPU Context', link: '/ko/core-concepts/redgpu-context'}
                    ]
                }
            ],
        },
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