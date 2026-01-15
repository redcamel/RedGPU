import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
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
  }
}