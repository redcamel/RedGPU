# [Audit] Codebase Redundancy & Fragmentation Report

## 1. 개요 (Overview)
RedGPU 프로젝트 내에 존재하는 중복 코드 패턴, 로직 파편화 지점, 그리고 개선이 필요한 아키텍처적 요소들을 전수 조사하여 정리한 문서입니다. 본 보고서의 항목들은 단계적으로 해결하여 엔진의 유지보수성 및 런타임 성능을 최적화하는 것을 목표로 합니다.

---

## 🔍 중복 코드 및 파편화 분석 (Audit Results)

### 1.1 셰이더 내 수학 상수 및 헬퍼 중복 (WGSL Constants)
*   **현황 (AS-IS)**: 여러 `.wgsl` 파일에서 `PI`, `EPSILON`, `FLT_MAX` 등을 개별적으로 정의하거나 하드코딩된 숫자로 사용 중.
*   **개선 (TO-BE)**: `SystemCodeManager.math` 라이브러리를 전량 활용하여 `#redgpu_include 방식`으로 통일.
*   **결과**: ✅ 완료. `math.EPSILON`, `math.PI2` 등을 통한 수치 정밀도 일관성 확보 및 매직 넘버 제거.

### 1.2 유니폼 업데이트 상용구 (Uniform Boilerplate)
*   **현황 (AS-IS)**: `PBRMaterial`, `PhongMaterial` 등에서 필드별 Getter/Setter 내에 `this.updateUniform('key', value)` 패턴이 수백 회 반복됨.
*   **개선 (TO-BE)**: `ABaseMaterial` 또는 `ASinglePassPostEffect` 수준에서 유니폼 매핑을 자동화하는 `Proxy` 또는 데코레이터 기반 시스템 도입.
*   **기대 효과**: 코드량 획기적 감소 및 오타로 인한 유니폼 업데이트 오류 방지.

### 1.3 조명 데이터 매핑 로직 파편화 (Lighting Data Mapping)
*   **현황 (AS-IS)**: 포인트/스팟 조명의 클러스터링 데이터를 버퍼에 쓰는 로직이 `View3D.ts` 내부에 직접 노출되어 있었음.
*   **개선 (TO-BE)**: **`ClusterLightManager`**를 신설하여 데이터 패킹 및 패스 관리를 전담하도록 이관. 
    - `core`, `pass/bound`, `pass/light` 단위로 폴더링하여 캡슐화 강화.
    - 해상도 변경 시에만 클러스터 영역을 재계산하는 **Dirty Checking 최적화** 반영.
*   **기대 효과**: `View3D` 클래스의 응집도 향상 및 불필요한 GPU 연산(Bound 계산) 제거.

### 1.4 리소스 생명주기 수동 관리 (Manual Reference Counting)
*   **현황 (AS-IS)**: IBL 텍스처 교체 시 `useNum++`, `useNum--` 등을 `View3D`에서 수동으로 호출하여 관리 중.
*   **개선 (TO-BE)**: `ManagedResource` 기반의 자동 참조 카운팅(Auto Reference Counting) 시스템 구축 및 `ResourceManager` 통합.
*   **기대 효과**: 메모리 누수 방지 및 리소스 해제 시점의 안정성 확보.

### 1.5 정점 셰이더 I/O 명칭 정규화 (Vertex Shader I/O Normalization)
*   **현황 (AS-IS)**: 파일별로 `VertexOutput`, `VertexOut`, `OutData`, `OutputData` 등 출력 구조체 명칭이 혼용되어 유지보수 및 라이브러리 공유 시 혼선 발생.
*   **개선 (TO-BE)**: 모든 정점 셰이더의 입력 구조체를 **`InputData`**, 출력 구조체를 **`VertexOutput`**으로 전수 통일.
*   **결과**: ✅ 완료. 시스템 엔트리 포인트 및 디스플레이 객체 전역에 표준 I/O 규격 적용 및 셰이더 간 결합성 확보.

### 1.6 GPU 디스크립터 생성 반복 (Descriptor Literals)
*   **현황 (AS-IS)**: 유사한 설정의 `GPUTextureDescriptor`, `GPUSamplerDescriptor`를 매번 객체 리터럴로 직접 생성.
*   **개선 (TO-BE)**: `DescriptorFactory`를 도입하여 규격화된 포맷(`rgba16float` 등)과 사용처(`Storage`, `Sampled` 등)에 따른 자동 생성 지원.
*   **기대 효과**: WebGPU API 규격 준수 강제 및 설정 실수 방지.

### 1.7 런타임 값 검증 중복 (Validation Redundancy)
*   **현황 (AS-IS)**: 모든 Setter마다 `validateNumberRange` 등의 검증 함수가 명시적으로 호출됨.
*   **개선 (TO-BE)**: 유니폼 자동 업데이트 시스템과 결합하여 데이터 스키마(Schema) 정의 시 자동으로 검증되도록 구조 개선.
*   **기대 효과**: 비즈니스 로직과 검증 로직의 분리.

