import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RedGPU',
  description: 'RedGPU WebGPU 기반 3D 그래픽 엔진',

  base: '/RedGPU/manual/',
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
      // 상대 경로로 두 단계 위로 이동
      { text: 'RedGPU 홈', link: '../../', target: '_self' },
      { text: '매뉴얼 홈', link: '/' },
      { text: '시작하기', link: '/ko/introduction/getting-started' },
      { text: 'API 문서', link: '/api/README' },
      // Examples도 상대 경로로
      { text: 'Examples', link: '../../examples/', target: '_self' }
    ],

    sidebar: {
      '/ko/': [
        {
          text: '소개',
          items: [
            { text: '시작하기', link: '/ko/introduction/getting-started' }
          ]
        },
        {
          text: '핵심 개념',
          items: [
            { text: 'RedGPU Context', link: '/ko/core-concepts/redgpu-context' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: '개요', link: '/api/README' },
            { text: 'Classes', link: '/api/classes/README' },
            { text: 'Functions', link: '/api/functions/README' },
            { text: 'Type Aliases', link: '/api/type-aliases/README' },
            { text: 'Variables', link: '/api/variables/README' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/redcamel/RedGPU' }
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © RedGPU'
    }
  }
})