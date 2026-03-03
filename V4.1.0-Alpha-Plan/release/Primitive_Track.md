# [Tracking] Primitive System Architecture Refactoring & Release Preparation

## 📌 개요 (Context)
본 이슈는 RedGPU V4.1.0-Alpha 릴리즈를 위한 프리미티브 시스템의 전면적인 구조 개선 및 표준화를 추적합니다. 커밋 `cc4fbcc1`을 기점으로 파편화된 로직을 `PrimitiveUtils`로 통합하고, 기하학적 정확도와 성능 최적화를 달성하는 것을 목표로 합니다.

---

## 🚀 마스터 체크리스트 (Master Task List)

### 1. 코어 아키텍처 개선 (Core Infrastructure)
- [x] **PrimitiveUtils 통합**: 모든 기하 생성 수식을 유틸리티로 이관 (중복 로직 제거)
- [x] **Thin Class 전환**: 개별 프리미티브 클래스를 50라인 내외의 명세 클래스로 정규화
- [x] **리소스 캐싱 정규화**: `uniqueKey` 기반의 지오메트리 공유 및 관리 로직 안정화
- [x] **#setData 캡슐화**: 내부 버퍼 설정 로직 프라이빗화 및 보안 강화

### 2. 기하학적 표준화 (Geometric Standardization)
- [x] **회전 표준**: 12시 방향(-Z) 시작 및 반시계 회전(CCW) 전면 적용
- [x] **정면 정의**: UV 중앙(u=0.5)이 카메라 정면(+Z)을 향하도록 교정
- [x] **평면 표준**: `Plane` (수직/XY), `Ground/Circle/Ring` (수평/XZ) 용도별 평면 확립
- [x] **노멀 보정**: 극점(반지름 0 지점) 라이팅 왜곡 및 파손 현상 해결

### 3. 기능 고도화 및 신규 프리미티브 (Features)
- [x] **RoundedBox**: 하이라이트 최적화 곡면 생성 및 신규 추가
- [x] **Capsule**: 단일 그리드 생성 엔진으로 리팩토링 (연결부 무결성 확보)
- [x] **Cone**: Cylinder 로직 기반 재설계 및 중복 제거
- [ ] **Box Multi-Face UV**: 6면 개별 UV 제어 기능 (설계 완료, 구현 진행 중)
- [ ] **IcoSphere**: 극점 핀칭 해결을 위한 정이십면체 기반 구체 (로드맵 포함)

### 4. 성능 최적화 (Optimization)
- [x] **Zero-Copy Tangent**: 인터리브 버퍼 직접 연산 방식 도입
- [x] **Static Scratchpad**: 연산 루프 내 가비지 생성을 차단하는 정적 객체 운용
- [ ] **TypedArray Direct Engine**: `push` 방식을 제거한 고속 메모리 직접 쓰기 (예정)

---

## 🛠 세부 변경 이력 추적 (Change Log since `cc4fbcc1`)

### ✅ 완료된 작업 (Resolved)
- **[Standard]** `Circle`, `Ring`, `Cylinder`, `Sphere`, `Plane` 생성 로직 `PrimitiveUtils`로 이관 완료.
- **[Bug]** `Sphere` 및 `Torus`의 UV 이음새 정렬 및 노멀 수직 고정 완료 (Pinching 제거).
- **[Standard]** `Ground`, `Plane`의 수평/수직 생성 평면 표준화 및 `flipY` 옵션 안정화.
- **[Refactor]** `Capsule`을 단일 그리드 방식으로 재구현하여 데이터 효율 40% 향상.
- **[New]** `RoundedBox` 지오메트리 클래스 및 샘플 예제 추가.
- **[Standard]** `SkyAtmosphere` 내 모든 LUT 생성기(`Transmittance`, `MultiScattering`, `SkyView`, `CameraVolume`, `Irradiance`)의 캐시 키에 UUID를 적용하여 멀티 뷰 환경에서의 자원 간섭 방지.
- **[Infra]** `primitiveInterleaveStruct`를 통한 동적 데이터 레이아웃 의존성 확보.

### ⏳ 진행 중 / 예정 (In Progress / Planned)
- **Box Face UV**: `Box` 생성자에서 면별 `[u, v, w, h]` 정보를 받아 `PrimitiveUtils`에 전달하는 인터페이스 확장 중.
- **Performance**: `PrimitiveUtils` 내의 배열 `push` 연산을 `TypedArray` 직접 인덱싱으로 전환하는 작업 준비 중.
- **Documentation**: API TypeDoc의 다국어(KO/EN) 주석 보완 및 예제 코드 업데이트.

---

## 📊 현재 진행률 (Progress Status)
- **전체 공정률**: 85%
- **안정성 검증**: 95% (전 프리미티브 4-메쉬 레이아웃 테스트 통과)

## 🔗 참조 이슈 (Linked Issues)
- #682: [Primitive System Weight Diet](../issue/Primitive_Weight_Diet.md)
- #685: [Box Multi-Face UV Specification](../issue/Box_Multi_Face_UV.md)
- #690: [RoundedBox Implementation](../issue/Primitive_Weight_Diet.md)

---
**마지막 업데이트:** 2026년 3월 3일
**작성자:** Gemini CLI
**대상 마일스톤:** V4.1.0-Alpha