### 1.8 시간 정보의 파편화 (Time Data Fragmentation)
*   **현황 (AS-IS)**: `time: f32` 필드 하나만 존재하여 TAA(FrameIndex), 모션 블러(DeltaTime), 물리 연산 등에 필요한 데이터가 부족함.
*   **개선 (TO-BE)**: `struct Time`을 신설하여 `absoluteTime`, `deltaTime`, `frameIndex`, `sinTime` 등을 통합 관리. `RenderViewStateData`로 계산 로직 중앙화.
*   **기대 효과**: Temporal 효과의 정밀도 향상 및 셰이더 연산 비용(CPU에서 미리 계산) 절감.

### 1.9 리소스 클래스 파편화 (Resource Class Fragmentation)
*   **현황 (AS-IS)**: `SkyAtmosphere` 시스템에서 차원(2D/3D)만 다른 5종의 LUT 텍스처 클래스가 개별 파일로 존재하여 로직 중복 발생.
*   **개선 (TO-BE)**: **`SkyAtmosphereLUTTexture`**로 통합. `depth` 파라미터에 따라 2D/3D를 가변 생성하도록 단일화.
*   **결과**: ✅ 완료. 코드 중복 제거 및 리소스 관리 효율성 증대.

### 1.10 모호한 내부 API 명칭 (Ambiguous Internal API)
*   **현황 (AS-IS)**: 리소스 변경 알림 메서드명이 `__fireListenerList`로 구현 중심적이며 직관성이 떨어짐.
*   **개선 (TO-BE)**: **`notifyUpdate`**로 리네임하여 의도(Intent) 명확화.
*   **결과**: ✅ 완료. `ResourceBase`를 포함한 엔진 전역 리소스 클래스 및 `MeshBase`에 적용 완료.

### 1.11 불명확한 텍스처 명칭 정규화 (Texture Naming Normalization)
*   **현황 (AS-IS)**: `IBLCubeTexture`는 명칭과 달리 IBL 전용이 아닌 시스템 내부 생성 텍스처를 위한 범용 컨테이너로 사용되고 있었으며, 위치 또한 IBL 폴더에 종속적이었음.
*   **개선 (TO-BE)**: **`DirectCubeTexture`**로 리네임하고 공용 텍스처 디렉토리로 이동.
*   **결과**: ✅ 완료. 시스템 아키텍처의 의존성 제거 및 의도(Direct Injection) 명확화.

---

## 🛠 리팩토링 우선순위 로드맵 (Roadmap)

| 순위 | 항목 | 중요도 | 난이도 | 상태 | 대상 파일 |
| :-- | :--- | :---: | :---: | :---: | :--- |
| **P1** | **정점 셰이더 I/O 명칭 정규화** | 높음 | 낮음 | ✅ 완료 | `src/display/**/shader/*.wgsl` |
| **P1** | **셰이더 상수 통합** | 높음 | 보통 | ✅ 완료 | `src/**/*.wgsl` |
| **P1** | **클러스터 조명 로직 이관** | 높음 | 낮음 | ✅ 완료 | `ClusterLightManager.ts`, `View3D.ts` |
| **P1** | **시간 데이터 구조체화** | 높음 | 낮음 | ✅ 완료 | `Time.wgsl`, `SystemUniformUpdater.ts` |
| **P1** | **투영 행렬 구조체화** | 높음 | 낮음 | ✅ 완료 | `Projection.wgsl`, `SystemUniformUpdater.ts` |
| **P1** | **리소스 업데이트 API 정규화** | 보통 | 낮음 | ✅ 완료 | `ResourceBase.ts` 및 전역 |
| **P1** | **LUT 텍스처 리소스 통합** | 보통 | 낮음 | ✅ 완료 | `SkyAtmosphereLUTTexture.ts` |
| **P1** | **범용 큐브 텍스처 명칭 정규화** | 보통 | 낮음 | ✅ 완료 | `DirectCubeTexture.ts` |
| **P2** | 샘플러 프리셋 표준화 | 높음 | 보통 | 대기 | `ResourceManager.ts`, `View3D.ts` |
| **P3** | 유니폼 업데이트 자동화 | 높음 | 높음 | 대기 | `ABaseMaterial.ts`, `PostEffect` 계열 |
| **P4** | 리소스 자동 참조 카운팅 | 보통 | 높음 | 대기 | `ResourceManager.ts`, `ManagedResource.ts` |

---
**최종 업데이트:** 2026-02-26
**상태:** 감사 완료 및 단계적 해결 중
**작성자:** Gemini CLI (Senior Engineer Mode)
