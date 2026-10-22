<script setup>
import {computed} from 'vue'
import {useData, withBase} from 'vitepress'

const {page} = useData()

const isKo = computed(() => {
  return page.value.relativePath?.startsWith('ko/')
})

const localePrefix = computed(() => (isKo.value ? '/ko' : '/en'))

const topics = computed(() => {
  const prefix = localePrefix.value
  if (isKo.value) {
    return [
      {title: '컨텍스트 (Context)', desc: '초기화 및 전역 설정', link: `${prefix}/context/`},
      {title: '뷰 시스템 (View)', desc: 'Scene · View3D · Camera', link: `${prefix}/view-system/`},
      {title: '기본 객체 (Objects)', desc: 'Mesh · 씬 그래프 · 텍스처', link: `${prefix}/basic-objects/`},
      {title: '조명과 그림자', desc: 'PBR · 라이트 · 캐스케이드 섀도우', link: `${prefix}/lighting-and-shadow/`},
      {title: '환경 설정', desc: 'IBL · SkyBox · SkyAtmosphere', link: `${prefix}/environment/`},
      {title: '에셋 및 로더', desc: 'glTF 2.0 · 스프라이트 · 파티클', link: `${prefix}/assets/`},
      {title: '포스트 이펙트', desc: 'SSR · DOF · Bloom · 톤 매핑', link: `${prefix}/post-effect/`},
      {title: '안티앨리어싱', desc: 'TAA · FXAA · MSAA', link: `${prefix}/antialiasing/`},
      {title: 'LOD 시스템', desc: '거리 기반 메시 · 인스턴스 최적화', link: `${prefix}/lod/`},
      {title: '랜드스케이프', desc: '대규모 지형 · 식생(Foliage & Grass)', link: `${prefix}/landscape/`},
      {title: '워터 (Water)', desc: '실시간 수면 렌더링', link: `${prefix}/water/`},
      {title: '인스펙터 (Inspector)', desc: '실시간 씬 디버깅 및 프로파일링', link: `${prefix}/inspector/`}
    ]
  }
  return [
    {title: 'Context', desc: 'Initialization & global settings', link: `${prefix}/context/`},
    {title: 'View System', desc: 'Scene · View3D · Camera', link: `${prefix}/view-system/`},
    {title: 'Basic Objects', desc: 'Mesh · Scene graph · Textures', link: `${prefix}/basic-objects/`},
    {title: 'Lighting & Shadow', desc: 'PBR · Lights · Cascaded shadows', link: `${prefix}/lighting-and-shadow/`},
    {title: 'Environment', desc: 'IBL · SkyBox · SkyAtmosphere', link: `${prefix}/environment/`},
    {title: 'Assets & Loaders', desc: 'glTF 2.0 · Sprites · Particles', link: `${prefix}/assets/`},
    {title: 'Post-Effect', desc: 'SSR · DOF · Bloom · Tone mapping', link: `${prefix}/post-effect/`},
    {title: 'Anti-Aliasing', desc: 'TAA · FXAA · MSAA', link: `${prefix}/antialiasing/`},
    {title: 'LOD System', desc: 'Mesh & instanced LOD optimization', link: `${prefix}/lod/`},
    {title: 'Landscape', desc: 'Terrain · Foliage & Grass scatter', link: `${prefix}/landscape/`},
    {title: 'Water', desc: 'Real-time water surface rendering', link: `${prefix}/water/`},
    {title: 'Inspector', desc: 'Real-time scene debugging & profiling', link: `${prefix}/inspector/`}
  ]
})
</script>

<template>
  <div class="VPHomeVideo">
    <div class="container">
      <!-- 1. 쇼케이스 영상 -->
      <div class="home-section">
        <div class="section-header">
          <h2 class="section-title">{{ isKo ? '엔진 쇼케이스' : 'Engine Showcase' }}</h2>
          <p class="section-desc">
            {{
              isKo ? 'WebGPU 기반으로 실시간 구동되는 RedGPU의 렌더링 데모 영상입니다.' : 'Real-time rendering showcase powered by RedGPU.'
            }}
          </p>
        </div>
        <div class="hero-video-container">
          <video
              autoplay
              class="hero-video"
              controls
              loop
              muted
              playsinline
          >
            <source src="https://github.com/user-attachments/assets/3115b699-9b3e-45f2-9e3b-682db04bcc03"
                    type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <!-- 2. 주요 매뉴얼 토픽 바로가기 -->
      <div class="home-section">
        <div class="section-header">
          <h2 class="section-title">{{ isKo ? '주요 매뉴얼 토픽' : 'Explore Documentation' }}</h2>
          <p class="section-desc">
            {{
              isKo ? 'RedGPU의 핵심 시스템과 렌더링 파이프라인 가이드를 주제별로 바로 확인하세요.' : 'Jump directly into core systems and rendering pipeline guides.'
            }}
          </p>
        </div>
        <div class="topic-grid">
          <a
              v-for="item in topics"
              :key="item.link"
              :href="withBase(item.link)"
              class="topic-card"
          >
            <div class="topic-card-header">
              <span class="topic-title">{{ item.title }}</span>
              <span class="topic-arrow">→</span>
            </div>
            <span class="topic-desc">{{ item.desc }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPHomeVideo {
  margin: 24px 24px 0;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.home-section {
  margin-top: 48px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
  margin: 0 0 6px;
  border: none;
  padding: 0;
}

.section-desc {
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .topic-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .topic-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.topic-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.topic-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.topic-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.topic-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.topic-arrow {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease, color 0.2s ease;
}

.topic-card:hover .topic-title,
.topic-card:hover .topic-arrow {
  color: var(--vp-c-brand-1);
}

.topic-card:hover .topic-arrow {
  transform: translateX(3px);
}

.topic-desc {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.hero-video-container {
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
}

.hero-video {
  width: 100%;
  height: auto;
  display: block;
}

@media (min-width: 640px) {
  .VPHomeVideo {
    padding: 0 48px;
    margin: 48px 0 0;
  }
}

@media (min-width: 960px) {
  .VPHomeVideo {
    padding: 0 64px;
  }
}
</style>
