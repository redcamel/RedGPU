# SkyAtmosphere Shader Library Candidate Functions

이 문서는 `SkyAtmosphere` 시스템의 여러 셰이더에 파편화되어 있는 로직들을 공용 라이브러리(`skyAtmosphereFn.wgsl` 또는 시스템 전역 라이브러리)로 통합하기 위한 후보 함수 리스트입니다.

## 5. 심층 중복 분석 및 리팩토링 로드맵 (Refactoring Roadmap)
현재 `SkyAtmosphere` 내의 여러 Generator들이 복사-붙여넣기 수준의 중복 로직을 다수 포함하고 있어, 이를 `skyAtmosphereFn.wgsl`로 통합하기 위한 세부 계획입니다.

### A. 대기 상태 및 밀도 (Atmosphere State) - ✅ 완료
| 대상 로직 | 통합 함수명 | 상태 |
| :--- | :--- | :---: |
| 고도(`h`)별 Rayleigh, Mie, Fog, Ozone 밀도 계산 | **`getAtmosphereDensities`** | ✅ |
| 물리 계수 산출 및 소멸 계수 통합 | **`getAtmosphereCoefficients`** | ✅ |

### B. 기하 및 구간 분할 (Geometry & Segments) - ✅ 완료
| 대상 로직 | 통합 함수명 | 상태 |
| :--- | :--- | :---: |
| `tEarthIn`, `tEarthOut` 및 `delta` 판정 | **`getPlanetIntersection`** | ✅ |
| 앞쪽 대기, 진공, 뒤쪽 대기 구간 정규화 | **`integrateScatSegment`** | ✅ |

### C. 적분 및 투과율 엔진 (Integration Engine) - ✅ 완료
| 대상 로직 | 통합 함수명 | 상태 |
| :--- | :--- | :---: |
| LUT 없이 직접 수행하는 수동 투과율 적분 | **`getSunTransmittanceManual`** | ✅ |
| 상황별(LUT/수동) 투과율 자동 선택 | **`getPhysicalTransmittance`** | ✅ |
| 공용 구간 적분 엔진 | **`integrateScatSegment`** | ✅ |

---
**최종 업데이트:** 2026-02-27
**상태:** 전역 리팩토링 및 중복 제거 완료 (Refactored & Deduplicated)
**프로젝트:** RedGPU


---
**작성일:** 2026-02-27
**상태:** 후보군 선정 완료 (Candidate Identified)
**프로젝트:** RedGPU
