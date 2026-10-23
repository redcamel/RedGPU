---
title: SkyAtmosphere
order: 3
---

<script setup>
const skyAtmosphereGraph = `
    Sun["Sun (DirectionalLight)"] -->|빛의 방향 제공| Atmosphere["SkyAtmosphere (대기 산란 계산)"]
    Atmosphere -->|배경 렌더링| View["View3D (배경 및 포스트 이펙트 적용)"]

    %% 회색조 스타일 적용
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# SkyAtmosphere

`SkyAtmosphere` 는 레일리 산란 (Rayleigh Scattering), 미 산란 (Mie Scattering), 오존 흡수 (Ozone
Absorption)를 실시간 계산하여 하늘 색상 변화와 공중 원근법 (Aerial Perspective)을 구현하는 물리 기반 대기 시뮬레이션 시스템입니다.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. 주요 특징 및 비교

- **실시간 대기 산란 및 IBL 연동**: 태양 고도와 대기 밀도에 맞춰 전용 LUT (Transmittance, SkyView, MultiScattering)와 대기 광원을 생성하여 씬 내 PBR 객체에 실시간
  환경광을 제공합니다.
- **공중 원근법**: 오브젝트 깊이 (Depth)를 기반으로 대기에 의한 색상 감쇠와 산란을 포스트 이펙트로 합성합니다.

| 구분            | SkyBox                                   | SkyAtmosphere                           |
|:----------------|:-----------------------------------------|:----------------------------------------|
| **연산 방식**   | 정적 이미지 기반 (`CubeTexture` / `IBL`) | 실시간 물리 수식 연산 (LUT 기반)        |
| **태양 반응성** | X (배경 이미지 고정)                     | O (태양 방향에 따른 실시간 색상 변화)   |
| **공중 원근법** | X                                        | O (거리에 따른 대기 산란 차등 적용)     |
| **적합한 용도** | 우주, 실내, 고정 배경                    | 오픈월드 야외 씬, 실시간 시간대 변화 씬 |

---

## 2. 기본 사용법 및 태양 각도 제어

`SkyAtmosphere` 는 `Scene` 에 등록된 **첫 번째 `DirectionalLight`** 를 태양 광원으로 사용하며, `View3D` 의 `skyAtmosphere` 속성에 할당하면 배경 렌더링,
대기 IBL, 공중 원근법이 한 번에 활성화됩니다.

```javascript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

첫 번째 `DirectionalLight` 의 방향 (`direction`) 또는 각도 속성을 변경하여 시간대별 하늘을 시뮬레이션합니다.

- **`elevation`** (`-90` ~ `90`): 태양의 수직 고도 각도입니다. `90` 은 정오 (푸른 하늘), `0` ~ `10` 은 일출/일몰 (붉은 노을), 음수는 일몰 후 밤 상태를 표현합니다.
- **`azimuth`** (`0` ~ `360`): 태양이 동쪽에서 서쪽으로 이동하는 수평 방위각입니다.

```javascript
sunLight.elevation = 5;  // 붉은 노을 연출
sunLight.azimuth = 180;
```

> [!TIP]
> 레일리/미 산란 색상 (`ColorRGB`) 및 계수 배율 (`*Scale`), 오존 흡수 (`absorption`, `absorptionScale`), 지표면 반경 (`groundRadius`), 구름
(`cloudCoverage`, `cloudDensity`) 등 상세 물리 파라미터는 `SkyAtmosphere` API 문서를 참고하세요.

---

## 3. 예제 코드

`DirectionalLight` 의 방향 변화에 따라 하늘의 대기 상태가 실시간으로 변하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 태양 역할을 할 DirectionalLight 생성
    const sunLight = new RedGPU.Light.DirectionalLight();
  scene.lightManager.addDirectionalLight(sunLight);

  // 2. SkyAtmosphere 생성 및 View에 지정
    const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = skyAtmosphere;
    redGPUContext.addView(view);

  // 3. 프레임마다 태양 고도(빛의 방향) 업데이트
    let time = 0;
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (timeDelta) => {
        time += timeDelta * 0.001;

      // 태양이 동에서 서로 지는 궤적 시뮬레이션 (y가 음수가 되면 밤 표현)
        const x = Math.cos(time);
      const y = Math.sin(time);
        sunLight.direction = [x, y, 0];
    });
});
```

---

## 다음 단계

- **[전역 바람 시스템](./wind.md)** : `WindManager` 로 씬 전체의 바람 방향과 세기 제어하기
