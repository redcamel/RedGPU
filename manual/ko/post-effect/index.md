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
        subgraph HDR ["1. HDR Built-in & Temporal Phase"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (useSSAO)"]:::pipelineNode
            SSR["SSR (useSSR)"]:::pipelineNode
            TAA["TAA (Temporal Accumulation)"]:::pipelineNode
            AE["AutoExposure"]:::pipelineNode
            SA --> SSAO --> SSR --> TAA --> AE
        end

        subgraph Transition ["2. User Effects & Tone Mapping Phase"]
            direction TB
            HDR_EFF["HDR Effects (DOF, Bloom, etc.)"]:::pipelineNode
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            LDR_EFF["LDR User Effects (Blur, Fog, etc.)"]:::pipelineNode
            HDR_EFF --> TM --> LDR_EFF
        end

        subgraph Final ["3. LDR Finalization Phase"]
            direction TB
            AA["FXAA / TAA CAS Sharpen"]:::pipelineNode
        end

        HDR --> Transition --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`
</script>

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 1. 제어 인터페이스

`View3D`는 후처리 목적에 따라 세 개의 매니저 속성을 제공하며, 실제 파이프라인 실행과 텍스처 풀링 (`PostEffectTexturePool`)은 `PostEffectManager`가 통합 관리합니다.

- **`view.builtInEffectManager` (`BuiltInEffectManager`)**: 빌트인 이펙트 (`useSSAO`, `useSSR`, `useDOF`, `useBloom`,
  `autoExposure`)의 활성화 및 세부 속성을 제어합니다.
- **`view.postEffectManager` (`PostEffectManager`)**: 일반 이펙트 체인 (`addEffect`,
  `removeEffect`)을 관리하고 전체 후처리 파이프라인을 실행합니다.
- **`view.toneMappingManager` (`ToneMappingManager`)**: HDR 데이터를 디스플레이 출력 범위 (LDR)로 변환하는 톤 매핑 알고리즘 (`mode`), 대비
  (`contrast`), 밝기 (`brightness`)를 제어합니다.

---

## 2. 렌더링 파이프라인 실행 순서

`PostEffectManager`는 물리적 정확도와 화질 보존을 위해 아래 3단계 순서로 후처리를 수행합니다.

1. **HDR 빌트인 및 시간 누적 단계 (`HDR Built-in & Temporal Phase`)**
    - 씬의 원본 HDR 컬러 및 G-Buffer (깊이, 노말, 모션 벡터)를 활용하여 `SkyAtmosphere`, `SSAO`, `SSR`을 순차적으로 합성합니다.
    - `TAA`가 활성화된 경우 톤 매핑 이전의 HDR 상태에서 모션 벡터 기반 시간 누적 (Temporal Accumulation)을 수행하며, 이어서 카메라 자동 노출 (`AutoExposure`) 휘도를
      계산합니다.
2. **사용자 이펙트 및 스마트 톤 매핑 전환 (`User Effects & Tone Mapping Phase`)**
    - `view.postEffectManager.addEffect()`로 등록한 이펙트 배열을 순회합니다.
   - `Bloom` 등 HDR 기반 이펙트 (`isLdr: false`)는 HDR 상태에서 먼저 실행되며, 루프 도중 **최초의 LDR 이펙트 (`isLdr: true`)를 만나는 시점에 즉시
      `ToneMappingManager`가 실행**되어 LDR 색공간으로 전환됩니다 (LDR 이펙트가 없을 경우 루프 종료 직후 톤 매핑 수행).
3. **LDR 마감 단계 (`LDR Finalization Phase`)**
    - 그리드 (`view.grid`)가 활성화된 경우 깊이 버퍼를 참조하여 합성합니다.
    - 안티앨리어싱 설정에 따라 `FXAA` 또는 `TAA`의 적응형 선명화 (`CAS Sharpen`) 패스를 거쳐 최종 이미지를 완성합니다.

---

## 3. 세부 구성 요소

1. **[일반 이펙트](./general-effects.md)**: `addEffect()`를 통해 블룸, 피사계 심도 (DoF), 블러, 안개, 색조 보정 등 다양한 필터 체인을 구성합니다.
2. **[톤 매핑](./tone-mapping.md)**: `ToneMappingManager`를 통해 HDR 씬의 색감과 노출을 LDR 화면 범위로 매핑합니다.
3. **[빌트인 이펙트](./builtin-effects.md)**: G-Buffer와 연동되는 고성능 `SSAO` 및 `SSR` 효과를 활성화합니다.

---

## 관련 예제

- [SSAO (화면 공간 주변광 차폐)](/RedGPU/examples/postEffect/ssao/)
- [SSR (화면 공간 반사)](/RedGPU/examples/postEffect/ssr/)
- [피사계 심도 (Depth of Field)](/RedGPU/examples/postEffect/lens/dof/)
- [블룸 (Bloom)](/RedGPU/examples/postEffect/bloom/)

---

[다음 단계: 일반 이펙트 배우기](./general-effects.md)
