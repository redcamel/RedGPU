# [Optimization] Geometry & Material Logic Consolidation (Weight Diet)

## 📌 개요 (Overview)
RedGPU 프로젝트의 핵심 구성 요소인 기하 구조(Primitive)와 재질(Material) 시스템 내의 중복 로직을 제거하고, 구조적 설계를 표준화하여 전체 코드 용량 감축(최대 25% 예상) 및 유지보수 효율성을 극대화합니다.

## 🎯 목표 (Goals)
- **기하 구조 최적화**: `Primitive` 베이스 클래스에서 `uniqueKey` 기반의 리소스 캐싱을 직접 수행하여 생성자(Constructor) 내 중복 코드 제거 및 기하 공식 공통화.
- **재질 시스템 경량화**: `DefineForFragment` 보일러플레이트 제거 및 유니폼 업데이트 자동화.
- **WGSL 표준화**: 셰이더 내 중복되는 구조체 선언을 `#redgpu_include` 기반으로 단일화.
- **런타임 성능 향상**: 데이터 패킹 및 버퍼 업데이트 오버헤드 최소화.

## 🛠️ 주요 작업 항목 (Task List)

### 1. 기하 구조 (Geometry / Primitive) 파트
- [x] **`uvSize` 파라미터 전면 제거**:
  - `AUVTransformBaseMaterial` 인프라를 활용하도록 변경하고, 기하 생성 단계의 물리적 UV 스케일링 로직 제거 완료.
  - 동일 형상 객체의 버퍼 재사용성 극대화 및 `uniqueKey` 복잡도 완화 완료.
- [x] **`PrimitiveUtils` 신설 및 로직 이관**:
  - [x] `generatePlaneData`: `Box`, `Plane`, `Ground` 클래스의 평면 기반 데이터 생성 로직을 통합 완료. (오른손 좌표계 및 V-Down UV 표준 준수)
  - [x] `generateCircleData`: `Circle`, `Cylinder`(상/하단 캡), `Torus`(단면) 클래스에 벡터 기반 범용 원형 데이터 생성 엔진 적용 완료.
  - [x] `generateCylinderTorsoData`: 실린더 및 캡슐의 몸통 데이터를 벡터 기반으로 생성하여 캡(Cap)과 완벽한 기하학적 정렬 보장.
  - [x] `generateGridIndices`: 모든 격자형 도형의 인덱스 생성 로직을 CCW(Counter-Clockwise) 표준으로 공통화 완료.
  - [x] `interleavePacker`: 12-플로트 정밀 데이터 패킹 헬퍼 도입 및 전 프리미티브 적용 완료.
- [x] **자동 캐싱 시스템 강화 및 캡슐화 (Constructor Injection)**:
  - `Primitive` 베이스 클래스의 생성자에서 `uniqueKey`와 `makeData`를 주입받아 캐싱 및 설정을 자동화 완료.
  - `#setData` 프라이빗 메서드와 프라이빗 필드를 통해 리소스 상태를 완벽히 캡슐화.
- [x] **데이터 생성 로직 분리 및 최적화**:
  - `#makeData`를 클래스 외부(파일 레벨)의 `makeData` 함수로 분리하여 `this` 초기화 순서 문제 해결 및 가독성 향상.
  - 클래스 본문은 인터페이스에 집중하고 복잡한 수식은 하단으로 배치하여 구조적 명확성 확보.

### 2. 재질 시스템 (Material) 파트
- [ ] **유니폼 업데이트 자동화 (Proxy/Decorator)**:
  - 현재 `DefineForFragment.defineByPreset` 등을 통해 수동으로 매핑되는 속성들을 클래스 메타데이터 기반으로 자동화.
  - Getter/Setter에서 `updateUniform`을 명시적으로 호출하는 패턴 제거.
- [ ] **재질 WGSL 구조체 단일화**:
  - `fragment.wgsl`마다 중복 선언된 `Uniforms` 구조체를 `SystemCodeManager` 라이브러리로 이관.
  - `#redgpu_include materialStruct.PhongMaterial` 형식을 도입하여 셰이더 코드량 감축.
- [ ] **`ABaseMaterial` 기능 확장**:
  - 텍스처 및 샘플러 바인딩 관리를 베이스 클래스에서 일관되게 처리하여 하위 클래스의 구현 복잡도 완화.

