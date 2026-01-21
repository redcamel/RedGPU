---
order: 1
---

# Skybox

Skybox는 3D 공간의 무한한 배경을 표현하는 기술입니다. RedGPU에서는 사용자의 필요에 따라 고전적인 **큐브맵(CubeMap)** 방식과 현대적인 **IBL(HDR)** 방식 두 가지를 모두 지원합니다.

## 1. 일반 큐브맵 방식 (CubeTexture)

6장의 이미지(상, 하, 좌, 우, 앞, 뒤)를 결합하여 하나의 배경을 만드는 가장 기본적인 방식입니다.

- **특징**: 직관적이고 가벼우며, 특정 배경 이미지가 명확할 때 사용합니다.
- **구성**: 6개의 이미지 경로가 담긴 배열을 사용하여 생성합니다.

```javascript
// 1. 6면 이미지로 큐브 텍스처 생성
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    './posx.jpg', './negx.jpg', 
    './posy.jpg', './negy.jpg', 
    './posz.jpg', './negz.jpg'
]);

// 2. SkyBox 생성
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox;
```

## 2. IBL 방식 (HDRTexture)

하나의 HDR 파노라마 이미지를 로드하여 배경과 조명 데이터를 동시에 처리하는 방식입니다.

- **특징**: 실제 물리적 밝기 정보를 포함하며, 배경으로 쓰이는 동시에 물체에 반사광과 조명을 제공합니다.
- **IBL의 두 가지 텍스처**:
    - **Environment Texture**: Skybox의 배경으로 사용되는 고해상도 이미지입니다.
    - **Diffuse Texture**: 조명 연산을 위해 부드럽게 블러(Blur) 처리된 이미지입니다. (주로 IBL 시스템 내부에서 사용)

```javascript
// 1. HDR 파일을 로드하여 IBL 리소스 생성
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. IBL의 environmentTexture를 Skybox의 소스로 사용
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
view.skybox = skybox;
```

## 3. 구현 방식 비교

| 구분 | CubeTexture 방식 | IBL (HDR) 방식 |
| :--- | :--- | :--- |
| **소스 파일** | 6장의 일반 이미지 (PNG/JPG) | 1장의 고대역폭 이미지 (.hdr) |
| **주요 용도** | 단순 배경 표현 | 사실적인 라이팅 및 배경 표현 |
| **반사 효과** | 기본 반사 | 고품질 물리 기반 반사 |

## 4. 라이브 데모 (Live Demo)

### A. 큐브맵 방식 (CubeMap)
6장의 이미지를 각각 로드하여 배경을 구성하는 전통적인 방식입니다.

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
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // 큐브맵 이미지 배열 설정
    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nx.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/px.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/ny.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/py.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nz.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/pz.jpg'
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

### B. IBL 방식 (HDR)
단일 HDR 파일을 통해 고품질 배경과 라이팅 정보를 동시에 제공하는 현대적인 방식입니다.

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
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
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

## 핵심 요약

- **SkyBox**는 단순한 배경을 넘어 씬의 전체 라이팅 분위기를 결정합니다.
- 용도에 따라 **CubeTexture**와 **IBL(HDR)** 중 적합한 방식을 선택하세요.
- 생성된 스카이박스 객체는 반드시 **View3D.skybox** 속성에 할당해야 화면에 나타납니다.

## 다음 학습 추천

배경 이미지를 조명 정보로 활용하여 물체의 재질감을 극대화하는 방법을 알아봅니다.

- **[IBL (Image-Based Lighting)](./ibl.md)**
