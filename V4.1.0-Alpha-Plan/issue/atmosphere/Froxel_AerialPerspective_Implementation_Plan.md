# Frustum-Aligned 3D Froxel Aerial Perspective 도입 계획

## 1. 배경 및 목적
현재 RedGPU의 `SkyAtmosphere`는 전방위(Spherical) 3D LUT를 사용하여 공중 투시(Aerial Perspective, AP)를 계산합니다. 이는 시야 밖의 데이터까지 계산하여 해상도를 낭비하며, 카메라 근처의 정밀도가 떨어지는 단점이 있습니다. 이를 **카메라 절두체(Frustum)에 최적화된 Froxel 격자** 구조로 개선하여 시각적 품질과 효율성을 동시에 확보합니다.

---

## 2. 핵심 설계 변경 사항

### 2.1 격자 구조 (Grid Structure)
* **기존**: Azimuth(U), Elevation(V), Distance(W) 기반 Spherical 3D LUT.
* **변경**: Screen X(U), Screen Y(V), Exponential Depth(W) 기반 Frustum-Aligned Froxel.
* **해상도 제안**: `32 x 32 x 64` 또는 `64 x 64 x 32` (성능과 정밀도 균형).

### 2.2 깊이 매핑 (Z-Distribution)
근거리의 안개 및 산란 디테일을 극대화하기 위해 깊이 $z$를 다음과 같이 비선형적으로 매핑합니다:
$$W = \frac{\log(d / d_{near})}{\log(d_{far} / d_{near})}$$
또는 단순 지수 매핑:
$$W = \left(\frac{d}{d_{max}}\right)^{power}$$
(UE5의 경우 보통 로그 매핑을 선호함)

---

## 3. 단계별 구현 로직 (완료)

### [V] 단계 1: `CameraVolumeGenerator` 리팩토링
* **Texture Dimension**: 효율적인 실시간 연산을 위해 32x32x32 해상도 적용.
* **Update Frequency**: 카메라의 회전/이동에 대응하여 매 프레임 재계산 로직 구축.

### [V] 단계 2: `cameraVolumeShaderCode.wgsl` 수정
* **NDC to World**: Inverse View/Projection Matrix를 사용하여 정확한 절두체 레이 방향 추출.
* **Camera-Relative Origin**: 정밀도 유지를 위해 카메라 상대 좌표계를 사용하여 산란 적분 수행.

### [V] 단계 3: `computeCode.wgsl` (Post-Effect) 수정
* **Ray Length Correction**: 수직 Z-depth를 실제 광선 길이로 변환하는 `RayLengthRatio` 도입 (화면 가장자리 정밀도 해결).
* **Near-field Fix**: 3D LUT 해상도 한계를 보완하기 위해 200m 이내 영역에 대한 분석적 적분(Analytical Integration) 결합.

---

## 4. 기대 효과 및 성과
1. **정밀도 향상**: 화면 전체에 걸쳐 균일하고 물리적으로 정확한 공중 투시 효과 구현.
2. **근거리 아티팩트 제거**: 카메라 주변 물체가 안개에 덮이는 현상(Over-fogging) 완벽 해결.
3. **God Rays 기초 확보**: Froxel 구조 완성을 통해 Volumetric Shadows 구현을 위한 데이터 파이프라인 완성.

---

## 5. 리스크 관리 및 최적화 전략 (Risk Management)

### 5.1 성능 최적화 (Performance)
* **보셀당 적분 단계 최적화**: 기존 64단계 적분을 Froxel 격자에서는 16~24단계로 조정하여 연산 부하를 낮춤 (격자의 누적 효과로 인해 시각적 손실 최소화).
* **비동기 컴퓨팅(Async Compute)**: WebGPU 환경에서 렌더링 파이프라인과 독립적으로 Compute Pass를 배치하여 효율성 증대.

### 5.2 정밀도 및 아티팩트 방지
* **Exponential Depth Mapping**: $W = (d/d_{max})^{power}$ 공식을 적용하여 근거리 보셀 밀도를 높임 (Near Plane은 0.1~1.0km 사이의 상수로 설정).
* **Dithering & Filtering**: 3D Texture 샘플링 시 Trilinear Filtering을 사용하고, `computeCode.wgsl`에 노이즈 기반 Dithering을 추가하여 밴딩(Banding) 현상 방지.
* **Temporal Filtering**: 카메라 이동 시 발생하는 미세한 지터링(Shimmering)을 억제하기 위해 이전 프레임 데이터를 90~95% 비율로 블렌딩하는 로직 검토.

---

## 6. 현실적 구현을 위한 3대 핵심 가이드 (Implementation Guide)

### 6.1 카메라 상대 좌표계 사용 (Camera-Relative)
월드 좌표($10^6$ 단위)에서 발생하는 정밀도 오차를 방지하기 위해, 보셀의 위치 계산은 카메라 원점(0,0,0) 기준으로 수행하고, 산란 적분 함수에만 절대 고도를 전달하여 계산합니다.

### 6.2 프레임 간 데이터 가중치 제어
매 프레임 재계산 시 발생하는 미세한 노이즈를 잡기 위해, `Froxel LUT` 텍스처를 두 개(Ping-Pong) 준비하여 이전 프레임의 결과와 현재 결과를 `mix(prev, curr, 0.1)` 형태로 섞어주는 **Temporal Amortization**을 고려해야 합니다.

### 6.3 뷰포트 비율 보정
셰이더 내에서 `ScreenCoord = (f32(x)/32.0, f32(y)/32.0)`으로 고정하지 않고, `systemUniforms.projection`에서 전달되는 가로세로 비율을 곱해 절두체의 형태를 물리적으로 정확하게 유지해야 합니다.

---

## 7. 향후 과제: Stage 3 시각적 완성도 향상 (TODO)

### [ ] Task 3.1: 노이즈 기반 Dithering 도입
* **목적**: 3D LUT 보간 과정에서 발생하는 미세한 밴딩(Banding) 현상 제거.
* **내용**: `computeCode.wgsl`에서 샘플링 좌표 또는 결과값에 Blue Noise/Interleaved Gradient Noise를 적용.

### [ ] Task 3.2: Temporal Filtering (Time-slicing) 검토
* **목적**: 카메라 급회전 시 발생하는 지터링 억제 및 프레임 부하 분산.
* **내용**: 
    * 프레임당 격자의 일부만 업데이트하거나, 이전 프레임 결과를 90% 이상 유지하는 지수 이동 평균(EMA) 필터 적용.
    * 핑퐁(Ping-pong) 텍스처 구조 설계.

### [ ] Task 3.3: Volumetric Shadows (God Rays) 프로토타이핑
* **목적**: UE5 수준의 빛 내림 효과 구현.
* **내용**: `CameraVolumeGenerator` 적분 루프 내에서 Directional Light의 Shadow Map 샘플링 연동.

---

## 🔗 관련 문서 (Related Documents)



* **[분석 보고서] [SkyAtmosphere 구현 심층 분석 및 UE5 비교 보고서](./SkyAtmosphere_UE5_Comparison_Analysis.md)**

