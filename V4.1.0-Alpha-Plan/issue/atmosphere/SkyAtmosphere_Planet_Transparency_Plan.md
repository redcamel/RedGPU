# [Plan] Planet-Transparent Atmosphere Implementation (useGround=false)

## 1. 개요 (Overview)
`useGround` 옵션이 `false`일 때, 단순히 지면을 검게 가리는 것이 아니라 지면(Planet)을 투명하게 간주하여 대기 효과가 지평선 아래로 자연스럽게 이어지도록 개선하는 계획입니다. 이는 언리얼 엔진의 `Render Sky Atmosphere` 옵션과 동일한 동작을 목표로 합니다.

## 2. 주요 변경 사항 (Key Changes)

### 2.1 LUT 생성기(Generator) 로직 수정
지면 충돌 시 적분을 중단하는 모든 WGSL 코드를 수정하여 `useGround` 상태에 따라 대기권 끝(`t_max`)까지 적분을 지속하도록 변경합니다.

*   **수정 대상**:
    - `transmittanceShaderCode.wgsl`: `get_optical_depth` 함수에서 `t_earth` 판정 시 `useGround`가 `false`이면 무시하고 적분 수행.
    - `skyViewShaderCode.wgsl`: `dist_limit` 계산 시 `useGround`가 `false`이면 `t_max`를 사용.
    - `cameraVolumeShaderCode.wgsl`: 루프 내 `cur_h < -0.001` 중단 로직을 `useGround` 상태에 따라 분기.
    - `skyAtmosphereReflectionShaderCode.wgsl`: `dist_limit` 및 지면 반사광 추가 로직 수정.

### 2.2 최종 합성 셰이더 (`computeCode.wgsl`) 수정
*   **지면 오버라이드 제거**: 현재 `t_earth > 0.0 && uniforms.useGround == 0.0`일 때 배경을 강제로 검은색으로 만드는 로직을 제거합니다.
*   **연속성 확보**: 수정된 `SkyViewLUT`를 그대로 샘플링하여 지평선 아래에서도 대기색이 나타나도록 합니다.

### 2.3 투과율(Transmittance) 및 산란 정합성
*   **Transmittance**: 지면 너머(지구 반대편)의 태양광이 지면에 가려지지 않고 대기를 통과해 도달하도록 `get_transmittance` 및 관련 함수를 보완합니다.
*   **Shadow Mask**: `skyView` 및 `reflection` 셰이더 내의 행성 그림자(`shadow_mask`) 계산 시 `useGround`가 `false`이면 그림자를 생성하지 않도록 처리합니다.

## 3. 구현 단계 (Implementation Steps)

1.  **Step 1: 유니폼 구조 확인**: 모든 생성기 셰이더가 `useGround` 파라미터가 포함된 유니폼 버퍼를 올바르게 참조하고 있는지 확인합니다.
2.  **Step 2: 핵심 함수 수정**: `skyAtmosphereFn.wgsl` 또는 각 생성기 셰이더의 레이-구체 교차 및 거리 제한 로직을 수정합니다.
3.  **Step 3: LUT 생성기 업데이트**: 4종의 주요 LUT 생성기 셰이더를 순차적으로 업데이트합니다.
4.  **Step 4: 최종 셰이더 업데이트**: `computeCode.wgsl`의 배경 처리 로직을 단순화합니다.
5.  **Step 5: 검증**: `useGround = false` 설정 시 지평선 아래로 대기가 투명하게 이어지는지, 공중에 떠 있는 행성 대기 효과가 정상적으로 표현되는지 확인합니다.

## 4. 기대 효과 (Expected Benefits)
*   **시각적 연속성**: 지평선에서 대기 효과가 툭 끊기는 현상을 제거하여 시각적 완성도를 높입니다.
*   **커스텀 지형 지원**: 사용자가 직접 배치한 거대 지형 메시가 대기 배경과 물리적으로 올바르게 합성됩니다.
*   **유연한 연출**: 우주 공간이나 고고도 비행 시뮬레이션 등 다양한 환경 연출이 가능해집니다.

---
**작성일:** 2026-02-27
**상태:** 계획 수립 완료 (Planned)
**프로젝트:** RedGPU
