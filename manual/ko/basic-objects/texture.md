---
title: Texture
order: 3
---

<script setup>
const textureGraph = `
    Img["이미지 URL (.png / .jpg / .ktx2 / .svg)"] -->|비동기 로드 및 트랜스코딩| Texture["BitmapTexture / TextureArray (리소스)"]
    Texture -->|참조| Material["BitmapMaterial / PhongMaterial / PBRMaterial"]
    Material -->|적용| Mesh["Mesh (디스플레이 객체)"]

    %% 회색조 스타일 적용
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Texture

**Texture** 는 외부 이미지 파일이나 압축 텍스처를 GPU 리소스로 변환하여 머티리얼 (`BitmapMaterial`, `PhongMaterial`, `PBRMaterial` 등)의 표면에 매핑하는
객체입니다.

<ClientOnly>
  <MermaidResponsive :definition="textureGraph" />
</ClientOnly>

---

## 1. 텍스처 클래스 및 지원 포맷

RedGPU는 용도에 따라 3가지 텍스처 리소스 클래스를 제공하며, 네트워크 비동기 로딩이 완료되는 즉시 렌더링 파이프라인을 자동으로 갱신합니다.

| 클래스              | 지원 포맷 및 주요 역할                                                                                                                                                   |
|:--------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`BitmapTexture`** | 일반 비트맵(`.png`, `.jpg`, `.webp`, `.avif`), 벡터(`.svg`), 그리고 **`.ktx2` GPU 압축 텍스처**(Basis Universal / UASTC·ETC1S 자동 트랜스코딩)를 로드하는 표준 2D 텍스처 |
| **`TextureArray`**  | 동일한 해상도의 여러 이미지를 단일 `texture_2d_array` GPU 리소스로 묶어 다중 레이어 셰이더의 바인딩 슬롯 소모를 최소화 (비트맵 및 `.ktx2` 배열 지원)                     |
| **`PackedTexture`** | 서로 다른 텍스처의 개별 채널(R, G, B, A)을 GPU에서 하나의 ORM(Occlusion-Roughness-Metallic) 패킹 텍스처로 실시간 병합                                                    |

---

## 2. BitmapTexture 생성 및 옵션

```javascript
// 1. 일반 비트맵(JPG/PNG/WebP) 또는 SVG 로드
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);

// 2. KTX2 (Basis Universal GPU 압축 텍스처) 로드
// 디바이스가 지원하는 최적의 BC7/ASTC/ETC2 포맷으로 자동 트랜스코딩됩니다.
const ktx2Texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    './assets/terrain/rock_diff.ktx2'
);

// 3. 여러 이미지 URL을 단일 2D 텍스처 배열(TextureArray)로 생성
const layerTextureArray = new RedGPU.Resource.TextureArray(
    redGPUContext,
    ['./assets/layer0.ktx2', './assets/layer1.ktx2', './assets/layer2.ktx2'],
    true // useMipmap
);
```

### 생성자 매개변수 및 이벤트 리스너

| 파라미터명                | 타입                          | 기본값         | 설명                                                      |
|:--------------------------|:------------------------------|:---------------|:----------------------------------------------------------|
| **`redGPUContext`**       | `RedGPUContext`               | 필수           | 엔진 컨텍스트 인스턴스                                    |
| **`src`**                 | `string \| { src, cacheKey }` | 선택           | 로드할 이미지 URL 경로 또는 캐시 키 지정 객체             |
| **`useMipMap`**           | `boolean`                     | `true`         | 원거리 모아레(Moire) 방지를 위한 멀티 레벨 밉맵 생성 여부 |
| **`onLoad`**              | `(textureInstance) => void`   | 선택           | 이미지 로드 및 GPU 업로드 완료 시 호출되는 콜백           |
| **`onError`**             | `(error) => void`             | 선택           | 네트워크 로드 실패 등 예외 발생 시 호출되는 콜백          |
| **`format`**              | `GPUTextureFormat`            | `'rgba8unorm'` | GPU 텍스처 포맷 (KTX2 로드 시 압축 포맷 자동 선택)        |
| **`usePremultiplyAlpha`** | `boolean`                     | `false`        | 프리멀티플 알파(Premultiplied Alpha) 적용 여부            |

> 생성 후에도 `texture.addLoadListeners(onLoad, onError)` 메서드를 통해 로드 완료/실패 리스너를 추가 등록할 수 있습니다.

---

## 3. 실습 예제: 텍스처를 입힌 메시 렌더링

`BitmapTexture` 를 생성하여 `BitmapMaterial` 에 연결하고 화면에 출력하는 예제입니다.

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

---

## 다음 단계

- **[조명과 그림자](../lighting-and-shadow/index.md)** : 광원 (`Light`), 라이팅 재질 (`PhongMaterial`, `PBRMaterial`), 그림자 (`Shadow`)
  설정 방법
