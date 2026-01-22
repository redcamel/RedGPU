---
title: General Effects
order: 3
---

# 일반 이펙트 (General Effects)

방사형 블러, 그레이스케일 등 RedGPU가 제공하는 다양한 표준 효과들을 관리합니다.

## 1. 사용 방법 (addEffect)

이펙트 객체를 생성한 후 `view.postEffectManager.addEffect()`를 통해 등록합니다. 등록된 순서대로 파이프라인 체인이 형성됩니다.

```javascript
const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
view.postEffectManager.addEffect(radialBlur);
```

## 2. 주요 이펙트 예시

### 2.1 방사형 블러 (Radial Blur)
중심점에서 바깥쪽으로 퍼져나가는 속도감이나 집중 효과를 연출합니다.

<ClientOnly>
<CodePen title="RedGPU PostEffect - RadialBlur" slugHash="posteffect-radialblur">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => { scene.addChild(result.resultMesh); }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
    radialBlur.blur = 0.1;
    view.postEffectManager.addEffect(radialBlur);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

### 2.2 그레이스케일 (Grayscale)
이미지를 흑백으로 변환하여 고전적인 분위기를 연출합니다.

<ClientOnly>
<CodePen title="RedGPU PostEffect - Grayscale" slugHash="posteffect-grayscale">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => { scene.addChild(result.resultMesh); }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    
    redGPUContext.addView(view);

    // 흑백 효과 추가
    const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
    view.postEffectManager.addEffect(grayscale);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 3. 전체 지원 목록

RedGPU가 제공하는 모든 일반 이펙트 목록입니다. 모든 이펙트는 `RedGPU.PostEffect` 네임스페이스 하위에 위치합니다.

| 카테고리 | 클래스 명 | 설명 |
| :--- | :--- | :--- |
| **Blur** | `Blur`, `GaussianBlur` | 가우시안 블러 (가장 일반적인 흐림 효과) |
| | `BlurX`, `BlurY` | 단방향(가로/세로) 블러 |
| | `DirectionalBlur` | 지정된 각도 방향으로 흐려지는 효과 |
| | `RadialBlur` | 중심에서 바깥쪽으로 원형으로 흐려지는 효과 |
| | `ZoomBlur` | 중심에서 바깥쪽으로 확대되며 흐려지는 효과 |
| **Adjustments** | `BrightnessContrast` | 밝기와 대비 조절 |
| | `HueSaturation` | 색조와 채도 조절 |
| | `ColorBalance` | 색상 균형(미드톤, 쉐도우, 하이라이트) 조절 |
| | `ColorTemperatureTint` | 색온도와 틴트 조절 |
| | `Vibrance` | 활기(채도가 낮은 부분 위주로 보정) 조절 |
| | `Grayscale` | 흑백 이미지로 변환 |
| | `Invert` | 색상 반전 |
| | `Threshold` | 임계값을 기준으로 이진화 |
| **Lens** | `OldBloom` | 클래식한 빛 번짐 효과 |
| | `DOF` | 피사계 심도 (초점 외 영역 블러) |
| | `Vignetting` | 화면 외곽을 어둡게 처리하는 효과 |
| | `ChromaticAberration` | 렌즈의 색수차 현상 재현 |
| | `LensDistortion` | 렌즈 왜곡 효과 |
| **Atmospheric** | `Fog` | 거리 기반 안개 효과 |
| | `HeightFog` | 높이 기반 안개 효과 |
| **Visual / Utility** | `FilmGrain` | 필름 노이즈(그레인) 효과 |
| | `Sharpen` | 선명도 강조 |
| | `Convolution` | 커널 기반 필터 (Sharpen, Edge, Emboss 등 지원) |

::: info [라이브 확인]
위의 모든 이펙트들은 [RedGPU 공식 예제 페이지](https://redcamel.github.io/RedGPU/examples/#postEffect)의 **PostEffect** 카테고리에서 실시간 데모로 확인하실 수 있습니다.
:::

## 핵심 요약
- `addEffect()`를 사용해 원하는 순서대로 효과를 중첩할 수 있습니다.
- 모든 이펙트 객체는 생성 시 `redGPUContext`가 필요합니다.
- 실제 렌더링은 톤 매핑 직후 단계에서 수행됩니다.

## 다음 학습 추천
- **[톤 매핑](./tone-mapping)**
- **[빌트인 이펙트](./builtin-effects)**