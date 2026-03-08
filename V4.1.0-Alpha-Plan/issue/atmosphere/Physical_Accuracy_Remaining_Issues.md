# SkyAtmosphere 물리적 정확성 및 정합성 잔여 이슈 보고서 (Remaining Physical Inaccuracies)

## 1. 개요
최근의 개선 작업을 통해 `SkyAtmosphere` 시스템은 Sébastien Hillaire(2020) 모델에 근거한 물리 기반 렌더링에 가까워졌습니다. 그러나 정밀 분석 결과, 수치적 안정성을 위한 임의의 제한치(Cap), 셰이더 간의 구현 불일치, 그리고 모델의 단순화로 인한 비물리적 요소들이 일부 남아있음을 확인했습니다.

---

## 2. 주요 잔여 이슈 리스트

### 2.1 태양 휘도 스케일 제한 (Sun Radiance Scale Cap)
*   **파일**: `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl` (`getSunDiskRadianceUnit`)
*   **현상**: `radianceScale` 계산 시 `max(2e-4, solidAngle)`을 사용하여 고체각에 의한 휘도 증폭을 약 **5,000배**로 제한하고 있습니다.
*   **문제점**: 실제 태양의 고체각($\approx 6.794 \times 10^{-5}$ sr) 기준으로는 약 **14,718배** 밝아야 합니다. 현재의 제한은 물리적 태양 본체의 밝기를 실제보다 약 **3배 정도 어둡게** 만듭니다. `f32` 정밀도에서는 14,000 이상의 값을 충분히 수용할 수 있으므로, 이 제한은 지나치게 보수적입니다.

### 2.2 반사 큐브맵의 태양 모델 불일치 (Inconsistent Sun Model in Reflection)
*   **파일**: `src/display/skyAtmosphere/core/generator/ibl/reflection/skyAtmosphereReflectionShaderCode.wgsl`
*   **현상**: 배경(`background`) 셰이더와 달리, 반사 큐브맵 생성 시에는 `getSunDiskRadianceUnit` 함수를 사용하지 않고 하드코딩된 태양 모델과 `0.1`이라는 임의의 상수를 사용하고 있습니다.
*   **문제점**: 배경 하늘에서 보이는 태양과 반사(IBL)를 통해 사물에 맺히는 태양의 밝기/색상이 물리적으로 일치하지 않게 됩니다. 이는 PBR 렌더링의 정합성을 해치는 요인입니다.

### 2.3 투과율 LUT 매핑 정밀도 (Transmittance LUT Parameterization)
*   **파일**: `src/display/skyAtmosphere/core/generator/transmittance/transmittanceShaderCode.wgsl`
*   **현상**: $\cos\theta$ (천정각)를 투과율 LUT의 U 좌표로 매핑할 때 선형 매핑(`uv.x * 2.0 - 1.0`)을 사용합니다.
*   **문제점**: 대기 투과율은 수평선 부근(90도 근처)에서 가장 급격하게 변합니다. 선형 매핑은 이 구간에 할당된 텍셀 수가 부족하여, 일출/일몰 시의 색상 변화가 부자연스럽거나 밴딩(Banding)이 발생할 수 있습니다. Hillaire나 Bruneton이 제안한 비선형 매핑(수평선 부근에 가중치 부여) 도입이 필요합니다.

### 2.4 미사용 파라미터 및 데드 코드 (Unused Parameters)
*   **파일**: `src/display/skyAtmosphere/SkyAtmosphere.ts`, `uniformStructCode.wgsl`
*   **현상**: `groundSpecular`, `groundShininess`, `multiScatteringAmbient` 등의 파라미터가 유니폼 구조체에는 존재하지만, 실제 셰이더 코드에서는 전혀 사용되지 않고 있습니다.
*   **문제점**: 불필요한 메모리 점유 및 연산 가독성을 저해하며, 사용자에게 실제로 동작하지 않는 옵션을 제공하는 혼란을 줍니다.

### 2.5 오존 분포 모델의 단순화 (Simplified Ozone Profile)
*   **파일**: `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl` (`getAtmosphereDensities`)
*   **현상**: 오존층을 특정 고도를 중심으로 하는 단순한 가우시안 분포(`exp(-dist^2 / width^2)`)로 처리합니다.
*   **문제점**: 실제 대기의 오존 농도는 더 복잡한 층상 구조를 가집니다. 일반적인 그래픽스 구현으로는 허용 범위이나, 과학적 정확도를 요하는 시뮬레이션에서는 오차가 발생할 수 있습니다.

### 2.6 체적 그림자 미지원 (Missing Volumetric Shadows)
*   **현상**: 현재 행성 본체에 의한 그림자(Planet Shadow)만 대기에 반영됩니다.
*   **문제점**: 씬 내의 산, 건물 등 오브젝트에 의한 그림자가 대기 산란광에 투영되지 않아 빛 갈라짐(God Rays) 효과가 물리적으로 구현되지 않습니다. 이는 Shadow Map 데이터를 AP(Aerial Perspective) LUT 생성 단계에 통합해야 해결 가능합니다.

---

## 3. 권장 수정 우선순위

1.  **반사 큐브맵 태양 모델 통합 (P1)**: `getSunDiskRadianceUnit`을 사용하도록 수정하여 IBL 정합성 확보. (**완료**)
2.  **태양 휘도 제한 해제 (P1)**: `radianceScale`의 제한값을 물리 수치에 맞게 조정 (5000 -> 15000). (**완료**)
3.  **투과율 LUT 매핑 개선 (P2)**: 비선형 매핑 도입으로 수평선 정밀도 향상.
4.  **미사용 파라미터 정리 (P3)**: 코드 클린업.

---
**작성일**: 2026년 3월 8일
**작성자**: Gemini CLI (Atmosphere Improvement Task)
