<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  height: {
    type: String,
    default: '600px'
  }
})

const isMounted = ref(false)
const originUrl = ref('')

onMounted(() => {
  isMounted.value = true
  // 브라우저에서 현재의 도메인(origin)을 가져옵니다.
  originUrl.value = window.location.origin
})

const computedSrc = computed(() => {
  // 1. 아직 마운트되지 않았으면 빈 값 반환
  if (!isMounted.value) return ''

  // 2. 절대 경로(http/https)인 경우: 그대로 반환
  if (props.src.startsWith('http://') || props.src.startsWith('https://')) {
    return props.src
  }

  // 3. 상대 경로인 경우: originUrl과 결합
  // src가 /로 시작하지 않으면 중간에 /를 넣어줍니다.
  const path = props.src.startsWith('/') ? props.src : `/${props.src}`
  return `${originUrl.value}${path}`
})
</script>

<template>
  <div v-if="isMounted" class="example-frame">
    <div class="url-debug">{{ computedSrc }}</div>

    <iframe
        :src="computedSrc"
        :style="{ height: props.height }"
        width="100%"
        frameborder="0"
        loading="lazy"
    />
  </div>
</template>

<style scoped>
.example-frame {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.url-debug {
  padding: 4px 12px;
  background-color: var(--vp-c-bg-soft);
  font-size: 11px;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
  word-break: break-all;
}

.example-frame iframe {
  display: block;
  width: 100%;
}
</style>