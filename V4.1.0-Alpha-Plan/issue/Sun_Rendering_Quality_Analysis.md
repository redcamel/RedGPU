# Technical Specification: Sun & Sky-View Rendering Quality Improvement

## 1. 개요 (Background)
태양 본체(Sun Disk)의 개선에 이어, 태양 주변의 산란광(Scattering/Halo)을 담당하는 `Sky-View LUT`의 품질을 고도화합니다. 현재 노을 지는 상황에서 태양 주변이 뿌옇게 뭉개지는 현상(저해상도 아티팩트)을 해결하기 위해 매핑 공식 개선 및 언리얼 엔진의 하이브리드 렌더링 방식을 도입합니다.

## 2. Sky-View LUT 정밀 분석 (Sky-View Quality Analysis)

### 2.1 현재의 시각적 결함 (Visual Defects)
- **Sunset Blur (밉맵 현상)**: 태양이 지평선 근처에 있을 때 산란광 그라데이션이 심하게 뭉개짐.
- **Banding Artifacts**: 하늘 회전 시 또는 고대비 상황에서 산란광 경계가 계단식으로 보임.
- **Lack of Sharpness**: 태양 바로 옆의 날카로운 Mie 산란 피크를 담지 못해 하늘이 탁해 보임.

### 2.2 기술적 원인 (Root Causes)
- **Mapping Singularity**: 현재 $ratio = x^2$ 매핑은 지평선 부근에서 기울기($dy/dx$)가 $0$이 됨. 이로 인해 지평선의 방대한 각도 데이터가 단 몇 픽셀에 할당되어 데이터 밀도가 극도로 낮아짐.
- **Insufficient Resolution**: 200x200 해상도는 360도 전체 하늘의 정교한 산란 정보를 담기에 부족함.
- **Single-point Integration**: 픽셀 중심점 한 곳만 적분하여 굽기 때문에 날카로운 광원 경계에서 앨리어싱 발생.

## 3. 언리얼 엔진(UE) 벤치마킹 (UE Benchmarking)

| 기술 항목 | 설명 (Description) | RedGPU 적용 방향 |
| :--- | :--- | :--- |
| **Horizon-relative Mapping** | 지평선을 기준으로 위/아래를 분리하고 기울기가 0이 되지 않는 비선형 매핑 사용 | $x^2$ 매핑을 언리얼 스타일의 보정 매핑으로 교체 |
| **Asymmetric Resolution** | 방위각(수평) 해상도를 고도(수직) 해상도보다 높게 설정 | 512x256 또는 1024x512 해상도 도입 |
| **Hybrid Mie Glow** | 넓은 산란은 LUT에서, 날카로운 피크는 실시간 계산으로 처리 | `background_fragment`에 실시간 Mie Phase 계산 추가 |

## 4. 해결 설계 (Proposed Solution)

### 4.1 매핑 공식 고도화 (Refined Parametrization)
- 지평선 영역에서 픽셀 밀도가 고갈되지 않도록 `getSkyViewUV` 및 `SkyViewGenerator`의 매핑 수식을 전면 수정.
- 지평선 근처에 픽셀을 집중시키되, 데이터 손실이 없는 선형-비선형 혼합 모델 적용.

### 4.2 하이브리드 산란 렌더링 (Hybrid Scattering)
- **LUT Component**: 광범위한 대기 산란 및 다중 산란 담당.
- **Real-time Component**: 태양 주변 5~10도 이내의 매우 날카로운 Mie 산란(In-scattering)을 셰이더에서 직접 계산하여 LUT 샘플링 결과 위에 가산(Additive).
- 결과: 태양 주변이 뭉개지지 않고 매우 날카롭고 투명하게 표현됨.

## 5. 세부 작업 순서 및 로드맵 (Roadmap)

### 🚀 1단계: 해상도 및 기본 구조 최적화
- [ ] `SkyViewGenerator.ts` 해상도 상향 (예: 512x256) 및 메모리 포맷 점검.
- [ ] `SkyAtmosphere.ts` 내 유니폼 구조체에 하이브리드 렌더링용 파라미터 추가.

### ☀️ 2단계: 매핑 함수 교체 (Parametrization Update)
- [ ] `skyAtmosphereFn.wgsl`의 `getSkyViewUV` 함수 수정.
- [ ] `skyViewShaderCode.wgsl`의 역매핑 로직 수정 및 동기화.
- [ ] 결과 확인: 노을 질 때 지평선 부근의 뭉개짐 현상 제거 확인.

### 🌅 3단계: 하이브리드 Mie Glow 구현
- [ ] `background_fragment.wgsl`에서 실시간 Mie Phase Function(`phaseMieDual`) 적용.
- [ ] LUT 샘플링 결과와 실시간 계산 결과를 물리적으로 합산.
- [ ] 결과 확인: 태양 바로 주변의 극도로 날카로운 광휘 표현 성공.

### 🎨 4단계: 최종 밸런스 튜닝
- [ ] LUT 강도와 실시간 강도 사이의 에너지 보존 밸런싱.
- [ ] 다양한 시간대별 시각적 안정성 검증.

---
## 6. 관련 파일 (Target Files)
- `src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts`
- `src/display/skyAtmosphere/core/generator/skyView/skyViewShaderCode.wgsl`
- `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl`
- `src/display/skyAtmosphere/wgsl/background_fragment.wgsl`
