---
title: Sprite3D
order: 2
---

# Sprite3D

**Sprite3D**는 3D 공간 내에 배치되는 2D 평면 객체입니다. 일반적인 메시와 달리 **빌보드(Billboard)** 기능을 기본으로 내장하고 있어, 카메라의 회전 방향에 관계없이 항상 정면을 유지해야 하는 요소(아이콘, 이름표, 특수 효과 등)를 구현하는 데 최적화되어 있습니다.

## 1. 주요 특징

- **Billboard**: 카메라를 항상 정면으로 바라보는 기능을 기본으로 지원합니다.
- **자동 비율 유지**: 할당된 텍스처의 원본 비율(Aspect Ratio)을 자동으로 계산하여 평면의 크기를 조절합니다.
- **UI 친화적**: 3D 공간 내에서의 위치(World Position)와 2D적인 표현 방식을 결합하여 공간감 있는 UI 요소를 제공합니다.

## 2. 기본 사용법

`Sprite3D`는 내부적으로 `Plane` 지오메트리를 사용하며, 이미지를 출력하기 위해 `BitmapMaterial`과 함께 사용됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 텍스처 및 재질 생성
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. 스프라이트 생성 및 추가
const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
scene.addChild(sprite);
```

## 3. 핵심 속성 제어

스프라이트의 빌보드 동작과 시각적 표현을 제어하는 주요 속성들입니다.

| 속성명 | 설명 | 기본값 |
| :--- | :--- | :--- |
| **`useBillboard`** | 카메라를 항상 향하게 할지 여부 | `true` |
| **`useBillboardPerspective`** | 카메라와의 거리에 따른 원근감(크기 변화) 적용 여부 | `true` |
| **`billboardFixedScale`** | `useBillboardPerspective`가 `false`일 때 화면상에 고정될 배율 | `1.0` |

```javascript
// 멀어져도 크기가 일정하게 유지되는 아이콘 스타일 설정
sprite.useBillboard = true;
sprite.useBillboardPerspective = false; 
sprite.billboardFixedScale = 0.1;
```

## 4. 실습 예제: 빌보드 유형별 비교

3D 공간에 세 가지 서로 다른 설정의 스프라이트를 배치하여 빌보드 옵션에 따른 시각적 차이를 확인해 봅니다.

<ClientOnly>
<CodePen title="RedGPU - Sprite3D Billboard Showcase" slugHash="sprite3d-showcase">
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
    
    // 공용 재질 생성
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 1. 기본 빌보드 (Perspective ON)
    const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite1.x = -3; sprite1.y = 1;
    scene.addChild(sprite1);

    // 2. 빌보드 비활성화 (공간에 고정된 평면)
    const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite2.x = 0; sprite2.y = 1;
    sprite2.useBillboard = false;
    scene.addChild(sprite2);

    // 3. 고정 크기 빌보드 (Perspective OFF)
    const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3.x = 3; sprite3.y = 1;
    sprite3.useBillboardPerspective = false;
    scene.addChild(sprite3);

    // 4. 옵션 설명 라벨 (TextField3D)
    const createLabel = (text, x, y) => {
        const label = new RedGPU.Display.TextField3D(redGPUContext, text);
        label.x = x; label.y = y;
        label.color = '#ffffff';
        label.fontSize = 16;
        label.background = '#ff3333';
        label.padding = 8;
        label.useBillboard = true; // 라벨은 항상 정면 보기
        scene.addChild(label);
    };

    createLabel('Billboard ON', -3, 2.2);
    createLabel('Billboard OFF', 0, 2.2);
    createLabel('Perspective OFF', 3, 2.2);

    // 3D 뷰 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // 렌더링 시작
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 핵심 요약

- **Sprite3D**는 3D 좌표계를 가지면서도 카메라를 정면으로 바라보는 빌보드 기능을 제공합니다.
- `useBillboardPerspective` 속성을 통해 거리에 관계없이 일정한 크기로 표현되는 UI 스타일 요소를 구현할 수 있습니다.
- 텍스처의 해상도와 비율에 따라 지오메트리 크기가 자동 조정되어 편리하게 사용할 수 있습니다.

---

## 다음 학습 추천

스프라이트를 활용한 애니메이션 효과에 대해 알아봅니다.

- **[SpriteSheet3D (스프라이트 시트)](./spritesheet)**
