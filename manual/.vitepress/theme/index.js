import DefaultTheme from 'vitepress/theme'
import {h} from 'vue'
import './custom.css'
import ExampleFrame from './components/ExampleFrame.vue'
import GlobalFooter from './components/GlobalFooter.vue'

import pkg from '../../../package.json' with {type: 'json'}

export default {
    extends: DefaultTheme,

    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-title-after': () => h('span', {class: 'version-tag'}, ` V${pkg.version}`),
            'layout-bottom': () => h(GlobalFooter),
        })
    },

    enhanceApp({app, router}) {

        app.component('ExampleFrame', ExampleFrame)
    }
}