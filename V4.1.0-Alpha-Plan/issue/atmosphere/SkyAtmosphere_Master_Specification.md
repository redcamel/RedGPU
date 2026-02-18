# [Technical Specification] Physically Based Atmospheric Scattering System (SkyAtmosphere)

## 1. 개요 (Overview)
SkyAtmosphere는 월드 공간 내의 물리적 공기 밀도(Atmospheric Density)를 시뮬레이션하는 전역 환경 시스템입니다. 본 시스템은 카메라와 객체 사이의 매질 내에서 발생하는 빛과 입자의 상호작용을 계산하며, 다음과 같은 물리 현상을 기반으로 합니다.

1. **Extinction (소멸)**: 물체에서 출발한 빛이 관찰자에게 도달하기 전 Rayleigh 및 Mie 산란에 의해 감쇄되는 현상입니다. 거리 증가에 따른 색상 및 대비의 지수적 감소를 재현합니다.
2. **In-scattering (인스캐터링)**: 광원에서 방출된 빛이 대기 입자에 의해 굴절되어 관찰자의 시선 방향으로 유입되는 현상입니다.
    * **Rayleigh In-scattering**: 분자 단위 산란에 의한 단파장(청색) 산란광을 생성합니다.
    * **Mie In-scattering**: 미세 입자에 의한 전방 산란 및 태양 주변의 헤일로(Halo)를 형성합니다.

본 시스템은 Sébastien Hillaire (2020)의 모델을 WebGPU Compute Shader 환경에 최적화하여 실시간 적분 연산을 수행합니다.

---

## 2. 기술적 세부 사양 (Technical Specifications)

### 2.1 물리 시뮬레이션 모델 (Physical Simulation Model)
지구 대기의 물리적 조성을 수학적으로 모델링합니다.

* **Rayleigh Scattering**: 파장의 4제곱에 반비례하는 분자 산란을 시뮬레이션합니다.
* **Mie Scattering**: 에어로졸 등 큰 입자에 의한 산란 및 지평선 연무(Haze)를 시뮬레이션합니다.
* **Gaussian Ozone Absorption**: 오존층에 의한 특정 파장 흡수를 가우시안 분포 모델($Center: 25km, Width: 15km$)로 적용합니다.
* **Physically Integrated Fog**: 높이 안개(Height Fog)를 별도의 포스트 프로세스가 아닌 대기 산란 적분 공식 내 Mie 산란 구성 요소로 통합하여 연산합니다.
* **Multi-Scattering (Fms)**: 2차 이상의 다중 산란 근사 계산을 통해 에너지를 보존하고 지평선 휘도를 보정합니다.

### 2.2 LUT 파이프라인 구조 (LUT Pipeline Infrastructure)
실시간 연산 부하 최적화를 위해 4종의 Look-Up Table을 운용합니다.

| 명칭 | 해상도 | 주요 역할 | 알고리즘/매핑 |
| :--- | :---: | :--- | :--- |
| **Transmittance** | 256x64 | 고도 및 각도별 투과율 데이터 | 비선형 (Zenith angle vs Altitude) |
| **Multi-Scattering** | 32x32 | 다중 산란 에너지 보정 | 선형 (1.0 - H) 기반 에너지 보존 |
| **Sky-View** | 200x200 | 전방위 대기색 시각화 텍스처 | 위경도 매핑 및 지평선 왜곡 보정 |
| **Camera Volume** | 64x64x32 | Aerial Perspective (공중 투시) | $z^2$ 비선형 매핑 (최대 100km) |

---

## 3. 아키텍처 및 구현 (Architecture and Implementation)

### 3.1 컴퓨트 셰이더 기반 파이프라인 (Compute Shader Based Pipeline)
`ASinglePassPostEffect`를 상속받는 Pure Compute Shader 방식으로 구현되었습니다.
* **구현 방식**: 기하 구조(Sphere Mesh) 의존성을 제거하고 픽셀 단위 Compute Pass로 전환하였습니다.
* **리소스 바인딩**:
    * **Group 0**: Source Color, Depth, LUTs (4종), Sampler를 바인딩합니다.
    * **Group 1**: Output Storage Texture, System Uniforms, Atmosphere Parameters를 바인딩합니다.

### 3.2 합성 로직 (Composition Logic)
최종 픽셀 색상은 다음의 수식을 통해 결정됩니다.
$$FinalColor = (SourceColor \times Transmittance) + Inscattering$$
* **배경 (Background)**: Sky-View LUT에서 직접 시각화된 데이터를 추출합니다.
* **불투명 객체 (Opaque Objects)**: Camera Volume 3D LUT를 참조하여 투과율 및 산란광을 합성합니다.

