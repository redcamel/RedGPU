# [Specification] Camera Uniform Structure Normalization

## 1. 개요 (Overview)
엔진의 렌더링 파이프라인에서 카메라 관련 데이터를 관리하는 `Camera` 구조체의 명칭과 구성을 정규화하기 위한 명세입니다. 기존의 모호한 명칭(`cameraMatrix`)을 수학적 실체에 맞는 표준 용어(`viewMatrix`)로 변경하고, 현대적인 렌더링 기법(TAA, SSR 등)에 필요한 추가 파라미터를 통합하여 셰이더 코드의 직관성과 확장성을 확보하는 것을 목표로 합니다.

---

## 📐 공간 정의 및 명칭 표준 (Space Definitions)

### 2.1 뷰 변환 (View Transformation)
- **World Space $	o$ View Space**: 정점을 카메라 기준 좌표계로 변환하는 행렬입니다.
- **표준 명칭**: **`viewMatrix`** (기존 `cameraMatrix`)
- **수학적 실체**: 카메라 월드 행렬의 역행렬 ($View = Camera_{world}^{-1}$)

### 2.2 역뷰 변환 (Inverse View Transformation)
- **View Space $	o$ World Space**: 카메라 공간의 좌표를 다시 월드 공간으로 변환하거나, 카메라의 월드 위치/방향 데이터를 추출할 때 사용합니다.
- **표준 명칭**: **`inverseViewMatrix`**
- **수학적 실체**: 카메라의 월드 행렬 ($View^{-1} = Camera_{world}$)

---

## 📝 구조체 사양 (Struct Specification - Final)
데이터 정렬(16바이트)과 연산 효율성을 고려하여 최종 확정된 구조입니다.

| 순서 | 필드명 | 타입 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | **viewMatrix** | `mat4x4<f32>` | World to View 변환 행렬 |
| 2 | **inverseViewMatrix** | `mat4x4<f32>` | View to World 변환 행렬 (카메라 월드 행렬) |
| 3 | **cameraPosition** | `vec3<f32>` | 카메라의 월드 위치 |
| 4 | **nearClipping** | `f32` | 근거리 클리핑 평면 거리 |
| 5 | **farClipping** | `f32` | 원거리 클리핑 평면 거리 |
| 6 | **fieldOfView** | `f32` | 시야각 (Radian) |

---

## 📝 그림자 구조체 사양 (Shadow Struct Specification - Final)
방향성 광원의 그림자 데이터를 그룹화하여 최종 확정된 구조입니다.

| 순서 | 필드명 | 타입 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | **directionalShadowDepthTextureSize** | `u32` | 그림자 텍스처 해상도 |
| 2 | **directionalShadowBias** | `f32` | 그림자 바이어스 (피터 패닝 방지) |
| 3 | **padding** | `vec2<f32>` | 16바이트 정렬용 패딩 |

---

## 📝 대기 산란 구조체 사양 (SkyAtmosphere Struct Specification - Final)
대기 산란 관련 데이터를 그룹화하여 최종 확정된 구조입니다.

| 순서 | 필드명 | 타입 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | **useSkyAtmosphere** | `u32` | 대기 산란 사용 여부 (0: 비활성, 1: 활성) |
| 2 | **skyAtmosphereSunIntensity** | `f32` | 태양 광 강도 |
| 3 | **skyAtmosphereExposure** | `f32` | 대기 노출값 |
| 4 | **padding** | `f32` | 16바이트 정렬용 패딩 |

---

## 💻 WGSL 정의 (Final WGSL)
`struct Camera`, `struct Shadow`, `struct SkyAtmosphere`는 별도의 파일로 분리되어 관리되며, `SYSTEM_UNIFORM.wgsl`에서 인클루드하여 사용합니다.

### 2.1 Camera 구조체
- **파일 위치**: `src/systemCodeManager/shader/systemStruct/Camera.wgsl`
- **시스템 등록**: `SystemCodeManager.ts` 내 `SystemStructLibrary`에 등록되어 `#redgpu_include systemStruct.Camera` 형태로 사용 가능합니다.

