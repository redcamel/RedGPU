import DefaultTheme from 'vitepress/theme'
import { h, watch, nextTick } from 'vue'
import { useRouter } from 'vitepress'
import './custom.css'
import './mermaid.css'
import HeroVideo from './components/HeroVideo.vue'
import HomeHeroRenderer from './components/HomeHeroRenderer.vue'
import ExampleFrame from './components/ExampleFrame.vue'
import CodePen from './components/CodePen.vue'
import MermaidResponsive from './components/MermaidResponsive.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import pkg from '../../../package.json' with { type: 'json' }

export default {
    extends: DefaultTheme,

    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-title-after': () => h('span', { class: 'version-tag' }, ` V${pkg.version}`),
            'home-hero-info-before': () => h(HomeHeroRenderer),
            'home-features-after': () => h(HeroVideo),
            'layout-bottom': () => h(GlobalFooter),
        })
    },

    // setup 훅에서 경로 감시 로직 추가
    setup() {
        const { route } = useRouter();

        const fixBreadcrumbs = () => {
            if (typeof window === 'undefined') return;

            // DOM이 완전히 렌더링된 후 실행
            nextTick(() => {
                // vp-doc 내의 모든 링크를 찾음
                const links = document.querySelectorAll('.vp-doc a');

                links.forEach(link => {
                    const text = link.textContent?.trim();

                    // 제거하고 싶은 텍스트 매칭
                    if (text === 'RedGPU API' || text === `RedGPU API v${pkg.version}`) {
                        // 1. 해당 링크 숨기기
                        link.style.display = 'none';

                        // 2. 바로 뒤의 "/" 구분자 제거 (텍스트 노드 탐색)
                        let nextNode = link.nextSibling;
                        if (nextNode && nextNode.nodeType === 3) { // Node.TEXT_NODE
                            if (nextNode.textContent?.includes('/')) {
                                nextNode.textContent = nextNode.textContent.replace('/', '').trim();
                            }
                        }
                    }

                });
            });
        };

        // 경로가 바뀔 때마다 실행
        watch(() => route.path, () => {
            // api 폴더 하위일 때만 작동하도록 조건부 실행 가능
            if (route.path.includes('/api/')) {
                fixBreadcrumbs();
            }
        }, { immediate: true });
    },

    enhanceApp({ app }) {
        app.component('ExampleFrame', ExampleFrame)
        app.component('CodePen', CodePen)
        app.component('MermaidResponsive', MermaidResponsive)
    }
}