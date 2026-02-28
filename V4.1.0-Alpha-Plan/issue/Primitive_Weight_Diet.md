# [Optimization] Primitive System Architecture Refactoring & Standardization

## 📌 개요 (Overview)
RedGPU 프리미티브 시스템의 고질적인 중복 로직을 제거하고, 기하학적 수식 및 데이터 처리 프로세스를 `PrimitiveUtils`로 중앙 집중화하여 시스템 구조를 근본적으로 개선했습니다. 또한, 상용 엔진(Unreal, Three.js) 수준의 인터페이스 표준을 도입하고 12-플로트 인터리브 포맷을 전역화하여 렌더링 정확도와 런타임 안정성을 극대화하는 것을 목표로 합니다.

---

## 🎯 최적화 및 표준화 목표 (Strategic Goals)

| 목표 항목 | 핵심 전략 | 성과 지표 |
| :--- | :--- | :--- |
| **아키텍처 단일화** | 베이스 클래스 중심의 리소스 캐싱 및 수식 유틸리티화 | 클래스 코드량 65% 절감 |
| **데이터 레이아웃 표준화** | P3, N3, U2, T4 (12 floats) 인터리브 포맷 전역 적용 | 노멀맵 정확도 향상 |
| **인터페이스 직관화** | 업계 표준 명명 규칙 기반의 생성자 인자 마이그레이션 | 개발자 가독성 극대화 |
| **시스템 견고함 확보** | 0값 예외 처리 및 EPSILON 기반 수치 제어 로직 통합 | 런타임 에러 제로화 |

---

## 🛠️ 주요 리팩토링 완료 현황 (Execution Status)

### 1. 로직 중앙 집중화 (`PrimitiveUtils`)

| 기능 | 리팩토링 내용 | 상태 |
| :--- | :--- | :---: |
| **generatePlaneData** | Box, Plane, Ground 등 평면 기반 기하 생성 로직 통합 | 🟢 |
| **generateCircleData** | 원형 기하 엔진 적용 및 0값 안전장치(최소 1정점) 통합 | 🟢 |
| **generateCylinderTorsoData** | 벡터 기반 실린더 몸통 생성 로직 신설 및 정렬 일치 | 🟢 |
| **generateGridIndices** | 격자형 인덱스 생성 로직의 CCW 와인딩 표준 공통화 | 🟢 |
| **interleavePacker** | 12-플로트 정밀 데이터 패킹 및 오프셋 관리 헬퍼 도입 | 🟢 |
| **calculateTangents** | 프로젝트 공통 수학 유틸리티 기반 탄젠트 계산 프로세스 통합 | 🟢 |

### 2. 코어 시스템 고도화

| 작업 항목 | 개선 상세 | 상태 |
| :--- | :--- | :---: |
| **리소스 캡슐화** | `Primitive` 베이스 클래스에서 uniqueKey 기반 캐싱 자동화 | 🟢 |
| **데이터 생성 격리** | `#makeData` 외부 함수 분리를 통한 초기화 안정성 확보 | 🟢 |
| **물리 스케일링 제거** | 기하 레벨의 `uvSize` 제거 및 재질 레벨 스케일링으로 일원화 | 🟢 |
| **인터리브 표준화** | 전 프리미티브에 12-플로트(Tangent 포함) 스트라이드 적용 | 🟢 |

---

## 🔍 정합성 및 안정성 개선 내역 (Consistency & Robustness)

### 1. 정밀도 및 예외 대응

| 항목 | 개선 내용 | 결과 |
| :--- | :--- | :---: |
| **0값 안전장치** | 치수 0일 때 "1정점 + 빈 인덱스" 전략으로 WebGPU 에러 방지 | 🟢 |
| **EPSILON 체크** | 부동 소수점 오차를 고려한 미세 수치 제어 로직 적용 | 🟢 |
| **이음새(Seam) 정렬** | 모든 회전체 프리미티브의 텍스처 시작점을 뒤쪽(-Z)으로 통일 | 🟢 |
| **UV V-Down 표준** | 모든 도형의 UV를 엔진 표준(상단=0, 하단=1)에 맞춰 교정 | 🟢 |

### 2. 생성자 인자명 표준 마이그레이션 결과

| 클래스 | 이전 인자명 | 표준화된 인자명 | 상태 |
| :--- | :--- | :--- | :---: |
| **Box** | wSegments, hSegments, dSegments | `widthSegments`, `heightSegments`, `depthSegments` | 🟢 |
| **Circle** | segments | `radialSegments` | 🟢 |
| **Plane / Ground** | wSegments, hSegments | `widthSegments`, `heightSegments` | 🟢 |
| **Torus** | radialSubdivisions, bodySubdivisions | `radialSegments`, `tubularSegments` | 🟢 |
| **Torus** | startAngle, endAngle | `thetaStart`, `thetaLength` | 🟢 |
| **TorusKnot** | tube, p, q | `tubeRadius`, `windingsAroundAxis`, `windingsAroundCircle` | 🟢 |
| **Capsule** | cylinderHeight | `height` | 🟢 |

---

## 📏 명명 규칙 가이드라인 (Standard Naming Conventions)

| 분류 | 명명 규칙 | 예시 |
| :--- | :--- | :--- |
| **Segments** | `[방향/성격]Segments` 형식을 사용 | `widthSegments`, `radialSegments` |
| **Dimensions** | 기본 선형/곡률 치수 명칭 사용 | `width`, `radiusTop`, `tubeRadius` |
| **Angles** | 회전 범위 및 각도는 `theta/phi` 사용 | `thetaStart`, `thetaLength`, `phiLength` |
| **States** | 객체의 상태를 나타내는 직관적 Boolean | `openEnded`, `flipY` |

---
**대상 버전:** V4.1.0-Alpha
