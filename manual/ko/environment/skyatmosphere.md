---
title: SkyAtmosphere
order: 3
---

<script setup>
const skyAtmosphereGraph = `
    Sun["Sun (DirectionalLight)"] -->|빛의 방향 제공| Atmosphere["SkyAtmosphere (대기 산란 계산)"]
    Atmosphere -->|배경 및 대기 광원| View["View3D (배경·IBL·공중 원근법 적용)"]

    %% 회색조 스타일 적용
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# SkyAtmosphere

`SkyAtmosphere` 는 물리 기반 대기 산란 (Atmospheric Scattering) 시뮬레이션 시스템입니다. 레일리 산란 (Rayleigh Scattering), 미 산란 (Mie
Scattering), 오존 흡수 (Ozone Absorption) 등을 실시간으로 계산하여 사실적인 하늘, 저녁 노을, 그리고 거리에 따른 공중 원근법 (Aerial Perspective) 효과를 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. 주요 특징

- **실시간 물리 기반 시뮬레이션**: 태양의 고도 (`DirectionalLight`)와 대기 밀도에 맞춰 하늘의 색상이 실시간으로 변화합니다.
- **대기 IBL 자동 연동**: 대기 상태를 분석하여 전용 환경광 (SkyLight)을 생성하고 씬 내의 PBR 객체에 실시간 반사광 및 간접 조명을 제공합니다.
- **공중 원근법 (Aerial Perspective)**: 오브젝트와의 거리 (Depth)에 따른 대기 산란과 색상 감쇠를 자동으로 합성하여 공간감을 극대화합니다.
- **통합 제어**: `View3D` 의 `skyAtmosphere` 속성에 할당하는 것만으로 배경 렌더링, 대기 IBL, 공중 원근법이 한 번에 활성화됩니다.

---

## 2. 기본 사용법

`SkyAtmosphere` 는 `Scene` 에 등록된 첫 번째 `DirectionalLight` 를 태양 광원으로 사용하여 대기 산란을 실시간 연산합니다.

```javascript
// 1. 태양 역할을 할 DirectionalLight 등록
const sunLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(sunLight);

// 2. SkyAtmosphere 생성 및 View에 적용
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

---

## 3. 태양 각도 및 대기 속성 제어

태양의 위치는 `DirectionalLight` 의 구면 좌표 각도 속성 (`elevation`, `azimuth`)으로 직관적으로 제어할 수 있습니다.

- **`elevation` (고도, `-90 ~ 90`도)**: 태양의 수직 높이 각도입니다.
  - `45 ~ 90`: 맑고 푸른 낮 하늘
  - `0 ~ 10`: 태양이 지평선에 걸친 붉은 일출/일몰 노을
  - 음수 값 (예: `-10`): 일몰 이후의 밤 하늘
- **`azimuth` (방위각, `0 ~ 360`도)**: 태양의 수평 회전 각도입니다.

```javascript
// 1. 태양 고도 및 방위각 조정 (노을 연출)
sunLight.elevation = 5;
sunLight.azimuth = 180;

// 2. 구름 및 대기 산란 속성 조정
skyAtmosphere.cloudCoverage = 0.5; // 구름 분포 범위 (0.0 ~ 1.0, 기본값: 0.4)
skyAtmosphere.cloudDensity = 0.7;  // 구름 밀도 (0.0 ~ 1.0, 기본값: 0.7)
```

::: tip [세부 대기 물리 파라미터]
레일리/미 산란 계수 (`rayleighScatteringScale`, `mieScatteringScale`), 오존 흡수 (`ozoneAbsorptionScale`), 행성 반경 (`groundRadius`) 등
상세 속성은 `SkyAtmosphere` API 문서를 참고하세요.
:::

---

## 4. 실습 예제: 태양 고도에 따른 하늘과 노을 변화

`DirectionalLight` 의 `elevation` 값을 시간에 따라 변화시켜 한낮의 푸른 하늘부터 저녁 노을까지 실시간으로 변하는 하늘을 확인해 봅니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 태양 광원(DirectionalLight) 생성 및 등록
    const sunLight = new RedGPU.Light.DirectionalLight();
    sunLight.azimuth = 180;
    scene.lightManager.addDirectionalLight(sunLight);

    // 2. SkyAtmosphere 생성 및 View 적용
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.tilt = 10;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    redGPUContext.addView(view);

    // 3. 시간에 따라 태양 고도(elevation) 애니메이션
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        sunLight.elevation = Math.sin(time * 0.0005) * 25 + 20;
    });
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - SkyAtmosphere" slugHash="skyatmosphere-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    const sunLight = new RedGPU.Light.DirectionalLight();
    sunLight.azimuth = 180;
    scene.lightManager.addDirectionalLight(sunLight);

    const sphere = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
        new RedGPU.Material.PBRMaterial(redGPUContext)
    );
    sphere.material.metallicFactor = 0.9;
    sphere.material.roughnessFactor = 0.15;
    scene.addChild(sphere);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.tilt = 5;
    controller.distance = 10;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        sunLight.elevation = Math.sin(time * 0.0006) * 25 + 20;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 5. SkyBox와의 비교

| 구분            | `SkyBox`                                 | `SkyAtmosphere`                                |
|:----------------|:-----------------------------------------|:-----------------------------------------------|
| **방식**        | 정적 이미지 기반 (`CubeTexture` / `IBL`) | 실시간 물리 산란 연산 (LUT 기반)               |
| **태양 반응성** | X (배경 이미지 고정)                     | O (`DirectionalLight` 방향에 따라 실시간 변화) |
| **공중 원근법** | X                                        | O (거리에 따라 대기 산란 차등 적용)            |
| **적합한 용도** | 실내, 우주 공간, 고정된 배경             | 야외 오픈월드, 시간대(낮/노을/밤)가 변하는 씬  |

---

## 관련 예제

- [SkyAtmosphere 기본](/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
- [대기 산란 파라미터 테스트](/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
- [SkyAtmosphere + glTF 모델](/RedGPU/examples/3d/skyAtmosphere/gltf/)

---

## 다음 학습 추천

씬 전체의 바람 방향과 세기를 제어하여 자연스러운 환경 움직임을 만드는 방법을 알아봅니다.

- **[전역 바람 시스템 (WindManager)](./wind.md)**
