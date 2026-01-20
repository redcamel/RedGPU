<template>
  <div class="mermaid-responsive-container">
    <div v-if="!isMobile" class="desktop-view" v-html="desktopSvg"></div>
    <div v-else class="mobile-view" v-html="mobileSvg"></div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick, watch} from 'vue'
import mermaid from 'mermaid'

const props = defineProps({
  definition: {
    type: String,
    required: true,

  }
})

const desktopSvg = ref('')
const mobileSvg = ref('')
const isMobile = ref(false)

// 모바일 감지 기준 너비 (768px)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1600
}

const renderCurrentDiagram = async () => {
  if (!props.definition) return;

  // 현재 상태에 필요한 이미지가 이미 있다면 렌더링 스킵 (Lazy Loading)
  if (isMobile.value && mobileSvg.value) return;
  if (!isMobile.value && desktopSvg.value) return;

  await nextTick()
  const baseDefinition = props.definition.trim();
  // 기존 정의에 graph 방향이 있다면 제거 (우리가 제어하기 위해)
  let content = baseDefinition.replace(/^graph (TD|LR|TB|BT|RL)/m, '');

  const currentIsMobile = isMobile.value; // 렌더링 시작 시점의 상태 캡처
  const id = `mermaid-${currentIsMobile ? 'mobile' : 'desktop'}-${Date.now()}`
  const direction = currentIsMobile ? 'TD' : 'LR'

  try {
    const {svg} = await mermaid.render(id, `graph ${direction}\n${content}`)

    // 렌더링이 끝난 후 상태에 맞게 저장
    if (currentIsMobile) {
      mobileSvg.value = svg
    } else {
      desktopSvg.value = svg
    }
  } catch (e) {
    console.error(`Mermaid ${currentIsMobile ? 'Mobile' : 'Desktop'} Render Error:`, e)
    const errorHtml = `<pre class="error">${e.message}</pre>`
    if (currentIsMobile) mobileSvg.value = errorHtml
    else desktopSvg.value = errorHtml
  }
}

// 정의가 바뀌면 캐시 초기화 및 다시 렌더링
watch(() => props.definition, () => {
  desktopSvg.value = ''
  mobileSvg.value = ''
  renderCurrentDiagram()
})

// 화면 크기 변경으로 모바일/데스크탑 모드가 바뀌면 필요한 다이어그램 렌더링 확인
watch(isMobile, renderCurrentDiagram)

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables :{
      fontFamily: 'var(--vp-font-family-base)',
    }
  })

  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  await renderCurrentDiagram()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.mermaid-responsive-container {
  margin: 20px 0;
  overflow-x: auto; /* 다이어그램이 클 경우 스크롤 허용 */
}

/* 
 mermaid 렌더링 결과 내부의 svg 스타일 조정 
 v-html로 주입되므로 deep selector가 필요할 수 있으나,
 mermaid 자체가 svg에 스타일을 포함하므로 기본 컨테이너 스타일만 지정
*/
.desktop-view, .mobile-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.error {
  color: #ff4d4f;
  font-size: 0.85em;
  background: rgba(255, 77, 79, 0.1);
  padding: 10px;
  border-radius: 4px;
}
</style>