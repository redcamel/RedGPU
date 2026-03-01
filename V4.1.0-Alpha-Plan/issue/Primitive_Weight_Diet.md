# [Optimization] Primitive System Architecture Refactoring & Standardization

## 📌 개요 (Overview)
RedGPU 프리미티브 시스템의 고질적인 중복 로직을 제거하고, 기하학적 수식 및 데이터 처리 프로세스를 `PrimitiveUtils`로 중앙 집중화하여 시스템 구조를 근본적으로 개선했습니다.

---

## 🎯 핵심 리팩토링 목표 (Strategic Goals)
| 분류 | 핵심 전략 | 성과 지표 |
| :--- | :--- | :--- |
| **아키텍처** | 베이스 클래스 중심의 리소스 캐싱 및 수식 유틸리티화 | 클래스 코드량 65% 절감 |
| **데이터 레이아웃** | P3, N3, U2, T4 (12 floats) 인터리브 포맷 전역 적용 | 노멀맵 정확도 및 연산 성능 향상 |
| **인터페이스** | 업계 표준 명명 규칙 기반의 생성자 인자 마이그레이션 | 개발자 가독성 및 학습 곡선 최적화 |
| **시스템 견고함** | 0값 예외 처리 및 EPSILON 기반 수치 제어 로직 통합 | 런타임 에러 제로화 및 안정성 확보 |

---

## 📐 프리미티브 물리 표준 가이드 (Geometric Standards)

### 1. 생성 시작점 및 회전 방향 (Rotation Standard)
| 항목 | 표준 정의 | 시각적 설명 |
| :--- | :--- | :--- |
| **0도 시작점** | **12시 방향 (-Z축)** | **[업계 표준]** 텍스처 이음새(Seam)를 뒤로 숨기기 위해 뒤쪽(-Z)에서 시작합니다. |
| **회전 방향** | **상단 조감 기준 반시계 회전 (CCW)** | 정점이 생성되는 궤적은 12시(-Z) → 9시(-X) → 6시(+Z) → 3시(+X) 순서입니다. |
| **정면 위치** | **u = 0.5 지점** | **[업계 표준]** 텍스처 가로축(U)의 중앙인 50% 지점이 카메라를 보는 정면(+Z축)입니다. |

### 2. 앞면 정의 및 컬링 (Winding & Culling)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **앞면 (Front)** | **반시계 방향 (CCW)** | 정점 세 개를 반시계 방향으로 연결하는 면이 앞면입니다. |
| **안정화 로직** | **CCW 생성 + 표준 인덱스** | 반시계 방향 정점 배치 후 표준 인덱스로 연결하여 바깥쪽을 CCW로 구현합니다. |
| **가시성** | **뒷면 제거 (Back-face)** | 성능 최적화를 위해 도형의 안쪽면(뒷면)은 기본적으로 렌더링하지 않습니다. |

### 3. UV 매핑 및 텍스처 방향 (UV Standard)
| 항목 | 표준 정의 | 상세 설명 |
| :--- | :--- | :--- |
| **UV 원점** | **상단 좌측 (Top-Left)** | 텍스처의 (0,0)은 도형의 왼쪽 상단에 매핑됩니다. (V-Down 표준) |
| **수직 흐름** | **위 → 아래** | V=0은 도형의 가장 높은 곳, V=1은 가장 낮은 곳을 의미합니다. |
| **수평 흐름** | **좌측 → 정면 → 우측** | 반시계 방향 회전에 따라 텍스처가 왼쪽(U=0)에서 정면(U=0.5)을 거쳐 오른쪽(U=1)으로 감쌉니다. |

#### **원형 단면(Cap) 및 Circle UV 옵션**
`Circle` 및 원형 단면을 가진 프리미티브(`Cylinder`, `Torus`)는 `isRadial` 계열 옵션을 통해 두 가지 매핑 방식을 지원합니다:
1.  **Planar Mode (isRadial: false, 기본값):**
    *   텍스처를 단면 위에 그대로 올려놓은 형태입니다. (중심: UV 0.5, 0.5)
    *   일반적인 물체 표현이나 뚜껑 로고 투영 등에 사용됩니다.
2.  **Radial Mode (isRadial: true):**
    *   **성장형/팽창형(Expansion) 매핑:** U축은 각도($0 \rightarrow 1$), V축은 중심에서의 거리($0 \rightarrow 1$)에 매핑됩니다.
    *   텍스처의 **V 오프셋(V-Offset)** 애니메이션을 통해 원이 중심에서 밖으로 커지는 VFX 효과를 구현할 수 있습니다.

**적용 대상:**
- **Circle:** `isRadial`
- **Cylinder:** `isRadialTop`, `isRadialBottom`
- **Torus:** `isRadialCapStart`, `isRadialCapEnd` (Partial 모드 시)

### 4. 단면 제어 표준 (Capping)
| 항목 | 명칭 표준 | 적용 대상 및 특징 |
| :--- | :--- | :--- |
| **수직 기둥** | **capTop, capBottom** | Cylinder: 위(+Y)와 아래(-Y) 단면을 개별적으로 제어 가능합니다. |
| **회전 고리** | **capStart, capEnd** | Torus: 시작 각도와 끝 각도의 단면을 개별적으로 제어 가능합니다. |

