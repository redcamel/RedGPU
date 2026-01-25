---
order: 1
---

<script setup>
const skyboxGraph = `
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    HDRSource -->|new| HDRTex["RedGPU.Resource.HDRTexture"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    HDRTex --> Skybox
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% 커스텀 클래스 적용
    class View3D,Skybox mermaid-main;
    class IBL,HDRTex,CubeTex mermaid-component;
`
</script>

# Skybox

Skybox는 3D 공간의 무한한 배경을 표현하는 기술입니다. **SkyBox** 객체를 생성하여 카메라 뷰(**View3D**)의 `skybox` 속성에 할당하면 렌더링됩니다.

## 1. 기본 사용법

SkyBox는 일반적인 메쉬와 달리 씬(Scene)에 추가하지 않고, **View3D** 에 직접 연결하여 사용합니다.

```javascript
// 1. SkyBox 생성 (텍스처 필요)
const skybox = new RedGPU.Display.SkyBox(redGPUContext, texture);

// 2. View에 적용 (필수)
view.skybox = skybox;
```

## 2. 텍스처 생성 방법

SkyBox에 적용할 텍스처를 생성하는 방법은 크게 세 가지로 나뉩니다. 가장 권장되는 방식인 **IBL** 부터 고전적인 **큐브맵** 순으로 살펴봅니다.

<ClientOnly>
  <MermaidResponsive :definition="skyboxGraph" />
</ClientOnly>

### 2.1 IBL 리소스 활용 (권장)

`RedGPU.Resource.IBL` 객체를 생성하면 내부적으로 **환경 텍스처**(Environment Texture)가 함께 생성됩니다. 이 텍스처를 Skybox에 활용하는 방식입니다.

- **장점**: 배경과 완벽하게 일치하는 물리 기반 조명(Diffuse/Specular) 데이터를 함께 얻을 수 있습니다.
- **활용**: 가장 사실적인 렌더링 결과를 얻기 위해 주로 사용되는 현대적인 방식입니다.

```javascript
// IBL 생성 (조명 데이터 + 배경 텍스처 생성됨)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// IBL 내부의 environmentTexture를 Skybox로 사용
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

### 2.2 단일 HDR 이미지 (HDRTexture)

한 장의 HDR 파노라마 이미지를 로드하여 `HDRTexture`를 생성하고 이를 Skybox에 직접 적용하는 방식입니다.

- **장점**: 단 한 장의 이미지로 고품질의 배경을 구성할 수 있습니다.
- **특징**: 단순히 배경으로만 사용되며, 씬 전체의 조명(IBL) 데이터까지 자동으로 계산하지는 않습니다.

```javascript
const hdrTexture = new RedGPU.Resource.HDRTexture(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, hdrTexture);
```

### 2.3 6장의 이미지 (CubeTexture)

상, 하, 좌, 우, 앞, 뒤 6장의 일반 이미지(JPG, PNG 등)를 결합하여 `CubeTexture`를 생성하는 고전적인 방식입니다. 이미지 배열은 반드시 **px, nx, py, ny, pz, nz** 순서로 전달해야 합니다.

- **장점**: 리소스를 구하기 쉽고 직관적입니다.
- **단점**: HDR 정보를 포함하지 않아 사실적인 광원 효과를 기대하기 어렵습니다.

```javascript
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    './posx.jpg', './negx.jpg', 
    './posy.jpg', './negy.jpg', 
    './posz.jpg', './negz.jpg'
]);

const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
```

## 3. 구현 방식 비교

| 구분 | IBL 활용 (권장) | HDRTexture | CubeTexture |
| :--- | :--- | :--- | :--- |
| **소스** | 1장의 HDR 이미지 | 1장의 HDR 이미지 | 6장의 이미지 |
| **타입** | `CubeTexture` (변환됨) | `HDRTexture` | `CubeTexture` |
| **조명 데이터** | O (자동 생성) | X | X |
| **주요 용도** | 배경 + 물리 기반 조명 | 고품질 배경 | 단순 배경 |

## 4. 라이브 데모

### A. IBL 활용 방식 (조명 포함)

<ClientOnly>
<CodePen title="RedGPU Basics - Skybox (IBL)" slugHash="skybox-ibl">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. IBL 생성 및 SkyBox 적용
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

### B. 큐브맵 방식 (6장 이미지)

<ClientOnly>
<CodePen title="RedGPU Basics - Skybox (CubeMap)" slugHash="skybox-cubemap">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // CubeTexture 생성 (순서: px, nx, py, ny, pz, nz)
    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/px.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nx.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/py.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/ny.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/pz.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nz.jpg'
    ]);
    
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **SkyBox** 는 뷰(**View3D**)에 설정하여 배경을 렌더링합니다.
- 사실적인 조명이 필요하다면 **IBL** 을 통해 생성된 환경 텍스처를 사용하는 것이 가장 좋습니다.
- 단순 배경이 목적이라면 **HDRTexture** 나 **CubeTexture** 를 사용합니다.

## 다음 학습 추천



- **[IBL (Image-Based Lighting)](./ibl)**
