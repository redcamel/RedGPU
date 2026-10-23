---
title: Post-Effect
order: 9
---

# 포스트 이펙트

**포스트 이펙트**(Post-Effect) 는 3D 씬 렌더링이 완료된 후 최종 2D 이미지에 시각적 효과를 적용하는 후처리 시스템입니다. 색상 변환을 담당하는 `ToneMappingManager` 와 파이프라인
실행 및 효과를 제어하는 `PostEffectManager` 로 구성됩니다.

<script setup>
const postEffectGraph = `
    graph TB
        subgraph Control ["제어 인터페이스 (API)"]
            direction TB
            TMM["view.toneMappingManager"]:::controlNode
            PEM["view.postEffectManager"]:::controlNode
        end

        subgraph HDR ["1. HDR 단계 (씬 컴포넌트)"]
            direction TB
            SA["SkyAtmosphere (대기 산란)"]:::pipelineNode
            SSAO["SSAO (차폐 내장 효과)"]:::pipelineNode
            SSR["SSR (반사 내장 효과)"]:::pipelineNode
            SA --> SSAO --> SSR
        end

        subgraph Transition ["2. 전환 단계 (노출 및 일반 이펙트)"]
            direction TB
            AE["AutoExposure (자동 노출)"]:::pipelineNode
            GE["일반 후처리 이펙트 (순차 실행)"]:::pipelineNode
            TM["Tone Mapping (톤 매핑)"]:::pipelineNode
            AE --> GE --> TM
        end

        AA["3. LDR 단계 (FXAA / TAA 및 TAACASPass)"]:::pipelineNode

    TMM -.->|설정 주입| TM
    PEM -.->|관리 및 실행| Transition
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

## 1. 시스템 구조

사용자는 목적에 따라 두 개의 매니저로 후처리를 설정하며, 실제 연산은 `PostEffectManager` 가 총괄하는 단일 파이프라인에서 순차 실행됩니다.

- **`ToneMappingManager`**: `view.toneMappingManager` 속성을 통해 씬의 기본 색조, 노출, 대비 등 색상 변환 설정을 담당합니다.
- **`PostEffectManager`**: `view.postEffectManager` 속성을 통해 자동 노출 (`autoExposure`), 빌트인 이펙트 (`ssao`, `ssr`), 일반 이펙트의
  추가/삭제 및
  파이프라인 전체 실행을 담당합니다.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

---

## 2. 렌더링 파이프라인 흐름

후처리 효과는 그래픽스 최적화와 시각적 일관성을 위해 고정된 순서로 처리됩니다.

1. **HDR Phase**: `SkyAtmosphere`, `SSAO`, `SSR` 등 깊이 정보와 HDR 색역이 필요한 장면 구성 요소를 먼저 합성합니다.
2. **Transition Phase**:
    - 카메라의 `useAutoExposure` 활성화 시 `AutoExposure` 컴퓨트 패스가 적정 노출값을 산출합니다.
    - `addEffect()` 로 등록된 일반 이펙트 루프를 실행합니다.
    - 루프 도중 첫 번째 LDR (Low Dynamic Range) 이펙트를 만나는 시점에 즉시 톤 매핑을 수행하며, LDR 이펙트가 없으면 루프 종료 시점에 수행합니다.
3. **LDR Phase**: 활성화 상태에 따라 `FXAA` 또는 `TAA`(`TAACASPass` 샤프닝 포함) 연산을 수행하여 최종 이미지를 보정합니다.

### 자동 노출 제어

`camera.useAutoExposure = true`(기본값) 설정 시 매 프레임 GPU 컴퓨트 셰이더에서 화면 휘도 히스토그램을 계산하고 `view.postEffectManager.autoExposure` 를
통해 노출을 부드럽게 적응시킵니다.

| 속성 / 메서드                     | 기본값         | 설명                                                                                          |
|:----------------------------------|:---------------|:----------------------------------------------------------------------------------------------|
| **`minExposure` / `maxExposure`** | `0.15` / `4.0` | 자동 노출의 최소 및 최대 제한 범위                                                            |
| **`speedUp` / `speedDown`**       | `3.0` / `1.0`  | 어두운 곳에서 밝은 곳(`speedUp`), 밝은 곳에서 어두운 곳(`speedDown`)으로의 명순응·암순응 속도 |
| **`exposureBias`**                | `0.0`          | 수동 노출 보정 바이어스 (`-5.0 ~ +5.0` EV 스톱)                                               |
| **`reset()`**                     | 메서드         | 카메라 컷 전환이나 씬 이동 직후 노출 적응 히스토리를 즉시 초기화                              |

```javascript
const autoExposure = view.postEffectManager.autoExposure;
autoExposure.minExposure = 0.25;
autoExposure.maxExposure = 3.5;
autoExposure.exposureBias = 0.2;
```

::: tip [라이브 데모]
[RedGPU 공식 예제 페이지](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect)에서 모든 효과의 실시간 작동 모습을 확인할 수 있습니다.
:::

---

## 관련 예제

- [SSAO (화면 공간 주변광 차폐)](/RedGPU/examples/postEffect/ssao/)
- [SSR (화면 공간 반사)](/RedGPU/examples/postEffect/ssr/)
- [피사계 심도 (Depth of Field)](/RedGPU/examples/postEffect/lens/dof/)
- [블룸 (Bloom)](/RedGPU/examples/postEffect/oldBloom/)

---

## 다음 단계

- **[일반 이펙트](./general-effects.md)** : 블룸, 블러, 흑백 등 후처리 효과 체인 구성
- **[톤 매핑](./tone-mapping.md)** : 씬의 기본 색감과 대비 설정
- **[빌트인 이펙트](./builtin-effects.md)** : `SSAO`, `SSR` 활성화 및 세부 조정
- **[안티앨리어싱](../antialiasing/index.md)** : 화면 외곽선 계단 현상 제거
