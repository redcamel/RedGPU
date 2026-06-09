---
title: Post-Effect 개요
order: 9
---

# 포스트 이펙트

포스트 이펙트는 3D 씬 렌더링이 완료된 후, 최종 2D 이미지에 시각적 효과를 더하는 기술입니다. RedGPU의 후처리 시스템은 **설정의 편의성**과 **실행의 효율성**을 위해 이원화된 인터페이스를 제공합니다.

<script setup>
const postEffectGraph = `
    graph TB
        subgraph Control ["Control Interface (API)"]
            direction TB
            TMM["view.toneMappingManager"]:::controlNode
            PEM["view.postEffectManager"]:::controlNode
        end

        subgraph HDR ["1. HDR Phase (Scene Components)"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (Built-in)"]:::pipelineNode
            SSR["SSR (Built-in)"]:::pipelineNode
            SA --> SSAO --> SSR
        end

        subgraph Transition ["2. Transition Phase (Exposure & User Effects)"]
            direction TB
            AE["AutoExposure"]:::pipelineNode
            GE["User General Effects (Loop)"]:::pipelineNode
            TM["Tone Mapping"]:::pipelineNode
            AE --> GE --> TM
        end

        AA["3. LDR Phase (FXAA / TAA)"]:::pipelineNode

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Transition
    Control --> HDR
    HDR --> Transition
    Transition --> AA

    classDef controlNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    
    style Control fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
`
</script>

## 1. 시스템 구조: 제어와 실행

사용자는 목적에 따라 두 개의 매니저를 통해 후처리를 제어하지만, 실제 연산은 `PostEffectManager` 가 총괄하는 하나의 파이프라인 내에서 순차적으로 실행됩니다.

*   **ToneMappingManager** (`view.toneMappingManager`): 씬의 가장 기본적인 색조, 노출, 대비 등 **색상 변환 설정**을 담당하는 전용 창구입니다.
*   **PostEffectManager** (`view.postEffectManager`): 일반 이펙트의 추가/삭제 및 파이프라인의 **전체 실행**을 담당합니다.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 2. 렌더링 파이프라인 흐름

모든 효과는 아래 순서에 따라 처리됩니다. 이 순서는 그래픽스 최적화와 시각적 결과의 일관성을 위해 고정되어 있습니다.

1. **HDR Phase (장면 구성 요소)**: `SkyAtmosphere`, `SSAO`(SSAO), `SSR`(실시간 반사) 등 물리적인 씬 정보를 조립하는 단계입니다.
2. **Exposure & Transition (노출 및 톤매핑 전환)**:
    * `AutoExposure`(자동 노출) 연산이 수행됩니다.
    * 사용자가 `addEffect()`로 등록한 **일반 이펙트** 루프를 실행합니다.
    * 루프 도중 첫 번째 LDR(Low Dynamic Range) 이펙트를 만나는 시점에 즉시 **Tone Mapping**을 수행하며, 만약 루프가 끝날 때까지 수행되지 않았다면 루프 종료 시점에 수행합니다.
3. **LDR Phase (안티앨리어싱)**: 최종 이미지를 보정하는 마지막 단계로, 활성화 상태에 따라 `FXAA` 또는 `TAA` (및 `TAASharpen`) 연산이 수행됩니다.

::: tip [라이브 데모]
[RedGPU 공식 예제 페이지](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect)에서 모든 효과의 실시간 작동 모습을 확인할 수 있습니다.
:::

## 3. 학습 가이드

*   **[일반 이펙트](./general-effects.md)** : 블룸, 블러, 흑백 등 다양한 효과 추가하기
*   **[톤 매핑](./tone-mapping.md)** : 씬의 기본 색감과 노출 설정하기
*   **[빌트인 이펙트](./builtin-effects.md)** : SSAO, SSR 등 고성능 효과 활성화하기
* **[안티앨리어싱](../antialiasing/index.md)** : 화면 외곽선 정리하기