---
order: 3
---

# Scene

**Scene**은 모든 3D 객체(Mesh, Light)가 배치되는 **무대**이자 **컨테이너**입니다. 아무리 멋진 모델과 조명을 만들어도, Scene에 추가하지 않으면 화면에 나타나지 않습니다.

## 1. Scene의 역할

RedGPU에서 **RedGPU.Display.Scene**은 다음과 같은 핵심 역할을 수행합니다.

- **객체 컨테이너**: `addChild()`를 통해 Mesh, Group 등 시각적 객체를 포함합니다.
- **조명 관리**: `LightManager`를 내장하여 Scene 전체의 조명을 관리합니다.
- **배경 설정**: 단색 배경(Background Color)을 설정합니다. (단, 스카이박스는 View에서 관리합니다.)

## 2. Scene 생성 및 배경색 설정

Scene을 생성할 때는 별도의 인자가 필요하지 않습니다. `useBackgroundColor` 속성을 켜고 `backgroundColor`를 설정하면 Scene의 배경색을 지정할 수 있습니다.

```javascript
// 1. Scene 생성
const scene = new RedGPU.Display.Scene();

// 2. 배경색 활성화 및 색상 설정
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#5259c3'); // 파란색 배경
```

## 3. 조명 관리자 (LightManager)

앞서 [조명(Light)](./light.md) 챕터에서 다루었듯이, 모든 조명은 Scene이 가지고 있는 `lightManager`에 등록해야 합니다.

```javascript
// 환경광 설정
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

// 방향광 추가
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);
```

## 4. Scene과 뷰(View)의 관계

초보자가 자주 헷갈리는 부분은 **Scene**과 **View**의 관계입니다.

- **Scene**: "무엇을(What)" 보여줄지 정의하는 **공간**입니다. (객체, 조명, 배경색)
- **View**: 그 공간을 "어떻게(How)" 볼지 정의하는 **창**입니다. (카메라, 스카이박스, 뷰포트 크기)

```javascript
// Scene: 객체들이 사는 세상
const scene = new RedGPU.Display.Scene();

// View: 세상을 바라보는 창 (Camera와 Scene을 연결)
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

// Skybox는 View에 설정합니다!
view.skybox = mySkybox; 
```

## 6. 학습: Scene 구성 예제 (배경색 설정)

배경색을 설정하고 간단한 객체를 배치하여 Scene을 구성해 봅니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    // 1. Scene 생성
    const scene = new RedGPU.Display.Scene();
    
    // 2. 배경색 설정 (진한 남색)
    scene.useBackgroundColor = true;
    scene.backgroundColor.setColorByHEX('#1a1a2e');

    // 3. 카메라 및 컨트롤러 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    // 4. 객체 추가 (노란색 상자)
    const box = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#e94560')
    );
    scene.addChild(box);

    // 5. 뷰 생성 및 등록
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationX += 0.5;
    });
});
```

## 라이브 데모 (Live Demo)

배경색이 적용된 Scene 위에서 회전하는 상자를 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Scene Background" slugHash="scene-background">
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

    // Background Color Setup
    scene.useBackgroundColor = true;
    scene.backgroundColor.setColorByHEX('#222831'); // Dark Gray

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    const box = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(box);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationZ += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **Scene**은 객체와 조명을 담는 최상위 컨테이너입니다.
- **배경색**은 `scene.useBackgroundColor`와 `scene.backgroundColor`로 설정합니다.
- **스카이박스(Skybox)**는 Scene이 아닌 **View**에 설정한다는 점을 주의해야 합니다.

## 다음 학습 추천

이제 기본적인 Scene 구성 방법을 모두 익혔습니다. 외부에서 제작된 정교한 3D 모델을 불러와 Scene을 더욱 풍성하게 만들어 봅시다.

- **[모델 로딩 (GLTF Loader)](./gltf-loader.md)**