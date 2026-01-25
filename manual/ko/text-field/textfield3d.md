---
title: TextField3D
order: 3
---

# TextField3D

**TextField3D**는 3D 공간 상의 실제 좌표(`x, y, z`)에 배치되는 텍스트 객체입니다. 월드 내의 표지판, 캐릭터 머리 위의 이름표, 또는 특정 객체에 부착된 설명문 등을 만들 때 유용합니다.

## 1. 기본 사용법

`TextField3D`는 일반적인 `Mesh`와 동일하게 다루어지며, 3D 공간 내에 물리적으로 위치합니다.

```javascript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "3D World Text");
textField.y = 5; // 공중에 배치
scene.addChild(textField);
```

## 2. 빌보드 (Billboard) 기능

3D 텍스트는 카메라의 위치에 따라 측면이나 뒷면이 보일 수 있습니다. 텍스트를 항상 정면으로 보이게 하려면 **Billboard** 기능을 활성화합니다.

- **`useBillboard`**: 활성화 시 카메라가 회전해도 항상 텍스트가 정면을 향합니다.
- **`useBillboardPerspective`**: 원근감에 따른 크기 변화를 유지할지 여부를 결정합니다. (기본값: `true`)

```javascript
textField.useBillboard = true;
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

아래 예제에서 설정 조합에 따른 4가지 텍스트 필드의 차이를 확인해 보세요. 마우스로 카메라를 회전시키면 빌보드 효과의 차이가 명확히 드러납니다.

<ClientOnly>
<CodePen title="RedGPU Basics - TextField3D Billboard Comparison" slugHash="textfield3d-billboard">
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
    const createCase = (x, label, color, useBB, useBP) => {
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
        text.padding = 15; // 패딩 추가
        text.useBillboard = useBB;
        text.useBillboardPerspective = useBP;
        scene.addChild(text);
    };

    // 4가지 케이스 배치
    createCase(-4.5, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, true);
    createCase(-1.5, "Billboard: ON", "rgba(0, 204, 153, 0.8)", true, true);
    createCase(1.5, "Perspective: ON", "rgba(0, 102, 255, 0.8)", true, true);
    createCase(4.5, "Perspective: OFF", "rgba(255, 102, 0, 0.8)", true, false);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;
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

- **TextField3D**: 월드 공간 내 실제 좌표에 배치되는 텍스트 객체입니다.
- **CSS 스타일**: 색상, 배경, 보더 등 웹 표준 스타일을 그대로 적용할 수 있습니다.
- Billboard: 3D 텍스트가 항상 카메라를 바라보게 설정하여 가독성을 높일 수 있습니다.

---

## 다음 단계

텍스트와 함께 3D 공간을 풍성하게 채워줄 이미지 기반의 객체들에 대해 알아봅니다.

- **[스프라이트 (Sprite & SpriteSheet)](../sprite/)**
