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
      {title: '시작하기 (Getting Started)', desc: '엔진 도입 및 첫 3D 씬 구성', link: `${prefix}/introduction/`},
      {title: '컨텍스트 (Context)', desc: '초기화 및 전역 설정', link: `${prefix}/context/`},
      {title: '뷰 시스템 (View System)', desc: 'Scene · View3D · Camera', link: `${prefix}/view-system/`},
      {title: '기본 객체 (Basic Objects)', desc: 'Mesh · Geometry · Material · 텍스처', link: `${prefix}/basic-objects/`},
      {title: '조명과 그림자', desc: 'PBR · 라이트 · 캐스케이드 섀도우', link: `${prefix}/lighting-and-shadow/`},
      {title: '환경 설정 (Environment)', desc: 'SkyBox · IBL · 안개 · 전역 바람', link: `${prefix}/environment/`},
      {title: '확장 객체 (Extended Objects)', desc: 'glTF 2.0 · 인스턴스 메시 · 스프라이트 · 텍스트', link: `${prefix}/extended-objects/`},
      {title: '사용자 인터랙션', desc: '마우스 피킹 및 키보드 이벤트', link: `${prefix}/interaction/`},
      {title: '포스트 이펙트', desc: 'SSR · DOF · Bloom · 톤 매핑', link: `${prefix}/post-effect/`},
      {title: 'LOD 시스템', desc: '거리 기반 메시 · 인스턴스 최적화', link: `${prefix}/lod/`},
      {title: '안티앨리어싱', desc: 'TAA · MSAA · FXAA', link: `${prefix}/antialiasing/`},
      {title: '랜드스케이프 (Landscape)', desc: '지형 · 스플래팅 · 타일 스트리밍 · 잔디 · 식생', link: `${prefix}/landscape/`},
      {title: '워터 (Water)', desc: '물리 기반 호수 · 수면 파동 인터랙션', link: `${prefix}/water/`},
      {title: '플러그인 (Plugins)', desc: '캐릭터 컨트롤러 · 물리 엔진', link: `${prefix}/plugins/`},
      {title: '인스펙터 (Inspector)', desc: '실시간 씬 디버깅 및 프로파일링', link: `${prefix}/inspector/`}
    ]
  }
  return [
    {title: 'Getting Started', desc: 'Quick start & first 3D scene setup', link: `${prefix}/introduction/`},
    {title: 'Context', desc: 'Initialization & global settings', link: `${prefix}/context/`},
    {title: 'View System', desc: 'Scene · View3D · Camera', link: `${prefix}/view-system/`},
    {title: 'Basic Objects', desc: 'Mesh · Geometry · Material · Textures', link: `${prefix}/basic-objects/`},
    {title: 'Lighting & Shadow', desc: 'PBR · Lights · Cascaded shadows', link: `${prefix}/lighting-and-shadow/`},
    {title: 'Environment', desc: 'SkyBox · IBL · Fog · Global Wind', link: `${prefix}/environment/`},
    {title: 'Extended Objects', desc: 'glTF 2.0 · InstancedMesh · Sprites · Text', link: `${prefix}/extended-objects/`},
    {title: 'Interaction', desc: 'Mouse picking & keyboard events', link: `${prefix}/interaction/`},
    {title: 'Post-Effect', desc: 'SSR · DOF · Bloom · Tone mapping', link: `${prefix}/post-effect/`},
    {title: 'LOD System', desc: 'Mesh & instanced LOD optimization', link: `${prefix}/lod/`},
    {title: 'Anti-Aliasing', desc: 'TAA · MSAA · FXAA', link: `${prefix}/antialiasing/`},
    {title: 'Landscape', desc: 'Terrain · Splatting · Streaming · Grass · Foliage', link: `${prefix}/landscape/`},
    {title: 'Water', desc: 'Physically based lake & wave interaction', link: `${prefix}/water/`},
    {title: 'Plugins', desc: 'Character controller & physics engine', link: `${prefix}/plugins/`},
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
            <source src="https://github.com/user-attachments/assets/e46b2e21-3173-43fb-948f-a68f6fcfb424"
                    type="video/mp4">
            Your browser does not support the video tag.
          </video>
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
