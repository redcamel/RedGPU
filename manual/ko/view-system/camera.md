---
title: Camera
order: 4
---

# Camera

**Camera**는 3D 월드 좌표계(World Coordinate)를 2D 화면 좌표계(Screen Coordinate)로 변환하기 위한 **투영 행렬**(Projection Matrix)과 **뷰 행렬**(View Matrix)을 관리하는 객체입니다.
RedGPU는 렌더링 파이프라인에서 버텍스 셰이더(Vertex Shader)에 카메라의 행렬 정보를 전달하여 정점의 위치를 계산합니다.

RedGPU는 두 가지 표준 투영 방식을 지원합니다.

## 1. PerspectiveCamera

**`RedGPU.Camera.PerspectiveCamera`**는 **원근 투영**(Perspective Projection) 방식을 사용합니다. 
시야각(FOV)을 기반으로 절두체(Frustum)를 생성하며, 카메라로부터 거리가 멀어질수록 객체가 작게 렌더링됩니다. 사람의 눈이나 실제 카메라 렌즈와 유사한 공간감을 제공합니다.

```javascript
// 인스턴스 생성
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);

// 1. Field of View (시야각, 단위: Degree)
// 값이 클수록 더 넓은 영역을 볼 수 있지만 가장자리 왜곡이 심해질 수 있습니다.
camera.fov = 45; 

// 2. Clipping Planes (렌더링 범위 절단면)
// nearClipping ~ farClipping 사이의 객체만 렌더링됩니다.
camera.nearClipping = 0.1; 
camera.farClipping = 1000; 

// 3. Transform (위치 이동)
camera.x = 0;
camera.y = 5;
camera.z = -10;
```

## 2. OrthographicCamera

**`RedGPU.Camera.OrthographicCamera`**는 **직교 투영**(Orthographic Projection) 방식을 사용합니다.
거리에 따른 크기 변화(원근감)가 발생하지 않으며, 모든 투영선이 평행합니다. 주로 2D UI, 미니맵, CAD 도면 뷰어, 아이소메트릭(Isometric) 게임 등 정확한 비율 유지가 필요한 경우 사용됩니다.

```javascript
// 인스턴스 생성
const camera = new RedGPU.Camera.OrthographicCamera(redGPUContext);

// Zoom Factor (확대/축소 비율)
// 값이 클수록 화면이 확대되어 보입니다.
camera.zoom = 1; 
```

## 3. View Matrix 제어: lookAt

카메라의 위치(`position`)만으로는 시선 방향을 정의하기 어렵습니다. `lookAt` 메서드는 카메라가 특정 월드 좌표를 바라보도록 회전 행렬(Rotation Matrix)을 자동으로 재계산합니다.

```javascript
// 카메라가 월드 원점(0, 0, 0)을 바라보도록 설정
camera.lookAt(0, 0, 0);

// 동적 타겟 추적 (매 프레임 호출 시)
// Target Mesh의 현재 위치를 바라보도록 View Matrix 갱신
camera.lookAt(targetMesh.x, targetMesh.y, targetMesh.z);
```

## 4. 실습 예제

카메라의 위치를 이동시키며 `lookAt`으로 고정된 타겟을 주시하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. PerspectiveCamera 설정
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 5;
    camera.z = -10;
    camera.lookAt(0, 0, 0); // 초기화 시 원점 주시

    // 2. 씬 구성
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
        // Orbit Movement: 원형 궤도로 카메라 이동
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 10;
        camera.z = Math.cos(angle) * 10;
        
        // Matrix Update: 이동 후 다시 원점을 바라보도록 행렬 갱신
        camera.lookAt(0, 0, 0);
    });
});
```

## 라이브 데모

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
    const scene = new RedGPU.Display.Scene();
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

## 관련 문서

- **[Camera Controller (카메라 컨트롤러)](./controller.md)**: 사용자 입력을 통한 카메라 제어 자동화.