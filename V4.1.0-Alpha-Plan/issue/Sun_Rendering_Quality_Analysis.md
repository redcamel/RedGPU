# Technical Specification: Sun Rendering Quality Improvement

## 1. 개요 (Background)
현재 RedGPU의 `SkyAtmosphere` 시스템은 물리 기반 대기 산란(PBR Scattering)을 훌륭하게 표현하고 있으나, 태양 본체(Sun Disk)의 표현은 기하학적 단순화(`smoothstep`)에 의존하고 있습니다. 이로 인해 노을이나 고대비 환경에서 태양이 비물리적으로 평면적이거나, 눈부심(Glare) 효과가 부족한 현상이 발생합니다. 본 문서는 이를 언리얼 엔진(UE) 수준의 물리적 정확도로 끌어올리기 위한 개선 계획을 정의합니다.

## 2. 현상 분석 (Current State Analysis)

### 2.1 시각적 결함 (Visual Defects)
- **Flat Disk Syndrome**: 태양 본체의 밝기가 균일하여 입체감이 결여됨.
- **Intensity Compression**: 태양 본체의 HDR 에너지가 대기 산란광에 비해 충분히 높지 않아 Bloom 효과가 미약함.
- **Horizon Aliasing/Step**: 저고도에서 지평선과 태양의 경계가 부자연스럽게 절단되거나 색상 그라데이션이 부족함.

### 2.2 기술적 제약 (Technical Constraints)
- `background_fragment.wgsl`에서 `dot(viewDir, sunDir)`와 `smoothstep`만을 사용한 임계값 처리.
- 대기 산란 강도(`sunIntensity`)와 태양 본체 강도가 하드코딩된 비율로 결합됨.
- 태양 영역 내 픽셀별 투과율(Transmittance) 변화 무시.

## 3. 벤치마크 및 목표 (Benchmarks & Objectives)

언리얼 엔진의 `SkyAtmosphere` 모델을 벤치마킹하여 다음의 물리적 특성을 구현하는 것을 목표로 합니다.

| 핵심 목표 (Goals) | 물리적 근거 (Physical Basis) | 기대 효과 (Expected Result) |
| :--- | :--- | :--- |
| **Limb Darkening** | 태양의 광구 깊이에 따른 온도 차이로 인해 가장자리가 어두워짐 | 태양이 "원반"이 아닌 "구체"로 인지됨 |
| **Solar HDR Scaling** | 태양 본체는 대기보다 약 $10^4 \sim 10^5$배 밝음 | 강렬한 Bloom/Glow 및 사실적인 노출 제어 가능 |
| **Per-pixel Transmittance** | 대기층 두께가 태양 본체의 상/하단에서 다르게 작용함 | 노을 시 태양 아랫부분이 더 붉고 어둡게 표현됨 |
| **Atmospheric Refraction** | 대기 밀도 차이에 의한 빛의 굴절 | 지평선 근처에서 태양이 타원형으로 압축됨 |

## 4. 해결 설계 (Proposed Solution)

### 4.1 물리적 주연 감광 (Limb Darkening) 수식 도입
기존의 단순 `mask`를 다음의 감쇠 모델로 교체합니다.
- **모델**: `Scattering = SunIntensity * pow(1.0 - (1.0 - cos_theta) / (1.0 - cos_sun_radius), exponent)`
- 중심부에서 가장자리로 갈수록 에너지를 비선형적으로 감쇠시켜 입체감 부여.

### 4.2 고휘도 에너지 스케일링 (Solar HDR Boost)
- 태양 본체 전용 가중치(`params.solarIntensityMult`)를 도입.
- 최종 출력 값에 대해 최소 100배 이상의 HDR 오프셋을 적용하여 포스트 프로세싱 단계에서 강한 Bloom 유도.

### 4.3 픽셀 단위 투과율 샘플링 (Per-pixel Transmittance)
- `background_fragment.wgsl`에서 태양 마스크가 0보다 큰 픽셀에 대해, 해당 픽셀의 시선 방향 고도($y$)를 사용하여 `getTransmittance`를 개별적으로 다시 계산.

## 5. 세부 작업 순서 및 로드맵 (Detailed Roadmap)

### 🚀 1단계: 파라미터 확장 및 유니폼 구조 설계 (Completed ✅)
- [x] **레거시 유니폼 정리**: 사용되지 않는 필드(`multiScatteringAmbient`, `horizonHaze` 등) 제거.
- [x] **신규 파라미터 추가**: `solarIntensityMult`, `sunLimbDarkening` 필드 구축.
- [x] **구조체 동기화**: `SkyAtmosphere.wgsl`, `uniformStructCode.wgsl`, `SkyAtmosphere.ts` 업데이트 완료.
- [x] **테스트 환경 구축**: `skyAtmosphereTest` 예제 패널에 신규 파라미터 조작부 추가.

### ☀️ 2단계: 태양 본체 렌더링 고도화 - Phase 1 (In Progress 🚧)
- [ ] `background_fragment.wgsl`의 `sunMask` 계산 로직 수정 (Limb Darkening 추가).
- [ ] 태양 본체 강도 보정 계수(`solarIntensityMult`) 적용.

### 🌅 3단계: 사실성 강화 보정 - Phase 2
- [ ] 태양 픽셀별 투과율 개별 계산 로직 추가.
- [ ] 수평선 근처 수직 스케일 압축(Squash) 보정 수식 도입.

### 🎨 4단계: 최종 밸런스 및 파라미터 노출
- [ ] 외부 API 최종 점검 및 다양한 시간대별 기본값 튜닝.

---
## 6. 관련 파일 (Target Files)
- `src/display/skyAtmosphere/wgsl/background_fragment.wgsl` (핵심 렌더링)
- `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl` (수식 라이브러리)
- `src/display/skyAtmosphere/SkyAtmosphere.ts` (파라미터 전달)
- `src/systemCodeManager/shader/systemStruct/SkyAtmosphere.wgsl` (유니폼 구조 정의)
