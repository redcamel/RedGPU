# [Optimization] Weight Diet: Primitive System Consolidation

## 📌 개요 (Overview)
RedGPU 프로젝트의 핵심 구성 요소인 기하 구조(Primitive) 시스템 내의 중복 로직을 제거하고, 구조적 설계를 표준화하여 전체 코드 용량 감축 및 유지보수 효율성을 극대화합니다.

## 🎯 목표 (Goals)
- **기하 구조 최적화**: `Primitive` 베이스 클래스에서 `uniqueKey` 기반의 리소스 캐싱을 직접 수행하여 생성자(Constructor) 내 중복 코드 제거 및 기하 공식 공통화.
- **표준화**: 인자명, 데이터 포맷을 상용 엔진 수준으로 표준화하여 일관성 확보.
- **런타임 성능 향상**: 데이터 패킹 및 버퍼 업데이트 오버헤드 최소화.

## 🛠️ 주요 작업 항목 (Task List)
- [x] **`uvSize` 파라미터 전면 제거**: `AUVTransformBaseMaterial` 인프라를 활용하여 물리적 UV 스케일링 로직 제거 완료.
- [x] **`PrimitiveUtils` 신설 및 로직 이관**:
  - [x] `generatePlaneData`: 평면 기반 데이터 생성 로직 통합 (오른손 좌표계 및 V-Down UV 준수).
  - [x] `generateCircleData`: 원형 데이터 생성 엔진 적용 및 0값 예외 처리(최소 1정점 보장) 완료.
  - [x] `generateCylinderTorsoData`: 실린더/캡슐 몸통 생성 로직 벡터 기반 통합 완료.
  - [x] `generateGridIndices`: 모든 격자형 도형의 인덱스 생성 로직을 CCW 표준으로 공통화 완료.
  - [x] `interleavePacker`: 12-플로트(P3, N3, U2, T4) 정밀 데이터 패킹 헬퍼 도입 완료.
  - [x] `calculateTangents`: 공통 수학 유틸리티(`src/math/calculateTangents.ts`) 기반 탄젠트 계산 통합 완료.
- [x] **자동 캐싱 시스템 강화 및 캡슐화**: `Primitive` 베이스 클래스 생성자에서 `uniqueKey` 기반 리소스 관리 자동화 완료.
- [x] **데이터 생성 로직 분리**: `#makeData`를 외부 함수로 분리하여 초기화 안정성 및 가독성 확보 완료.
- [x] **런타임 안정성 및 견고함 강화**:
  - WebGPU 0바이트 버퍼 에러 방지를 위한 "최소 1정점 생성 + 빈 인덱스" 전략 전역 적용.
  - `TorusKnot` 파라미터명 명확화 및 예제 동기화 완료.

## 🔍 일관성 및 안정성 개선 내역 (Consistency & Robustness)
- **0값 안전장치 (Zero-Value Safety)**: 
  - `radius`, `thetaLength`, `phiLength` 등이 0일 때 WebGPU에서 `size: 0` 버퍼 생성 에러가 발생하는 것을 방지하기 위해 최소 1개의 정점을 생성하도록 전 프리미티브 로직 보완.
  - 실제 렌더링은 `indexData`를 비움으로써 아무것도 그려지지 않도록 처리하여 논리적 일관성 확보.
- **정면 및 이음새 정렬 (Alignment)**:
  - `Sphere`, `Cylinder`, `Capsule`, `Torus`, `TorusKnot` 등 모든 회전체의 텍스처 이음새(Seam)를 뒤쪽(-Z)으로 통일.
  - `Sphere` 수평각 오프셋(-PI/2) 조정을 통해 다른 프리미티브와 정면 방향 동기화.
- **UV V-Down 표준**: 모든 프리미티브의 UV 상하 반전 문제를 해결하고 엔진 표준(상단=0, 하단=1)에 맞춤.

## 📏 생성자 인자명 표준화 (Constructor Parameter Standardization)
프리미티브 간의 일관성을 위해 다음 명명 규칙을 준수하며, 기존 인자들을 순차적으로 마이그레이션합니다.

- **Segments (분할 수)**: `widthSegments`, `heightSegments`, `radialSegments`, `tubularSegments` 등으로 통일.
- **Dimensions (치수)**: `width`, `height`, `depth`, `radius`, `tubeRadius` 등 직관적 명칭 사용.
- **Angles (각도)**: `thetaStart/Length`, `phiStart/Length` 사용.

### 📉 인자명 마이그레이션 대상 (Migration List)
| 클래스 | 마이그레이션 대상 (기존 → 표준) |
| :--- | :--- |
| **Box** | `wSegments` → `widthSegments`, `hSegments` → `heightSegments`, `dSegments` → `depthSegments` |
| **Plane / Ground** | `wSegments` → `widthSegments`, `hSegments` → `heightSegments` |
| **Torus** | `radialSubdivisions` → `radialSegments`, `bodySubdivisions` → `tubularSegments` |
| **Torus** | `startAngle` → `thetaStart`, `endAngle` → `thetaLength` |
| **TorusKnot** | `tube` → `tubeRadius` |
| **Capsule** | `cylinderHeight` → `height` |

---
**우선순위:** 🟠 높음 (High) | **난이도:** 🟡 보통 (Normal) | **대상 버전:** V4.1.0-Alpha
