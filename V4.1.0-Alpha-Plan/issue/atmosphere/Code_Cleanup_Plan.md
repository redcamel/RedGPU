# SkyAtmosphere 코드 정리 및 최적화 계획 (Cleanup Plan)

## 1. 개요 (Overview)
본 문서는 `src/display/skyAtmosphere/` 모듈의 물리적/수학적 논리는 유지하되, 코드의 구조적 중복을 제거하고 흐름을 개선하여 V4.1.0의 안정성을 높이기 위한 가이드를 제공합니다.

---

## 2. 정밀 분석 결과 및 개선 항목

### 2.1 Generator 계층 구조 및 자원 관리 (High Importance)
*   **현황**: `Transmittance`, `MultiScattering` 등 모든 Generator가 `render()` 호출 시마다 `gpuDevice.createBindGroup`을 수행함.
*   **문제점**: 텍스처 리소스가 변경되지 않았음에도 매 프레임 가비지 컬렉션(GC) 부하와 CPU 오버헤드 발생.
*   **개선**: 입력 리소스(TextureView 등)가 변경되었을 때만 바인드 그룹을 갱신하도록 **Bind Group Caching** 로직 도입.
*   **우선순위**: **P0 (최우선)**

### 2.2 SkyAtmosphere.ts 보일러플레이트 중복 (Medium Importance)
*   **현황**: 대기 파라미터(Mie, Rayleigh 등)가 약 30개에 달하며, 각각 독립적인 Getter/Setter와 `dirty` 플래그 업데이트 로직이 개별적으로 작성됨.
*   **문제점**: 코드 길이가 불필요하게 길어지고 오타로 인한 버그 발생 가능성이 높음.
*   **개선**: 파라미터 정의 객체를 기반으로 Setter 로직을 자동화하거나, 파라미터 그룹별로 Dirty 플래그를 통합 관리하는 구조로 개선.
*   **우선순위**: **P1 (높음)**

### 2.3 셰이더 컴파일 및 문자열 조합 (Medium Importance)
*   **현황**: `SkyAtmosphere.ts`의 `#initShaders` 메서드에서 대량의 WGSL 코드를 배열 `join('\n')` 방식으로 조합함.
*   **문제점**: 셰이더 코드 가독성이 떨어지고 IDE의 구문 강조(Syntax Highlighting) 혜택을 받지 못함.
*   **개선**: 조합 로직을 별도의 `.wgsl` 파일로 완전히 이동시키거나, `SystemCodeManager`를 활용한 템플릿 방식으로 정규화.
*   **우선순위**: **P1 (높음)**

### 2.4 IBL 생성기(Reflection/Irradiance) 흐름 정규화 (Low Importance)
*   **현황**: `SkyAtmosphereReflectionGenerator.ts`는 `async render`를 사용하고 내부에서 루프를 돌며 밉맵을 생성하는 등 다른 Generator와 흐름이 상이함.
*   **문제점**: 전체 시스템의 동기/비동기 흐름 예측이 어려움.
*   **개선**: `ASkyAtmosphereLUTGenerator` 추상 클래스에 밉맵 생성 및 비동기 대기 로직을 정규화하여 하위 클래스 코드를 단순화.
*   **우선순위**: **P2 (보통)**

---

## 3. 개선 작업 로드맵 (Action Plan)

### Step 1: Generator 기반 강화 (P0)
| 진행 상황 | 대상 파일 | 주요 변경 사항 | 비고 |
| :---: | :--- | :--- | :--- |
| **완료** | `ASkyAtmosphereLUTGenerator.ts` | `protected` 변수 4종 및 `readonly` 속성 4종을 Private Field(`#`)로 캡슐화 | 외부/자식 클래스용 Getter/Setter 구현 추가. `protected` 키워드 제거(public 전환). |
| **완료** | `ASkyAtmosphereLUTGenerator.ts` | `gpuRender`를 `executeComputePass`로 개명 및 파이프라인 의존성 주입(DI) 적용 | 부모 클래스의 불필요한 `#pipeline` 상태 제거 및 자식 클래스의 명확한 파이프라인 관리 보장 |
| **완료** | `TransmittanceGenerator.ts` | 단일 바인드 그룹 캐싱 로직 적용 (`#bindGroup`) | `this.executeComputePass()` 활용 (`@ts-ignore` 제거) |
| **완료** | `MultiScatteringGenerator.ts` | 단일 바인드 그룹 캐싱 로직 적용 (`#bindGroup`) | `this.executeComputePass()` 활용 (`@ts-ignore` 제거) |
| **완료** | `SkyViewGenerator.ts` | 단일 바인드 그룹 캐싱 로직 적용 (`#bindGroup`) | `this.executeComputePass()` 활용 (`@ts-ignore` 제거) |
| **완료** | `AtmosphereIrradianceGenerator.ts` | 단일 바인드 그룹 캐싱 로직 적용 (`#bindGroup`) | `this.executeComputePass()` 활용 (`@ts-ignore` 제거) |
| **완료** | `CameraVolumeGenerator.ts` | 조건부 바인드 그룹 캐싱 적용 | `View3D`의 UniformBuffer 갱신 여부 감지 로직 포함 |
| **완료** | `SkyAtmosphereReflectionGenerator.ts` | 다중 바인드 그룹 캐싱 적용 | `SoftCut`, `NoSoftCut`, `combine` 루프용 배열 캐싱 적용 |

