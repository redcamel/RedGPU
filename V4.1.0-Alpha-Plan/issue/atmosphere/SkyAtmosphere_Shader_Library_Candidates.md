# SkyAtmosphere Shader Library Candidate Functions

이 문서는 `SkyAtmosphere` 시스템의 여러 셰이더에 파편화되어 있는 로직들을 공용 라이브러리(`skyAtmosphereFn.wgsl`)로 통합하여 코드 중복을 제거하고 유지보수성을 극대화한 결과 보고서입니다.

## 1. 고수준 물리 엔진 (skyAtmosphereFn.wgsl) - ✅ 완전 통합 완료
구조적 제어 로직까지 라이브러리 내부로 통합하여, 개별 Generator들은 설정 및 인터페이스 역할만 수행하도록 최적화되었습니다.

### ⚠️ WGSL 제약 사항 및 설계 원칙
*   **No Opaque Types in Structs**: WGSL 명세에 따라 `texture_2d` 및 `sampler`는 구조체(`struct`)의 멤버가 될 수 없습니다. 따라서 모든 리소스 바인딩 객체는 함수의 매개변수로 개별 전달됩니다.
*   **Context Removal**: 초기 설계 단계에서 도입했던 `AtmosphereContext`는 위 제약으로 인해 폐기되었으며, 대신 표준화된 매개변수 순서를 따릅니다.

### A. 통합 경로 제어 (High-Level Path Control)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`renderAtmospherePath`** | 행성 교차 판정, 3구간(Front/Ground/Back) 분할 적분을 자동 수행하는 **최종 통합 엔진** | ✅ |

### B. 적분 엔진 및 물리량 (Integration Engine)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`computeScatStep`** | 단일 지점에서의 물리량(산란광, 소멸 계수) 계산 루틴 | ✅ |
| **`integrateScatSegment`** | 특정 구간을 지정된 샘플 수로 누적 적분하는 하위 엔진 | ✅ |
| **`getPlanetIntersection`** | 레이와 행성 본체 사이의 교차점 2개(`tIn`, `tOut`) 산출 | ✅ |

### C. 대기 상태 및 매핑 (State & Mapping)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getAtmosphereDensities`** | 고도(`h`)별 Rayleigh, Mie, Fog, Ozone 밀도를 구조체로 일괄 산출 | ✅ |
| **`getAtmosphereCoefficients`** | 밀도와 물리 상수를 결합하여 최종 산란 및 소멸 계수 생성 | ✅ |
| **`getSkyViewUV`** / **`getTransmittanceUV`** | UE5 표준 규격의 LUT 좌표 변환 및 역매핑 유틸리티 | ✅ |

---

## 2. 리팩토링 최종 성과 (Final Results)
*   **Zero Structural Redundancy**: `if-else` 기반의 복잡한 구간 분할 로직이 모든 Generator에서 제거되고 `renderAtmospherePath` 하나로 통합되었습니다.
*   **Robustness**: 모든 대기 렌더링(배경, 안개, 반사)이 동일한 수학적 엔진을 사용하므로 수치적 일관성이 100% 보장됩니다.
*   **WGSL Compliance**: 하드웨어 제약 조건을 준수하면서도 코드 응집력을 유지하는 최적의 API 구조를 확보했습니다.

---
**최종 업데이트:** 2026-02-27
**상태:** WGSL 표준 준수 및 구조적 리팩토링 완료 (WGSL Compliant & Refactored)
**프로젝트:** RedGPU
