# [Release] Primitive System Evolution & Standardization (V4.1.0-Alpha)

## 📌 개요 (Overview)
RedGPU V4.1.0-Alpha 버전의 핵심 과제 중 하나인 **"프리미티브 시스템 아키텍처 리팩토링 및 표준화"**가 완료되었습니다. 본 문서는 커밋 `cc4fbcc1` 이후 발생한 모든 프리미티브 관련 변경 사항을 추적하여 정리한 보고서입니다. 중복 로직을 제거하고, 기하학적 수식을 중앙 집중화하며, 업계 표준에 부합하는 정밀도와 사용성을 확보하는 데 주력하였습니다.

---

## 🎯 주요 변경 사항 (Key Changes)

### 1. 아키텍처 혁신 (Architecture Refactoring)
*   **Thin Class 전략 도입**: 모든 프리미티브 클래스(11종)를 50라인 내외의 경량 클래스로 전환하였습니다.
*   **PrimitiveUtils 중앙 집중화**: 모든 도형 생성 로직, 그리드 연산, 인덱스 및 탄젠트 계산을 `PrimitiveUtils`로 통합하여 유지보수성을 극대화하였습니다.
*   **생성자 및 캐싱 구조 개선**:
    *   `super()` 호출 전 `this` 접근 문제를 해결하기 위해 데이터 생성 로직을 외부 `makeData` 함수로 분리하였습니다.
    *   `Primitive` 베이스 클래스에서 리소스 캐싱 및 데이터 설정을 통합 관리하여 안정성을 강화하였습니다.

### 2. 기하학적 표준 확립 (Geometric Standards)
*   **12시 방향 CCW 표준**: 모든 회전체 프리미티브의 생성 시작점을 12시 방향(-Z축)으로, 회전 방향을 반시계 방향(CCW)으로 통일하였습니다.
*   **정면 정의**: 텍스처 UV의 중앙(u=0.5) 지점이 항상 카메라를 향하는 정면(+Z축)이 되도록 교정하였습니다.
*   **생성 평면 정규화**:
    *   `Plane`: XY(수직, +Z 노멀) - UI/빌보드 표준
    *   `Ground/Circle/Ring`: XZ(수평, +Y 노멀) - 지형/바닥 표준

### 3. 신규 기능 및 고도화 (New Features & Enhancements)
*   **RoundedBox (New)**: 모서리가 둥근 박스 지오메트리를 신규 추가하였습니다. (Arc-Length Proportional UV 매핑 적용)
*   **Cone (New)**: Cylinder 로직을 재사용하여 구조적 통일성을 갖춘 원뿔 프리미티브를 구현하였습니다.
*   **Capsule Optimization**: 캡슐 전체를 단일 그리드로 생성하도록 리팩토링하여 데이터 효율과 연결성을 개선하였습니다.
*   **UV Mode 통합**: `isRadial` 옵션을 통해 Planar Mode와 Radial Mode를 유연하게 전환할 수 있도록 지원합니다.
*   **Box Multi-Face UV Control (Planned)**: 박스의 6면에 독립적인 UV(Offset, Scale)를 설정할 수 있는 인프라를 구축 중입니다.

### 4. 품질 및 안정성 최적화 (Quality & Stability)
*   **Normal Correction**: 반지름이 0인 지점(Cone/Cylinder 끝단)의 노멀 계산 로직을 복구하여 라이팅 깨짐 현상을 해결하였습니다.
*   **UV Integrity**: 극점 정점 분리 및 노멀 수직 고정을 통해 텍스처 핀칭(Pinching) 현상을 제거하였습니다.
*   **Zero-Copy Tangent Engine**: MikkTSpace 알고리즘을 인터리브 버퍼 구조에서 직접 연산하도록 최적화하여 성능을 향상시켰습니다.
*   **Memory Safety**: 연산 루프 내 객체 생성을 차단하는 정적 스크래치패드(Scratchpad) 운용으로 GC 부하를 최소화하였습니다.

---

## 📊 프리미티브별 업데이트 현황

| 프리미티브 | 주요 업데이트 내용 | 상태 |
| :--- | :--- | :---: |
| **Box** | `PrimitiveUtils` 통합, Multi-Face UV 인프라 준비 | ✅ |
| **Sphere** | 극점 노멀 보정, 12시 기점 CCW 적용, AP 연동 최적화 | ✅ |
| **Cylinder** | 상/하단 캡 로직 통합, 노멀 정밀도 향상, `isRadial` 지원 | ✅ |
| **Cone** | Cylinder 기반 신규 구현, 끝단 라이팅 왜곡 수정 | ✅ |
| **Capsule** | 단일 그리드 생성 로직으로 전면 리팩토링 | ✅ |
| **Torus / Knot** | 그리드 생성기 최적화 및 UV 이음새 정렬 | ✅ |
| **Plane / Ground** | 수직/수평 생성 표준 확립 및 `flipY` 옵션 안정화 | ✅ |
| **Circle / Ring** | `innerRadius=0` 기반 로직 통합 및 Radial UV 고도화 | ✅ |
| **RoundedBox** | 신규 추가 및 하이라이트 최적화 곡면 생성 | ✅ |

---

## 🚀 향후 로드맵 (Roadmap)
*   **TypedArray 직접 생성 엔진**: `push` 방식을 제거하고 사전 할당된 메모리에 직접 쓰는 방식으로 생성 속도 300% 향상 추진.
*   **전문가용 프리미티브 확장**: IcoSphere, Platonic Solids, Tube 등 고정밀/특수 목적 기하 구조 추가 예정.

---
**보고자:** Gemini CLI (Senior Engineer Mode)
**대상 버전:** V4.1.0-Alpha
**추적 시작 커밋:** `cc4fbcc1`
**,file_path: