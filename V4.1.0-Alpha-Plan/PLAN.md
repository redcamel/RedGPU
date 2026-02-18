# RedGPU V4.1.0-Alpha Release Plan

## 1. 개요 (Overview)
- **버전:** 4.1.0-Alpha
- **테마:** **"Beyond the Sky" (물리 기반 하늘의 완성)**
- **목표:** 물리 산란 법칙에 기반한 실시간 동적 대기 시스템 구현으로 비주얼 혁신
- **상태:** 계획 확정 및 초집중 개발 단계

---

## 2. 핵심 개발 과제 (The Masterpiece Focus)

### 2.1 하이엔드 대기 시스템 (Atmospherics)
| 과제 명칭 | 우선순위 | 난이도 | 부하 정도 | 상세 내용 |
| :--- | :---: | :---: | :---: | :--- |
| **[SkyAtmosphere](issue/atmosphere/SkyAtmosphere_Master_Specification.md)** | 🔴 최고 | 🟠 높음 | 🟡 보통 | Rayleigh/Mie 산란 기반 실시간 스카이 및 노을 시스템 구현 (view.skyAtmosphere 슬롯 신설, **MSAA 대응 포함**) |

### 2.2 디테일 인프라 (Detail Foundation)
| 과제 명칭 | 우선순위 | 난이도 | 부하 정도 | 상세 내용 |
| :--- | :---: | :---: | :---: | :--- |
| **[Decal System](./issue/Detail_Foundation.md)** | 🟠 높음 | 🟡 보통 | 🟢 낮음 | 물리 기반 공간에 사실적인 표면 디테일을 더하는 투영 시스템 |

### 2.3 셰이더 인프라 통합 (Shader Infrastructure)
| 과제 명칭 | 우선순위 | 난이도 | 부하 정도 | 상세 내용 |
| :--- | :---: | :---: | :---: | :--- |
| **[Shader Consolidation](issue/infrastructure/Shader_Common_Library_Consolidation.md)** | 🔴 최고 | 🟡 보통 | 🟡 보통 | `SystemCodeManager` 도입 및 공통 셰이더 함수(Math, Color, Depth)의 원자적 통합과 문서화 자동화 |

> **⚠️ 전역 셰이더 대기 연동 필수 과제 (Global Atmosphere Integration)**: 
> 완성된 **SkyAtmosphere** 시스템을 기반으로, 모든 3D 재질 셰이더를 업데이트합니다.
> - **기술적 핵심**: `redgpu_include ATMOSPHERE` 시스템을 구축하여 모든 머티리얼이 자동으로 **Aerial Perspective(공중 투시)** 기능을 포함하도록 강제합니다.
> - **전역 리소스 바인딩**: `SystemUniform`에 `useSkyAtmosphere` 플래그를 추가하고, `cameraVolumeTexture`(3D LUT)를 **Group 0**에 전역 바인딩하여 모든 재질에서 즉시 참조 가능한 환경을 구축합니다.
> - **바리안트 연동**: `useSkyAtmosphere` 조건부 블록을 통해 런타임에 성능 손실 없이 대기 효과를 켜고 끌 수 있는 구조를 확립합니다.
> - **목표**: 재질 종류에 상관없이 월드 내 모든 물체가 동일한 물리적 대기 환경 하에 존재하도록 시각적 통일성을 완성합니다.

---

## 3. 유지보수 및 코드 품질 (Refactoring & Quality)

### 3.1 시스템 안정화
| 항목 | 상태 | 비고 |
| :--- | :--- | :--- |
| **디렉토리 오타 수정** | ✅ 완료 | `textFileds` -> `textFields` 및 import 정리 |
| **로드맵 체계화** | ✅ 완료 | 분야별 전문 로드맵 문서 5종 분리 및 `roadmap/` 이동 완료 |
| **셰이더 인프라 설계** | ✅ 완료 | `SystemCodeManager` 및 JSDoc 자동화 체계 수립 완료 |
| **Import 전수 점검** | ⏳ 대기 | 전체 프로젝트 참조 무결성 확인 및 최적화 |

### 3.2 문서화 및 예제
| 항목 | 우선순위 | 상태 | 상세 목표 |
| :--- | :---: | :---: | :--- |
| **SkyAtmosphere 가이드** | 🔴 최고 | ⏳ 대기 | 물리 기반 하늘 설정 및 조명 연동 예제 작성 |
| **API TypeDoc 보완** | 🟡 보통 | ⏳ 대기 | 핵심 엔진 API 주석 보완 (KO/EN) |

---

## 4. 진행 상황 (Progress)
- 전체 진행률: **25%** (핵심 시스템 설계 및 인프라 자동화 체계 수립 완료)

---
**최종 업데이트:** 2026년 2월 15일
