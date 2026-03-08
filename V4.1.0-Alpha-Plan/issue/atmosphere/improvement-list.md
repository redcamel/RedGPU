# Sky Atmosphere Improvement List

## [KO] 개요
`@src\display\skyAtmosphere\**` 경로의 물리 기반 대기 산란 시스템에 대한 분석 결과, RedGPU Professional 표준 및 기술적 최적화를 위한 개선 사항을 정리합니다.

## [EN] Overview
This document summarizes the improvements for the physics-based atmospheric scattering system in `@src\display\skyAtmosphere\**` based on RedGPU Professional standards and technical optimization analysis.

---

## 1. TypeDoc Documentation (Professional Standard)
### [KO] 주석 표준 준수 및 보완
- **다국어 태그 (`[KO]`, `[EN]`) 적용**: `SkyAtmosphere` 클래스 및 각 `Generator` 클래스의 멤버, 메서드에 다국어 설명 보완.
- **태그 순서 및 형식 준수**: `@example`을 최상단에 배치하고, `@param` 이름 뒤 ` - ` (공백-하이픈-공백) 형식을 철저히 준수.
- **카테고리 지정**: `@category SkyAtmosphere` 태그를 추가하여 문서화 분류 체계 정립.
- **제네릭 타입 백틱 처리**: 주석 내 `Array<number>` 등 제네릭 표현을 백틱으로 감싸 VitePress 빌드 에러 방지.

### [EN] TypeDoc Standards Compliance
- **Multilingual Tags (`[KO]`, `[EN]`)**: Complete missing descriptions for `SkyAtmosphere` and `Generator` classes.
- **Tag Order and Formatting**: Place `@example` at the top and use the ` - ` (space-hyphen-space) format for `@param`.
- **Category Assignment**: Add `@category SkyAtmosphere` for better documentation organization.
- **Generic Type Backticks**: Wrap generic types like `Array<number>` in backticks to prevent VitePress build errors.

---

## 2. Technical Optimization & Logic Integrity
### [KO] 비동기 렌더링 정합성 해결
- **문제**: `ReflectionGenerator.render`는 `async`이지만 `SkyAtmosphere.#updateLUTs`에서 동기적으로 호출됨.
- **개선**: 리플렉션/조도 데이터가 생성 완료된 후 배경 및 포스트 이펙트가 적용되도록 상태 관리 로직 도입.

### [EN] Async Rendering Consistency
- **Problem**: `ReflectionGenerator.render` is `async`, but called synchronously in `SkyAtmosphere.#updateLUTs`.
- **Improvement**: Implement state management to ensure reflection/irradiance data is ready before background and post-effect rendering.

### [KO] 셰이더 초기화 및 구조 개선
- **문제**: `SkyAtmosphere.ts` 내 `#initShaders`에서 대량의 문자열 결합으로 WGSL 코드를 생성함.
- **개선**: 구조화된 템플릿 방식이나 별도 WGSL 파일 분리를 통해 가독성과 유지보수성 향상.

### [EN] Shader Initialization & Structure
- **Problem**: Large string concatenations for WGSL in `SkyAtmosphere.ts`'s `#initShaders`.
- **Improvement**: Improve readability and maintainability by using structured templates or separate WGSL files.

---

## 3. Resource Management & Consistency
### [KO] 리소스 명명 및 생명주기
- **일관된 Labeling**: 모든 GPU 리소스(Texture, Buffer, Pipeline)에 일관된 네이밍 규칙 적용 (`createUUID()` 사용 여부 통일).
- **명시적 파괴**: `SkyAtmosphere` 인스턴스 파괴 시 내부 수동 생성 리소스들의 `destroy()` 호출 보장 확인.

### [EN] Resource Naming & Lifecycle
- **Consistent Labeling**: Apply consistent naming conventions to all GPU resources (Textures, Buffers, Pipelines).
- **Explicit Destruction**: Ensure all manually created internal resources are properly `destroy()`ed when the `SkyAtmosphere` instance is disposed.

---

## 4. Parameter Validation
### [KO] 입력값 검증 강화
- **배열 타입 검증**: `rayleighScattering` 등 배열/색상 타입에 대한 유효 범위 검증 로직 추가.
- **물리적 범위 제한**: 그래픽 아티팩트 방지를 위해 입력값 범위를 물리적으로 유효한 임계치로 더 엄격히 제한.

### [EN] Enhanced Parameter Validation
- **Array Type Validation**: Add range validation for array/color types like `rayleighScattering`.
- **Physical Range Constraints**: Strictly limit input ranges to physically valid thresholds to prevent graphical artifacts.
