# Camera

3D 공간을 화면에 출력하기 위해서는 세상을 바라보는 시인 **Camera**가 필요합니다. 카메라는 3D 좌표를 2D 모니터 화면으로 변환해주는 역할을 합니다.

## 1. PerspectiveCamera (원근 카메라)

RedGPU의 **RedGPU.Camera.PerspectiveCamera**는 실제 사람의 눈이나 카메라 렌즈와 동일한 방식으로 작동합니다. 멀리 있는 물체는 작게, 가까운 물체는 크게 렌더링하여 자연스러운 입체감을 제공합니다.

```javascript
// 카메라 생성
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);

// 카메라의 위치 설정
camera.x = 0;
camera.y = 5;
camera.z = -10;
```

## 2. 초점 설정: lookAt

카메라를 특정 위치에 두었더라도, 정작 엉뚱한 곳을 보고 있다면 화면에는 아무것도 나오지 않을 수 있습니다. `lookAt()` 메서드를 사용하면 카메라가 특정 좌표를 정면으로 응시하도록 설정할 수 있습니다.

```javascript
// 카메라가 원점(0, 0, 0)을 바라보게 합니다.
camera.lookAt(0, 0, 0);
```

## 3. 학습: 카메라 위치와 초점의 변화
카메라의 위치를 바꾸면서 초점을 바라보는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // 1. 카메라 생성 및 설정
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 5;
    camera.z = -10;
    camera.lookAt(0, 0, 0);

    // 2. 중심 물체 (바닥과 박스)
    scene.addChild(
        new RedGPU.Display.Mesh(
            redGPUContext, 
            new RedGPU.Primitive.Ground(redGPUContext, 10, 10),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
        )
    );
    const box = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    box.y = 1;
    scene.addChild(box);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        // 시간에 따라 카메라가 원점을 중심으로 회전하도록 위치 변경
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 10;
        camera.z = Math.cos(angle) * 10;
        
        // 위치가 변하더라도 항상 원점을 바라보게 함
        camera.lookAt(0, 0, 0);
    });
});
```

## 라이브 데모 (Live Demo)

아래 예제는 사용자의 조작 없이 코드로 카메라의 위치와 초점을 실시간으로 변경하는 모습을 보여줍니다.

<ClientOnly>
<CodePen title="RedGPU Basics - Camera lookAt" slugHash="camera-lookat">
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

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 5;

    // Floor & Center Box
    scene.addChild(new RedGPU.Display.Mesh(
        redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 10, 10),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    ));
    const box = new RedGPU.Display.Mesh(
        redGPUContext, new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    box.y = 1;
    scene.addChild(box);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 10;
        camera.z = Math.cos(angle) * 10;
        camera.lookAt(0, 0, 0);
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **PerspectiveCamera**는 3D 공간의 깊이감을 표현하는 표준 카메라입니다.
- **x, y, z** 속성으로 카메라의 위치를 직접 제어할 수 있습니다.
- **lookAt()** 메서드는 카메라가 바라볼 지점(좌표)을 지정하는 가장 직관적인 방법입니다.

## 다음 학습 추천

사용자가 직접 카메라를 조작할 수 있는 방법을 알아봅니다.

- **[컨트롤러 (Controller)](./controller.md)**