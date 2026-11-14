---
title: Post-Effect
order: 9
---

# 포스트 이펙트

포스트 이펙트 (Post-Effect)는 3D 씬의 G-Buffer 렌더링이 완료된 후, 컴퓨트 셰이더 기반 파이프라인을 통해 최종 화면에 공간 광원 효과, 색보정, 렌즈 효과 및 안티앨리어싱을 적용하는 후처리
시스템입니다.

<script setup>
const postEffectGraph = `
    graph TB
        subgraph HDR ["1. HDR 빌트인 이펙트 및 시간 누적 단계"]
            direction TB
            SA["SkyAtmosphere / SSAO / SSR / Fog / HeightFog"]:::pipelineNode
            TAA["TAA / AutoExposure"]:::pipelineNode
            OPT["DOF / Bloom / LensFlare"]:::pipelineNode
            SA --> TAA --> OPT
        end

        subgraph LDR ["2. 톤 매핑 및 LDR 후처리 단계"]
            direction TB
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            BLDR["BuiltIn LDR (색수차 / 왜곡 / 비네팅 / 그레인)"]:::pipelineNode
            ULDR["PostEffectManager (사용자 커스텀 LDR 체인)"]:::pipelineNode
            TM --> BLDR --> ULDR
        end

        subgraph Final ["3. 디버거 격리 및 최종 출력 단계"]
            direction TB
            DBG["DebuggerRenderer (오버레이 패스)"]:::pipelineNode
            AA["FinalRender (Fused FXAA / TAA CAS)"]:::pipelineNode
            DBG --> AA
        end

        HDR --> LDR --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style LDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`
</script>

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 1. 제어 인터페이스

`View3D` 는 후처리 목적에 따라 세 개의 매니저 속성을 제공하며, 실제 파이프라인 실행과 텍스처 풀링(`PostEffectTexturePool`)은 `PostEffectManager` 가 통합 관리합니다.

- **`view.builtInEffectManager`**: 시스템 표준 빌트인 이펙트 12종(`SSAO`, `SSR`, `Fog`, `HeightFog`, `AutoExposure`, `DOF`, `Bloom`,
  `LensFlare`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`)의 활성화 및 세부 속성을 제어합니다.
- **`view.postEffectManager`**: 사용자 커스텀 LDR 이펙트 체인(`addEffect`, `removeEffect`)을 관리하고 전체 후처리 파이프라인을 실행합니다.
- **`view.toneMappingManager`**: HDR 데이터를 디스플레이 출력 범위(LDR)로 변환하는 톤 매핑 알고리즘(`mode`), 대비(`contrast`), 밝기(`brightness`)를
  제어합니다.

---

## 2. 렌더링 파이프라인 실행 순서

`PostEffectManager` 는 물리적 정확도와 화질 보존을 위해 아래 3단계 순서로 후처리를 수행합니다.

1. **HDR 빌트인 이펙트 및 시간 누적 단계**
    - 씬의 원본 HDR 컬러 및 G-Buffer(깊이, 노말, 모션 벡터)를 활용하여 `SkyAtmosphere`, `SSAO`, `SSR`, `Fog`, `HeightFog` 를 순차적으로 실행합니다.
    - `TAA` 가 활성화된 경우 톤 매핑 이전 HDR 상태에서 시간 누적을 수행한 뒤 `AutoExposure`, `DOF`, `Bloom`, `LensFlare` 를 차례로 적용합니다.
2. **톤 매핑 및 LDR 후처리 단계**
    - `ToneMappingManager` 가 HDR 결과를 `rgba8unorm` LDR 색공간으로 변환합니다.
    - 이어서 빌트인 LDR 이펙트(`ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`)가 적용된 후,
      `view.postEffectManager.addEffect()` 로 등록한 사용자 커스텀 LDR 이펙트 체인이 순차 실행됩니다.
3. **디버거 격리 및 최종 출력 단계**
    - `DebuggerRenderer` 가 모든 후처리 이후 격리된 오버레이 패스로 그리드와 디버그 기즈모를 렌더링하여 `AutoExposure` 나 `DOF` 간섭을 방지합니다.
    - `FinalRender` 패스에 통합된 `FXAA` 또는 `TAA CAS` 선명화 필터를 거쳐 최종 스왑체인 이미지를 완성합니다.

---

## 3. 세부 구성 요소

1. **[빌트인 이펙트](./builtin-effects.md)**: `BuiltInEffectManager` 를 통해 `SSAO`, `SSR`, `Fog`, `AutoExposure`, `DOF`,
   `Bloom`, `LensFlare` 등 12종의 표준 이펙트를 제어합니다.
2. **[톤 매핑](./tone-mapping.md)**: `ToneMappingManager` 를 통해 HDR 씬의 색감과 노출을 LDR 화면 범위로 매핑합니다.
3. **[일반 이펙트](./general-effects.md)**: `addEffect()` 를 통해 블러, 색조 보정, 샤픈, 컨볼루션 등 사용자 커스텀 LDR 필터 체인을 구성합니다.

---

## 관련 예제

- [SSAO (화면 공간 주변광 차폐)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
- [SSR (화면 공간 반사)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/)
- [피사계 심도 (Depth of Field)](/RedGPU/examples/postEffect/builtIn/lens/dof/)
- [블룸 (Bloom)](/RedGPU/examples/postEffect/builtIn/lens/bloom/)
- [렌즈 플레어 (SkyAtmosphere)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
- [렌즈 플레어 (SkyBox)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyBox/)

---

[다음 단계: 빌트인 이펙트 배우기](./builtin-effects.md)
