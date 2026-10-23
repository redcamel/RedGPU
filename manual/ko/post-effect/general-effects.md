---
title: General Effects
order: 2
---

# 일반 이펙트

**일반 이펙트**(General Effects) 는 블러, 색상 보정, 렌즈 효과 등 사용자가 원하는 순서대로 조합하여 적용할 수 있는 표준 후처리 필터입니다.

## 1. 사용 방법

`RedGPU.PostEffect` 네임스페이스의 이펙트 인스턴스를 생성한 후 `view.postEffectManager.addEffect()` 로 등록합니다. 등록한 순서대로 후처리 파이프라인 체인이 구성됩니다.

```javascript
const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
view.postEffectManager.addEffect(radialBlur);
```

---

## 2. 주요 이펙트 예시

### 2.1 방사형 블러

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

### 2.2 그레이스케일

화면을 흑백으로 변환합니다.

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

---

## 3. 지원 이펙트 목록

모든 일반 이펙트는 `RedGPU.PostEffect` 네임스페이스 하위에 위치합니다.

| 카테고리             | 클래스명               | 설명                                               |
|:---------------------|:-----------------------|:---------------------------------------------------|
| **Blur**             | `Blur`, `GaussianBlur` | 가우시안 블러                                      |
|                      | `BlurX`, `BlurY`       | 단방향(가로/세로) 블러                             |
|                      | `DirectionalBlur`      | 지정된 각도 방향 블러                              |
|                      | `RadialBlur`           | 중심에서 바깥쪽으로 원형 블러                      |
|                      | `ZoomBlur`             | 중심에서 바깥쪽으로 확대 블러                      |
| **Adjustments**      | `BrightnessContrast`   | 밝기와 대비 조절                                   |
|                      | `HueSaturation`        | 색조와 채도 조절                                   |
|                      | `ColorBalance`         | 색상 균형(미드톤, 쉐도우, 하이라이트) 조절         |
|                      | `ColorTemperatureTint` | 색온도와 틴트 조절                                 |
|                      | `Vibrance`             | 채도가 낮은 영역 위주의 활기 보정                  |
|                      | `Grayscale`            | 흑백 변환                                          |
|                      | `Invert`               | 색상 반전                                          |
|                      | `Threshold`            | 임계값 기준 이진화                                 |
| **Lens**             | `OldBloom`             | 빛 번짐 효과                                       |
|                      | `DOF`                  | 피사계 심도 (초점 외 영역 블러)                    |
|                      | `Vignetting`           | 화면 외곽 어둡게 처리                              |
|                      | `ChromaticAberration`  | 렌즈 색수차 현상 재현                              |
|                      | `LensDistortion`       | 렌즈 왜곡 효과                                     |
| **Atmospheric**      | `Fog`                  | 거리 기반 안개 효과                                |
|                      | `HeightFog`            | 높이 기반 안개 효과                                |
| **Visual / Utility** | `FilmGrain`            | 필름 그레인(노이즈) 효과                           |
|                      | `Sharpen`              | 선명도 강조                                        |
|                      | `Convolution`          | 커널 기반 컨볼루션 필터 (Sharpen, Edge, Emboss 등) |

::: info [라이브 데모]
모든 이펙트는 [RedGPU 공식 예제 페이지](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect)의 **PostEffect** 탭에서
실시간으로 확인할 수 있습니다.
:::

---

## 다음 단계

- **[톤 매핑](./tone-mapping.md)** : HDR에서 LDR로의 색상 변환과 노출 제어
- **[빌트인 이펙트](./builtin-effects.md)** : `SSAO` 및 `SSR` 설정
