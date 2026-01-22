---
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

    class Manager mermaid-main;
    class TM,CE,SE,AA mermaid-component;
`
</script>

# 포스트 이펙트

**포스트 이펙트**(Post-Effect) 는 3D 씬의 모든 객체가 렌더링된 후, 최종적으로 생성된 2D 이미지에 추가적인 시각 효과를 적용하는 기술입니다. 이를 통해 블러, 블룸, 색상 보정 등 그래픽의 완성도를 높이는 다양한 효과를 구현할 수 있습니다.

## 1. PostEffectManager

RedGPU의 모든 후처리 효과는 `PostEffectManager` 를 통해 관리됩니다. 이 관리자는 각 뷰(**View3D**)가 생성될 때 내부적으로 자동 생성됩니다.

### 1.1 일반 이펙트 추가

대부분의 효과(OldBloom, Blur 등)는 사용자가 직접 객체를 생성한 후 `addEffect` 를 통해 추가합니다.

```javascript
// 1. 이펙트 생성
const bloom = new RedGPU.PostEffect.OldBloom(redGPUContext);

// 2. 관리자에 추가
view.postEffectManager.addEffect(bloom);
```

### 1.2 빌트인 이펙트 활성화

**SSAO** 와 **SSR** 은 성능 최적화와 깊이 버퍼 활용을 위해 시스템 내부에서 자동으로 관리됩니다. 사용자는 **직접 인스턴스를 생성하지 않으며**, 관리자의 속성을 통해 즉시 활성화할 수 있습니다.

```javascript
// SSAO 활성화
view.postEffectManager.useSSAO = true;

// SSR 활성화
view.postEffectManager.useSSR = true;
```

## 2. 톤 매핑

**톤 매핑**(Tone Mapping) 은 HDR(High Dynamic Range) 이미지의 넓은 밝기 범위를 디스플레이 가능한 범위로 변환하는 과정입니다. RedGPU에서는 후처리 파이프라인의 **가장 첫 단계**에서 실행되며, 노출(Exposure)과 색감을 결정하는 매우 중요한 역할을 합니다.

`ToneMappingManager` 는 `View3D` 에 내장되어 있어 별도의 생성 없이 즉시 설정할 수 있습니다.

```javascript
// 톤 매핑 모드 및 밝기 설정
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
view.toneMappingManager.exposure = 1.2;
view.toneMappingManager.contrast = 1.1;
```

## 3. 렌더링 파이프라인 흐름

포스트 이펙트는 씬 렌더링이 완료된 직후에 실행되며, 여러 이펙트가 체인(Chain) 형태로 연결되어 순차적으로 적용됩니다.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 4. 주요 이펙트 유형

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
- **Tone Mapping** 은 파이프라인의 첫 단계로, 전체적인 노출과 분위기를 결정합니다.
- **SSAO, SSR** 은 직접 생성하지 않고 관리자의 속성으로 제어하는 빌트인 기능입니다.

## 다음 학습 추천

- **[톤 매핑 (Tone Mapping)](./tone-mapping.md)**
- **[SSAO (Ambient Occlusion)](./ssao.md)**
- **[Bloom (빛 번짐)](./bloom.md)**