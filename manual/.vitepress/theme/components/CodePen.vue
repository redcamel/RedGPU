<template>
  <div ref="root" class="codepen-container">
    <div 
      class="codepen"
      :data-height="height"
      data-theme-id="dark"
      data-default-tab="result"
      :data-slug-hash="slugHash"
      data-editable="true"
      data-user="redcamel"
      :data-prefill="prefillJson"
      style="width: 100%; margin-top: 20px;"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'

const props = defineProps({
  title: { type: String, default: 'RedGPU Example' },
  height: { type: String, default: '500' },
  slugHash: { type: String, default: 'redgpu-example' }
})

const root = ref(null)

const prefillJson = computed(() => {
    return JSON.stringify({
        title: props.title,
        description: "RedGPU Example",
        tags: ["redgpu", "webgpu", "3d"],
        head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        scripts: [],
        stylesheets: []
    })
})

onMounted(async () => {
    if (typeof window !== 'undefined') {
        const SCRIPT_URL = "https://cpwebassets.codepen.io/assets/embed/ei.js";
        
        // 1. 스크립트 로드 확인 및 삽입
        const loadScript = () => {
          return new Promise((resolve) => {
            if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
                resolve();
            } else {
                const script = document.createElement('script');
                script.src = SCRIPT_URL;
                script.async = true;
                script.onload = resolve;
                document.body.appendChild(script);
            }
          });
        };

        await loadScript();
        
        // 2. DOM이 완전히 렌더링된 후 CodePen 스크립트 실행
        await nextTick();
        
        // SPA 네비게이션 대응을 위해 약간의 지연 후 호출
        setTimeout(() => {
            if (window.__CPEmbed) {
                window.__CPEmbed();
            }
        }, 100);
    }
})
</script>

<style scoped>
.codepen-container {
    width: 100%;
    min-height: 200px;
}
</style>