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
| **예제 패널 고도화** | 전 예제에 `cullMode` 제어 추가 (DoubleSide 테스트 지원) | 🟢 |
| **인자명 직관화** | p/q, wSegments 등 추상적 명칭을 표준 명칭으로 교체 | 🟢 |

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
| States | 객체의 상태를 나타내는 직관적 Boolean | `openEnded`, `flipY` |

---

## 🛠️ 기존 프리미티브 고도화 과제 (Enhancement Roadmap)

표준화된 구조를 바탕으로 향후 기능적 완성도를 높이기 위한 고도화 과제 목록입니다.

| 대상 프리미티브 | 고도화 항목 | 필요성 (Necessity) | 우선순위 | 기대 효과 |
| :--- | :--- | :--- | :---: | :--- |
| **Sphere / Capsule** | **극점 토폴로지 최적화** | 극점의 중복 정점으로 인한 아티팩트 제거 및 렌더링 효율 극대화 | 🔥 높음 | 인덱스 버퍼 절감 및 렌더링 성능 향상 |
| **Sphere / Torus** | **부분 생성 단면 캡 (Capping)** | 각도가 360도 미만인 부분 생성 시 노출되는 안쪽 단면을 자동으로 폐쇄 | 🔥 높음 | 입체감 확보 및 내부 노출 방지 |
| **Plane / Ground** | **양면 구성 옵션** | 식물, 종이, 얇은 막 등 셰이더 수정 없이 양방향 가시성이 필요한 경우 대응 | 🔥 높음 | 데이터 기반의 양면 렌더링 지원 |
| **Box** | **6면 개별 데이터 제어** | 각 면별로 다른 텍스처 오프셋이나 재질 속성 적용이 필요한 건축/산업용 모델 대응 | 🟢 보통 | 텍스처링 유연성 및 제작 편의성 확보 |
| **Cylinder / Cone** | **법선 보간 모드** | 각진 기둥(Flat)과 부드러운 원통(Smooth) 표현을 데이터 수준에서 선택 | 🟢 보통 | 시각적 표현의 다양성 및 제어 정밀도 향상 |
| **Common** | **경량 레이아웃 프리셋** | UI(노멀 불필요), 그림자(UV 불필요) 등 용도별 VRAM 최적화 필요성 | 🟡 낮음 | VRAM 사용량 최소화 및 로딩 속도 개선 |

---

## 🚀 향후 추가 예정 프리미티브 (Future Primitive Roadmap)

시스템의 완성도를 높이고 다양한 시각적 요구사항을 충족하기 위해 다음 프리미티브들의 추가를 계획하고 있습니다.

| 프리미티브 | 설명 | 필요성 (Necessity) | 우선순위 | 전략 |
| :--- | :--- | :--- | :---: | :--- |
| **Cone** | 원뿔 및 절단된 원뿔 형태 생성 | 피라미드, 화살표 촉, 조명 범위 시각화 등에 필수적 | 🔥 높음 | `Cylinder` 로직 재사용 |
| **Ring** | 내경이 존재하는 2D 고리형 평면 | UI 요소, 포탈 효과, 궤도 시각화, 조준점 등에 활용 | 🔥 높음 | `generateCircleData` 확장 |
| **Polyhedrons** | Icosahedron, Octahedron 등 (다면체) | 저폴리곤 구체 대체, 결정체 형태, 추상 아트 구성 | 🟢 보통 | 정규 다면체 알고리즘 도입 |
| **Lathe** | 2D 경로 기반 회전체 생성 | 컵, 병, 그릇, 기둥 등 복잡한 대칭형 모델 생성 가능 | 🟢 보통 | 사용자 정의 경로 기반 생성 |
| **Tube** | 3D 경로 기반 파이프 형태 생성 | 케이블, 로프, 혈관, 파이프라인 시각화에 특화 | 🟡 낮음 | 경로 추적 및 스위핑 로직 |
| **Extrude** | 2D 모양에 깊이를 주어 3D화 | 3D 텍스트, 로고, 복잡한 평면 도형의 입체화 기초 | 🟡 낮음 | 베지어 및 사이드 생성 로직 |

---
**대상 버전:** V4.1.0-Alpha
