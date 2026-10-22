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

단순한 색상을 넘어 실제 사진이나 압축 텍스처 파일을 물체의 표면에 입히면 훨씬 현실적인 3D 객체를 만들 수 있습니다. RedGPU에서는 외부 이미지 파일을 **BitmapTexture** 로 불러와 다양한 재질
(**BitmapMaterial**, **PhongMaterial**, **PBRMaterial** 등)에 적용합니다.

<ClientOnly>
  <MermaidResponsive :definition="textureGraph" />
</ClientOnly>

## 1. 이미지 불러오기: BitmapTexture

이미지를 3D 엔진에서 사용하려면 먼저 텍스처 객체로 변환해야 합니다. `RedGPU.Resource.BitmapTexture`는 일반 비트맵 (`.png`, `.jpg`, `.webp`)뿐만 아니라 **
`.ktx2` GPU 압축 텍스처**(Basis Universal 자동 트랜스코딩)와 **`.svg` 벡터 이미지**까지 네이티브로 지원합니다.

```javascript
// 1. 일반 이미지(JPG/PNG/WebP) 또는 SVG 로드
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
```

### BitmapTexture 생성자 매개변수 및 이벤트 리스너

| 파라미터명                | 타입                              | 설명                                                                                   |
|:--------------------------|:----------------------------------|:---------------------------------------------------------------------------------------|
| **`redGPUContext`**       | `RedGPUContext`                   | 엔진의 컨텍스트 인스턴스 (필수)                                                        |
| **`src`**                 | `string` 또는 `{ src, cacheKey }` | 로드할 이미지(`.png`, `.jpg`, `.webp`, `.svg`, `.ktx2`)의 URL 경로 또는 캐시 옵션 객체 |
| **`useMipMap`**           | `boolean` (기본값: `true`)        | 원거리 모아레(Moire) 현상을 막기 위한 멀티 레벨 밉맵(Mipmap) 생성 활성화 여부          |
| **`onLoad`**              | `(textureInstance) => void`       | 이미지 로드 및 GPU 텍스처 업로드를 완료했을 때 호출될 콜백 함수                        |
| **`onError`**             | `(error) => void`                 | 이미지 네트워크 로드 실패 등의 예외 발생 시 호출될 콜백 함수                           |
| **`format`**              | `GPUTextureFormat`                | 사용할 GPU 텍스처 포맷 (생략 시 기본 `'rgba8unorm'` 또는 KTX2 압축 포맷 자동 선택)     |
| **`usePremultiplyAlpha`** | `boolean` (기본값: `false`)       | 알파 채널 값이 곱해진 프리멀티플 알파(Premultiplied Alpha) 적용 여부                   |

생성자 콜백 외에도 `addLoadListeners(onLoad, onError)` 메서드를 통해 로드 완료/실패 리스너를 추가로 등록할 수 있습니다.

```javascript
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, './assets/ crate.png');

texture.addLoadListeners(
    (loadedTexture) => {
        console.log('텍스처 로드 완료:', loadedTexture.width, loadedTexture.height);
    },
    (err) => {
        console.error('텍스처 로드 실패:', err);
    }
);
```

---

## 2. 고급 텍스처 리소스: TextureArray 및 PackedTexture

RedGPU는 단일 2D 텍스처 외에도 대규모 렌더링 최적화를 위한 전용 텍스처 클래스를 제공합니다.

* **`RedGPU.Resource.TextureArray`**: 여러 장의 동일한 해상도 이미지를 단일 `texture_2d_array` GPU 리소스로 묶어 바인딩 슬롯 소모를 줄입니다. 일반 비트맵 배열과
  `.ktx2` 배열을 모두 지원합니다.
* **`RedGPU.Resource.PackedTexture`**: 서로 다른 텍스처의 개별 채널 (R, G, B, A)을 GPU에서 하나의 ORM (Occlusion-Roughness-Metallic) 패킹
  텍스처로 병합할 때 사용됩니다.

```javascript
// 여러 이미지 URL을 단일 2D 텍스처 배열(TextureArray)로 생성
const layerTextureArray = new RedGPU.Resource.TextureArray(
    redGPUContext,
    [
        './assets/layers/layer0.ktx2',
        './assets/layers/layer1.ktx2',
        './assets/layers/layer2.ktx2'
    ],
    true // useMipmap
);
```

---

## 3. 재질에 적용하기: BitmapMaterial

불러온 텍스처는 **BitmapMaterial** 등을 통해 메시의 외관으로 사용됩니다. 생성자에서 바로 지정하거나 `diffuseTexture` 속성에 할당할 수 있습니다.

```javascript
// 1. 텍스처를 사용하는 재질 생성
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. 메시 생성 및 재질 적용
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## 4. 비동기 로딩의 이해

이미지 파일은 네트워크를 통해 다운로드되므로 불러오는 데 시간이 걸립니다. RedGPU 는 이미지가 로드되는 동안 기본 상태로 대기하다가, **로딩이 완료되는 즉시 자동으로 파이프라인을 갱신하여 화면에 텍스처를
출력**합니다.

## 5. 실습: 텍스처를 입힌 상자 만들기

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

## 핵심 요약

- **BitmapTexture** 는 일반 이미지 (`.png`, `.jpg`, `.webp`), 벡터 (`.svg`), 그리고 GPU 압축 포맷 (`.ktx2`)을 3D 엔진용 리소스로 변환합니다.
- **TextureArray** 와 **PackedTexture** 를 통해 다중 텍스처 바인딩과 채널 패킹을 최적화할 수 있습니다.
- RedGPU 는 이미지의 비동기 로딩을 자동으로 처리하여 관리의 편의성을 제공합니다.

## 다음 학습 추천

단순한 이미지를 넘어, 빛과 그림자를 추가하여 공간에 입체감을 불어넣는 방법을 알아봅니다.

- **[조명과 그림자](../lighting-and-shadow/index.md)**
