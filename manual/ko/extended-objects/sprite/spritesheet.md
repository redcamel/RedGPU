---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

`SpriteSheet3D` 는 격자 형태로 여러 애니메이션 프레임이 나열된 **스프라이트 시트**(Sprite Sheet) 텍스처를 지정된 구획 (Segment)으로 나누어 순차 재생하는 3D 디스플레이
객체입니다.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 1. 기본 사용법

시트의 격자 구조와 재생 속도를 정의하는 `SpriteSheetInfo` 인스턴스를 생성한 뒤 `SpriteSheet3D` 생성자에 전달합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 스프라이트 시트 정보 정의
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png', 
    5, 3, // 가로 5개, 세로 3개 세그먼트
    15,   // 총 프레임 수
    0,    // 시작 프레임 인덱스
    true, // 반복 재생 여부 (loop)
    24    // 초당 프레임 수 (FPS)
);

// 2. SpriteSheet3D 인스턴스 생성 및 추가
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
scene.addChild(spriteSheet);
```

---

## 2. 애니메이션 및 크기 제어

프레임 재생 제어 메서드와 함께 `Sprite3D` 와 동일한 빌보드 및 크기 설정 속성을 제공합니다.

| 속성 / 메서드                 | 기본값  | 설명                                                                                 |
|:------------------------------|:--------|:-------------------------------------------------------------------------------------|
| **`play()` / `stop()`**       | -       | 애니메이션 재생을 시작하거나 현재 프레임에서 일시 정지합니다.                        |
| **`gotoAndPlay(frameIndex)`** | -       | 지정한 프레임 인덱스로 이동한 후 즉시 재생합니다.                                    |
| **`gotoAndStop(frameIndex)`** | -       | 지정한 프레임 인덱스로 이동한 후 정지합니다.                                         |
| **`useBillboard`**            | `true`  | 카메라를 항상 정면으로 향하게 할지 여부                                              |
| **`worldSize`**               | `1`     | `usePixelSize: false` 일 때 적용되는 월드 공간 세로 크기(Unit 단위)                  |
| **`usePixelSize`**            | `false` | 고정 픽셀 크기 모드 사용 여부 (`true` 설정 시 거리에 관계없이 `pixelSize` 로 렌더링) |
| **`pixelSize`**               | `0`     | `usePixelSize: true` 일 때 적용되는 화면상 고정 픽셀 크기(`px`)                      |

```javascript
// 고정 픽셀 크기로 캐릭터 애니메이션 표시
spriteSheet.usePixelSize = true;
spriteSheet.pixelSize = 128;
```

> `worldSize` 와 `usePixelSize` 의 상세 동작 원리는 **[Sprite3D 매뉴얼](./sprite.md)** 을 참고하세요.

---

## 3. 실습 예제: 캐릭터 스프라이트 애니메이션

5x3 격자 시트 이미지 (`SpriteSheetInfo`)를 사용하여 월드 크기 모드와 고정 픽셀 크기 모드로 애니메이션을 재생하는 예제입니다.

<ClientOnly>
<CodePen title="RedGPU - SpriteSheet3D Animation" slugHash="spritesheet3d-basic">
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

    // 1. SpriteSheetInfo 생성 (5x3 격자, 15프레임, 24FPS)
    const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );

    // 2. 월드 사이즈 스프라이트 시트 (World Size)
    const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet1.x = -3; spriteSheet1.y = 1;
    spriteSheet1.worldSize = 2;
    scene.addChild(spriteSheet1);

    // 3. 고정 픽셀 사이즈 스프라이트 시트 (Pixel Size)
    const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet2.x = 3; spriteSheet2.y = 1;
    spriteSheet2.usePixelSize = true;
    spriteSheet2.pixelSize = 150;
    scene.addChild(spriteSheet2);

    // 4. 옵션 설명 라벨 (TextField3D)
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
    controller.distance = 10;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // 렌더링 시작
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 관련 예제

- [SpriteSheet3D 기본](/RedGPU/examples/3d/sprite/spriteSheet3D/)
- [SpriteSheet3D 옵션 비교](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
- [SpriteSheet3D 마우스 이벤트](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)

---

## 다음 단계

- **[TextField3D](../text-field/textfield3d.md)** : 3D 공간 내에 텍스트 레이블 구성 및 배치하기
