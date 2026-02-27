# [Plan] SkyAtmosphere Ground Simulation & Rendering Separation

## 1. 개요 (Overview)
언리얼 엔진(UE)의 SkyAtmosphere 컴포넌트 동작을 벤치마킹하여, 대기 산란 시뮬레이션에 영향을 주는 물리적 지면(`useGround`)과 화면에 실제로 그려지는 시각적 지면(`showGround`)의 역할을 명확히 분리합니다. 이를 통해 지평선 아래로 이어지는 자연스러운 대기 효과와 커스텀 지형 메시와의 완벽한 합성을 지원합니다.

## 2. 주요 개념 (Key Concepts)

### 2.1 useGround (물리적 영향 / LUT 단계)
- **역할**: 대기 산란 시뮬레이션(LUT 생성) 시 행성(지구)의 존재 여부를 결정합니다.
- **활성화 (true)**: 태양광이 지면에 가려 그림자가 생기며, 지면 반사광(Ground Albedo)이 멀티 스캐터링에 기여합니다.
- **비활성화 (false)**: 행성을 투명한 매질로 간주합니다. 태양광이 행성을 통과하여 반대편 대기까지 도달하며, 지평선 아래로 대기가 끊김 없이 이어집니다.

### 2.2 showGround (시각적 렌더링 / Post-Effect 단계)
- **역할**: 최종 화면 합성 시 행성(지구)의 구체 형태를 시각적으로 렌더링할지 결정합니다.
- **활성화 (true)**: `computeCode.wgsl`에서 지면 교차점의 색상(Albedo/Ambient)을 계산하여 출력합니다.
- **비활성화 (false)**: 지면을 렌더링하지 않습니다. `useGround`가 `true`일 경우 대기에는 지면 그림자가 남지만, 지면 자체는 보이지 않아 사용자가 배치한 커스텀 지형 메시를 노출하기에 적합합니다.

---

## 3. 주요 변경 사항 (Key Changes)

### 3.1 유니폼 구조체 확장
*   **파일**: `src/systemCodeManager/shader/systemStruct/SkyAtmosphere.wgsl`
*   **변경**: `padding1: f32`를 `showGround: f32`로 변경하여 쉐이더에서 시각적 토글 값을 인식하도록 합니다.

### 3.2 LUT 생성기(Generator) 로직 수정 (`useGround` 관련)
*   지면 충돌 시 적분을 중단하는 모든 WGSL 코드를 `useGround` 상태에 따라 대기권 끝(`t_max`)까지 지속하도록 수정합니다.
*   **수정 대상**: `transmittanceShaderCode.wgsl`, `skyViewShaderCode.wgsl`, `cameraVolumeShaderCode.wgsl`, `skyAtmosphereReflectionShaderCode.wgsl`.

### 3.3 최종 합성 셰이더 (`computeCode.wgsl`) 수정 (`showGround` 관련)
*   **지면 오버라이드 로직 변경**: 레이가 지면에 충돌했을 때, `showGround` 유니폼 값이 `1.0`인 경우에만 지면 색상을 합성합니다.
*   **연속성 확보**: `showGround`가 `false`이고 `useGround`가 `false`라면 지평선 아래에서도 `SkyViewLUT`에서 계산된 대기색이 그대로 나타나도록 합니다.

---

## 4. 구현 단계 (Implementation Steps)

### Phase 1: 기반 구조 구축
1.  **Step 1: WGSL 구조체 수정**: `SkyAtmosphere.wgsl`에 `showGround` 필드 추가.
2.  **Step 2: 클래스 프로퍼티 추가**: `SkyAtmosphere.ts`에 `showGround` getter/setter 구현 및 유니폼 업데이트 로직 반영.

### Phase 2: 물리 엔진(LUT) 고도화
1.  **Step 3: 생성기 셰이더 업데이트**: 4종의 주요 LUT 생성기(Transmittance, SkyView, Volume, Reflection)가 `useGround` 상태에 따라 적분 거리를 동적으로 결정하도록 수정.
2.  **Step 4: 그림자 마스크 보완**: `useGround = false`일 때 행성 그림자(`shadow_mask`)가 생성되지 않도록 처리.

### Phase 3: 시각적 합성 및 검증
1.  **Step 5: 합성 셰이더 업데이트**: `computeCode.wgsl`에 `showGround` 조건부 렌더링 로직 적용.
2.  **Step 6: 예제 UI 반영**: `Use Ground`와 `Show Ground`를 독립적으로 제어할 수 있는 테스트 패널 구성.
3.  **Step 7: 최종 검증**: 우주 공간 및 지평선 근처에서의 시각적 연속성 확인.

---

## 5. 기대 효과 (Expected Benefits)
*   **UE 스타일 워크플로우**: 언리얼 엔진 사용자에게 익숙한 대기 제어 방식을 제공합니다.
*   **완벽한 지형 합성**: 행성 구체 대신 사용자의 하이폴리곤 지형 메시가 대기 효과와 물리적으로 올바르게 어우러집니다.
*   **비주얼 품질 향상**: 지평선에서 발생하는 급격한 색상 단절(Artifact)을 근본적으로 제거합니다.

---
**작성일:** 2026-02-27
**상태:** 계획 업데이트 완료 (Updated)
**프로젝트:** RedGPU
---