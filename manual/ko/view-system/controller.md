---
order: 5
---


# Controller

카메라의 위치를 코드로 일일이 계산하는 것은 매우 번거로운 일입니다. **Controller**를 사용하면 마우스나 터치 입력을 통해 사용자가 직접 시점을 자유롭게 탐색할 수 있습니다.

## 1. 다양한 컨트롤러 제공

RedGPU는 콘텐츠의 특성에 맞춰 즉시 사용할 수 있는 다양한 컨트롤러를 제공합니다. 모든 컨트롤러는 **RedGPU.Camera** 네임스페이스 아래에 위치합니다.

| 종류 | 특징 | 주요 용도 |
| :--- | :--- | :--- |
| **OrbitController** | 특정 대상을 중심으로 궤도 회전 | 제품 뷰어, 객체 관찰, 일반 3D 장면 |
| **FollowController** | 특정 대상을 부드럽게 추적 | 3인칭 게임, 캐릭터 추적 카메라 |
| **FreeController** | 관찰자 시점에서 자유로운 이동 | FPS 게임, 가상 투어, 개발자용 디버그 시점 |
| **IsometricController** | 고정된 각도를 유지하는 쿼터뷰 | 시뮬레이션 게임, 전략 게임, 인포그래픽 |

## 2. 기본 사용법: OrbitController

가장 대중적으로 사용되는 **OrbitController**를 예로 들어 사용법을 알아보겠습니다. 컨트롤러를 생성한 후, `RedGPU.Display.View3D` 생성 시 **세 번째 인자로 컨트롤러 인스턴스**를 직접 전달하면 뷰와 연결됩니다.

```javascript
// 1. 컨트롤러 생성
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

// 2. 컨트롤러 속성 설정
controller.distance = 15; // 대상과의 거리
controller.tilt = 45;     // 상하 각도
controller.pan = 0;       // 좌우 각도

// 3. 뷰 생성 시 컨트롤러 인스턴스(controller)를 직접 전달
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);
```

## 3. 학습: 직접 조작하는 3D 세계

사용자가 마우스로 자유롭게 오브젝트를 관찰할 수 있는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // 1. 컨트롤러 설정 (카메라는 내부에 자동 생성됨)
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 20;
    controller.tilt = 30;

    // 2. 중심 물체 생성
    const sun = new RedGPU.Display.Mesh(
        redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    // 3. 뷰 설정 (세 번째 인자로 controller 전달)
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 4. 렌더러 시작
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

## 라이브 데모 (Live Demo)

마우스 드래그와 휠을 사용하여 화면을 자유롭게 탐색해 보세요.

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

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // Controller Setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 15;
    controller.tilt = 25;

    // Central Object
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99")
    );
    scene.addChild(mesh);

    // View Setup with controller
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- RedGPU는 **Orbit, Follow, Free, Isometric** 등 다양한 컨트롤러를 기본 제공합니다.
- 컨트롤러는 카메라를 내부에 생성하여 소유하며, 마우스와 터치 입력을 시점으로 변환합니다.
- `RedGPU.Display.View3D`의 세 번째 인자로 **controller 인스턴스**를 전달하여 연결합니다.

## 다음 학습 추천

물체의 표면에 이미지를 입혀 실제감을 부여해 봅니다.

- **[텍스처와 비트맵 재질 (Texture & BitmapMaterial)](../basic-objects/texture.md)**