# [Optimization] Primitive System Architecture Refactoring & Standardization

## 📌 개요 (Overview)
RedGPU 프리미티브 시스템의 고질적인 중복 로직을 제거하고, 기하학적 수식 및 데이터 처리 프로세스를 `PrimitiveUtils`로 중앙 집중화하여 시스템 구조를 근본적으로 개선했습니다. 모든 프리미티브 클래스는 `Primitive` 베이스 클래스와 `PrimitiveUtils`를 활용하는 **Thin Class** 구조(50라인 내외)로 완전히 전환되었습니다.

---

## 🎯 핵심 리팩토링 목표 (Strategic Goals)
| 분류 | 핵심 전략 | 성과 지표 | 상태 |
| :--- | :--- | :--- | :---: |
| **아키텍처** | 베이스 클래스 중심의 리소스 캐싱 및 수식 유틸리티화 | 클래스 코드량 65% 절감 | ✅ |
| **데이터 레이아웃** | P3, N3, U2, T4 (12 floats) 인터리브 포맷 전역 적용 | 노멀맵 정확도 및 연산 성능 향상 | ✅ |
| **인터페이스** | 업계 표준 명명 규칙 기반의 생성자 인자 마이그레이션 | 개발자 가독성 및 학습 곡선 최적화 | ✅ |
| **시스템 견고함** | 0값 예외 처리 및 EPSILON 기반 수치 제어 로직 통합 | 런타임 에러 제로화 및 안정성 확보 | ✅ |

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

### 3. 앞면 정의 및 컬링 (Winding & Culling)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **앞면 (Front)** | **반시계 방향 (CCW)** | 정점 세 개를 반시계 방향으로 연결하는 면이 앞면입니다. |
| **안정화 로직** | **CCW 생성 + 표준 인덱스** | 반시계 방향 정점 배치 후 표준 인덱스로 연결하여 바깥쪽을 CCW로 구현합니다. |
| **가시성** | **뒷면 제거 (Back-face)** | 성능 최적화를 위해 도형의 안쪽면(뒷면)은 기본적으로 렌더링하지 않습니다. |

### 4. UV 매핑 및 텍스처 방향 (UV Standard)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **UV 원점** | **상단 좌측 (Top-Left)** | 텍스처의 (0,0)은 도형의 왼쪽 상단에 매핑됩니다. (V-Down 표준) |
| **수직 흐름** | **위 → 아래** | V=0은 도형의 가장 높은 곳, V=1은 가장 낮은 곳을 의미합니다. |
| **수평 흐름** | **좌측 → 정면 → 우측** | 반시계 방향 회전에 따라 텍스처가 왼쪽(U=0)에서 정면(U=0.5)을 거쳐 오른쪽(U=1)으로 감쌉니다. |

---

## ✅ 리팩토링 및 안정성 완료 현황 (Execution Status)

### 1. 로직 및 코어 시스템 개선
| 항목 | 리팩토링 및 고도화 내용 | 상태 |
| :--- | :--- | :---: |
| **PrimitiveUtils** | 평면/원형/링/몸통 생성, 그리드 인덱스, 탄젠트 계산 유틸리티화 | ✅ |
| **Architecture** | 베이스 클래스 uniqueKey 기반 자동 캐싱 및 makeData 외부화 | ✅ |
| **Thin Class 전략** | 모든 프리미티브 클래스를 50라인 이내의 설정 전용 클래스로 정규화 완성 | ✅ |
| **Cone (New)** | 신규 원뿔 프리미티브 추가 및 실린더 로직 재사용 | ✅ |
| **Ring (New)** | 신규 고리 프리미티브 추가 및 전용 유틸리티 로직 구현 | ✅ |
| **UV Options** | `isRadial` (Planar Mode / Radial Mode) 옵션 통합 구현 | ✅ |
| **Tooling** | 전 예제 4-메쉬 레이아웃 및 고해상도 라벨링 표준화 | ✅ |

