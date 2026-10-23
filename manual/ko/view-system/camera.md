---
title: Camera
order: 4
---

# Camera

`Camera` 는 3D **월드 좌표계**(World Coordinate)를 2D **화면 좌표계**(Screen Coordinate)로 변환하기 위한 **투영 행렬**(Projection Matrix)과 **뷰
행렬**(View Matrix)을 관리하는 시점 객체입니다.

---

## 1. 카메라 유형

RedGPU는 용도에 따라 세 가지 카메라 클래스를 제공합니다.

| 클래스                   | 투영 방식                | 설명 및 주요 용도                                                                                                                                             |
|:-------------------------|:-------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`PerspectiveCamera`**  | 원근 투영 (Perspective)  | 거리에 따라 원근감이 적용되는 표준 3D 카메라입니다. 물리 기반 노출(`useAutoExposure`)과 `50000` 단위의 원거리 클리핑(`farClipping`)이 기본 설정되어 있습니다. |
| **`OrthographicCamera`** | 직교 투영 (Orthographic) | 거리에 따른 원근 왜곡 없이 물체의 실제 비율을 유지합니다. CAD 도면 뷰어나 2.5D 아이소메트릭 환경에 사용합니다.                                                |
| **`Camera2D`**           | 2D 평면 투영             | UI 및 2D 요소 렌더링 전용 카메라입니다. `View2D` 생성 시 내부적으로 자동 생성되므로 직접 인스턴스화하지 않습니다.                                             |

```javascript
// PerspectiveCamera 생성 (Context 주입 불필요)
const camera = new RedGPU.Camera.PerspectiveCamera();

camera.fieldOfView = 45;     // 시야각 (기본값: 60도)
camera.nearClipping = 0.1;   // 근평면 가시 거리 (기본값: 0.1)
camera.farClipping = 50000;  // 원평면 가시 거리 (기본값: 50000)

// 위치 이동 및 목표 지점 응시(lookAt)
camera.setPosition(0, 5, -15);
camera.lookAt(0, 0, 0);
```

---

## 2. 물리 카메라 노출 및 자동 노출 제어

`PerspectiveCamera` 는 실제 카메라와 동일한 물리적 노출 파라미터 (`aperture`, `shutterSpeed`, `iso`)를 보유합니다. `useAutoExposure = true`(기본값)일
때는 `view.postEffectManager.autoExposure` 설정에 따라 실시간 화면 휘도 적응을 수행하며, `false` 일 때는 수동 노출 (`ev100`) 기준으로 동작합니다.

| 구분               | 속성명                           | 기본값              | 설명                                                          |
|:-------------------|:---------------------------------|:--------------------|:--------------------------------------------------------------|
| **`ACamera`**      | **`useAutoExposure`**            | `true`              | 실시간 화면 휘도 분석 기반 자동 노출 활성화 여부              |
| **`ACamera`**      | **`aperture`**                   | `16.0`              | 조리개 값 (f-stop, 범위: `1.0 ~ 32.0`)                        |
| **`ACamera`**      | **`shutterSpeed`**               | `1 / 125`           | 셔터 스피드 (초 단위 노출 시간)                               |
| **`ACamera`**      | **`iso`**                        | `100`               | 센서 감도 (ISO, 범위: `50 ~ 25600`)                           |
| **`ACamera`**      | **`ev100`**                      | 읽기 전용           | 조리개, 셔터 스피드, ISO로부터 자동 산출된 EV100 노출값       |
| **`AutoExposure`** | **`exposureCompensation`**       | `0.0`               | 자동 노출 결과에 가산할 노출 보정값 (EV 단위)                 |
| **`AutoExposure`** | **`meteringMode`**               | `'center-weighted'` | 측광 모드 (`AVERAGE` 전체 평균 / `CENTER_WEIGHTED` 중앙 중점) |
| **`AutoExposure`** | **`minEV100` / `maxEV100`**      | `6.0` / `15.0`      | 자동 노출이 적응할 최소·최대 EV100 한계 범위                  |
| **`AutoExposure`** | **`adaptationSpeedUp` / `Down`** | `3.0` / `1.0`       | 밝은 곳 및 어두운 곳으로 이동할 때의 눈 적응 속도             |
| **`AutoExposure`** | **`targetLuminance`**            | `0.18`              | 자동 노출이 목표로 삼는 화면 평균 휘도 기준값 (18% 중성 회색) |

```javascript
// 자동 노출(AutoExposure) 세부 파라미터 조정 예시
const autoExposure = view.postEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5; // +0.5 EV 밝게 보정
autoExposure.meteringMode = RedGPU.Camera.AutoExposure.METERING_MODE.CENTER_WEIGHTED;
autoExposure.minEV100 = 6.0;
autoExposure.maxEV100 = 15.0;
```

---

## 3. 실습 예제: 카메라 궤도 회전과 `lookAt()`

카메라 위치를 원형 궤도로 이동시키면서 `lookAt(0, 0, 0)` 을 호출하여 항상 중앙의 물체를 주시하도록 뷰 행렬을 갱신하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. PerspectiveCamera 설정
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
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

    // 3. 애니메이션: 카메라 궤도 이동 및 시선 고정
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
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

    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
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

- **[Camera Controller](./controller.md)** : 마우스·터치·키보드를 이용한 인터랙티브 카메라 및 캐릭터 제어
