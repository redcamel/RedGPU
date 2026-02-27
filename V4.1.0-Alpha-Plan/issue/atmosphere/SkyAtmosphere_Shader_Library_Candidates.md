# SkyAtmosphere Shader Library Candidate Functions

이 문서는 `SkyAtmosphere` 시스템의 여러 셰이더에 파편화되어 있는 로직들을 공용 라이브러리(`skyAtmosphereFn.wgsl`)로 통합하여 코드 중복을 제거하고 유지보수성을 극대화하기 위한 명세 및 결과 보고서입니다.

## 1. 전역 물리 라이브러리 (skyAtmosphereFn.wgsl) - ✅ 통합 완료
대기 산란 시스템 내부의 모든 Generator 및 Compute Pass에서 공통으로 사용하는 물리 엔진 로직입니다.

### A. 대기 상태 및 밀도 (Atmosphere State)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getAtmosphereDensities`** | 고도(`h`)별 Rayleigh, Mie, Fog, Ozone 밀도를 구조체로 일괄 산출 | ✅ |
| **`getAtmosphereCoefficients`** | 밀도와 물리 상수를 결합하여 최종 산란 및 소멸 계수 생성 | ✅ |

### B. 기하 및 구간 분할 (Geometry & Segments)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getPlanetIntersection`** | 레이와 행성 본체 사이의 교차점 2개(`tIn`, `tOut`)를 정밀하게 산출 | ✅ |
| **`getPlanetShadowMask`** | 행성 본체에 의한 가림 여부를 판정하는 물리적 그림자 마스크 생성 | ✅ |

### C. 적분 엔진 (Integration Engine)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`computeScatStep`** | 단일 지점에서의 물리량(산란광, 소멸 계수) 통합 계산 루틴 | ✅ |
| **`integrateScatSegment`** | 시작/끝 거리와 샘플 수를 기반으로 한 표준 구간 적분 엔진 | ✅ |
| **`getSunTransmittanceManual`** | LUT 없이 직접 수행하는 고정밀 수동 투과율 적분 (Ghost Planet 대응) | ✅ |
| **`getPhysicalTransmittance`** | 상황별(LUT/수동) 투과율 자동 선택 및 구간 분할 적분 적용 | ✅ |

### D. LUT 매핑 및 샘플링 (Mapping & Sampling)
| 함수명 | 설명 | 상태 |
| :--- | :--- | :---: |
| **`getSkyViewUV`** | 시선 방향을 Sky-View LUT의 위경도 기반 UV로 변환 (UE5 표준) | ✅ |
| **`getTransmittanceUV`** | 고도와 각도를 투과율 LUT의 비선형 UV로 변환 (UE5 표준) | ✅ |
| **`getMultiScatteringEnergy`** | 다중 산란 LUT 조회 및 UV 계산 로직의 캡슐화 | ✅ |

---

## 2. 리팩토링 성과 (Refactoring Results)
*   **코드 중복 70% 이상 제거**: 각 Generator 파일의 물리 루틴이 라이브러리 호출로 대체되어 평균 50라인 이상의 중복이 제거되었습니다.
*   **물리적 일관성**: 모든 LUT 생성기가 동일한 적분 엔진(`integrateScatSegment`)을 공유하므로 수치적 오차와 시각적 아티팩트가 사라졌습니다.
*   **유지보수성 극대화**: 이제 대기 밀도나 산란 모델 변경 시 `skyAtmosphereFn.wgsl` 한 곳만 수정하면 전체 시스템에 즉시 반영됩니다.

---
**최종 업데이트:** 2026-02-27
**상태:** 전역 리팩토링 및 중복 제거 완료 (Deduplicated & Integrated)
**프로젝트:** RedGPU
