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

단순한 색상을 넘어 실제 사진이나 그림 파일을 물체의 표면에 입히면 훨씬 현실적인 3D 객체를 만들 수 있습니다. RedGPU 에서는 이미지 파일을 **BitmapTexture** 로 불러와 **BitmapMaterial** 을 사용하여 물체에 적용합니다.

<ClientOnly>
  <MermaidResponsive :definition="textureGraph" />
</ClientOnly>

## 1. 이미지 불러오기: BitmapTexture

이미지를 3D 엔진에서 사용하려면 먼저 텍스처 객체로 변환해야 합니다. `RedGPU.Resource.BitmapTexture` 를 사용하면 웹상의 이미지 경로를 통해 텍스처 데이터를 생성할 수 있습니다.

```javascript
// 이미지 경로를 지정하여 텍스처 데이터 생성
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);
```

### BitmapTexture 생성자 매개변수 옵션

```typescript
constructor(
    redGPUContext
:
RedGPUContext,
    src ? : string | {src: string, cacheKey: string},
    useMipMap
:
boolean = true,
    onLoad ? : (textureInstance?: BitmapTexture) => void,
    onError ? : (error: Error) => void,
    format ? : GPUTextureFormat,
    usePremultiplyAlpha
:
boolean = false
)
```

| 파라미터명                     | 타입                                  | 설명                                                   |
|:--------------------------|:------------------------------------|:-----------------------------------------------------|
| **`redGPUContext`**       | `RedGPUContext`                     | 엔진의 컨텍스트 인스턴스 (필수)                                   |
| **`src`**                 | `string` 또는 `{ src, cacheKey }`     | 로드할 이미지의 URL 경로 혹은 캐시 키가 지정된 소스 객체                   |
| **`useMipMap`**           | `boolean` (기본값: `true`)             | 원거리 왜곡을 막기 위한 멀티 레벨 밉맵(Mipmap) 생성 활성화 여부             |
| **`onLoad`**              | `(texture?: BitmapTexture) => void` | 이미지 리소스 로드 및 GPU 텍스처 변환이 완전히 끝났을 때의 콜백 함수            |
| **`onError`**             | `(error: Error) => void`            | 이미지 네트워크 로드 실패 등의 예외 발생 시 호출될 콜백 함수                  |
| **`usePremultiplyAlpha`** | `boolean` (기본값: `false`)            | 알파 채널 값이 곱해진 프리멀티플 알파(Premultiplied Alpha) 포맷의 사용 여부 |

---

## 2. 재질에 적용하기: BitmapMaterial

불러온 텍스처는 **BitmapMaterial** 을 통해 메시의 외관으로 사용됩니다. 생성자에서 바로 지정하거나 `diffuseTexture` 속성에 할당할 수 있습니다.

```javascript
// 1. 텍스처를 사용하는 재질 생성
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. 메시 생성 및 재질 적용
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## 3. 비동기 로딩의 이해

이미지 파일은 네트워크를 통해 다운로드되므로 불러오는 데 시간이 걸립니다. RedGPU 는 이미지가 로드되는 동안 기본 상태로 대기하다가, **로딩이 완료되는 즉시 자동으로 화면에 텍스처를 출력**합니다.

개발자가 별도의 로딩 완료 체크 로직을 작성하지 않아도 엔진이 내부적으로 상태를 관리하므로 매우 편리합니다.

## 4. 실습: 텍스처를 입힌 상자 만들기

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

- **BitmapTexture** 는 외부 이미지 파일을 3D 엔진용 리소스로 변환합니다.
- **BitmapMaterial** 은 텍스처를 사용하여 물체의 표면을 표현하는 전용 재질입니다.
- RedGPU 는 이미지의 비동기 로딩을 자동으로 처리하여 관리의 편의성을 제공합니다.

## 다음 학습 추천

단순한 이미지를 넘어, 빛과 그림자를 추가하여 공간에 입체감을 불어넣는 방법을 알아봅니다.

- **[조명과 그림자](../lighting-and-shadow/index.md)**