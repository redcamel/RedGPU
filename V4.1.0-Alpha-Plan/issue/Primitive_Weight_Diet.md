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

### 3. 앞면 정의 및 컬링 (Winding & Culling)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **앞면 (Front)** | **반시계 방향 (CCW)** | 정점 세 개를 반시계 방향으로 연결하는 면이 앞면입니다. |
| **안정화 로직** | **CCW 생성 + 표준 인덱스** | 바깥쪽을 CCW로 구현하여 표준 인덱싱 자동화. |
| **가시성** | **뒷면 제거 (Back-face)** | 성능 최적화를 위해 도형의 안쪽면은 렌더링 제외. |

### 4. UV 매핑 및 텍스처 방향 (UV Standard)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **UV 원점** | **상단 좌측 (Top-Left)** | 텍스처의 (0,0)은 도형의 왼쪽 상단에 매핑 (V-Down 표준). |
| **수직 흐름** | **위 → 아래** | V=0은 최고점, V=1은 최저점을 의미. |
| **수평 흐름** | **좌측 → 정면 → 우측** | U=0(좌), U=0.5(정면), U=1(우)로 감싸는 구조. |

---

## 🛠️ 심층 성능 최적화 성과 (Deep Performance Optimization) ✅
| 분류 | 최적화 내용 | 기대 효과 | 상태 |
| :--- | :--- | :--- | :---: |
| **Object Pooling** | `#SCRATCH_V1` ~ `#SCRATCH_V4` 정적 상수 도입 | 루프 내 임시 객체 할당 제거 및 GC 부하 방지 | ✅ |
| **Basis Vectors** | `#BASIS_U`, `#BASIS_V`, `#AXIS_UP` 등 상수화 | 공간 정의의 일관성 확보 및 불필요한 객체 생성 방지 | ✅ |
| **Math Helpers** | `#set`, `#normalize`, `#cross` 비공개 메소드 통합 | Frenet 프레임 연산 등 복합 수식의 안정성 및 가독성 향상 | ✅ |

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

## 🛠️ 1차 경량화 과제 실행 성과 (Phase 1: Weight-Diet)
| 과제명 | 핵심 해결 내용 | 기대 효과 | 상태 |
| :--- | :--- | :--- | :---: |
| **생성 프로세스 단일화** | `PrimitiveUtils.finalize`로 탄젠트 및 지오메트리 생성 통합 | Boilerplate 제거 및 파일당 코드량 감소 | ✅ |
| **구체 수학 로직 모듈화** | `generateSphericalData` 위도/경도 이중 루프 공통화 | Sphere/Capsule 로직 중복 제거 및 수식 단일화 | ✅ |
| **안전장치 로직 표준화** | `getEmptyGeometry`를 통한 0값 예외 처리 통합 | 런타임 안정성 강화 및 중복 가드 클로즈 제거 | ✅ |
| **UniqueKey 생성 자동화** | `Primitive.generateUniqueKey` 파라미터 기반 자동화 | 오타 방지, 캐싱 정확도 향상 및 생성자 가독성 증대 | ✅ |
| **복잡 알고리즘 외부화** | `TorusKnot` 등 무거운 수식 로직 `PrimitiveUtils` 이관 | 클래스를 설정 전용(Thin Class)으로 완벽 분리 | ✅ |

---

## 🛠️ 2차 고도화 과제 실행 성과 (Phase 2: Structural Cohesion)
| 과제명 | 핵심 해결 내용 | 기대 효과 | 상태 |
| :--- | :--- | :--- | :---: |
| **그리드 패턴 추상화** | `generateGrid` 콜백 기반 유틸리티 도입 | 6개 이상의 메소드에서 중복 루프/인덱스 로직 제거 | ✅ |
| **방사형 수식 완전 통합** | `#calculateRadialPoint`를 모든 회전체에 적용 | `Torus`, `TorusKnot`까지 엔진 물리 표준 일관성 확보 | ✅ |
| **엔트리 포인트 표준화** | 모든 `makeData` 로직을 `PrimitiveUtils`로 이관 | 모든 프리미티브 클래스의 50라인 정규화 달성 | ✅ |
| **벡터 기반 평면 로직 단일화** | `generatePlaneData`를 벡터(`uVector`, `vVector`) 기반으로 전환 | 임의 평면 생성 유연성 확보 및 구조적 통일 달성 | ✅ |

---

## 🚀 차세대 고도화 로드맵 (Next-Gen Roadmap)
시스템 안정화 이후 물리적 성능의 한계와 기능 확장을 위한 심화 과제입니다.

| 대상 항목 | 상세 개선 내용 (Problem → Solution) | 기대 성과 (Benefit) | 우선순위 |
| :--- | :--- | :--- | :---: |
| **극점 토폴로지 최적화** | **[현황]** UV Sphere 방식 사용 시 양 극점에 중복 정점 다수 발생<br/>**[개선]** 극점의 정점을 단일화하여 인덱스 연결 구조 최적화 | 버퍼 용량 절감 및 극점 부근 라이팅 왜곡(Pinching) 원천 차단 | 🔥 높음 |
| **Box 6면 개별 UV 제어** | **[현황]** 모든 면에 동일한 0~1 UV가 고정 매핑됨<br/>**[개선]** 면별 UV 오프셋/스케일 배열 파라미터 도입 (Atlas UV 대응) | 단일 텍스처 아틀라스를 이용한 멀티 머티리얼 박스 구현 가능 | 🔥 높음 |
| **비동기 생성 지원** | **[현황]** 고정밀(High-Poly) 생성 시 메인 스레드 블로킹 발생<br/>**[개선]** `PrimitiveUtils` 로직을 Web Worker로 분리하여 비동기 생성 | 대규모 씬 로딩 및 정밀 모델 생성 시 프레임 드롭 방지 | 🟢 보통 |
| **고급 지오메트리 확장** | **[현황]** 기본 기하 도형 위주의 라인업<br/>**[개선]** Lathe(회전체), Extrude(압출), Polyhedron(다면체) 알고리즘 도입 | 복잡한 상용 모델링 데이터 없이 엔진 레벨에서 고차원 형태 생성 | 🟢 보통 |
| **데이터 레이아웃 유연성** | **[현황]** 모든 객체에 Tangent를 포함한 12-float 고정 레이아웃 사용<br/>**[개선]** 노멀맵 미사용 시 8-float(P3, N3, U2) 전환 옵션 제공 | VRAM 사용량 33% 절감 및 모바일/저사양 환경 최적화 | 🟢 보통 |

---
**대상 버전:** V4.1.0-Alpha (완료)
