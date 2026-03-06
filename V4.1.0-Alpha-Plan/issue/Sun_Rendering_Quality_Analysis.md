# Technical Specification: Sun & Sky-View Rendering Quality Improvement

## 1. 개요 (Background)
태양 본체(Sun Disk)의 개선에 이어, 태양 주변의 산란광(Scattering/Halo)을 담당하는 `Sky-View LUT`의 품질을 고도화합니다. 현재 노을 지는 상황에서 태양 주변이 뿌옇게 뭉개지는 현상(저해상도 아티팩트)을 해결하기 위해 매핑 공식 개선 및 언리얼 엔진의 하이브리드 렌더링 방식을 도입합니다.

## 2. Sky-View LUT 정밀 분석 및 해결 상태 (Sky-View Quality Analysis)

### 2.1 시각적 결함 해결 상태 (Visual Defects Status)
- **Sunset Blur (밉맵 현상)**: 태양이 지평선 근처에 있을 때 산란광 그라데이션이 심하게 뭉개짐. (Resolved ✅ - Sqrt/Square 매핑 교정)
- **Banding Artifacts**: 하늘 회전 시 또는 고대비 상황에서 산란광 경계가 계단식으로 보임. (Resolved ✅ - 512x256 해상도 상향)
- **Horizon/Ground Alignment**: 노을 시 지표면이 하늘색에 가리거나 경계가 어긋나는 현상. (Resolved ✅ - Horizon-relative 매핑 일치화)
- **Lack of Sharpness**: 태양 바로 옆의 날카로운 Mie 산란 피크 부족. (Improving 🚧 - Hybrid Glow 작업 중)

### 2.2 기술적 개선 사항 (Technical Improvements)
- **Sky-View LUT 매핑 고도화**: 지평선 영역의 픽셀 밀도를 극대화하는 `sqrt`(샘플러) / `ratio^2`(생성기) 비선형 매핑 적용 완료.
- **해상도 및 정밀도 확보**: 512x256 해상도 상향 및 `skyViewScatMult` 강도 제어 파라미터 도입 완료.
- **데이터 파이프라인 동기화**: 모든 셰이더 및 TS 레이어의 유니폼 오프셋 정렬 완료.

## 3. 언리얼 엔진(UE) 벤치마킹 (UE Benchmarking)

| 기술 항목 | 설명 (Description) | RedGPU 적용 결과 |
| :--- | :--- | :--- |
| **Horizon-relative Mapping** | 지평선을 기준으로 위/아래를 분리하고 기울기가 0이 되지 않는 비선형 매핑 | 적용 완료 ✅ |
| **Asymmetric Resolution** | 방위각(수평) 해상도를 고도(수직) 해상도보다 높게 설정 | 512x256 적용 완료 ✅ |
| **Hybrid Mie Glow** | 넓은 산란은 LUT에서, 날카로운 피크는 실시간 계산으로 처리 | 구현 중 🚧 |

## 4. 해결 설계 (Proposed Solution)

### 4.1 매핑 공식 고도화 (Refined Parametrization)
- `getSkyViewUV`에서 지평선 기준 `sqrt(ratio)` 매핑을 통해 픽셀 당 각도 정밀도 대폭 향상.
- 노을 상황에서의 밉맵 현상을 근본적으로 제거.

### 4.2 하이브리드 산란 렌더링 (Hybrid Scattering)
- **LUT Component**: 광범위한 대기 산란 및 다중 산란 담당 (512x256 해상도).
- **Real-time Component**: 태양 주변의 매우 날카로운 Mie 산란 피크를 `background_fragment`에서 직접 계산하여 합산.

## 5. 세부 작업 순서 및 로드맵 (Roadmap)

### 🚀 1단계: 해상도 및 기본 구조 최적화 (Completed ✅)
- [x] **LUT 해상도 상향**: 512x256 적용 완료.
- [x] **신규 파라미터 추가**: `skyViewScatMult` 반영 완료.

### ☀️ 2단계: 매핑 함수 교체 (Completed ✅)
- [x] **매핑 로직 정상화**: `sqrt`/`ratio^2` 역함수 관계 정립으로 데이터 손실 방지.
- [x] **지평선 정합성 수정**: 노을 시 지표면 위치 어긋남 및 가려짐 현상 해결.

### 🌅 3단계: 하이브리드 Mie Glow 구현 (Completed ✅)
- [x] `background_fragment.wgsl`에서 실시간 Mie Phase Function(`phaseMie`) 적용.
- [x] LUT 샘플링 결과와 실시간 계산 결과를 물리적으로 합산.
- [x] Aerial Perspective 및 Reflection(IBL) 셰이더에도 실시간 Mie Glow 적용 완료.

### 🎨 4단계: 최종 밸런스 튜닝 (Completed ✅)
- [x] LUT 강도(`1 - mieGlow`)와 실시간 강도(`mieGlow`) 사이의 에너지 보존 밸런싱 구현 완료.
- [x] 모든 관련 셰이더(Sky, AP, IBL)에서 일관된 산란 공식 적용 확인.
- [x] 다양한 시간대별 시각적 안정성 검증 기반 마련.

---
## 6. 관련 파일 (Target Files)
- `src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts`
- `src/display/skyAtmosphere/core/generator/skyView/skyViewShaderCode.wgsl`
- `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl`
- `src/display/skyAtmosphere/wgsl/background_fragment.wgsl`
