# SkyAtmosphere Shader Library Candidate Functions

이 문서는 `SkyAtmosphere` 시스템의 여러 셰이더에 파편화되어 있는 로직들을 공용 라이브러리(`skyAtmosphereFn.wgsl` 또는 시스템 전역 라이브러리)로 통합하기 위한 후보 함수 리스트입니다.

## 1. Atmosphere 전용 공용 함수 (Module Internal Shared)
대기 산란 시스템 내부의 여러 LUT 생성기에서 중복 사용되는 물리 로직입니다. (skyAtmosphereFn.wgsl로 통합 완료)

| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`integrateStep`** | 특정 지점(`p`)에서의 밀도 계산, 태양 투과율 조회, 페이즈 함수 적용, 산란광/투과율 누적 로직 통합 | ✅ |
| **`integrateOpticalDepth`** | 특정 구간의 광학 깊이를 정밀하게 적분하는 유틸리티 | ✅ |
| **`getPhysicalTransmittance`** | 지면 가림을 무시하고 대기 밀도만 고려한 물리적 투과율 계산 (구간 분할 적분 적용) | ✅ |

## 2. 엔진 시스템 전역 유틸리티 (System Global Utility)
대기 산란 외에도 범용적으로 재활용 가능한 함수입니다.

| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getRaySphereIntersection`** | 레이와 구체의 교차점 2개(`t0`, `t1`)를 반환하는 표준 기하 함수 | ✅ |

## 3. 물리 및 수학 라이브러리 (Light & Math)
물리 기반 렌더링(PBR)의 기초가 되는 표준 수식들입니다.

| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`phaseRayleigh`** | 레일리 산란 페이즈 함수 (분자 단위 산란) | ✅ |
| **`phaseMie`** | 미(Mie) 산란 페이즈 함수 (입자 단위 산란, 비등방성 `g` 포함) | ✅ |
| **`getOzoneDensity`** | 고도에 따른 오존 농도 분포 (Gaussian 모델) | ✅ |
| **`getTotalExtinction`** | 특정 고도에서의 전체 대기 소멸 계수 산출 | ✅ |

## 4. LUT 매핑 및 샘플링 유틸리티 (LUT Mapping)
대기 산란 LUT 전용의 좌표 변환 함수입니다.

| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getSkyViewUV`** | 시선 방향을 Sky-View LUT의 위경도 기반 UV로 변환 (UE5 표준) | ✅ |
| **`getTransmittanceUV`** | 고도와 각도를 투과율 LUT의 비선형 UV로 변환 (UE5 표준) | ✅ |

---
**작성일:** 2026-02-27
**상태:** 후보군 선정 완료 (Candidate Identified)
**프로젝트:** RedGPU
