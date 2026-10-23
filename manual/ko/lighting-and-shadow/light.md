---
title: Light
order: 1
---
<script setup>
const lightGraph = `
    graph TD
        Scene["Scene (3D 씬)"]
        LightMgr["LightManager (조명 매니저)"]
        Ambient["AmbientLight (환경광)"]
        DirLight["DirectionalLight (방향광)"]
        PointLight["PointLight (점광원)"]
        SpotLight["SpotLight (스포트라이트)"]

        Scene -->|보유| LightMgr
        LightMgr -->|관리| Ambient
        LightMgr -->|관리| DirLight
        LightMgr -->|관리| PointLight
        LightMgr -->|관리| SpotLight
        
        %% 회색조 스타일 적용
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style PointLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style SpotLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Light

RedGPU의 조명 시스템은 물리적 빛 단위 (`Lux`, `Lumen`)를 기반으로 동작하며, `Scene` 내부의 `LightManager` 를 통해 모든 광원을 통합 관리합니다.

---

## 1. 물리적 빛 단위

| 단위        | 물리적 의미              | 적용 광원                          | 설명                                                     |
|:------------|:-------------------------|:-----------------------------------|:---------------------------------------------------------|
| **`Lux`**   | 조도 ($1\text{ lm/m}^2$) | `DirectionalLight`, `AmbientLight` | 단위 면적에 도달하는 빛의 밝기 (`lux` 속성 제어)         |
| **`Lumen`** | 광선속 ($\text{lm}$)     | `PointLight`, `SpotLight`          | 광원에서 사방으로 방출되는 빛의 총량 (`lumen` 속성 제어) |

---

## 2. LightManager와 광원 등록

생성된 광원은 반드시 `scene.lightManager` 에 등록해야 렌더링 연산에 반영됩니다.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

```javascript
// 방향광 및 점광원 추가
scene.lightManager.addDirectionalLight(directionalLight);
scene.lightManager.addPointLight(pointLight);

// 환경광 할당 (씬당 1개)
scene.lightManager.ambientLight = ambientLight;
```

> [!IMPORTANT]
> **광원 등록 한계치 및 재질 주의사항**
> - **`DirectionalLight`**: 최대 **3개**
> - **`PointLight` + `SpotLight`** (클러스터 조명): 합산 최대 **1,024개**
> - **`AmbientLight`**: `Scene` 당 최대 **1개**
> - `ColorMaterial` 은 조명의 영향을 받지 않는 언릿 (Unlit) 재질이므로, 조명 효과를 확인하려면 `PhongMaterial` 또는 `PBRMaterial` 을 사용해야 합니다.

---

## 3. 광원의 종류와 주요 속성

| 광원 클래스            | 물리 단위 (기본값) | 주요 속성                                                    | 특징 및 용도                                                                             |
|:-----------------------|:-------------------|:-------------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| **`DirectionalLight`** | `lux` (`100,000`)  | `direction`, `color`, `lux`                                  | 위치에 무관하게 일정한 방향으로 비추는 평행광(태양광)이며 그림자(CSM) 생성을 지원합니다. |
| **`PointLight`**       | `lumen` (`1,000`)  | `x/y/z`, `radius`, `color`, `lumen`                          | 한 지점에서 모든 방향으로 퍼져나가며 `radius` 범위 내에서 거리 제곱에 비례해 감쇠합니다. |
| **`SpotLight`**        | `lumen` (`1,000`)  | `x/y/z`, `direction`, `radius`, `innerCutoff`, `outerCutoff` | 특정 지점에서 원뿔 형태로 집중된 빛을 조사합니다.                                        |
| **`AmbientLight`**     | `lux` (`50`)       | `color`, `lux`                                               | 방향이나 그림자 없이 씬 전체의 어두운 영역을 균일하게 보정합니다.                        |

---

## 4. 다중 점광원 구현 예제

바닥과 구체들을 `PhongMaterial` 로 배치하고, 서로 다른 색상의 `PointLight` 두 개를 이동시키는 예제입니다.

```javascript
const blueLight = new RedGPU.Light.PointLight('#0000ff', 1000);
blueLight.radius = 15;
scene.lightManager.addPointLight(blueLight);

const redLight = new RedGPU.Light.PointLight('#ff0000', 1000);
redLight.radius = 15;
scene.lightManager.addPointLight(redLight);

// 프레임 루프에서 광원 위치 이동
renderer.start(redGPUContext, (time) => {
    const t = time / 1000;
    blueLight.x = Math.sin(t) * 10;
    blueLight.z = Math.cos(t) * 10;
    redLight.x = Math.sin(t + 3.14) * 10;
    redLight.z = Math.cos(t + 3.14) * 10;
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Multi Lights" slugHash="multi-lights-demo">
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

    const blueLight = new RedGPU.Light.PointLight('#0000ff', 1000);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    const redLight = new RedGPU.Light.PointLight('#ff0000', 1000);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff');
    
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        material
    );
    scene.addChild(floor);

    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
    for (let i = 0; i < 25; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i % 5 - 2) * 4;
        mesh.z = (Math.floor(i / 5) - 2) * 4;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const t = time / 1000;
        blueLight.x = Math.sin(t) * 10;
        blueLight.z = Math.cos(t) * 10;
        blueLight.y = Math.sin(t * 0.5) * 5 + 5;

        redLight.x = Math.sin(t + 3.14) * 10;
        redLight.z = Math.cos(t + 3.14) * 10;
        redLight.y = Math.cos(t * 0.5) * 5 + 5;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

- **[Phong Material](./phong-material.md)** : 조명에 반응하는 표면 질감과 다중 텍스처 맵 설정 방법
