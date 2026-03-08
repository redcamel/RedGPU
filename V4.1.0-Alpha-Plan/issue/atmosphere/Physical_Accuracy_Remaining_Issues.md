# SkyAtmosphere 물리적 정확성 및 정합성 잔여 이슈 보고서 (Remaining Physical Inaccuracies)

## 1. 개요
최근의 개선 작업을 통해 `SkyAtmosphere` 시스템은 Sébastien Hillaire(2020) 모델에 근거한 물리 기반 렌더링에 도달했습니다. 핵심적인 물리 법칙(에너지 보존, 다중 산란, 지면 PBR)이 적용되었으며, 수치적 안정성과 시각적 정합성을 방해하던 요소들이 대부분 제거되었습니다.

---

## 2. 주요 개선 결과 요약

### 2.1 태양 휘도 스케일 정상화 (Sun Radiance Scale)
*   **파일**: `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl`
*   **개선**: 고체각에 의한 휘도 증폭 제한치를 물리 상수인 약 **14,718배**($1 / \Omega_{sun}$)로 상향 조정했습니다.
*   **효과**: 태양 본체가 대기 산란광에 비해 물리적으로 올바른 대비를 가지게 되었습니다.

### 2.2 반사 큐브맵의 태양 모델 정합성 (Reflection Consistency)
*   **파일**: `src/display/skyAtmosphere/core/generator/ibl/reflection/skyAtmosphereReflectionShaderCode.wgsl`
*   **개선**: 반사 큐브맵에서 태양 본체(Disk)를 제거하고 **Mie Glow(헤일로)**만 남겼습니다.
*   **이유**: 
    1. **이중 계산 방지**: PBR 엔진의 Directional Light(직접광)와 하이라이트가 중복되는 것을 막아 물리적 정합성을 높임.
    2. **노이즈 제거**: 초고휘도 태양에 의한 샘플링 에일리어싱(Fireflies)을 원천 차단하여 깨끗한 IBL 환경을 제공함.

### 2.3 지면 PBR 및 환경광 연동 (Ground PBR Integration)
*   **개선**: 임의 상수인 `groundAmbient`를 폐기하고, Multi-Scattering LUT에서 유도된 실제 환경광 에너지를 지면 반사에 적용했습니다.
*   **효과**: 지면 반사율(Albedo)에 따라 대기 밝기가 상호작용하는 물리 현상이 정확하게 구현되었습니다.

---

## 3. 향후 과제 (Remaining Tasks)

### 3.1 투과율 LUT 매핑 정밀도 (Transmittance LUT Parameterization) - P2
*   $\cos\theta$ 매핑을 선형에서 비선형(수평선 가중치)으로 변경하여 일출/일몰 시의 정밀도를 향상할 필요가 있습니다.

### 3.2 미사용 파라미터 및 데드 코드 정리 (Code Cleanup) - P3
*   `groundSpecular`, `multiScatteringAmbient` 등 셰이더에서 사용되지 않는 파라미터들을 구조체 및 API에서 제거해야 합니다.

### 3.3 체적 그림자 지원 (Volumetric Shadows) - P4
*   Shadow Map을 Aerial Perspective LUT에 통합하여 God Rays 효과를 구현하는 고도화 작업이 가능합니다.

---
**최종 업데이트**: 2026년 3월 8일
**작성자**: Gemini CLI (Atmosphere Improvement Task)
