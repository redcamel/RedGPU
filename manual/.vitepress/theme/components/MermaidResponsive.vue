<template>
  <div class="mermaid-responsive-container" ref="containerRef">
    <div v-if="!isMobile" class="desktop-view" v-html="desktopSvg || loadingHtml"></div>
    <div v-else class="mobile-view" v-html="mobileSvg || loadingHtml"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps({
  definition: {
    type: String,
    required: true
  }
})

const containerRef = ref(null)
const desktopSvg = ref('')
const mobileSvg = ref('')
const isMobile = ref(false)
const loadingHtml = '<div class="mermaid-loading">Rendering diagram...</div>'

const generateUniqueId = (prefix) => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${randomStr}_${Date.now()}`.replace(/-/g, '_');
}

const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 1600
}

const renderCurrentDiagram = async () => {
    if (!props.definition) return;
    
    const currentIsMobile = isMobile.value;
    if (currentIsMobile && mobileSvg.value) return;
    if (!currentIsMobile && desktopSvg.value) return;

    await nextTick()
    
    const baseDefinition = props.definition.trim();
    // 기존 graph 키워드 및 방향 선언 제거
    let content = baseDefinition.replace(/^graph\s+(TD|LR|TB|BT|RL)/m, '');
    const direction = currentIsMobile ? 'TD' : 'LR'
    const id = generateUniqueId(`mermaid_${currentIsMobile ? 'mo' : 'de'}`)
    
    // graph 선언과 내용 사이에 명확한 공백과 줄바꿈 추가
    const finalDefinition = `graph ${direction}\n    ${content}`;
    
    try {
        const { svg } = await mermaid.render(id, finalDefinition)
        
        if (currentIsMobile) mobileSvg.value = svg
        else desktopSvg.value = svg
    } catch (e) {
        console.error('Mermaid Render Error:', e)
        const errorHtml = `<div class="error">Mermaid Error: ${e.message}</div>`
        if (currentIsMobile) mobileSvg.value = errorHtml
        else desktopSvg.value = errorHtml
    }
}

watch(() => props.definition, () => {
    desktopSvg.value = ''
    mobileSvg.value = ''
    renderCurrentDiagram()
})

watch(isMobile, renderCurrentDiagram)

onMounted(async () => {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        themeVariables: {
            darkMode: true,
            background: '#1b1b1f',
            primaryColor: '#252529',
            primaryTextColor: '#F2F2F2',
            primaryBorderColor: '#00CC99',
            lineColor: '#6e6e73',
            secondaryColor: '#161618',
            tertiaryColor: '#161618',
            mainBkg: '#1b1b1f',
            nodeBorder: '#00CC99',
            edgeLabelBackground: '#252529',
            fontFamily: 'var(--vp-font-family-base)',
        }
    })
    
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    setTimeout(renderCurrentDiagram, 100)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.mermaid-responsive-container {
    margin: 20px 0;
    min-height: 50px;
    display: flex;
    justify-content: center;
}
.mermaid-loading {
    font-size: 0.9em;
    color: var(--vp-c-text-3);
    font-style: italic;
}
.desktop-view, .mobile-view {
    width: 100%;
    display: flex;
    justify-content: center;
}
:deep(.error) {
    color: #ff4d4f;
    font-size: 0.8em;
    padding: 10px;
    border: 1px solid #ff4d4f;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>
