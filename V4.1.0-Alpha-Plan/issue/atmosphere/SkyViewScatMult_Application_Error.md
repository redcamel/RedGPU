# [Issue] skyViewScatMult 파라미터 적용 오류 및 물리적 부적합성

## 1. 개요
현재 `SkyAtmosphere` 시스템에서 대기 산란 강도를 조절하는 `skyViewScatMult` 파라미터가 물리적으로 올바르지 않은 시점(Post-process)에 적용되어, 산란광의 밝기만 변할 뿐 대기의 밀도나 투과율(Transmittance)과의 상관관계가 깨지는 현상을 해결했습니다.

## 2. 상세 문제점 분석

### 2.1 잘못된 적용 시점 (Post-process Multiplier)
*   최종 렌더링 결과물에 `skyViewScatMult`를 직접 곱함으로써, 이미 계산된 결과의 "이미지 밝기"만 강제로 높이는 방식이었습니다.

### 2.2 물리적 비정합성 (Physical Inconsistency)
*   **투과율(Transmittance) 불일치**: 산란이 강해지면(ScatMult 증가) 빛이 대기를 통과하면서 더 많이 소산(Extinction)되어야 하지만, 이전 방식은 투과율은 그대로인 상태에서 산란광만 밝아져 물리적으로 불가능한 결과가 나타났습니다.
*   **다중 산란(Multi-Scattering) 오류**: 산란 계수가 누적되는 다중 산란 과정에서 배율이 누락되어 에너지 보존 법칙이 깨진 상태였습니다.

## 3. 해결된 아키텍처 (Implemented Solution)

### 3.1 산란 및 소산 계수 통합 제어 (Scattering & Extinction Scaling)
*   **핵심 로직**: `skyAtmosphereFn.wgsl`의 모든 적분 함수(`integrateOpticalDepth`, `integrateScatSegment`)에서 `skyViewScatMult`를 **산란 성분뿐만 아니라 소산(Extinction) 항에도 적용**했습니다.
*   **수식 반영**:
    ```wgsl
    // Rayleigh 및 Mie 소산 항에 배율 적용 (skyAtmosphereFn.wgsl)
    optExt += (params.rayleighScattering * d.rhoR * params.skyViewScatMult 
               + vec3<f32>(params.mieExtinction * d.rhoM * params.skyViewScatMult) 
               + params.ozoneAbsorption * d.rhoO) * stepSize;
    ```
*   이로 인해 산란이 강해지면(ScatMult 증가) 산란광은 밝아지되, 그 뒤의 물체나 태양 빛은 물리적으로 더 강하게 가려지게 됩니다.

### 3.2 다중 산란 에너지 보존 정합성 확보
*   `multiScatteringShaderCode.wgsl`에서도 동일하게 소산 항에 배율을 적용하여, 강화된 산란 환경에 맞춘 정확한 다중 산란 에너지를 계산하도록 수정했습니다.

### 3.3 중복 포스트 배율 제거
*   LUT(SkyView, AP, MultiScat) 단계에서 이미 산란 강도가 물리적으로 반영되었으므로, `background_fragment.wgsl`과 `computeCode.wgsl`의 최종 출력부에서 `skyViewScatMult`를 제거하여 중복 적용을 방지했습니다.

### 3.4 라이프사이클 관리
*   `SkyAtmosphere.ts`에서 `skyViewScatMult` 변경 시 `dirtyLUT` 플래그를 활성화하여, 모든 LUT가 새로운 산란 배율에 맞춰 물리적으로 다시 생성되도록 보장했습니다.

## 4. 기대 효과
*   **물리적 사실감 향상**: 산란광 증가와 빛의 감쇄(Shadowing)가 동시에 일어나 "대기가 짙어지는 효과"를 정확히 재현.
*   **시각적 일관성**: 배경 하늘과 오브젝트(AP) 간의 톤 불일치 및 에너지 보존 문제 해결.
*   **성능 최적화**: 포스트 이펙트 단계의 불필요한 곱셈 연산 제거.
