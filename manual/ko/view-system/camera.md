---
title: Camera
order: 4
---

# Camera

**Scene** 이 모든 물체가 배치된 '무대'라면, **Camera** 는 그 무대를 바라보는 '관찰자의 눈' 입니다.
**월드 좌표계**(World Coordinate) 를 **화면 좌표계**(Screen Coordinate) 로 변환하기 위한 **투영 행렬**(Projection Matrix) 과 **뷰 행렬**(View Matrix) 을 관리하는 핵심 객체입니다.

RedGPU 는 용도에 따라 세 가지 표준 투영 방식을 지원합니다.

## 1. PerspectiveCamera

**PerspectiveCamera** 는 **원근 투영**(Perspective Projection) 방식을 사용합니다. 사람의 눈이나 실제 카메라 렌즈와 유사하게 작동하며, 멀리 있는 물체는 작고 가까운 물체는
크게 렌더링하여 현실감 있는 공간감을 제공합니다.

특히 RedGPU의 **PerspectiveCamera**는 실제 세계의 렌즈를 시뮬레이션하는 **물리 기반 카메라(Physical Camera)** 모델링을 지향합니다. 주변 환경의 조도(광량) 변화에 맞추어
실시간으로 화면의 적정 밝기 노출값을 자동 계산해주는 **자동 노출(`useAutoExposure`) 기능이 기본 활성화(`true`)** 되어 동작합니다.

```javascript
// 인스턴스 생성 (Context 주입 필요)
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);

// 1. 자동 노출 기능 활성화 여부 제어 (기본값: true)
camera.useAutoExposure = true;

// 2. 시야각(Field of View) 설정 (기본값: 60도)
// 값이 클수록 넓은 영역을 보지만 가장자리 왜곡이 심해질 수 있습니다.
camera.fieldOfView = 45;

// 3. 가시 거리(Clipping Planes) 설정
// near ~ far 사이의 물체만 화면에 그려집니다.
camera.nearClipping = 0.1;
camera.farClipping = 1000;

// 4. 위치 설정 (Transform)
camera.x = 0;
camera.y = 5;
camera.z = -15;
```

## 2. Camera2D

**Camera2D** 는 UI 및 2D 요소 렌더링에 특화된 2D 전용 카메라입니다. 이 카메라는 개발자가 직접 `new` 키워드를 사용해 생성하여 등록하지 않으며, **View2D** 객체를 초기화 및 생성할 때
**내부적으로 자동 생성되어 등록**되어 사용됩니다.

## 3. OrthographicCamera

**OrthographicCamera** 는 원근감에 따른 왜곡이 발생하지 않는 **직교 투영**(Orthographic Projection) 카메라입니다. 주로 원근감이 없이 물체의 실제 스펙 비율을 정확히
유지해야 하는 기계 및 건축 도면 설계 뷰어나 2.5D 쿼터뷰(Isometric) 환경이 필요한 경우에 이런 카메라가 있다는 점을 참고하여 제한적으로 사용됩니다.

---

## 4. 시선 제어 (lookAt)

카메라의 위치를 옮긴 후 특정 지점을 정면으로 응시하게 하려면 `lookAt()` 메서드를 사용합니다. 이 메서드는 목표 지점을 바라보도록 **뷰 행렬** 을 자동으로 재계산합니다.

```javascript
// 카메라가 월드 원점(0, 0, 0) 을 바라보도록 설정
camera.lookAt(0, 0, 0);

// 움직이는 물체를 추적하는 경우 (매 프레임 호출)
// camera.lookAt(mesh.x, mesh.y, mesh.z);
```

## 4. 실습 예제: 카메라 궤도 회전

카메라의 위치를 원형 궤도로 이동시키면서, `lookAt()` 을 이용해 항상 중앙의 물체를 주시하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. PerspectiveCamera 설정
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 8; // 약간 높은 위치에서 내려다보기
    
    // fieldOfView 설정
    camera.fieldOfView = 45;
    camera.lookAt(0, 0, 0);

    // 2. 씬 구성 (TorusKnot + 조명)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    // 3. 애니메이션: 카메라 위치를 실시간으로 변경
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        
        // 이동 후 항상 원점(0, 0, 0) 을 바라보도록 갱신
        camera.lookAt(0, 0, 0);
    });
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Camera lookAt" slugHash="camera-lookat">
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
    
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    
    scene.lightManager.addDirectionalLight(dirLight);

    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 8;
    
    // fieldOfView 설정
    camera.fieldOfView = 45;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

카메라의 위치를 코드로 일일이 계산하는 대신, 마우스와 터치를 이용해 직관적으로 조종하는 방법을 알아봅니다.

- **[카메라 컨트롤러](./controller.md)**
