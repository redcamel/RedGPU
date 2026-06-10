<script setup>
import {computed} from 'vue'

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

// 호스트 주소 설정
const HOST = ''

// src가 외부 링크인지 확인하고, 상대 경로라면 호스트를 붙임
const resolvedSrc = computed(() => {
  // 이미 전체 URL(http/https)이 포함되어 있다면 그대로 반환
  if (/^(http|https):\/\//.test(props.src)) {
    return props.src
  }

  // HOST가 지정되어 있다면 결합하고, 비어 있다면 원래의 루트 절대 경로를 보존하여 반환합니다.
  if (HOST) {
    const cleanSrc = props.src.startsWith('/') ? props.src.slice(1) : props.src
    return `${HOST}${cleanSrc}`
  }

  return props.src.startsWith('/') ? props.src : '/' + props.src
})
</script>

<template>
  <div class="example-frame">
    <iframe
        :src="resolvedSrc"
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
  background-color: var(--vp-c-bg-soft); /* 로딩 전 배경색 대비 */
}

.example-frame iframe {
  display: block;
  width: 100%;
}
@media (max-width: 1280px) {
  .example-frame iframe{
    height: 600px !important;
  }
}

@media (max-width: 960px) {
  .example-frame iframe{
    height: 700px !important;
  }
}

</style>