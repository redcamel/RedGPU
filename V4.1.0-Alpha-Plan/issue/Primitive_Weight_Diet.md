# [Optimization] Primitive System Architecture Refactoring & Standardization

## 📌 개요 (Overview)
RedGPU 프리미티브 시스템의 고질적인 중복 로직을 제거하고, 기하학적 수식 및 데이터 처리 프로세스를 `PrimitiveUtils`로 중앙 집중화하여 시스템 구조를 근본적으로 개선했습니다. 모든 프리미티브 클래스는 `Primitive` 베이스 클래스와 `PrimitiveUtils`를 활용하는 **Thin Class** 구조(50라인 내외)로 완전히 전환되었으며, 런타임 성능 최적화까지 완료되었습니다.

---

## 🎯 핵심 리팩토링 목표 (Strategic Goals)
| 분류 | 핵심 전략 | 성과 지표 | 상태 |
| :--- | :--- | :--- | :---: |
| **아키텍처** | 베이스 클래스 중심의 리소스 캐싱 및 수식 유틸리티화 | 클래스 코드량 65% 절감 | ✅ |
| **데이터 레이아웃** | P3, N3, U2, T4 (12 floats) 인터리브 포맷 전역 적용 | 노멀맵 정확도 및 연산 성능 향상 | ✅ |
| **인터페이스** | 업계 표준 명명 규칙 기반의 생성자 인자 마이그레이션 | 개발자 가독성 및 학습 곡선 최적화 | ✅ |
| **시스템 견고함** | 0값 예외 처리 및 EPSILON 기반 수치 제어 로직 통합 | 런타임 에러 제로화 및 안정성 확보 | ✅ |
| **성능 최적화** | 정적 객체 재사용(Object Pooling)을 통한 GC 부하 감소 | 메모리 할당 효율성 극대화 | ✅ |

---

## 📐 프리미티브 물리 표준 가이드 (Geometric Standards)

### 1. 생성 시작점 및 회전 방향 (Rotation Standard)
| 항목 | 표준 정의 | 시각적 설명 |
| :--- | :--- | :--- |
| **0도 시작점** | **12시 방향 (-Z축)** | **[업계 표준]** 텍스처 이음새(Seam)를 뒤로 숨기기 위해 뒤쪽(-Z)에서 시작합니다. |
| **회전 방향** | **상단 조감 기준 반시계 회전 (CCW)** | 정점이 생성되는 궤적은 12시(-Z) → 9시(-X) → 6시(+Z) → 3시(+X) 순서입니다. |
| **정면 위치** | **u = 0.5 지점** | **[업계 표준]** 텍스처 가로축(U)의 중앙인 50% 지점이 카메라를 보는 정면(+Z축)입니다. |

### 2. 생성 방향 표준 (Orientation Standard)
| 프리미티브 유형 | 생성 평면 | 노멀 방향 | 용도 및 업계 관례 |
| :--- | :---: | :---: | :--- |
| **Plane** | **XY (수직)** | **+Z** | **[UI/빌보드 표준]** 카메라를 마주 보는 수직 형태로 생성됩니다. |
| **Ground** | **XZ (수평)** | **+Y** | **[지형/바닥 표준]** 월드 바닥에 누워 있는 형태로 생성됩니다. |
| **Circle / Ring** | **XZ (수평)** | **+Y** | **[효과/표식 표준]** 언리얼/유니티 관례에 따라 바닥에 누운 형태로 생성됩니다. |

---

## 🛠️ 심층 성능 최적화 성과 (Deep Performance Optimization) ✅

### 1. 정적 객체 재사용 (Object Pooling / Scratchpad)
*   **문제점**: `generateTorusData`, `generateTorusKnotData` 등의 루프 내부에서 임시 벡터 객체(`{x, y, z}`)를 생성 시마다 수천 번 할당함.
*   **해결**: 클래스 내부 비공개 정적 Scratchpad 객체(`#SCRATCH_V1` ~ `#SCRATCH_V4`)를 도입하여 연산 결과를 재사용함으로써 가비지 컬렉션(GC) 부하를 제거.

### 2. 표준 기저 및 방향 벡터 상수화
*   **해결**: 모든 프리미티브가 공유하는 표준 상수 정의를 통해 공간 정의의 일관성 확보 및 가독성 향상.
    *   `#BASIS_U`, `#BASIS_V`: 평면 구성을 위한 기본 기저 축 (+X, -Z).
    *   `#AXIS_UP`, `#AXIS_DOWN`: 수직 방향 축 (+Y, -Y).
    *   `#ZERO_VECTOR`: 좌표계의 원점.

### 3. 수학 연산 헬퍼 통합
*   **해결**: Frenet 프레임 및 방사형 연산을 위한 전용 헬퍼(`#set`, `#normalize`, `#cross`)를 비공개 메소드로 구현하여 `TorusKnot` 등 복합 지오메트리의 수식 가독성과 안정성 향상.

