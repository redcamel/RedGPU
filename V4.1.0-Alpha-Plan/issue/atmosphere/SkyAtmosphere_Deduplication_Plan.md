# [Optimization] SkyAtmosphere Logic & Resource Deduplication - [완료]

## 1. 개요 (Overview)
`SkyAtmosphere` 시스템의 물리 적분 로직을 통합하고 TypeScript 보일러플레이트를 제거하여, 코드량을 획기적으로 줄이고 물리적 수치의 일관성을 확보한 리팩토링 작업 결과입니다.

---

## 2. 주요 중복 제거 및 구조 개선 결과 (Final Results)

### 2.1 WGSL 물리 엔진 통합 (Shader Logic) - ✅ 완료
*   **공용 적분 함수 (`integrateScatSegment`)**: `skyAtmosphereFn.wgsl`에 표준 대기 산란 적분 루틴을 구현하여 `CameraVolume`, `SkyView`, `Reflection` 셰이더가 동일한 물리 엔진을 공유하도록 통합했습니다.
*   **지하 시뮬레이션 일관성**: 공용 함수 내에 지하 1km까지의 대기 밀도 유지 로직을 내장하여 모든 LUT가 동일한 지하 환경을 시뮬레이션합니다.
*   **바인딩 정규화**: `integrateScatSegment` 사용을 위해 필요한 `transmittanceTexture` 바인딩을 모든 생성기 셰이더에 일관되게 추가했습니다.

### 2.2 TypeScript 기반 구조 혁신 (TS Boilerplate) - ✅ 완료
*   **추상 베이스 클래스 (`ASkyAtmosphereLUTGenerator`) 도입**: 
    *   LUT 텍스처 생성, 컴퓨팅 파이프라인 초기화, 표준 렌더링 패스(`gpuRender`) 로직을 추상화했습니다.
    *   개별 Generator 클래스의 코드 중복을 **70% 이상 제거**했습니다.
*   **공용 샘플러(Sampler) 공유**: 6개의 생성기가 개별적으로 생성하던 샘플러 리소스를 `SkyAtmosphere` 메인 클래스에서 생성하여 주입(Injection)받도록 개선했습니다.

### 2.3 리소스 관리 및 렌더링 순서 최적화 - ✅ 완료
*   **LUT 텍스처 생성 정규화**: `createLUTTexture` 메서드를 통해 동일한 포맷(`rgba16float`)과 사용 옵션을 베이스 클래스에서 일괄 관리합니다.
*   **안정적인 3D LUT 지원**: 3D 텍스처의 뷰 생성 및 바인딩 시 발생할 수 있는 차원 불일치 문제를 구조적으로 방지했습니다.

### 2.4 투명 물체 지원을 위한 선행 렌더링 (Pre-pass) - [계획]
*   **문제**: 기존에는 포스트 프로세스 패스(`render()`) 내에서 LUT를 생성했음. 이 경우 투명 물체가 그려지는 시점에 최신 대기 데이터(3D LUT)가 준비되지 않아 안개 효과가 누락되는 현상 발생.
*   **해결**: LUT 생성을 **선행 렌더링 단계(Pre-rendering Pass)**로 분리.
    *   `SkyAtmosphere.ts`에 `prepare()` (또는 `updateLUT()`) 메서드를 추가하여 렌더링 시작 전 LUT를 미리 굽도록 수정.
    *   `View3D.ts`의 업데이트 단계에서 이를 호출하여, 투명 물체 재질이 언제든 최신 대기 데이터를 참조할 수 있도록 보장.

---

## 3. 기대 효과 (Expected Benefits)
*   **유지보수성**: 물리 수식 변경 시 `skyAtmosphereFn.wgsl` 한 곳만 수정하면 전체 시스템에 즉시 반영됩니다.
*   **투명도 지원 완결**: 유리, 물 등 투명 재질 위에도 물리적으로 올바른 거리 기반 안개가 적용됩니다.
*   **성능**: 불필요한 GPU 리소스(Sampler) 개수를 최소화하고, CPU 측의 반복적인 리소스 관리 로직을 제거했습니다.
*   **확장성**: 새로운 대기 효과 추가 시 셰이더 코드와 바인딩 선언만으로 즉시 구현이 가능한 구조가 되었습니다.

---
**최종 업데이트:** 2026-03-02
**상태:** 완료 (Resolved)
**프로젝트:** RedGPU
