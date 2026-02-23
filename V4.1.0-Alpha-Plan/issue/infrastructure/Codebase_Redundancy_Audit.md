# [Audit] Codebase Redundancy & Fragmentation Report

## 1. 개요 (Overview)
RedGPU 프로젝트 내에 존재하는 중복 코드 패턴, 로직 파편화 지점, 그리고 개선이 필요한 아키텍처적 요소들을 전수 조사하여 정리한 문서입니다. 본 보고서의 항목들은 단계적으로 해결하여 엔진의 유지보수성 및 런타임 성능을 최적화하는 것을 목표로 합니다.

---

## 🔍 중복 코드 및 파편화 분석 (Audit Results)

### 1.1 셰이더 내 수학 상수 및 헬퍼 중복 (WGSL Constants)
*   **현황 (AS-IS)**: 여러 `.wgsl` 파일에서 `PI`, `EPSILON`, `FLT_MAX` 등을 개별적으로 정의하거나 하드코딩된 숫자로 사용 중.
*   **개선 (TO-BE)**: `SystemCodeManager.math` 라이브러리를 전량 활용하여 `#redgpu_include` 방식으로 통일.
*   **기대 효과**: 수치적 정밀도 일관성 확보 및 매직 넘버 제거.

### 1.2 유니폼 업데이트 상용구 (Uniform Boilerplate)
*   **현황 (AS-IS)**: `PBRMaterial`, `PhongMaterial` 등에서 필드별 Getter/Setter 내에 `this.updateUniform('key', value)` 패턴이 수백 회 반복됨.
*   **개선 (TO-BE)**: `ABaseMaterial` 또는 `ASinglePassPostEffect` 수준에서 유니폼 매핑을 자동화하는 `Proxy` 또는 데코레이터 기반 시스템 도입.
*   **기대 효과**: 코드량 획기적 감소 및 오타로 인한 유니폼 업데이트 오류 방지.

### 1.3 조명 데이터 매핑 로직 파편화 (Lighting Data Mapping)
*   **현황 (AS-IS)**: 포인트/스팟 조명의 클러스터링 데이터를 버퍼에 쓰는 로직이 `View3D.ts` 내부에 직접 노출되어 있음.
*   **개선 (TO-BE)**: `SystemUniformUpdater`로 이관하여 `updatePointLights`, `updateSpotLights` 메서드로 캡슐화.
*   **기대 효과**: `View3D` 클래스의 비대함 해결 및 조명 데이터 구조 변경 시 대응 용이.

### 1.4 리소스 생명주기 수동 관리 (Manual Reference Counting)
*   **현황 (AS-IS)**: IBL 텍스처 교체 시 `useNum++`, `useNum--` 등을 `View3D`에서 수동으로 호출하여 관리 중.
*   **개선 (TO-BE)**: `ManagedResource` 기반의 자동 참조 카운팅(Auto Reference Counting) 시스템 구축 및 `ResourceManager` 통합.
*   **기대 효과**: 메모리 누수 방지 및 리소스 해제 시점의 안정성 확보.

### 1.5 정점 레이아웃 정의 중복 (Vertex Layout Redundancy)
*   **현황 (AS-IS)**: `Primitive` 클래스와 개별 `Geometry`에서 `VertexInterleavedStruct` 정의가 파편화되어 있음.
*   **개선 (TO-BE)**: 엔진 표준 정점 속성(Position, Normal, UV 등) 세트를 프리셋화하여 중앙 관리.
*   **기대 효과**: 새로운 지오메트리 추가 시 레이아웃 정의 오류 최소화.

### 1.6 GPU 디스크립터 생성 반복 (Descriptor Literals)
*   **현황 (AS-IS)**: 유사한 설정의 `GPUTextureDescriptor`, `GPUSamplerDescriptor`를 매번 객체 리터럴로 직접 생성.
*   **개선 (TO-BE)**: `DescriptorFactory`를 도입하여 규격화된 포맷(`rgba16float` 등)과 사용처(`Storage`, `Sampled` 등)에 따른 자동 생성 지원.
*   **기대 효과**: WebGPU API 규격 준수 강제 및 설정 실수 방지.

### 1.7 런타임 값 검증 중복 (Validation Redundancy)
*   **현황 (AS-IS)**: 모든 Setter마다 `validateNumberRange` 등의 검증 함수가 명시적으로 호출됨.
*   **개선 (TO-BE)**: 유니폼 자동 업데이트 시스템과 결합하여 데이터 스키마(Schema) 정의 시 자동으로 검증되도록 구조 개선.
*   **기대 효과**: 비즈니스 로직과 검증 로직의 분리.

---

## 🛠 리팩토링 우선순위 로드맵 (Roadmap)

| 순위 | 항목 | 중요도 | 난이도 | 대상 파일 |
| :-- | :--- | :---: | :---: | :--- |
| **P1** | 클러스터 조명 로직 이관 | 높음 | 낮음 | `View3D.ts`, `SystemUniformUpdater.ts` |
| **P1** | 셰이더 상수 통합 | 높음 | 보통 | `src/**/*.wgsl` |
| **P2** | 정점 셰이더 I/O 명칭 정규화 | 보통 | 낮음 | `src/display/**/shader/*.wgsl` |
| **P2** | 샘플러 프리셋 표준화 | 높음 | 보통 | `ResourceManager.ts`, `View3D.ts` |
| **P3** | 유니폼 업데이트 자동화 | 높음 | 높음 | `ABaseMaterial.ts`, `PostEffect` 계열 |
| **P4** | 리소스 자동 참조 카운팅 | 보통 | 높음 | `ResourceManager.ts`, `ManagedResource.ts` |

---
**최초 작성일:** 2026-02-23
**상태:** 감사 완료 및 로드맵 수립
**작성자:** Gemini CLI (Senior Engineer Mode)
