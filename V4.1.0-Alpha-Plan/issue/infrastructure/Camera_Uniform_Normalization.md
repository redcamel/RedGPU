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

## 📝 구조체 사양 (Struct Specification)

### 3.1 현재 구조 (Current - Legacy)
```wgsl
struct Camera {
    cameraMatrix: mat4x4<f32>,
    cameraPosition: vec3<f32>,
    nearClipping: f32,
    farClipping: f32
};
```

### 3.2 제안된 표준 구조 (Proposed - Standard)
데이터 정렬(16바이트)과 연산 효율성을 고려한 새로운 구조입니다.

| 순서 | 필드명 | 타입 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | **viewMatrix** | `mat4x4<f32>` | World to View 변환 행렬 |
| 2 | **inverseViewMatrix** | `mat4x4<f32>` | View to World 변환 행렬 (카메라 월드 행렬) |
| 3 | **cameraPosition** | `vec3<f32>` | 카메라의 월드 위치 |
| 4 | **nearClipping** | `f32` | 근거리 클리핑 평면 거리 |
| 5 | **cameraDirection** | `vec3<f32>` | 카메라가 바라보는 방향 (Forward Vector) |
| 6 | **farClipping** | `f32` | 원거리 클리핑 평면 거리 |
| 7 | **fieldOfView** | `f32` | 시야각 (Radian) |
| 8 | **aspectRatio** | `f32` | 화면 종횡비 (Width / Height) |
| 9 | **orthographic** | `u32` | 투영 모드 (0: Perspective, 1: Ortho) |
| 10 | **padding** | `f32` | 16바이트 정렬용 더미 데이터 |

---

## 💻 WGSL 정의 (Proposed WGSL)

```wgsl
struct Camera {
    viewMatrix: mat4x4<f32>,
    inverseViewMatrix: mat4x4<f32>,
    
    cameraPosition: vec3<f32>,
    nearClipping: f32,
    
    cameraDirection: vec3<f32>,
    farClipping: f32,
    
    fieldOfView: f32,
    aspectRatio: f32,
    orthographic: u32,
    padding: f32
};
```

---

## 🛠 전환 계획 (Migration Plan)

### 1단계: TypeScript 데이터 모델 업데이트
- `View3D.ts`의 유니폼 버퍼 쓰기 로직에 새로운 필드 추가.
- `cameraMatrix`에 할당되던 값을 `viewMatrix`로 명칭 변경.
- `inverseViewMatrix`, `cameraDirection` 등의 연산 로직 추가.

### 2단계: 시스템 셰이더 업데이트
- `src/systemCodeManager/shader/systemStruct/SYSTEM_UNIFORM.wgsl` 내 `Camera` 구조체 교체.
- 엔진 내부의 모든 셰이더에서 `systemUniforms.camera.cameraMatrix` 참조를 `viewMatrix`로 일괄 교체.

### 3단계: 검증 및 정규화
- 빌보드 로직(`getBillboardMatrix`) 등이 `viewMatrix`를 정상적으로 참조하는지 확인.
- 뎁스 복구 로직(`getLinearizeDepth`) 등이 새로운 클리핑 파라미터를 사용하는지 검증.

---

## 📊 진행 현황 (Progress Status)

### 완료 항목 (Completed)
- [x] **단독 명칭 교체**: 코드베이스 전반(`src/`)에서 `cameraMatrix` 변수/필드명을 `viewMatrix`로 교체 완료.
- [x] **시스템 구조체 반영**: `SYSTEM_UNIFORM.wgsl` 및 `POST_EFFECT_SYSTEM_UNIFORM.wgsl` 내 필드명 업데이트.
- [x] **핵심 매니저 업데이트**: `View3D.ts`, `PostEffectManager.ts` 등 주요 클래스의 참조 로직 수정.

### 진행 예정/검토 필요 (Pending/Todo)
- [ ] **복합 행렬 명칭 정규화**: `projectionCameraMatrix`, `noneJitterProjectionCameraMatrix` 등을 `projectionViewMatrix` 계열로 변경 검토.
- [ ] **역행렬 명칭 교체**: 여전히 `inverseCameraMatrix`로 명명된 부분을 `inverseViewMatrix`로 일괄 교체 필요.

---
**최종 업데이트:** 2026-02-23
**상태:** 진행 중 (In Progress)
**작성자:** Gemini CLI
