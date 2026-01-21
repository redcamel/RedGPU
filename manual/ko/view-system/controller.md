---
title: Camera Controller
order: 5
---

# Camera Controller

**Controller**는 사용자 입력(Mouse, Touch, Keyboard)을 감지하여 카메라의 위치와 회전(Transform)을 실시간으로 갱신하는 **상호작용 모듈**(Interaction Module)입니다.
복잡한 행렬 연산 없이도 직관적인 3D 내비게이션 환경을 구축할 수 있도록 돕습니다.

## 1. 컨트롤러 유형

RedGPU는 다양한 인터랙션 시나리오에 대응하는 표준 컨트롤러를 제공합니다.

| 클래스명 | 기반 알고리즘 | 주요 적용 사례 |
| :--- | :--- | :--- |
| **`OrbitController`** | Spherical Coordinate (구면 좌표계) | 모델 뷰어, 턴제 게임, 일반적인 3D 씬 탐색 |
| **`FollowController`** | Target Interpolation (타겟 보간 추적) | TPS(3인칭) 게임, 캐릭터 추적 카메라 |
| **`FreeController`** | First-Person Navigation (1인칭 이동) | FPS 게임, 건축물 내부 투어, 디버깅 |
| **`IsometricController`** | Orthographic Projection (직교 투영) | 전략 시뮬레이션(RTS), 아이소메트릭 뷰 |

::: tip [카메라 인스턴스 관리]
모든 Controller 클래스는 내부적으로 전용 **Camera 인스턴스**를 생성하여 소유(Has-a relationship)합니다. 
따라서 Controller를 생성하면 별도의 Camera를 생성할 필요가 없으며, `View3D`에 Controller 인스턴스를 전달하면 내부의 카메라가 자동으로 연결됩니다.
:::

## 2. 구현 패턴: OrbitController

가장 범용적인 **OrbitController**의 사용 패턴입니다. `RedGPU.Display.View3D` 초기화 시 Camera 인자가 들어갈 자리에 Controller 인스턴스를 전달하는 것이 핵심입니다.

```javascript
// 1. Controller 인스턴스 생성
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

// 2. 파라미터 튜닝
controller.distance = 15; // 타겟(Pivot)으로부터의 거리
controller.tilt = 45;     // 수직 회전 각도 (Elevation)
controller.pan = 0;       // 수평 회전 각도 (Azimuth)

// 3. View 연결 (Dependency Injection)
// View3D는 전달받은 객체가 Controller일 경우, controller.camera를 렌더링에 사용합니다.
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

// 4. 등록
redGPUContext.addView(view);
```

## 3. 실습 예제

마우스 인터랙션을 통해 3D 오브젝트를 다각도로 관찰하는 뷰어 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // 1. Controller 초기화 (Camera 내장)
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 20;
    controller.tilt = 30;

    // 2. 렌더링 대상 추가
    const sun = new RedGPU.Display.Mesh(
        redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    // 3. View 생성 및 연결
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 4. 렌더 루프 시작
    // Controller는 내부적으로 매 프레임 입력을 감지하여 Camera Matrix를 갱신합니다.
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

## 라이브 데모

- **Left Click + Drag**: 궤도 회전 (Rotate)
- **Wheel Scroll**: 줌 인/아웃 (Zoom)

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

## 관련 문서

- **[Texture & BitmapMaterial](../basic-objects/texture.md)**: 3D 객체의 표면 질감 표현.