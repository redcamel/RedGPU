---
title: Sprite3D
order: 2
---

# Sprite3D

**Sprite3D** 는 3D 공간 내에 배치되는 2D 평면 객체입니다. 일반적인 메시와 달리 **빌보드**(Billboard) 기능을 기본으로 내장하고 있어, 카메라의 회전 방향에 관계없이 항상 정면을 유지해야 하는 요소(아이콘, 이름표, 특수 효과 등)를 구현하는 데 최적화되어 있습니다.

## 1. 주요 특징

- **Billboard** : 카메라를 항상 정면으로 바라보는 기능을 기본으로 지원합니다.
- **자동 비율 유지**: 할당된 텍스처의 원본 비율(Aspect Ratio)을 자동으로 계산하여 평면의 크기를 조절합니다.
- **UI 친화적** : 3D 공간 내에서의 위치(World Position)와 2D적인 표현 방식을 결합하여 공간감 있는 UI 요소를 제공합니다.

## 2. 기본 사용법

`Sprite3D` 는 내부적으로 **Plane** 지오메트리를 사용하며, 이미지를 출력하기 위해 **BitmapMaterial** 과 함께 사용됩니다.

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

### 빌보드 설정

| 속성명 | 설명 | 기본값 |
| :--- | :--- | :--- |
| **`useBillboard`** | 카메라를 항상 향하게 할지 여부 | `true` |

### 크기 및 렌더링 모드

`Sprite3D`는 월드 단위 크기 또는 고정된 픽셀 크기로 렌더링할 수 있는 옵션을 제공합니다.

| 속성명 | 설명 | 기본값 |
| :--- | :--- | :--- |
| **`worldSize`** | 월드 공간에서의 세로 크기 (Unit 단위). 가로 크기는 비율에 맞춰 자동 조절됩니다. | `1` |
| **`usePixelSize`** | 고정 픽셀 크기 모드 사용 여부. `true`일 경우 거리에 관계없이 일정한 픽셀 크기로 렌더링됩니다. | `false` |
| **`pixelSize`** | 고정 픽셀 크기 값 (`px` 단위). `usePixelSize`가 `true`일 때만 적용됩니다. | `0` |

```javascript
// 1. 월드 단위 크기 설정 (거리에 따라 작아짐)
sprite.worldSize = 2;

// 2. 고정 픽셀 크기 설정 (아이콘 등 UI 스타일, 거리에 관계없이 크기 일정)
sprite.usePixelSize = true;
sprite.pixelSize = 64; 
```

### 3.3 월드 사이즈와 픽셀 사이즈의 관계

`Sprite3D`에서 크기와 선명도를 결정하는 핵심 요소들의 관계를 이해하면 상황에 맞는 최적의 연출이 가능합니다.

#### 3.3.1 소스 해상도 (Texture Resolution)
- **역할**: 원본 이미지의 크기가 스프라이트의 **최대 선명도**를 결정합니다.
- **특징**: `usePixelSize` 모드를 사용할 때, `pixelSize`를 원본 해상도보다 크게 설정하면 이미지가 흐려질 수 있습니다.

#### 3.3.2 월드 사이즈 (`worldSize`)
- **역할**: 3D 월드 공간 내에서의 **물리적 세로 높이**(Unit 단위)를 결정합니다.
- **동작**: `usePixelSize`가 `false`일 때 작동하며, 일반적인 3D 오브젝트처럼 거리에 따른 원근감이 적용됩니다.

#### 3.3.3 고정 픽셀 모드 (`usePixelSize` & `pixelSize`)
- **역할**: 3D 공간에 위치하지만, 화면에는 **지정한 픽셀 크기** 그대로 표시합니다.
- **특징**: 이 모드가 활성화되면 `worldSize`는 무시됩니다. 기본적으로 텍스처가 로드될 때의 **원본 높이(Height)**가 `pixelSize`에 자동으로 할당됩니다. 아이콘이나 마커처럼 거리에 상관없이 일정한 크기와 가독성을 유지해야 할 때 사용합니다.

::: tip [픽셀 크기 조절]
`usePixelSize`가 활성화된 상태에서 스프라이트가 너무 크거나 작게 보인다면, `worldSize`가 아닌 `pixelSize` 속성을 직접 변경하여 조절하십시오.
:::

## 4. 실습 예제: 렌더링 모드별 비교

3D 공간에 서로 다른 설정의 스프라이트를 배치하여 시각적 차이를 확인해 봅니다.

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

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
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

## 핵심 요약

- **Sprite3D** 는 3D 좌표계를 가지면서도 카메라를 정면으로 바라보는 **Billboard** 기능을 제공합니다.
- `usePixelSize` 속성을 통해 거리에 관계없이 일정한 크기로 표현되는 UI 스타일 요소를 구현할 수 있습니다.
- 텍스처의 해상도와 비율에 따라 지오메트리 크기가 자동 조정되어 편리하게 사용할 수 있습니다.

---

## 다음 학습 추천

스프라이트를 활용한 애니메이션 효과에 대해 알아봅니다.

- **[SpriteSheet3D](../sprite/spritesheet.md)**