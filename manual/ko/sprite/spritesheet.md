---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

**SpriteSheet3D**는 하나의 이미지에 여러 애니메이션 프레임이 포함된 '스프라이트 시트(Sprite Sheet)'를 사용하여 3D 공간 내에서 연속된 동작을 구현하는 객체입니다. 폭발 효과, 불꽃, 걷는 캐릭터 등 역동적인 2D 애니메이션을 3D 공간에 배치할 때 유용합니다.

## 1. 스프라이트 시트 이해

스프라이트 시트는 여러 프레임의 이미지를 격자 형태로 나열한 하나의 커다란 텍스처입니다. RedGPU는 이 텍스처를 지정된 구획(Segment)으로 나누어 프레임별로 순차적으로 보여줌으로써 애니메이션을 완성합니다.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 2. 기본 사용법

스프라이트 시트를 사용하기 위해서는 먼저 시트의 구조를 정의하는 **SpriteSheetInfo** 객체를 생성한 뒤, 이를 **SpriteSheet3D**에 전달해야 합니다.

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

## 3. 애니메이션 제어

`SpriteSheet3D` 인스턴스를 통해 애니메이션의 재생 상태를 실시간으로 제어할 수 있습니다.

- **`play()`**: 애니메이션을 시작합니다.
- **`stop()`**: 현재 프레임에서 애니메이션을 일시 정지합니다.
- **`gotoAndPlay(frameIndex)`**: 지정한 프레임으로 이동한 즉시 재생합니다.
- **`gotoAndStop(frameIndex)`**: 지정한 프레임으로 이동한 후 정지합니다.

## 4. 실습 예제: 걷는 캐릭터 애니메이션

격자 형태의 시트 이미지가 `SpriteSheet3D`와 `Billboard` 설정을 통해 어떻게 자연스러운 캐릭터 동작으로 변하는지 확인해 봅니다.

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

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. SpriteSheetInfo 생성 (5x3 격자, 15프레임, 24FPS)
    const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );

    // 2. 기본 빌보드 (Perspective ON)
    const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet1.x = -3; spriteSheet1.y = 1;
    scene.addChild(spriteSheet1);

    // 3. 빌보드 비활성화 (공간에 고정된 평면)
    const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet2.x = 0; spriteSheet2.y = 1;
    spriteSheet2.useBillboard = false;
    scene.addChild(spriteSheet2);

    // 4. 고정 크기 빌보드 (Perspective OFF)
    const spriteSheet3 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet3.x = 3; spriteSheet3.y = 1;
    spriteSheet3.useBillboardPerspective = false;
    scene.addChild(spriteSheet3);

    // 5. 옵션 설명 라벨 (TextField3D)
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
    controller.distance = 10;
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

- **SpriteSheetInfo**: 이미지 소스와 시트의 격자 구조(Segments), 애니메이션 속도(FPS) 등을 정의합니다.
- **애니메이션 제어**: `play`, `stop`, `gotoAndPlay` 등의 메서드를 통해 시각적 흐름을 제어합니다.
- **효율성**: 여러 장의 이미지를 각각 불러오는 대신 하나의 시트 파일을 사용하므로 네트워크 오버헤드와 GPU 메모리 관리 측면에서 유리합니다.