### 3. 공통 기반 기술
- [x] **Interleave Format 표준화**:
  - `Position(3), Normal(3), UV(2), Tangent(4)` 레이아웃(총 12 floats)을 전역 표준으로 확정 및 적용 완료.
- [ ] **Shader Chunks 활용**:
  - 색상 변환, 조명 감쇄 등 재질 셰이더에 공통적으로 포함되는 헬퍼 함수들을 100% 라이브러리화.

## 🔍 UV 정합성 및 정규화 개선 내역 (UV Consistency Improvements)

기하 구조 리팩토링 과정에서 발견된 UV 매핑 오류를 수정하고, 엔진 전역의 데이터 일관성을 확보했습니다.

- **`Circle` & `Capsule` UV 교정**: 상하가 반전되어 생성되던 UV 좌표를 V-Down(Top-Left) 표준에 맞게 수정 완료.
- **`Cylinder` & `Capsule` 캡 UV 통합**: 상/하단 캡(Cap)의 UV를 `generateCircleData`를 통해 중앙 집중식 매핑(0.5, 0.5 중심)으로 표준화.
- **`Box` 6면 배향 통일**: 각 면의 생성 축에 관계없이 텍스처가 동일한 방향과 밀도로 입혀지도록 축 매핑 로직 정규화.
- **`Plane` & `Ground` 정합성**: XY 평면과 XZ 평면에서의 UV 흐름을 엔진 좌표계 표준(오른손 법칙)과 100% 동기화.
- **데이터 정규화 (Normalization)**: 모든 프리미티브에서 `uvSize`를 제거하고 기본 UV 범위를 `0.0 ~ 1.0`으로 고정. (스케일링은 재질 레벨의 `u_uvScale`로 일원화)
- **상용 엔진 표준 정렬 (Industry Standard Alignment)**:
  - **이음새(Seam) 위치 통일**: `Cylinder`, `Sphere`, `Capsule`, `Torus`, `TorusKnot` 등 모든 회전체의 텍스처 이음새를 뒤쪽(-Z)으로 배치하여 정면 시인성 최적화.
  - **기하학적 정렬**: 벡터 기반 생성을 통해 몸체와 캡의 텍스처 방향을 논리적으로 일치시킴.

## 📊 예상 코드 감축 수치 (Reduction Estimates)

리팩토링 후 각 모듈별 예상되는 코드 라인 수(LOC) 및 용량 변화 수치입니다.

| 대상 카테고리 | 현재 평균 LOC | 목표 평균 LOC | 감축률 (%) | 주요 절감 원인 |
| :--- | :---: | :---: | :---: | :--- |
| **Primitive Class (.ts)** | ~120 | ~40 | **~65%** | `makeData` 로직 제거 및 캐싱 코드 베이스 클래스 통합 |
| **Material Class (.ts)** | ~250 | ~100 | **~60%** | `DefineForFragment` 선언 및 Getter/Setter 상용구 자동화 |
| **Material WGSL** | ~1,000 | ~800 | **~20%** | `Uniforms` 구조체를 `#redgpu_include` 라이브러리로 이관 |
| **Primitive Utils** | 0 | +400 | **N/A** | 공통 로직 집중화 (신규 생성) |

### 📉 전체 영향도 요약
- **전체 라인 수**: `src/primitive/` 및 `src/material/` 기준 약 **1,200 ~ 1,500 라인** 절감 예상.
- **번들 크기**: 불필요한 중복 문자열 및 런타임 생성 로직 제거로 약 **15-20%**의 최종 번들 용량 최적화 기대.

## 📊 기대 효과 (Expected Impact)
- **용량 감축**: `src/primitive/` 및 `src/material/` 내 파일들의 물리적 크기 30% 이상 감소.
- **개발 생산성**: 새로운 도형이나 재질 추가 시 수학 공식과 비즈니스 로직에만 집중 가능.
- **안정성**: 중앙 집중식 로직 수정을 통해 모든 리소스에 동시 패치 가능(예: 정점 포맷 변경 등).

---
**우선순위:** 🟠 높음 (High)
**난이도:** 🟡 보통 (Normal)
**대상 버전:** V4.1.0-Alpha