---

## ✅ 리팩토링 및 안정성 완료 현황 (Execution Status)

### 1. 로직 및 코어 시스템 개선
| 항목 | 리팩토링 및 고도화 내용 | 상태 |
| :--- | :--- | :---: |
| **PrimitiveUtils** | 평면/원형/링/몸통 생성, 그리드 인덱스, 탄젠트 계산 유틸리티화 | ✅ |
| **Architecture** | 베이스 클래스 uniqueKey 기반 자동 캐싱 및 makeData 외부화 | ✅ |
| **Thin Class 전략** | 모든 프리미티브 클래스를 50라인 이내의 설정 전용 클래스로 정규화 완성 | ✅ |
| **Object Pooling** | 정규화된 네이밍의 Scratchpad 상수를 통한 런타임 메모리 최적화 | ✅ |
| **Cone (New)** | 신규 원뿔 프리미티브 추가 및 실린더 로직 재사용 | ✅ |
| **Ring (New)** | 신규 고리 프리미티브 추가 및 전용 유틸리티 로직 구현 | ✅ |
| **UV Options** | `isRadial` (Planar Mode / Radial Mode) 옵션 통합 구현 | ✅ |
| **Tooling** | 전 예제 4-메쉬 레이아웃 및 고해상도 라벨링 표준화 | ✅ |

### 2. 생성자 인자명 표준 마이그레이션 결과
| 클래스 | 표준화된 인자명 | 상태 |
| :--- | :--- | :---: |
| **Box** | widthSegments, heightSegments, depthSegments | ✅ |
| **Circle** | radialSegments, isRadial | ✅ |
| **Cone** | radius, height, radialSegments, heightSegments, capBottom | ✅ |
| **Ring** | innerRadius, outerRadius, thetaSegments, phiSegments, isRadial | ✅ |
| **Plane / Ground** | widthSegments, heightSegments, flipY | ✅ |
| **Cylinder** | capTop, capBottom, isRadialTop, isRadialBottom | ✅ |
| **Torus** | radialSegments, tubularSegments, thetaStart, thetaLength, capStart, capEnd | ✅ |
| **TorusKnot** | tubeRadius, windingsAroundAxis, windingsAroundCircle | ✅ |
| **Capsule** | height, radialSegments, heightSegments, capSegments | ✅ |

---

## 🛠️ 2차 고도화 과제: 구조적 응집도 극대화 (Phase 2: Structural Cohesion)

### 1. 그리드 패턴 추상화 (`generateGrid`) ✅
*   **해결**: `Plane`, `Sphere`, `Cylinder`, `Torus` 등 대다수 프리미티브가 공유하던 이중 루프 구조를 콜백 기반 유틸리티로 통합.

### 2. 방사형 수식의 완전 통합 (`#calculateRadialPoint` 확대) ✅
*   **해결**: `Torus`와 `TorusKnot`까지 `#calculateRadialPoint` 표준 수식을 적용하여 엔진 전역의 물리 표준 일관성 완성.

### 3. 엔트리 포인트 표준화 (Thin Class 완성) ✅
*   **해결**: `Sphere`, `Cylinder` 등 클래스 내부에 남은 `makeData` 로직을 `PrimitiveUtils`로 완전 이관. 모든 클래스 파일이 50라인 이내로 정규화됨.

### 4. 벡터 기반 평면 로직 단일화 ✅
*   **해결**: `generatePlaneData`를 축 문자열 방식에서 벡터(`uVector`, `vVector`) 기반으로 리팩토링하여 구조적 통일 달성.

---

## 🚀 향후 로드맵 (Roadmap)
| 구분 | 대상 항목 | 필요성 및 기대 효과 | 우선순위 | 상태 |
| :--- | :--- | :--- | :---: | :---: |
| **구조 개선** | **위 5대 경량화 과제 실행** | 시스템 슬림화 및 아키텍처 완성도 극대화 | ✅ | ✅ |
| **구조 개선** | **2차 고도화 과제 (4종) 실행** | 중복 0% 달성 및 클래스 정규화 완성 | ✅ | ✅ |
| **유지보수** | **PrimitiveUtils 내부 정밀 튜닝** | 유틸리티 응집도 향상 및 복합 도형 생성 효율화 | ✅ | ✅ |
| **고도화** | 극점 토폴로지 최적화 | 중복 정점 제거를 통한 렌더링 효율 향상 | 🟢 보통 | 🟢 |
| **고도화** | 6면 개별 UV 제어 | Box 각 면별 독립적 텍스처링 유연성 확보 | 🟢 보통 | 🟢 |
| **신규** | **Polyhedrons** | 저폴리곤 구체 대체 및 추상 아트 구성 | 🟢 보통 | 🟢 |

---
**대상 버전:** V4.1.0-Alpha (완료)
