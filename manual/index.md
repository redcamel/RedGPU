---
layout: home

hero:
  name: RedGPU
  text: 강력한 JavaScript WebGPU 라이브러리
  tagline: 놀라운 2D/3D 그래픽과 고성능 웹 애플리케이션을 위한 엔진
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/introduction/
    - theme: alt
      text: GitHub
      link: https://github.io/redcamel/RedGPU

features:
  - icon: 🎮
    title: 다양한 예제
    details: WebGPU 렌더링 성능을 보여주는 다양한 인터랙티브 예제를 탐험해보세요.
  - icon: 📚
    title: API 문서
    details: RedGPU의 강력한 기능을 활용할 수 있는 완벽한 API 레퍼런스와 문서를 제공합니다.
  - icon: ⚡
    title: 고성능
    details: 차세대 웹 그래픽을 위한 WebGPU의 힘을 활용하여 속도와 효율성을 극대화했습니다.
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const { go } = useRouter()

onMounted(() => {
  // 사용자가 루트(/)로 들어왔을 때, 기본적으로 한국어 소개 페이지로 보냅니다.
  // 브라우저 언어 설정을 체크하여 분기할 수도 있습니다.
  if (location.pathname === '/RedGPU/manual/') {
    const userLang = navigator.language || 'en'
    if (userLang.startsWith('ko')) {
      go('/RedGPU/manual/ko/introduction/')
    } else {
      go('/RedGPU/manual/en/introduction/')
    }
  }
})
</script>
