---
title: Sprite3D
order: 2
---

# Sprite3D

`Sprite3D` 는 3D 공간에 배치되는 2D 평면 디스플레이 객체입니다. 카메라 회전에 관계없이 항상 정면을 유지하는 **빌보드**(Billboard) 기능과
텍스처 원본 종횡비 (Aspect Ratio) 자동 유지를 기본 지원하여 아이콘, 마커, 이펙트 표현에 사용됩니다.

## 1. 기본 사용법

`Sprite3D` 는 내부적으로 평면 지오메트리를 사용하며, 출력할 텍스처가 담긴 `BitmapMaterial` 등을 전달하여 생성합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 텍스처 및 재질 생성
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. 스프라이트 생성 및 씬 추가
const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
scene.addChild(sprite);
```

---

## 2. 빌보드 및 크기 제어

`Sprite3D` 는 3D 원근감이 적용되는 월드 단위 크기 (`worldSize`)와 거리에 무관하게 일정한 화면 크기를 유지하는 고정 픽셀 크기 (`pixelSize`) 모드를 지원합니다.

| 속성               | 타입      | 기본값  | 설명                                                                                                         |
|:-------------------|:----------|:--------|:-------------------------------------------------------------------------------------------------------------|
| **`useBillboard`** | `boolean` | `true`  | 카메라를 항상 정면으로 향하게 할지 여부                                                                      |
| **`worldSize`**    | `number`  | `1`     | `usePixelSize: false` 일 때 적용되는 월드 공간 세로 크기(Unit 단위, 가로는 텍스처 비율에 맞춰 자동 결정)     |
| **`usePixelSize`** | `boolean` | `false` | 고정 픽셀 크기 모드 활성화 여부 (`true` 설정 시 `worldSize` 는 무시되고 원근감 없이 고정 픽셀 크기로 렌더링) |
| **`pixelSize`**    | `number`  | `0`     | `usePixelSize: true` 일 때 적용되는 화면상 세로 픽셀 크기(`px`, 텍스처 로드 시 원본 높이가 자동 할당됨)      |

```javascript
// 1. 월드 단위 크기 모드 (카메라 거리에 따라 원근감 적용)
sprite.worldSize = 2;

// 2. 고정 픽셀 크기 모드 (거리에 관계없이 64px 크기 유지)
sprite.usePixelSize = true;
sprite.pixelSize = 64; 
```

> [!TIP]
> `usePixelSize: true` 상태에서 스프라이트 크기를 변경하려면 `worldSize` 가 아닌 `pixelSize` 속성을 조절하세요. 단, `pixelSize` 를 원본 텍스처 해상도보다 크게
설정하면 이미지가 흐려질 수 있습니다.

---

## 3. 실습 예제: 렌더링 모드별 비교

3D 공간에 월드 크기 모드 (`worldSize`)와 고정 픽셀 크기 모드 (`usePixelSize`)의 스프라이트를 나란히 배치하여 카메라 거리에 따른 차이를 비교합니다.

<ClientOnly>
<CodePen title="RedGPU - Sprite3D Showcase" slugHash="sprite3d-showcase">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    // 공용 재질 생성
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 1. 기본 월드 사이즈 (World Size)
    const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite1.x = -3; sprite1.y = 1;
    sprite1.worldSize = 1.5;
    scene.addChild(sprite1);

    // 2. 고정 픽셀 사이즈 (Pixel Size) - 멀어져도 크기가 변하지 않음
    const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite2.x = 3; sprite2.y = 1;
    sprite2.usePixelSize = true;
    sprite2.pixelSize = 100;
    scene.addChild(sprite2);

    // 3. 옵션 설명 라벨 (TextField3D)
    const createLabel = (text, x, y) => {
        const label = new RedGPU.Display.TextField3D(redGPUContext, text);
        label.x = x; label.y = y;
        label.color = '#ffffff';
        label.fontSize = 16;
        label.background = '#ff3333';
        label.padding = 8;
        label.useBillboard = true;
        scene.addChild(label);
    };

    createLabel('World Size', -3, 2.5);
    createLabel('Pixel Size', 3, 2.5);

    // 3D 뷰 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

- **[SpriteSheet3D](./spritesheet.md)** : 스프라이트 시트 이미지를 활용한 프레임 애니메이션 구현하기
