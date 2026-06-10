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

**SkyAtmosphere**는 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 시스템입니다. 레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering),
오존 흡수(Ozone Absorption) 등을 실시간으로 계산하여 사실적인 하늘, 저녁 노을, 그리고 고도와 거리에 따른 공중 원근법(Aerial Perspective) 효과를 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. 주요 특징

* **실시간 물리 기반 시뮬레이션**: 태양의 고도(빛의 방향)와 대기 밀도에 맞춰 하늘의 색상이 실시간으로 자연스럽게 변화합니다.
* **대기 IBL 자동 연동**: 대기 상태를 분석하여 전용 LUT(Transmittance, SkyView, MultiScattering 등) 및 대기 광원(SkyLight)을 생성하며, 씬 내의 다른 PBR
  오브젝트들에게 실시간 대기 광원 정보를 제공합니다.
* **공중 원근법(Aerial Perspective)**: 오브젝트의 깊이(Depth) 정보를 기반으로 대기에 의한 색상 감쇠와 산란을 포스트 이펙트로 합성하여 공간감을 극대화합니다.
* **통합 제어**: `View3D`에 설정하는 것만으로 배경 렌더링, IBL 반사광 업데이트, 포스트 이펙트 처리가 한 번에 활성화됩니다.

---

## 2. 기본 사용법

SkyAtmosphere는 씬(Scene)에 추가된 **첫 번째 방향성 광원(DirectionalLight)** 을 태양 광원으로 사용하여 대기 산란을 실시간 연산합니다.
복잡한 수동 설정 필요 없이 **View3D**의 `skyAtmosphere` 속성에 할당하는 것만으로 전체 파이프라인이 자동 적용됩니다.

```javascript
// 1. SkyAtmosphere 인스턴스 생성
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

// 2. View에 설정 (자동으로 배경 및 대기 포스트 이펙트 적용)
view.skyAtmosphere = skyAtmosphere;
```

---

## 3. 태양의 각도 제어 (DirectionalLight 연동)

태양의 위치는 씬에 추가된 첫 번째 `DirectionalLight` 인스턴스의 각도 속성을 제어하여 직관적으로 변경할 수 있습니다. 벡터 데이터를 직접 변경하는 대신, 각도(Degree) 속성을 사용하여 하루의
시간 변화를 손쉽게 시뮬레이션할 수 있습니다.

* **`elevation` (고도)**: 태양의 수직 높이 각도(도, `-90` ~ `90`)를 조절합니다.
  * `90`: 태양이 머리 위에 있는 정오 상태를 나타내며, 푸른 하늘이 연출됩니다.
  * `0` ~ `10`: 태양이 지평선에 걸친 일출/일몰 상태로, 붉은 노을이 표현됩니다.
  * 음수 값 (예: `-10`): 태양이 지평선 아래로 내려간 밤 상태가 표현됩니다.
* **`azimuth` (방위각)**: 태양이 동쪽에서 서쪽으로 지나가는 수평 회전 각도(도, `0` ~ `360`)를 조절합니다.

```javascript
// 고도와 방위각을 직접 변경하여 태양 위치 조정
sunLight.elevation = 5;  // 붉은 노을 연출
sunLight.azimuth = 180;
```

::: tip [기타 물리 파라미터 제어]
Rayleigh/Mie 산란 계수, 오존 흡수율, 지표면 반경, 구름 밀도 등 더 세밀한 대기 시뮬레이션 물리 파라미터는 `skyAtmosphere.params` 속성을 통해 조정할 수 있습니다.
자세한 파라미터 종류와 설정
방법은 [SkyAtmosphere API 레퍼런스](../api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyAtmosphere.md)를 참고하십시오.
:::

---

## 4. 예제 코드

아래 예제는 `DirectionalLight`의 방향 변화(태양의 움직임)에 반응하여 하늘의 대기 상태가 실시간으로 변하는 간단한 연동 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 태양 역할을 할 DirectionalLight 생성
    const sunLight = new RedGPU.Light.DirectionalLight();
  scene.lightManager.addDirectionalLight(sunLight);

    // 2. SkyAtmosphere 생성 및 적용
    const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    
    // 3. 카메라 및 뷰 구성
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    
    // 4. View에 대기 시스템 지정
    view.skyAtmosphere = skyAtmosphere;
    redGPUContext.addView(view);

    // 5. 프레임마다 태양 고도(빛의 방향) 업데이트
    let time = 0;
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (timeDelta) => {
        time += timeDelta * 0.001;
        
        // 태양이 동에서 서로 지는 궤적 시뮬레이션
        const x = Math.cos(time);
        const y = Math.sin(time); // y가 음수가 되면 밤(노을 이후 어둠)이 표현됩니다.
        sunLight.direction = [x, y, 0];
    });
});
```

---

## 5. Skybox와의 비교

| 구분         | Skybox                | SkyAtmosphere               |
|:-----------|:----------------------|:----------------------------|
| **방식**     | 정적 이미지 기반 (큐브맵 / IBL) | 실시간 물리 수식 연산 (LUT 기반)       |
| **태양 반응성** | X (배경 이미지 고정)         | O (태양 방향에 따라 실시간 색상 변화)     |
| **공중 원근법** | X                     | O (오브젝트 거리에 따라 대기 효과 차등 적용) |
| **적합한 용도** | 우주 공간, 실내, 특정 고정 배경   | 광활한 오픈월드 야외 씬, 실시간 시간대 변화 씬 |

---

## 다음 학습 추천

지금까지 배운 객체와 환경 설정을 바탕으로, 실제 프로젝트에서 어떻게 모델을 불러오고 제어하는지 더 깊이 알아봅시다.

- **[모델 로딩](../assets/model-loading/index.md)**