```wgsl
struct Camera {
    viewMatrix: mat4x4<f32>,
    inverseViewMatrix: mat4x4<f32>,
    cameraPosition: vec3<f32>,
    nearClipping: f32,
    farClipping: f32,
    fieldOfView: f32
};
```

### 2.2 Shadow 구조체
- **파일 위치**: `src/systemCodeManager/shader/systemStruct/Shadow.wgsl`

```wgsl
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    padding: vec2<f32>
};
```

### 2.3 SkyAtmosphere 구조체
- **파일 위치**: `src/systemCodeManager/shader/systemStruct/SkyAtmosphere.wgsl`

```wgsl
struct SkyAtmosphere {
    useSkyAtmosphere: u32,
    skyAtmosphereSunIntensity: f32,
    skyAtmosphereExposure: f32,
    padding: f32
};
```

```wgsl
// SYSTEM_UNIFORM.wgsl
#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Shadow
#redgpu_include systemStruct.SkyAtmosphere

struct SystemUniform {
    // ...
    camera: Camera,
    skyAtmosphere: SkyAtmosphere,
    shadow: Shadow,
    // ...
};
```

---

## 🛠 중앙 집중식 업데이트 (Centralized Update Logic)

### SystemUniformUpdater 도입
중복된 유니폼 업데이트 로직을 제거하고 유지보수성을 높이기 위해 `SystemUniformUpdater` 클래스를 도입했습니다.

- **위치**: `src/renderer/SystemUniformUpdater.ts`
- **역할**: 각 시스템 객체와 유니폼 버퍼의 오프셋 정보를 받아 표준화된 방식으로 데이터를 기록합니다.
- **주요 메서드**: 
  - `static updateCamera(camera, cameraMembers, uniformDataF32)`
  - `static updateShadow(shadowManager, shadowMembers, uniformData)`
  - `static updateSkyAtmosphere(skyAtmosphere, skyAtmosphereMembers, uniformData)`

---

## 🛠 전환 계획 (Migration Plan) - 완료
1. **TypeScript 데이터 모델 업데이트 (완료)**: `View3D.ts`, `PostEffectManager.ts` 필드 정규화 및 오프셋 동기화.
2. **시스템 셰이더 업데이트 (완료)**: `src/systemCodeManager/shader/systemStruct/` 내 구조체 동기화 및 별도 파일 분리.
3. **중앙 집중식 업데이터 도입 (완료)**: `SystemUniformUpdater`를 통한 업데이트 로직 단일화.
4. **검증 및 정규화 (완료)**: 모든 연산의 명칭 일관성 확보 및 셰이더 참조 수정.

---

## 📊 진행 현황 (Progress Status)

### 완료 항목 (Completed)
- [x] **단독 명칭 교체**: 코드베이스 전반(`src/`)에서 `cameraMatrix` $\rightarrow$ `viewMatrix` 교체 완료.
- [x] **복합 행렬 명칭 교체**: `projectionCameraMatrix` $\rightarrow$ `projectionViewMatrix` 교체 완료.
- [x] **그림자 및 대기 산란 정규화**: `Shadow`, `SkyAtmosphere` 구조체 도입 및 필드명 구체화 완료.
- [x] **역행렬 명칭 교체**: `inverseCameraMatrix` $\rightarrow$ `inverseViewMatrix` 일괄 교체 완료.
- [x] **시스템 구조체 반영 및 분리**: `Camera.wgsl`, `Shadow.wgsl`, `SkyAtmosphere.wgsl` 신설 및 공유 구조 개선 완료.
- [x] **중앙 집중식 로직 도입**: `SystemUniformUpdater`를 통해 업데이트 로직 단일화 완료.
- [x] **출력 구조체 명칭 변경**: `FragmentOutput` $\rightarrow$ `OutputFragment` 일관성 확보 완료.

### 진행 예정/검토 필요 (Pending/Todo)
- [ ] **런타임 검증**: 실제 렌더링 시 TAA, SSR 등에서 정규화된 유니폼 값이 정상적으로 연산되는지 추가 확인.

---
**최종 업데이트:** 2026-02-23
**상태:** 완료 (Completed)
**작성자:** Gemini CLI