---

## 4. 수치 안정성 및 정밀도 (Numerical Stability and Precision)

광대역 스케일(10km ~ 2,000,000km)에서의 수치적 정밀도 유지를 위해 다음과 같은 기술을 적용하였습니다.

1. **Direct View Reconstruction**: Projection Matrix 성분을 직접 사용하여 뷰 공간 방향을 재구성함으로써 정밀도 오차에 의한 지글거림을 방지하였습니다.
2. **360° Azimuth Wrap-around**: 수평각 샘플링 시 `repeat` 모드를 적용하고 셰이더 내 클램핑을 제거하여 경계의 불연속성을 해결하였습니다.
3. **Numerical Bias in Culling**: 부동 소수점 오차에 의한 객체 소실 방지를 위해 CPU 컬링 로직에 1.0 유닛(1m)의 안전 마진을 적용하였습니다.
4. **Stable Linear Depth**: 개선된 선형 깊이 복구 공식(`(n * f) / max(1e-6, f - d * (f - n))`)을 통해 정밀도를 유지합니다.

---

## 5. 비교 분석 (UE5 vs RedGPU)

| 항목 | Unreal Engine (Epic Tier) | RedGPU (V4.1.0-Alpha) | 비고 |
| :--- | :--- | :--- | :--- |
| **핵심 알고리즘** | Sébastien Hillaire (2020) | Sébastien Hillaire (2020) | 동일 모델 기반 |
| **AP LUT 정밀도** | 32x32x16 | 64x64x32 | RedGPU 해상도 우위 |
| **연산 방식** | Raster/Compute Hybrid | Pure Compute Shader | RedGPU 연산 단일화 |
| **좌표계 최적화** | Z-Up | Y-Up | RedGPU 표준 좌표계 최적화 |
| **안개 통합** | 컴포넌트 기반 합성 | 산란 적분 내 직접 통합 | 물리적 정합성 동일 수준 |

---

## 6. 향후 과제 (Future Roadmap)

1. **Dynamic IBL Integration**: Sky-View 데이터를 활용하여 실시간 환경 반사광을 업데이트할 예정입니다.
2. **Volumetric Cloud Interaction**: 대기 밀도 데이터를 활용하여 구름 시스템과의 광학적 상호작용을 구현할 계획입니다.
3. **Terrain Shadowing**: 지형 고도 데이터를 반영하여 대기 볼륨 내 그림자(God Rays) 생성을 추진합니다.

---

## 7. 시스템 전반의 변경 사항 (System-wide Changes)

### 7.1 SkyAtmosphere 전용 기능
* **Post-Effect Pipeline Migration**: 기하 구조 의존성을 제거하고 Compute Shader 기반 패스로 전환하였습니다.
* **Physically Integrated Fog**: Mie 산란 적분 내에 높이 안개 통합 연산을 적용하였습니다.
* **Gaussian Ozone Distribution**: 오존 밀도 시뮬레이션에 가우시안 곡선 모델을 도입하였습니다.
* **360° Seamless Sampling**: 3D LUT 샘플러 설정을 최적화하여 경계 불연속성 문제를 해결하였습니다.

### 7.2 엔진 코어 공통 변경 사항
* **System Uniform Expansion**: `SystemUniform` 구조체 및 바인딩 그룹(Group 0)에 `cameraVolumeTexture`(3D Texture)와 `skyAtmosphereSampler`를 전역으로 추가하여, 모든 셰이더 단계에서 대기 데이터에 접근할 수 있도록 인프라를 확장하였습니다.
* **Resource Management Upgrade**: `ResourceManager`에 `emptyTexture3DView` 및 `emptyDepthTextureView` 관리 기능을 추가하여, 3D 텍스처 미사용 시의 안정성을 확보하고 바인딩 오류를 방지하였습니다.
* **Material System Enhancement**: `getBindGroupLayoutDescriptorFromShaderInfo` 함수를 개선하여 `texture_3d` 바인딩 레이아웃 생성을 지원, 재질 시스템 전반에서 3D 볼륨 텍스처를 활용할 수 있도록 하였습니다.
* **Numerical Bias in Culling**: `Mesh.ts`의 절두체 컬링 로직에 Numerical Bias를 도입하였습니다.
* **Enhanced Linear Depth Reconstruction**: 안정화된 선형 깊이 복구 공식을 엔진 전역에 적용하였습니다.
* **Default Camera Clipping Updated**: 대규모 스케일 렌더링에 대응하기 위해 기본 Near/Far Clipping 수치를 상향 조정하였습니다.

---
**최종 업데이트:** 2026-02-14
**상태:** Master Specification Established
**프로젝트:** RedGPU
