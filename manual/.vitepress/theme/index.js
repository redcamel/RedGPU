import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import ExampleFrame from './components/ExampleFrame.vue'

import pkg from '../../../package.json' with { type: 'json' }

export default {
  extends: DefaultTheme,

  // 2. Layout 슬롯을 사용하여 버전 표시
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-after': () => h('span', { class: 'version-tag' }, ` V${pkg.version}`)
    })
  },

  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined') {
      document.addEventListener('click', (e) => {
        const titleLink = e.target.closest('.VPNavBarTitle a')
        if (titleLink) {
          e.preventDefault()
          const targetPath = 'https://redcamel.github.io/RedGPU/'
          window.location.href = targetPath
        }
      }, true)
    }
    app.component('ExampleFrame', ExampleFrame)
  }
}