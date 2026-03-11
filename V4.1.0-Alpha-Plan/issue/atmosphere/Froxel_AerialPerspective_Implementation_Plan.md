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

## 3. 단계별 구현 로직

### 단계 1: `CameraVolumeGenerator` 리팩토링
* **Texture Dimension**: Viewport의 가로세로 비를 고려하거나 고정된 저해상도 격자(예: 32x32)를 할당하도록 수정.
* **Update Frequency**: 카메라의 회전/이동에 따라 **매 프레임 재계산**이 필요함 (현재는 카메라 고도 변화 시에만 갱신됨).

### 단계 2: `cameraVolumeShaderCode.wgsl` 수정
* **UVW to World Position**:
    1. UV를 Screen Space NDC로 변환.
    2. W를 비선형 깊이 공식으로 실제 거리 $d$로 변환.
    3. Inverse Projection/View Matrix를 사용하여 World Position 추출.
* **Scattering Integration**: 추출된 World Position까지의 산란광 및 투과율을 `integrateScatSegment`로 계산하여 저장.

### 단계 3: `computeCode.wgsl` (Post-Effect) 수정
* **Sampling Logic**:
    1. 픽셀의 Depth 값을 읽어 선형 거리 $d$ 계산.
    2. Screen UV와 깊이 $d$를 기반으로 Froxel UVW 계산.
    3. `textureSampleLevel`을 사용하여 산란광 및 투과율 페치.
* **근거리 보정 제거**: Froxel 도입 시 근거리 정밀도가 확보되므로, 기존의 Analytical Approximation(200m 이내 직접 계산) 코드를 제거하여 단순화 가능.

---

## 4. 기대 효과
1. **정밀도 향상**: 화면에 보이는 영역에만 3D 텍셀을 집중시켜 안개와 빛의 산란이 훨씬 부드럽게 표현됨.
2. **에일리어싱 감소**: 구면 좌표계의 극점(Zenith/Nadir) 부근에서 발생하는 아티팩트 원천 차단.
3. **God Rays 기초 확보**: 향후 Froxel 기반 볼륨 렌더링을 확장하여 섀도우 맵과 연동 시 물리적인 빛 내림(Volumetric Shadows) 구현이 용이해짐.

---

## 5. 리스크 및 고려사항
* **카메라 이동 시 지터링(Jittering)**: 격자가 카메라에 고정되어 있으므로, 이동 시 텍셀 간 보간에 의한 미세한 떨림이 발생할 수 있음. (Temporal Filter로 해결 가능)
* **메모리 사용량**: 3D Texture의 해상도가 높아질 경우 비디오 메모리 점유율 상승 주의.

---

## 🔗 관련 문서 (Related Documents)
* **[분석 보고서] [SkyAtmosphere 구현 심층 분석 및 UE5 비교 보고서](./SkyAtmosphere_UE5_Comparison_Analysis.md)**

