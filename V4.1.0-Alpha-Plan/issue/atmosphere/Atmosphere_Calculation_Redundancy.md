# [Issue] 대기 산란(SkyAtmosphere) 중복 계산 및 코드 중복 문제

## 1. 개요
현재 `SkyAtmosphere` 구현에서 배경(하늘) 렌더링 단계와 포스트 이펙트(Aerial Perspective) 단계 간에 대기 산란 및 Mie Glow 계산이 중복으로 수행되고 있으며, 이로 인해 시각적 오류와 성능 낭비가 발생하고 있습니다.

## 2. 상세 문제점

### 2.1 계산의 중복 (Background Pixels)
*   **현상**: `Renderer`는 `renderBackground`를 통해 배경에 대기 효과가 적용된 하늘을 먼저 그립니다. 이후 Post-Effect 단계에서 배경 픽셀에 대해 다시 한번 Aerial Perspective와 Mie Glow를 합산합니다.
*   **부작용**: 배경 하늘에 투과율이 이중으로 적용되어 어두워지거나, 태양 주변 Glow가 중첩되어 과노출되는 현상 발생.

### 2.2 물리적 부정확성 (Occlusion Error)
*   **현상**: Post-Effect 단계에서 분석적인 Mie Glow를 모든 픽셀에 적용할 경우, 거대한 물체(산, 건물 등)가 태양을 가리고 있음에도 불구하고 물체 표면에 태양 Glow가 맺히는 오류가 발생합니다.

### 2.3 코드의 중복 (Logic Duplication)
*   `background_fragment.wgsl`과 `computeCode.wgsl`에 동일한 Mie Glow 계산 로직이 파편화되어 존재함.

## 3. 해결 전략 및 반영 내용

### 3.1 역할의 명확한 분리 (Architecture)
*   **`renderBackground` (Infinite Distance)**: 하늘 배경과 날카로운 태양의 Mie Glow 렌더링을 전담합니다.
*   **`computeCode` (Finite Distance)**: 카메라와 오브젝트 사이의 대기 산란(Aerial Perspective) 및 투과만 담당합니다.

### 3.2 깊이 판정 추가 (Depth Check)
*   `computeCode.wgsl`에서 `rawDepth >= 1.0`인 배경 픽셀은 이미 `renderBackground`에서 연산이 완료된 상태이므로, **추가 연산을 건너뛰고 원본 색상을 유지**하도록 수정하여 중복 계산을 원천 차단했습니다.

### 3.3 Mie Glow 로직 정리
*   **Post-Effect에서 Glow 제거**: 물체 차폐 문제를 해결하기 위해 `computeCode.wgsl`에서는 Mie Glow 계산을 완전히 제거했습니다.
*   **코드 공통화**: `skyAtmosphereFn.wgsl`에 `getMieGlowAmount` 공통 함수를 정의하여 `background_fragment.wgsl`에서 사용하도록 구조화했습니다.

### 3.4 밝기 톤 일치 (Intensity Scaling)
*   오브젝트에 적용되는 AP 산란광(`apSample.rgb`)에 `sunIntensity`와 `skyViewScatMult` 배율을 올바르게 적용하여 배경 하늘과 시각적 톤을 맞췄습니다.

## 4. 기대 효과
*   배경과 오브젝트 간의 대기 산란 표현 불일치 및 중첩 오류 해결.
*   태양 차폐(Occlusion) 시 물체 표면에 Glow가 나타나던 물리적 오류 해결.
*   배경 픽셀에 대한 컴퓨트 연산 스킵으로 성능 최적화.
*   공통 함수 사용을 통한 셰이더 코드 유지보수성 향상.
