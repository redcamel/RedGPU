---
order: 1
---

<script setup>
const skyboxGraph = `
    HDRSource["HDR 원본 (.hdr)"] -->|생성| IBL["RedGPU.Resource.IBL"]
    Images["6면 이미지"] -->|생성| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    CubeTex --> Skybox

    Skybox -->|view.skybox 등록| View3D["RedGPU.Display.View3D"]

    %% 회색조 스타일 적용
    style HDRSource fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Images fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style CubeTex fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Skybox fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View3D fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`
</script>

# Skybox

`SkyBox` 는 3D 공간의 무한한 360도 배경을 렌더링하는 디스플레이 객체입니다. 일반 메시와 달리 `Scene` 이 아닌 `View3D` 의 `skybox` 속성에
직접 할당하여 사용합니다.

```javascript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, texture);
view.skybox = skybox;
```

---

## 1. 텍스처 생성 방식 비교

`SkyBox` 에 적용할 텍스처는 `IBL` 을 통해 생성하거나 6장의 이미지를 결합한 `CubeTexture` 로 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="skyboxGraph" />
</ClientOnly>

| 구분            | IBL 활용                                    | CubeTexture 활용                                    |
|:----------------|:--------------------------------------------|:----------------------------------------------------|
| **소스**        | 1장의 HDR 파노라마 이미지 (`.hdr`)          | 6장의 방향별 일반 이미지 (`px, nx, py, ny, pz, nz`) |
| **텍스처 타입** | `IBLCubeTexture` (`ibl.environmentTexture`) | `CubeTexture`                                       |
| **조명 데이터** | O (확산·반사 조명 맵 자동 생성)             | X                                                   |
| **주요 용도**   | 배경 + 물리 기반 조명 (권장)                | 단순 시각적 배경                                    |

### 1.1 IBL 리소스 활용

`RedGPU.Resource.IBL` 생성 시 2D HDR 파노라마 이미지가 큐브맵 형태의 `environmentTexture` 로 자동 변환되며, 배경과 일치하는 물리 기반 조명 데이터도 함께 얻을 수 있습니다.

> [!NOTE]
> 단일 HDR (`.hdr`) 파노라마 이미지를 스카이박스로 사용하려면 반드시 `IBL` 을 거쳐 큐브맵으로 변환해야 합니다.

```javascript
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

### 1.2 CubeTexture 활용

상, 하, 좌, 우, 앞, 뒤 6장의 일반 이미지 (JPG, PNG 등)를 결합하여 `CubeTexture` 를 생성합니다. 이미지 배열은 반드시 **`px, nx, py, ny, pz, nz`** 순서로 전달해야
합니다.

```javascript
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    './posx.jpg', './negx.jpg', 
    './posy.jpg', './negy.jpg', 
    './posz.jpg', './negz.jpg'
]);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
```

---

## 2. 라이브 데모

### A. IBL 활용 방식

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

### B. CubeTexture 방식

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

---

## 관련 예제

- [SkyBox 기본](/RedGPU/examples/3d/skybox/skybox/)
- [SkyBox 트랜지션](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
- [노이즈 텍스처 기반 SkyBox 트랜지션](/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)

---

## 다음 단계

- **[IBL](./ibl.md)** : 배경 이미지를 물리 기반 광원으로 활용하여 객체에 사실적인 반사와 조명 적용하기
