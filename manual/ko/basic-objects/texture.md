---
title: Texture
order: 3
---

<script setup>
const textureGraph = `
    Img["이미지 URL/파일"] -->|로드| Texture["BitmapTexture (리소스)"]
    Texture -->|참조| Material["BitmapMaterial (머티리얼)"]
    Material -->|적용| Mesh["Mesh (디스플레이 객체)"]

    %% 회색조 스타일 적용
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Texture

단순한 색상을 넘어 실제 사진이나 그림 파일을 물체의 표면에 입히면 훨씬 현실적인 3D 객체를 만들 수 있습니다. RedGPU 에서는 이미지 파일을 `BitmapTexture` 로 불러와
`BitmapMaterial` 을 사용하여 물체에 적용합니다.

<ClientOnly>
  <MermaidResponsive :definition="textureGraph" />
</ClientOnly>

## 1. 이미지 불러오기: BitmapTexture

이미지를 3D 엔진에서 사용하려면 먼저 텍스처 객체로 변환해야 합니다. `BitmapTexture` 를 사용하면 웹상의 이미지 경로를 통해 텍스처 데이터를 생성할 수 있습니다.

```javascript
// 이미지 경로를 지정하여 텍스처 데이터 생성
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);
```

> [!TIP]
> `BitmapTexture`는 이미지를 비동기로 로드하며, 별도의 로딩 완료 체크 로직 없이도 다운로드가 끝나는 즉시 화면에 자동 반영됩니다.

## 2. 재질에 적용하기: BitmapMaterial

불러온 텍스처는 `BitmapMaterial` 을 통해 메시의 외관으로 사용됩니다. 생성자에서 바로 지정하거나 `diffuseTexture` 속성에 할당할 수 있습니다.

```javascript
// 1. 텍스처를 사용하는 재질 생성
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. 메시 생성 및 재질 적용
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## 3. 실습: 텍스처를 입힌 상자 만들기

실제 이미지를 불러와 회전하는 상자에 입혀보겠습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 텍스처 생성
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    // 2. 비트맵 재질 생성 및 텍스처 연결
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 3. 메시 생성 (Box)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        material
    );
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Texture" slugHash="mesh-texture">
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
    
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>


## 관련 예제

- [BitmapMaterial 기본](/RedGPU/examples/3d/material/bitmapMaterial/)
- [BitmapTexture 샘플러 조합](/RedGPU/examples/3d/texture/bitmapTextureSampler/)
- [밉맵 생성 옵션 비교](/RedGPU/examples/3d/texture/mipmapGenerator/)
- [투명 텍스처 알파 블렌딩](/RedGPU/examples/3d/transparent/alphaBlend/)

---

## 다음 학습 추천

단순한 이미지를 넘어, 빛과 그림자를 추가하여 공간에 입체감을 불어넣는 방법을 알아봅니다.

- **[조명과 그림자](../lighting-and-shadow/index.md)**
