---
order: 3
---

# SkyAtmosphere

**SkyAtmosphere**는 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 시스템입니다. 레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering),
오존 흡수(Ozone Absorption) 등을 실시간으로 계산하여 사실적인 하늘, 저녁 노을, 그리고 고도와 거리에 따른 공중 원근법(Aerial Perspective) 효과를 제공합니다.

## 1. 주요 특징

* **실시간 물리 기반 시뮬레이션**: 태양의 고도(빛의 방향)와 대기 밀도에 맞춰 하늘의 색상이 실시간으로 자연스럽게 변화합니다.
* **대기 IBL 자동 연동**: 대기 상태를 분석하여 전용 LUT(Transmittance, SkyView, MultiScattering 등) 및 대기 광원(SkyLight)을 생성하며, 씬 내의 다른 PBR
  오브젝트들에게 실시간 대기 광원 정보를 제공합니다.
* **공중 원근법(Aerial Perspective)**: 오브젝트의 깊이(Depth) 정보를 기반으로 대기에 의한 색상 감쇠와 산란을 포스트 이펙트로 합성하여 공간감을 극대화합니다.
* **통합 제어**: `View3D`에 설정하는 것만으로 배경 렌더링, IBL 반사광 업데이트, 포스트 이펙트 처리가 한 번에 활성화됩니다.

---

## 2. 기본 사용법

SkyAtmosphere는 복잡한 수동 설정 필요 없이 **View3D**의 `skyAtmosphere` 속성에 할당하는 것만으로 전체 파이프라인이 자동 적용됩니다.

```javascript
// 1. SkyAtmosphere 인스턴스 생성
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

// 2. View에 설정 (자동으로 배경 및 대기 포스트 이펙트 적용)
view.skyAtmosphere = skyAtmosphere;
```

---

## 3. 상세 파라미터 설정

`SkyAtmosphere` 인스턴스의 `params` 구조체나 개별 setter를 통해 물리 속성 및 태양, 구름 파라미터를 세밀하게 조정할 수 있습니다.

### 3.1 대기 산란 및 흡수 파라미터

* **`rayleighScattering`** (Vector3)
    * 레일리 산란 계수입니다. 질소, 산소 등 미세한 분자에 의한 산란을 결정하며 하늘의 푸른빛을 형성하는 주원인입니다.
* **`rayleighExponentialDistribution`** (Number)
    * 레일리 밀도가 고도에 따라 감소하는 고도 상수(km)입니다. 기본값은 `8.0`입니다.
* **`mieScattering`** (Vector3)
    * 미 산란 계수입니다. 먼지, 에어로졸 등 비교적 큰 입자에 의한 산란을 결정합니다.
* **`mieAnisotropy`** (Number)
    * 미 산란의 비등방성 계수(G-Factor, `0` ~ `0.999`)입니다. 태양 주변의 눈부심 범위(Mie Glow)를 결정합니다. 기본값은 `0.8`입니다.
* **`mieExponentialDistribution`** (Number)
    * 미 밀도가 고도에 따라 감소하는 고도 상수(km)입니다. 기본값은 `1.2`입니다.
* **`absorptionCoefficient`** (Vector3)
    * 대기 흡수 계수(예: 오존층)입니다. 하늘의 붉은 노을이 깊어질 때의 색감을 빚어냅니다.

### 3.2 태양 및 지표면 설정

* **`sunIntensity`** (Number)
    * 태양 광의 밝기(Lux 단위)입니다. 기본값은 `100,000`입니다.
* **`sunSize`** (Number)
    * 태양의 시각적 크기 각도입니다. 기본값은 `0.533`입니다.
* **`groundRadius`** (Number)
    * 행성의 반경(km)입니다. 지구 기준 기본값은 `6360.0`입니다.
* **`atmosphereHeight`** (Number)
    * 대기권의 전체 높이(km)입니다. 기본값은 `60.0`입니다.
* **`groundAlbedo`** (Vector3)
    * 지표면의 반사율(Albedo)입니다. 지표면에서 반사되어 다시 대기로 산란되는 다중 산란에 영향을 미칩니다.

### 3.3 구름 시뮬레이션 설정

대기 중에 흐르는 가벼운 권운 형태의 구름층을 조절할 수 있습니다.

* **`cloudCoverage`** (Number, `0` ~ `1.0`)
    * 구름이 하늘을 덮는 비율(커버리지)입니다.
* **`cloudDensity`** (Number, `0` ~ `1.0`)
    * 구름의 밀도와 두께감입니다.
* **`cloudHeight`** (Number, `0.1` ~ `20.0`)
    * 구름층이 형성되는 고도(km)입니다.
* **`cloudTimeMultiplier`** (Number)
    * 구름이 흘러가는 시간 변화율 속도 배수입니다.

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
    scene.addLight(sunLight);

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
