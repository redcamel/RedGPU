import {defineConfig} from 'vitepress'

export default defineConfig({
    title: 'RedGPU',
    description: 'RedGPU WebGPU 기반 3D 그래픽 엔진',

    base: '/RedGPU/manual/', // 이것만 설정
    ignoreDeadLinks: true,


    locales: {
        root: {
            label: '한국어',
            lang: 'ko',
            link: '/ko/'
        }
    },

    themeConfig: {
        nav: [
            {text: 'Manual home', link: '/'},
            {text: 'API', link: '/api/README'},
            {text: 'Examples', link: 'https://redcamel.github.io/RedGPU/examples/', target: '_self'},

            {text: '시작하기', link: '/ko/introduction/getting-started'},

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
            '/api/': [
                {
                    text: 'API Reference',
                    items: [
                        {text: '개요', link: '/api/README'},
                        {text: 'Classes', link: '/api/classes/README'},
                        {text: 'Functions', link: '/api/functions/README'},
                        {text: 'Type Aliases', link: '/api/type-aliases/README'},
                        {text: 'Variables', link: '/api/variables/README'}
                    ]
                }
            ]
        },


        footer: {
            message: 'Released under the ISC License.',
            copyright: 'Copyright © RedGPU'
        }
    }
})