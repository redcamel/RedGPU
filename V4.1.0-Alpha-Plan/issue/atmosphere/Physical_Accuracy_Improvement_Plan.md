# [Plan] SkyAtmosphere 물리적 정확도 및 정합성 개선 계획

## 1. 개요
현재 `SkyAtmosphere`는 Sébastien Hillaire(2020)의 모델을 기반으로 구현되어 있으나, 실시간 렌더링 성능 확보와 시각적 아티팩트 해결을 위해 일부 구간에서 임의의 배율(Magic Number)이나 비물리적인 근사식을 사용하고 있습니다. 본 문서는 이를 물리적 기반(Physically Based)으로 정밀하게 교정하기 위한 로드맵을 제시합니다.

---

## 2. 주요 개선 항목 리스트

### 2.1 태양 강도 에너지 보존 및 스케일 통일 (Solar Energy Consistency)
*   **현상**: 
    *   `background_fragment.wgsl`에서는 `sunIntensity * solarIntensityMult`를 사용.
    *   `skyAtmosphereReflectionShaderCode.wgsl`에서는 `solarIntensityMult * 0.1`이라는 임의의 상수를 곱함.
    *   태양 본체의 밝기가 대기 산란광(SkyView)에 비해 물리적으로 얼마나 더 밝아야 하는지에 대한 절대적인 기준이 모호함.
*   **물리적 수정 방향**: 태양의 고체각(Solid Angle)과 태양 상수(Solar Constant)를 기반으로, 대기 상층부에서의 태양 광도(Irradiance)와 대기 산란광의 비율을 물리적으로 고정(Calibration).
*   **우선순위**: P0 (최상) / **중요도**: 상

### 2.2 다중 산란(Multi-Scattering)의 위상 함수 근사화 개선
*   **현상**: `integrateMultiScatSegment` (in `multiScatteringShaderCode.wgsl`)에서 `0.25 * INV_PI` (등방성 산란)를 사용함.
*   **물리적 수정 방향**: 다중 산란은 대개 등방성으로 가정하지만, 실제로는 Rayleigh 산란의 비중이 큽니다. Hillaire 논문의 제안대로 등방성 가정을 유지하되, 에너지 보존을 위해 `fms` (평균 산란 에너지) 계산 시 위상 함수의 적분값을 더 정밀하게 반영하도록 보정.
*   **우선순위**: P2 (보통) / **중요도**: 중

### 2.3 지면 반사 및 주변광(Ground Ambient) 물리 모델 도입
*   **현상**: `skyViewShaderCode.wgsl` 등에 `params.groundAmbient`라는 임의의 추가 광량이 존재함.
*   **물리적 수정 방향**: 지면은 단순한 색상(`groundAlbedo`)뿐만 아니라, 하늘 전체에서 내려오는 조도(Irradiance)를 받아 반사하는 PBR Lambertian 표면으로 처리해야 함. `groundAmbient` 상수를 제거하고, `Multi-Scattering LUT`에서 계산된 전역 환경광 에너지를 지면 반사에 연동.
*   **우선순위**: P1 (높음) / **중요도**: 중

### 2.4 근거리 페이드아웃(Near-field Fade)의 물리적 대체
*   **현상**: `computeCode.wgsl`의 `nearFade = saturate(apDist * 20.0)`는 LUT 해상도 문제를 해결하기 위한 임의의 수치임.
*   **물리적 수정 방향**: 카메라에서 매우 가까운 거리는 LUT를 샘플링하는 대신, 분석적(Analytical)으로 미소 구간의 산란을 직접 적분하거나, LUT 매핑 함수(W-mapping)를 지수 분포가 아닌 카메라 근처에 더 높은 해상도를 갖도록 재정의.
*   **우선순위**: P2 (보통) / **중요도**: 상

### 2.5 오클루전(Occlusion) 근사 모델의 정밀화
*   **현상**: `computeCode.wgsl`의 `occlusionFactor = mix(1.0, saturate(1.0 - viewSunCos), 0.5)`는 그림자 맵이 없을 때를 대비한 시각적 트릭임.
*   **물리적 수정 방향**: 실제 Shadow Map이 있는 경우 이를 참조하여 대기 내 그림자(Volumetric Shadow)를 반영하거나, 최소한 지면 방향(Nadir)으로 갈수록 산란광이 감쇄되는 물리적 감쇄 곡선을 적용.
*   **우선순위**: P2 (보통) / **중요도**: 하 (Shadow Map 연동 시 해결됨)

### 2.6 하이브리드 Mie Glow의 정규화 (Normalization)
*   **현상**: `getMieGlowAmountUnit`에서 `miePhaseSharp * params.mieGlow`를 더할 때, 이 값이 전체 에너지 보존을 깨뜨리지 않는지(Normalization) 검증이 필요함.
*   **물리적 수정 방향**: 분석적 Glow를 더할 때, LUT에서 이미 표현된 Mie 산란 에너지를 그만큼 차감(Subtract)하여 전체 에너지가 보존되도록 수식 수정.
*   **우선순위**: P1 (높음) / **중요도**: 중

### 2.7 반사 큐브맵 클램핑 (Hard Clamping) 개선
*   **현상**: `skyAtmosphereReflectionShaderCode.wgsl`에서 `min(totalRadiance * 0.25, vec3<f32>(100.0))`와 같이 하드 클램핑을 사용함.
*   **물리적 수정 방향**: 하드 클램핑은 HDR 데이터의 연속성을 해칩니다. 수치적 불안정성은 적분 샘플 수를 늘리거나 중요도 샘플링(Importance Sampling)으로 해결하고, 클램핑은 톤 매핑 영역으로 위임.
*   **우선순위**: P1 (높음) / **중요도**: 중

---

## 3. 작업 우선순위 요약

| 항목 | 우선순위 | 중요도 | 상태 |
| :--- | :---: | :---: | :---: |
| **태양 강도 스케일 통합** | **P0** | **상** | 대기 |
| **지면 반사 PBR 연동** | **P1** | **중** | 대기 |
| **Mie Glow 에너지 정규화** | **P1** | **중** | 대기 |
| **반사 큐브맵 클램핑 개선** | **P1** | **중** | 대기 |
| **근거리 페이드아웃 물리 보정** | **P2** | **상** | 대기 |
| **다중 산란 수식 정밀화** | **P2** | **중** | 대기 |
| **오클루전 근사 정밀화** | **P2** | **하** | 대기 |

---

## 4. 향후 검증 방법
1.  **Mitsuba/PBRT Reference 비교**: 물리 기반 오프라인 렌더러의 대기 산란 결과값과 RedGPU의 Radiance를 비교.
2.  **에너지 보존 테스트**: 전체 구(Sphere) 방향으로 방출/산란되는 에너지의 합이 태양 상수(Solar Constant)와 일치하는지 확인.