---

## 🛠️ 테스트 및 시각화 표준 (Standardized Examples)
모든 프리미티브 예제는 기술적/시각적 검증을 위해 **4-메쉬 레이아웃**을 표준으로 채택합니다.

| 메쉬 유형 | 적용 텍스처 / 모드 | 검증 목적 |
| :--- | :--- | :--- |
| **Line List** | ColorMaterial (Green) | 토폴로지 구조 및 정점 연결 상태 확인 |
| **Triangle List (Grid)** | `UV_Grid_Sm.jpg` | 기하학적 UV 정렬 상태 및 왜곡 여부 확인 |
| **Triangle List (Diffuse)** | `crate.png` 또는 `h_test.jpg` | 실제 텍스처 적용 시의 시각적 완성도 확인 |
| **Point List** | ColorMaterial (Cyan) | 정점 분포 밀도 및 배치 상태 확인 |

---

## 🛠️ 리팩토링 및 안정성 완료 현황 (Execution Status)

### 1. 로직 및 코어 시스템 개선
| 항목 | 리팩토링 및 고도화 내용 | 상태 |
| :--- | :--- | :---: |
| **PrimitiveUtils** | 평면/원형/몸통 생성, 그리드 인덱스, 탄젠트 계산 유틸리티화 | 🟢 |
| **Architecture** | 베이스 클래스 uniqueKey 기반 자동 캐싱 및 makeData 외부화 | 🟢 |
| **Cone (New)** | 신규 원뿔 프리미티브 추가 및 실린더 로직 재사용 | 🟢 |
| **UV Options** | `isRadial` (Planar Mode / Radial Mode) 옵션 통합 구현 | 🟢 |
| **Tooling** | 전 예제 4-메쉬 레이아웃 및 고해상도 라벨링 표준화 | 🟢 |

### 2. 생성자 인자명 표준 마이그레이션 결과
| 클래스 | 이전 인자명 | 표준화된 인자명 | 상태 |
| :--- | :--- | :--- | :---: |
| **Box** | wSegments, hSegments, dSegments | widthSegments, heightSegments, depthSegments | 🟢 |
| **Circle** | segments | radialSegments, isRadial | 🟢 |
| **Cone** | - | radius, height, radialSegments, heightSegments, capBottom | 🟢 |
| **Plane / Ground** | wSegments, hSegments | widthSegments, heightSegments | 🟢 |
| **Cylinder** | openEnded | capTop, capBottom, isRadialTop, isRadialBottom | 🟢 |
| **Torus** | radialSubv, bodySubv | radialSegments, tubularSegments | 🟢 |
| **Torus** | start/endAngle, capped | thetaStart, thetaLength, capStart, capEnd, isRadialCapStart, isRadialCapEnd | 🟢 |
| **TorusKnot** | tube, p, q | tubeRadius, windingsAroundAxis, windingsAroundCircle | 🟢 |
| **Capsule** | cylinderHeight | height | 🟢 |

---

## 🛠️ 코드 중복 제거 및 구조 최적화 (Code Refinement)

| 분류 | 최적화 대상 및 전략 | 기대 효과 |
| :--- | :--- | :--- |
| **수학 로직 통합** | `Sphere`와 `Capsule`의 구체(Spherical) 생성 루프를 `PrimitiveUtils.generateSphericalData`로 통합 | 공식 일관성 확보 및 코드 중복 40% 절감 |
| **후처리 캡슐화** | 탄젠트 연산 및 지오메트리 생성을 `PrimitiveUtils.finalizeGeometry` 정적 메소드로 일원화 | 각 프리미티브 파일의 반복 코드(boilerplate) 제거 |
| **안전장치 표준화** | 0값(Radius, Length 등)에 대한 빈 데이터 반환 로직을 `PrimitiveUtils.validateDimensions`로 공통화 | 런타임 에러 방지 로직의 신뢰도 및 가독성 향상 |
| **키 생성 헬퍼** | `uniqueKey` 생성 로직을 `Primitive.generateUniqueKey` 베이스 메소드로 정형화 | 키 생성 규칙 누락 방지 및 템플릿 코드 간소화 |

---

## 🚀 향후 로드맵 (Roadmap)
| 구분 | 대상 항목 | 필요성 및 기대 효과 | 우선순위 |
| :--- | :--- | :--- | :---: |
| **구조 개선** | **위 최적화 과제(4건) 실행** | 코드 슬림화 및 아키텍처 완성도 극대화 | 🔥 높음 |
| **고도화** | 극점 토폴로지 최적화 | 중복 정점 제거를 통한 렌더링 효율 향상 | 🟢 보통 |
| **고도화** | 6면 개별 UV 제어 | Box 각 면별 독립적 텍스처링 유연성 확보 | 🟢 보통 |
| **신규** | **Ring (고리)** | UI, 포탈 효과, 궤도 시각화 등에 활용 | 🔥 높음 |
| **신규** | **Polyhedrons** | 저폴리곤 구체 대체 및 추상 아트 구성 | 🟢 보통 |

---
**대상 버전:** V4.1.0-Alpha