### Step 2: SkyAtmosphere 클래스 슬림화 및 Uniform 최적화 (P1)
| 진행 상황 | 대상 컴포넌트 | 주요 변경 사항 | 기대 효과 |
| :---: | :--- | :--- | :--- |
| **완료** | `SkyAtmosphere.ts` (State Mgmt) | `#markDirty` 메서드 신규 구현 | 산발적인 `dirty` 플래그 관리 일원화 |
| **완료** | `SkyAtmosphere.ts` (Setters) | 30여 개 파라미터 Setter 내 중복 로직 통합 | 코드 라인 수 대폭 감소 및 가독성 증가 |
| **완료** | `SkyAtmosphere.ts` (Uniforms) | `#updateSharedUniformBuffer` 일괄 복사 방식으로 개편 | 매 루프 발생하던 `queue.writeBuffer()`를 1회로 압축하여 CPU 부하 감소 |

### Step 3: 셰이더 리소스 정규화 (P1) - **[현재 보류 (On Hold)]**
*   **방향성 논의 결과**: `SystemCodeManager`를 오염시키지 않고, 번들러의 Native Import 및 TS 템플릿 리터럴을 활용하여 조립(Composition)하는 방향이 논의됨.
*   **상태**: 추가적인 아키텍처 결정 전까지 작업 홀딩.

### Step 4: WGSL 셰이더 내 공통 물리 로직 분리 및 통합 (P1)
여러 `.wgsl` 파일에 중복으로 하드코딩된 대기 산란 관련 수식과 유틸리티 함수들을 식별하고 `core/skyAtmosphereFn.wgsl`로 분리하여 유지보수성을 극대화합니다.

| 진행 상황 | 분류 (Category) | 중복 발견 위치 | 통합된 함수 시그니처 | 기대 효과 |
| :---: | :--- | :--- | :--- | :--- |
| **완료** | **큐브맵 벡터 매핑** | `Irradiance`, `Reflection (Soft/NoSoft)`, `Combine` (총 4곳) | `fn getCubeMapDirection(uv: vec2<f32>, face: u32) -> vec3<f32>` | 15줄 가량의 `switch(face)` 계산식 중복 제거 및 가독성 확보 |
| **완료** | **지면 반사광 계산** | `SkyView`, `Irradiance`, `Reflection (Soft/NoSoft)` (총 4곳) | `fn evaluateGroundRadiance(cosSun, sunTrans, msEnergy, groundAlbedo)` | Albedo와 MS 에너지를 이용한 적분 식의 파편화 방지 및 무결성 확보 |
| **완료** | **태양 본체 스페큘러** | `Reflection (SoftCut)`, `Reflection (NoSoftCut)` (총 2곳) | `fn getSpecularSunLobe(viewSunCos, lobeHalfAngle, sunTrans)` | Sun Lobe 계산을 위한 `pow(viewSun, sunLobePower)` 로직 통합 보존 |
| **완료** | **IBL 평가 거시 구조** | `Irradiance`, `Reflection (Soft/NoSoft)` (총 3곳) | `fn evaluateIBLRadiance(...)` | 각 IBL 셰이더 파일의 `main()` 함수가 10줄 이내로 극단적 압축 달성 |

### Step 5: WGSL 추가 공통 로직 식별 및 시스템 레벨 편입 (P2)
정밀 분석을 통해 식별된 2차 중복 요소들을 정리하고, 범용성이 높은 수학 로직은 시스템 코어(`math`)로 편입합니다.

| 진행 상황 | 분류 (Category) | 중복 발견 위치 | 통합 전략 및 기대 효과 |
| :---: | :--- | :--- | :--- |
| **완료** | **Frustum Ray 추출** | `CameraVolume`, `ComputePostEffect` (총 2곳) | `fn getFrustumRayDirection(uv, invP, invV)`를 `skyAtmosphereFn`에 추가하여 NDC->World 변환의 중복 제거 |
| **완료** | **Hammersley 시퀀스** | `Irradiance` 등 IBL 관련 셰이더 내부 하드코딩 | IBL 중요도 샘플링에 쓰이는 `radicalInverse_VdC` 및 `hammersley` 함수를 `getRadicalInverseVanDerCorput`과 `getHammersley`로 명확히 명명하여 `SystemCodeManager`의 `math.hash` 모듈로 이관 및 엔진(BRDF, Prefilter 등) 전반에 걸쳐 일괄 적용 |



## 4. 자체 점검 결과 (Self-Review)

*   **점검 1차 (논리 무결성)**: 개선 후에도 물리 적분(Integration) 횟수, 샘플링 공식, LUT 해상도는 변함이 없는가? -> **YES**
*   **점검 2차 (의존성 확인)**: View3D나 Renderer 등 외부 모듈에 영향을 주는 파괴적 변경이 있는가? -> **NO (내부 캡슐화 유지)**
*   **점검 3차 (성능 기대치)**: CPU 프레임 타임 및 GC 발생 빈도가 유의미하게 감소하는가? -> **YES (바인드 그룹 캐싱 효과)**

---
**작성 일자**: 2026-03-12  
**분석가**: RedGPU AI Assistant (Gemini CLI)
