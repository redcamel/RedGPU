# 컨트롤러 (Controller)

카메라의 위치를 코드로 일일이 계산하는 것은 매우 번거롭습니다. **Controller**를 사용하면 마우스나 터치 입력을 통해 사용자가 직접 시점을 자유롭게 탐색할 수 있습니다.

## 1. OrbitController (궤도 컨트롤러)

**RedGPU.Camera.OrbitController**는 특정 지점을 중심으로 카메라가 궤도를 그리며 회전하게 해주는 가장 대중적인 컨트롤러입니다.

- **회전**: 마우스 왼쪽 버튼 드래그
- **확대/축소**: 마우스 휠 스크롤
- **이동 (Pan)**: 마우스 오른쪽 버튼 드래그

## 2. 사용법

컨트롤러를 생성한 뒤, `RedGPU.Display.View3D` 생성 시 **세 번째 인자로 컨트롤러 인스턴스**를 직접 전달합니다. 이렇게 하면 뷰와 컨트롤러가 연결되어 마우스 조작이 화면에 즉시 반영됩니다.

```javascript
// 1. 컨트롤러 생성
const controller = new RedGPU.Camera.OrbitController(redContext);

// 2. 컨트롤러 속성 설정
controller.distance = 15; // 대상과의 거리
controller.tilt = 45;     // 상하 각도
controller.pan = 0;       // 좌우 각도

// 3. 뷰 생성 시 컨트롤러 인스턴스(controller)를 직접 전달
const view = new RedGPU.Display.View3D(redContext, scene, controller);
redContext.addView(view);
```

## 3. 실습: 직접 조작하는 3D 세계

사용자가 마우스로 자유롭게 오브젝트를 관찰할 수 있는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redContext) => {
    const scene = new RedGPU.Display.Scene(redContext);
    
    // 1. 컨트롤러 생성
    const controller = new RedGPU.Camera.OrbitController(redContext);
    controller.distance = 20;
    controller.tilt = 30;

    // 2. 중심 물체 생성
    const sun = new RedGPU.Display.Mesh(
        redContext, new RedGPU.Primitive.Sphere(redContext, 2),
        new RedGPU.Material.ColorMaterial(redContext, '#ff4500')
    );
    scene.addChild(sun);

    // 3. 뷰 설정 (세 번째 인자로 controller 전달)
    const view = new RedGPU.Display.View3D(redContext, scene, controller);
    redContext.addView(view);

    // 4. 렌더러 시작
    const renderer = new RedGPU.Renderer();
    renderer.start(redContext);
});
```

## 라이브 데모

마우스 드래그와 휠을 사용하여 장면을 자유롭게 탐색해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Controller" slugHash="orbit-controller">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redContext) => {
    const scene = new RedGPU.Display.Scene(redContext);
    
    // Controller Setup
    const controller = new RedGPU.Camera.OrbitController(redContext);
    controller.distance = 15;
    controller.tilt = 25;

    // Central Object
    const mesh = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.TorusKnot(redContext),
        new RedGPU.Material.ColorMaterial(redContext, "#00CC99")
    );
    scene.addChild(mesh);

    // View Setup with controller
    const view = new RedGPU.Display.View3D(redContext, scene, controller);
    redContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **OrbitController**는 마우스/터치 입력에 따라 시점을 자동으로 제어합니다.
- `RedGPU.Display.View3D`의 세 번째 인자로 **controller 인스턴스**를 전달하여 연결합니다.
- **RedGPU.Renderer.start(redContext)** 를 통해 렌더링 루프를 실행해야 합니다.

## 다음 학습 추천

물체의 표면에 이미지를 입혀 현실감을 높여봅니다.

- **[텍스처와 비트맵 재질 (Texture & BitmapMaterial) →](./texture.md)**
