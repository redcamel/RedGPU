---
title: Post-Effect
order: 1
---

<script setup>
const postEffectGraph = `
    subgraph Input ["Scene Output"]
        Color["Color Buffer"]
        Depth["Depth Buffer"]
    end

    Input --> Manager["RedGPU.PostEffect.PostEffectManager"]

    subgraph Pipeline ["Pipeline"]
        direction TB
        TM["Tone Mapping"]
        CE["Custom Effects"]
        SE["Spatial Effects"]
        AA["Antialiasing"]
        
        TM --> CE --> SE --> AA
    end

    Manager --> Pipeline
    Pipeline --> Final["Final Display"]
`
</script>

# 포스트 이펙트

**포스트 이펙트**(Post-Effect) 는 3D 씬의 모든 객체가 렌더링된 후, 최종적으로 생성된 2D 이미지에 추가적인 시각 효과를 적용하는 기술입니다. 이를 통해 블러, 블룸, 색상 보정 등 그래픽의 완성도를 높이는 다양한 효과를 구현할 수 있습니다.

## 1. PostEffectManager

RedGPU의 모든 후처리 효과는 `PostEffectManager` 를 통해 관리됩니다. 이 관리자는 각 뷰(**View3D**)가 생성될 때 내부적으로 자동 생성됩니다.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 2. 렌더링 파이프라인 흐름

포스트 이펙트는 씬 렌더링이 완료된 직후에 실행되며, 여러 이펙트가 체인(Chain) 형태로 연결되어 순차적으로 적용됩니다. 파이프라인은 크게 톤 매핑, 커스텀 이펙트, 공간 효과, 안티앨리어싱 단계로 구성됩니다.

## 3. 주요 이펙트 유형

RedGPU는 성능과 시각적 품질을 고려한 다양한 후처리 효과를 제공합니다.

| 분류 | 주요 이펙트 | 사용 방식 | 설명 |
| :--- | :--- | :--- | :--- |
| **톤 변환** | ToneMapping | **Built-in** | HDR 색상 범위를 보정하고 노출, 대비 조절 (View 내장) |
| **공간 효과** | SSAO, SSR | **Built-in** | 화면 공간 정보를 활용한 차폐 및 반사 효과 (속성으로 활성화) |
| **렌즈 효과** | OldBloom, Vignette, Blur | **addEffect** | 빛 번짐, 외곽 어두워짐, 초점 흐림 등 광학적 효과 |
| **색상 보정** | Adjustments | **addEffect** | 특정 색상 영역 보정 및 커스텀 필터링 |
| **특수 효과** | FilmGrain, Fog, Pixelize | **addEffect** | 노이즈 추가, 안개 효과, 픽셀화 등 스타일 연출 |

## 핵심 요약

- **PostEffectManager** 는 `View3D` 에 포함되어 있으며, 모든 후처리를 총괄합니다.
- 후처리는 톤 매핑을 시작으로 체인 형태로 순차 적용됩니다.
- 효과의 특성에 따라 직접 추가하는 방식과 속성으로 활성화하는 방식으로 나뉩니다.

## 다음 학습 추천

- **[일반 이펙트 추가](./custom-effects)**
- **[톤 매핑](./tone-mapping)**
- **[빌트인 이펙트](./builtin-effects)**
