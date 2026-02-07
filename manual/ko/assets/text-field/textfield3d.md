---
title: TextField3D
order: 3
---

# TextField3D

**TextField3D** 는 3D 공간 상의 실제 좌표(`x, y, z`)에 배치되는 텍스트 객체입니다. 월드 내의 표지판, 캐릭터 머리 위의 이름표, 또는 특정 객체에 부착된 설명문 등을 만들 때 유용합니다.

## 1. 기본 사용법

`TextField3D` 는 일반적인 **Mesh** 와 동일하게 다루어지며, 3D 공간 내에 물리적으로 위치합니다.

```javascript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "3D World Text");
textField.y = 5; // 공중에 배치
scene.addChild(textField);
```

## 2. 빌보드 (Billboard) 및 크기 제어

3D 텍스트는 카메라의 위치에 따라 측면이나 뒷면이 보일 수 있습니다. 텍스트를 항상 정면으로 보이게 하려면 **Billboard** 기능을 활성화하며, 필요에 따라 월드 단위 크기나 고정된 픽셀 크기를 설정할 수 있습니다.

### 빌보드 설정

- **`useBillboard`**: 활성화 시 카메라가 회전해도 항상 텍스트가 정면을 향합니다.

### 크기 및 렌더링 모드

| 속성명 | 설명 | 기본값 |
| :--- | :--- | :--- |
| **`worldSize`** | 월드 공간에서의 세로 크기 (Unit 단위). 가로 크기는 텍스트 길이에 맞춰 자동 조절됩니다. | `1` |
| **`usePixelSize`** | 고정 픽셀 크기 모드 사용 여부. `true`일 경우 거리에 관계없이 렌더링된 물리 픽셀 크기로 표시됩니다. | `false` |

```javascript
// 1. 월드 단위 크기 설정 (거리에 따라 작아짐)
textField.worldSize = 2;

// 2. 고정 픽셀 크기 설정 (거리에 관계없이 가독성 유지)
textField.usePixelSize = true;
```

## 3. 실습 예제: 3D 텍스트 구성

GLTF 모델과 함께 배치된 3D 텍스트를 구성해 봅니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 3D 텍스트 생성 및 배치
    const text3D = new RedGPU.Display.TextField3D(redGPUContext, "Damaged Helmet");
    text3D.y = 2.5;
    text3D.fontSize = 24;
    text3D.background = "rgba(0, 204, 153, 0.8)";
    text3D.padding = 10;
    text3D.useBillboard = true; // 카메라를 따라 회전
    text3D.worldSize = 1.2;     // 월드 크기 설정
    
    scene.addChild(text3D);

    // 2. 모델 및 환경 설정
    const ibl = new RedGPU.Resource.IBL(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    redGPUContext.addView(view);

    new RedGPU.GLTFLoader(redGPUContext, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', (loader) => {
        scene.addChild(loader.resultMesh);
    });

    new RedGPU.Renderer().start(redGPUContext);
});
```

### 라이브 데모

아래 예제에서 설정 조합에 따른 텍스트 필드의 차이를 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - TextField3D Showcase" slugHash="textfield3d-showcase">
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
    
    // IBL Setup
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    // 헬멧 및 텍스트 필드 그룹 생성을 위한 헬퍼 함수
    const createCase = (x, label, color, useBB, usePS) => {
        // 1. 모델 로딩
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
            (loader) => {
                const mesh = loader.resultMesh;
                mesh.x = x;
                scene.addChild(mesh);
            }
        );

        // 2. 텍스트 필드 생성
        const text = new RedGPU.Display.TextField3D(redGPUContext, label);
        text.x = x; text.y = 1.5;
        text.background = color;
        text.padding = 15;
        text.useBillboard = useBB;
        text.usePixelSize = usePS;
        scene.addChild(text);
    };

    // 케이스 배치
    createCase(-3, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, false);
    createCase(0, "World Size", "rgba(0, 204, 153, 0.8)", true, false);
    createCase(3, "Pixel Size", "rgba(0, 102, 255, 0.8)", true, true);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 10;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **TextField3D** : 월드 공간 내 실제 좌표에 배치되는 텍스트 객체입니다.
- **CSS 스타일**: 색상, 배경, 보더 등 웹 표준 스타일을 그대로 적용할 수 있습니다.
- **Billboard** : 3D 텍스트가 항상 카메라를 바라보게 설정하여 가독성을 높일 수 있습니다.

---

## 다음 단계

사용자의 입력에 반응하는 역동적인 콘텐츠를 만들기 위해 인터렉션 시스템을 알아봅니다.

- **[인터렉션](../../interaction/index.md)**