### 2. 생성자 인자명 표준 마이그레이션 결과
| 클래스 | 이전 인자명 | 표준화된 인자명 | 상태 |
| :--- | :--- | :--- | :---: |
| **Box** | wSegments, hSegments, dSegments | widthSegments, heightSegments, depthSegments | ✅ |
| **Circle** | segments | radialSegments, isRadial | ✅ |
| **Cone** | - | radius, height, radialSegments, heightSegments, capBottom | ✅ |
| **Ring** | - | innerRadius, outerRadius, thetaSegments, phiSegments, isRadial | ✅ |
| **Plane / Ground** | wSegments, hSegments | widthSegments, heightSegments, flipY | ✅ |
| **Cylinder** | openEnded | capTop, capBottom, isRadialTop, isRadialBottom | ✅ |
| **Torus** | radialSubv, bodySubv | radialSegments, tubularSegments | ✅ |
| **Torus** | start/endAngle, capped | thetaStart, thetaLength, capStart, capEnd, isRadialCapStart, isRadialCapEnd | ✅ |
| **TorusKnot** | tube, p, q | tubeRadius, windingsAroundAxis, windingsAroundCircle | ✅ |
| **Capsule** | cylinderHeight | height | ✅ |

---

## 🛠️ 심층 분석 기반 5대 경량화 과제 (Deep Weight-Diet Strategy)

### 1. 생성 프로세스 단일화 (`PrimitiveUtils.finalize`) ✅
*   **해결:** 탄젠트 계산과 지오메트리 객체 생성을 하나의 정적 메소드로 통합하여 Boilerplate 제거.

### 2. 구체 수학 로직 모듈화 (`PrimitiveUtils.generateSphericalData`) ✅
*   **해결:** `Sphere`와 `Capsule` 반구 영역에서 중복되던 위도/경도 기반 이중 루프 공식을 유틸리티로 추출.

### 3. 안전장치 로직 표준화 (`PrimitiveUtils.getEmptyGeometry`) ✅
*   **해결:** 반지름/각도가 0일 때의 예외 처리 통합하여 런타임 안정성 강화 및 중복 코드 제거.

### 4. UniqueKey 생성 자동화 (`Primitive.generateUniqueKey`) ✅
*   **해결:** 베이스 클래스에서 파라미터 기반 캐싱 키 자동 생성 로직 도입으로 오타 위험 제거 및 가독성 향상.

### 5. 복잡 알고리즘 외부화 (`TorusKnot` 등 무거운 수식 이관) ✅
*   **해결:** 모든 순수 수학 알고리즘을 `PrimitiveUtils`로 이관하여 클래스 파일 크기를 최소화.

---

## 🛠️ 2차 고도화 과제: 구조적 응집도 극대화 (Phase 2: Structural Cohesion)

### 1. 그리드 패턴 추상화 (`generateGrid`) ✅
*   **해결**: `Plane`, `Sphere`, `Cylinder`, `Torus` 등 대다수 프리미티브가 공유하던 이중 루프 구조를 콜백 기반 유틸리티로 통합.

### 2. 방사형 수식의 완전 통합 (`#calculateRadialPoint` 확대) ✅
*   **해결**: `Torus`와 `TorusKnot`까지 `#calculateRadialPoint` 표준 수식을 적용하여 엔진 전역의 물리 표준 일관성 완성.

### 3. 엔트리 포인트 표준화 (Thin Class 완성) ✅
*   **해결**: `Sphere`, `Cylinder` 등 클래스 내부에 남은 `makeData` 로직을 `PrimitiveUtils`로 완전 이관. 모든 클래스 파일이 50라인 이내로 정규화됨.

### 4. 벡터 기반 평면 로직 단일화 ✅
*   **해결**: `generatePlaneData`를 축 문자열 방식에서 벡터(`uVector`, `vVector`) 기반으로 리팩토링하여 임의 평면 생성 유연성 확보 및 구조적 통일 달성.

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
