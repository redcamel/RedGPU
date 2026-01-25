---
title: Post-Effect 개요
order: 1
---

# 포스트 이펙트 (Post-Effect)

포스트 이펙트는 3D 씬 렌더링이 완료된 후, 최종 2D 이미지에 시각적 효과를 더하는 기술입니다. RedGPU의 후처리 시스템은 **설정의 편의성**과 **실행의 효율성**을 위해 이원화된 인터페이스를 제공합니다.

<script setup>
const postEffectGraph = `
    subgraph Control ["Control Interface (API)"]
        direction LR
        TMM["view.toneMappingManager"]
        PEM["view.postEffectManager"]
    end

    subgraph Pipeline ["Execution Pipeline (GPU)"]
        direction TB
        TM["1. Tone Mapping"]
        CE["2. General Effects (Chained)"]
        SE["3. Screen Space Effects (Built-in)"]
        AA["4. Antialiasing"]
        
        TM --> CE --> SE --> AA
    end

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Pipeline
`
</script>

## 1. 시스템 구조: 제어와 실행

사용자는 목적에 따라 두 개의 매니저를 통해 후처리를 제어하지만, 실제 연산은 `PostEffectManager`가 총괄하는 하나의 파이프라인 내에서 순차적으로 실행됩니다.

*   **ToneMappingManager** (`view.toneMappingManager`): 씬의 가장 기본적인 색조, 노출, 대비 등 **색상 변환 설정**을 담당하는 전용 창구입니다.
*   **PostEffectManager** (`view.postEffectManager`): 일반 이펙트의 추가/삭제 및 파이프라인의 **전체 실행**을 담당합니다.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 2. 렌더링 파이프라인 흐름

모든 효과는 아래 순서에 따라 처리됩니다. 이 순서는 그래픽스 최적화와 시각적 결과의 일관성을 위해 고정되어 있습니다.

1.  **Tone Mapping**: HDR 데이터를 디스플레이 범위로 변환하는 첫 번째 관문입니다.
2.  **General Effects**: `addEffect()`로 추가된 효과들이 등록된 순서대로 체인처럼 연결되어 실행됩니다.
3.  **Screen Space Effects**: SSAO, SSR 등 씬의 깊이 정보를 활용하는 고성능 빌트인 효과가 적용됩니다.
4.  **Antialiasing**: 계단 현상을 제거하는 최종 보정 단계입니다.

::: tip [라이브 데모]
[RedGPU 공식 예제 페이지](https://redcamel.github.io/RedGPU/examples/#postEffect)에서 모든 효과의 실시간 작동 모습을 확인할 수 있습니다.
:::

## 3. 학습 가이드



*   **[일반 이펙트 (General Effects)](./general-effects)**: 블룸, 블러, 흑백 등 다양한 효과 추가하기

*   **[톤 매핑 (Tone Mapping)](./tone-mapping)**: 씬의 기본 색감과 노출 설정하기

*   **[빌트인 이펙트 (Built-in Effects)](./builtin-effects)**: SSAO, SSR 등 고성능 효과 활성화하기
