# Technical Specification: Sun Rendering Quality Improvement

## 1. 개요 (Background)
현재 RedGPU의 `SkyAtmosphere` 시스템은 물리 기반 대기 산란(PBR Scattering)을 훌륭하게 표현하고 있으나, 태양 본체(Sun Disk)의 표현은 기하학적 단순화(`smoothstep`)에 의존하고 있었습니다. 본 개선 작업을 통해 언리얼 엔진(UE) 수준의 물리적 정확도(Limb Darkening, Per-pixel Transmittance, Horizon Squashing)를 확보하고, HDR 에너지를 물리 수치에 가깝게 상향하여 시각적 몰입감을 극대화했습니다.

## 2. 현상 분석 및 해결 상태 (Current State Analysis)

### 2.1 시각적 결함 해결 상태 (Visual Defects Status)
- **Flat Disk Syndrome**: 태양 본체의 밝기가 균일하여 입체감이 결여됨. (Resolved ✅ - Limb Darkening 적용)
- **Intensity Compression**: 태양 본체의 HDR 에너지가 대기 산란광에 비해 낮아 Bloom 효과가 미약함. (Resolved ✅ - Solar HDR Boost 적용)
- **Horizon Aliasing/Step**: 저고도에서 지평선과 태양의 경계가 부자연스럽거나 색상 그라데이션 부족. (Resolved ✅ - Per-pixel Transmittance & Squashing 적용)

### 2.2 기술적 개선 사항 (Technical Improvements)
- `background_fragment.wgsl`의 렌더링 로직을 물리 기반 모델로 전면 교체.
- 태양 본체 전용 HDR 강도 계수(`solarIntensityMult`) 및 입체감 제어 계수(`sunLimbDarkening`) 도입.
- 픽셀 단위 고도 계산을 통한 정밀한 대기 투과율 산출 로직 구현.

## 3. 구현된 물리적 특성 (Implemented Physical Features)

| 핵심 기능 (Features) | 물리적 근거 (Physical Basis) | 적용 결과 (Result) |
| :--- | :--- | :--- |
| **Limb Darkening** | 태양 광구 깊이에 따른 온도 차이 모사 | 태양이 입체적인 구체로 표현됨 |
| **Solar HDR Scaling** | 태양의 압도적인 물리적 휘도 반영 | 강렬하고 사실적인 Bloom/Glare 발생 |
| **Per-pixel Transmittance** | 대기층 두께의 미세한 차이 반영 | 노을 시 태양 하단이 더 붉고 어둡게 변함 |
| **Horizon Squashing** | 대기 밀도 차이에 의한 굴절 효과 | 지평선 근처에서 태양이 타원형으로 압축됨 |

## 4. 해결 설계 요약 (Final Solution Summary)

### 4.1 물리적 주연 감광 (Limb Darkening)
- `pow(max(0.00001, 1.0 - normalizedDist), exponent)` 수식을 통해 가장자리 감쇠 구현.
- `0.00001` 세이프가드를 통해 지수가 0일 때의 산술 오류 방지.

### 4.2 고휘도 에너지 스케일링 (Solar HDR Boost)
- `solarIntensityMult`를 통해 태양 본체 에너지를 대기 산란광 대비 최대 수천 배까지 확장.

### 4.3 동적 형태 및 색상 보정 (Dynamic Morphing)
- `viewDir.y` 기반 픽셀별 투과율 샘플링.
- `squashFactor`를 이용한 수직 축 각거리 보정으로 타원형 태양 구현.

## 5. 세부 작업 순서 및 로드맵 (Detailed Roadmap)

### 🚀 1단계: 파라미터 확장 및 유니폼 구조 설계 (Completed ✅)
- [x] 레거시 유니폼 정리 및 신규 파라미터(`solarIntensityMult`, `sunLimbDarkening`) 추가.
- [x] 시스템 유니폼 버퍼(`SystemUniformUpdater.ts`) 동기화 완료.

### ☀️ 2단계: 태양 본체 렌더링 고도화 - Phase 1 (Completed ✅)
- [x] Limb Darkening 및 Solar HDR Boost 로직 적용 완료.
- [x] 저고도/Limb 0 상황에서의 아티팩트 버그 수정 완료.

### 🌅 3단계: 사실성 강화 보정 - Phase 2 (Completed ✅)
- [x] **Per-pixel Transmittance**: 태양 내부 픽셀별 투과율 그라데이션 구현 완료.
- [x] **Horizon Squashing**: 지평선 부근 타원형 압축 효과 구현 완료.

### 🎨 4단계: 최종 밸런스 및 파라미터 노출 (In Progress 🚧)
- [ ] 다양한 시나리오(낮, 일몰, 박명)별 파라미터 최적화.
- [ ] 외부 API 및 문서화 최종 점검.

---
## 6. 관련 파일 (Target Files)
- `src/display/skyAtmosphere/wgsl/background_fragment.wgsl` (렌더링 핵심)
- `src/display/skyAtmosphere/SkyAtmosphere.ts` (파라미터 제어)
- `src/systemCodeManager/shader/systemStruct/SkyAtmosphere.wgsl` (구조 정의)
- `src/renderer/SystemUniformUpdater.ts` (데이터 전달)
