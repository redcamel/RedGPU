# RedGPU Post-Processing Roadmap (The Cinematic Frontier)

본 문서는 RedGPU의 강력한 후처리 인프라를 기반으로, 언리얼 엔진의 비주얼 정점에 도달하기 위한 최종 기술 사양을 정의합니다. 이미 구현된 강력한 기능들을 기반으로 화질의 정점을 향한 고도화에 집중합니다.

---

## 🎯 전략적 우선순위 및 난이도 분석
시각적 파급력(Impact)과 구현 난이도(Difficulty)를 고려한 핵심 과제 순위입니다.

| 우선순위 | 기능 명칭 | 임팩트 | 난이도 | 부하 정도 | 핵심 가치 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **1순위** | **Contact Shadows** | 🟠 높음 | 🟡 보통 | 🟡 보통 | 물체가 공중에 떠 보이는 현상을 제거하는 현실감의 핵심 |
| **2순위** | **Pyramid Bloom** | 🟠 높음 | 🟡 보통 | 🟡 보통 | 기존의 딱딱한 블룸을 영화처럼 부드럽고 몽환적으로 개선 |
| **3순위** | **Auto Exposure** | 🟡 보통 | 🟠 높음 | 🟢 낮음 | 환경에 스스로 적응하는 엔진의 지능형 완성도 |
| **4순위** | **Motion Blur** | 🔴 최고 | 🔴 최고 | 🟠 높음 | 웹 엔진의 한계를 깨는 시네마틱한 속도감 |

---

## 🟢 Phase 1: 시각적 질감 및 컬러 완성
디지털 이미지의 차가움을 지우고 실제 카메라와 같은 풍부한 느낌을 부여합니다.

### 1. 전문가급 컬러 사이언스
- **Physical Exposure:** ISO, Aperture, Shutter Speed 기반의 실제 카메라 노출 모델 구축.
- **Smart Adaptive Exposure:** 히스토그램 분석을 통한 자연스러운 눈 적응(Eye Adaptation) 로직.

### 2. 물리 기반 광학 시뮬레이션
- **Pyramid-based Bloom:** 6단계 이상의 해상도 피라미드를 활용하여 부드러운 빛 번짐 구현.
- **Physical Bokeh DOF:** 조리개 날개 모양을 물리적으로 시뮬레이션하는 하이엔드 보케 효과.
- **Procedural Lens Flare:** 광원 위치와 렌즈 내부 반사를 고려한 절차적 플레어 시스템.

---

## 🟡 Phase 2: 시네마틱 동역학 및 음영
움직임의 부드러움과 공간의 깊이감을 정교화합니다.

### 1. 고정밀 가시성 및 음영
- **Contact Shadows:** 화면 공간 레이 트레이싱 기반의 미세 음영 디테일 보강.
- **Spatio-temporal Denoising:** SSR 및 SSAO의 노이즈를 제거하는 시공간 필터링 강화.

### 2. 궁극의 모션 안정성
- **Per-Object Motion Blur:** 동적 객체의 속도 정보를 활용하여 완벽한 속도감 구현.
- **TSR (Temporal Super Resolution):** TAA 인프라를 확장한 차세대 해상도 업스케일링 연구.

---

## 🛠️ 기존 기능 고도화 상세 계획 (Targeting 100%)
현재 구현된 기능 중 보완이 필요한 핵심 이펙트들의 기술적 개선 포인트입니다.

### 1. SSR (Screen Space Reflection) `90% → 100%`
- **우선순위:** 🟠 높음 | **난이도:** 🔴 최고
- **격차:** 정교한 레이마칭 로직 대비 샘플 노이즈 및 러프니스 대응력 보완 필요.
- **계획:**
  - **Spatio-temporal Denoiser:** 시공간 필터링을 통해 반사광 노이즈를 획기적으로 제거.
  - **Roughness Re-projection:** 표면 거칠기에 따른 반사광 확산을 물리적으로 보정.

### 2. SSAO (Ambient Occlusion) `90% → 100%`
- **우선순위:** 🟠 높음 | **난이도:** 🟠 높음
- **격차:** 원근 적응형 반경은 우수하나 미세 곡률 및 자기 차폐 표현 한계.
- **계획:**
  - **GTAO (Ground Truth AO) 연구:** 기하학적으로 더 정확한 차폐 영역 계산 알고리즘 도입.
  - **Multi-scale AO:** 여러 크기의 반경을 동시에 사용하여 광역 음영과 미세 디테일 확보.

### 3. Bloom (Glow) `70% → 100%`
- **우선순위:** 🔴 최고 | **난이도:** 🟡 보통
- **격차:** 구세대 방식의 좁은 번짐 범위와 부자연스러운 계단 현상 개선 필요.
- **계획:**
  - **Physically-based Pyramid Blur:** 6~8단계 해상도 피라미드를 통한 부드러운 빛 번짐 구현.
  - **Threshold Soft-Knee:** 밝은 영역의 경계부를 부드럽게 처리하여 계단 현상 제거.

### 4. DOF (Depth of Field) `75% → 100%`
- **우선순위:** 🟡 보통 | **난이도:** 🟠 높음
- **격차:** 단순 블러 기반으로, 실제 카메라 렌즈의 '물리적 보케(Bokeh)' 형태 부재.
- **계획:**
  - **Physical Shape Simulation:** 다각형 조리개 모양을 반영한 빛망울 생성 로직 추가.
  - **Tile-based Processing:** 화면 타일링을 통한 연산 효율성 및 선명도 조율.

### 5. Fog / HeightFog `95% → 100%`
- **우선순위:** 🟢 낮음 | **난이도:** 🟡 보통
- **격차:** 물리적 좌표 복원은 완벽하나 빛과의 입체적 산란 상호작용 부재.
- **계획:**
  - **In-scattered Light Integration:** 안개가 주광 및 주변광과 반응하여 빛줄기를 형성하도록 통합.

---

## ✨ 신규 기능 도입 상세 계획 (Bridge the Gap)
언리얼 엔진의 시각적 감성을 완성하기 위해 새롭게 추가될 핵심 기능들의 구현 전략입니다.

### 1. Contact Shadows
- **우선순위:** 🟠 높음 | **난이도:** 🟡 보통 | **부하 정도:** 🟡 보통
- **구현 전략:**
  - **Screen Space Ray-marching:** 각 픽셀에서 광원 방향으로 깊이 버퍼를 따라 미세한 레이(Ray)를 쏘아 가려짐 여부 판정.
  - **Depth-aware Blur:** 계산된 미세 음영이 노이즈 없이 부드럽게 맺히도록 깊이 정보를 보존하며 블러 처리.

### 2. Smart Auto Exposure (Eye Adaptation)
- **우선순위:** 🟡 보통 | **난이도:** 🟠 높음 | **부하 정도:** 🟢 낮음
- **구현 전략:**
  - **Luminance Histogram:** Compute Shader를 사용하여 화면 전체의 밝기 분포를 히스토그램으로 집계.
  - **Temporal Adaptation:** 계산된 평균 밝기에 따라 노출값을 서서히 변화시켜 터널 효과 등 실시간 눈 적응 현상 재현.

### 3. Per-Object Motion Blur
- **우선순위:** 🔴 최고 | **난이도:** 🔴 최고 | **부하 정도:** 🟠 높음
- **구현 전략:**
  - **Velocity Buffer Integration:** 모든 객체의 이전 프레임과 현재 프레임 위치 차이를 모션 벡터 버퍼에 기록.
  - **Directional Reconstruction:** 모션 벡터의 방향과 길이에 따라 픽셀을 여러 번 샘플링하여 속도감이 느껴지는 블러 생성.

### 4. Procedural Lens Flare
- **우선순위:** 🟢 낮음 | **난이도:** 🟡 보통 | **부하 정도:** 🟢 낮음
- **구현 전략:**
  - **Light Source Projection:** 화면 내 강한 광원의 위치를 NDC 좌표로 투영.
  - **Ghost/Halo Generation:** 투영된 중심점의 대칭축을 따라 다각형 원망울(Ghost)과 원형 띠(Halo)를 절차적으로 생성하여 합성.

---

## 📊 모든 포스트 이펙트별 구현 수준 비교 (UE5 vs RedGPU)

### 1. 색상 및 톤 조절 (Color & Tone)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 구현 상태 및 특징 |
| :--- | :--- | :---: | :---: | :--- |
| **Brightness/Contrast** | Brightness/Contrast | 100% | 🔵 매우 낮음 | (완료) 수학적으로 완벽 일치 |
| **Hue/Saturation** | Saturation/Hue Shift | 100% | 🔵 매우 낮음 | (완료) 수학적으로 완벽 일치 |
| **Color Balance** | Color Balance | 100% | 🔵 매우 낮음 | (완료) Shadow/Midtone/Highlight 제어 |
| **ColorTempTint** | Color Temp/Tint | 100% | 🔵 매우 낮음 | (완료) Kelvin 기반 색온도 완비 |
| **Vibrance** | Vibrance (Plugin) | 100% | 🟢 낮음 | (완료) 지능형 채도 보정 로직 포함 |
| **Invert** | Invert (Post Mat) | 100% | 🔵 매우 낮음 | (완료) 기본 기능 완비 |
| **Threshold** | Threshold (Post Mat) | 100% | 🔵 매우 낮음 | (완료) 기본 기능 완비 |
| **Grayscale** | Desaturation | 100% | 🔵 매우 낮음 | (완료) 기본 기능 완비 |
| **ACES Tone Mapping** | ACES Tone Mapper | 100% | 🟢 낮음 | (완료) Hill/Narkowicz 근사식 지원 |

### 2. 가시성 및 라이팅 효과 (Visibility & Lighting)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 구현 상태 및 특징 |
| :--- | :--- | :---: | :---: | :--- |
| **⚠️ SSR** | Screen Space Reflection | **90%** | 🟠 높음 | (완료) Adaptive Step Ray-marching |
| **⚠️ SSAO** | Ambient Occlusion | **90%** | 🟡 보통 | (완료) Adaptive Radius 기반 음영 |
| **⚠️ OldBloom** | Bloom | **70%** | 🟢 낮음 | (보완) 피라미드 방식 교체 필요 |
| **⚠️ Fog / HeightFog** | Exponential Height Fog | **95%** | 🟢 낮음 | (완료) 물리 좌표 복원 로직 적용 |

### 3. 블러 및 컨볼루션 (Blur & Convolution)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 구현 상태 및 특징 |
| :--- | :--- | :---: | :---: | :--- |
| **GaussianBlur** | Gaussian Blur | 100% | 🟡 보통 | (완료) X/Y 분리형 고성능 가우시안 |
| **Blur (Single Pass)** | Blur (Generic) | 100% | 🟢 낮음 | (완료) 컨볼루션 기반 단일 패스 |
| **Sharpen** | Sharpen | 100% | 🟢 낮음 | (완료) 커널 기반 경계 강조 |
| **Convolution** | Convolution Kernel | 100% | 🟢 낮음 | (완료) 사용자 정의 커널 지원 |
| **Zoom/Radial Blur** | Radial Blur | 100% | 🟡 보통 | (완료) 중심점 기반 효과 완비 |
| **Directional Blur** | Directional Blur | 100% | 🟡 보통 | (완료) 각도 기반 선형 블러 완비 |

### 4. 렌즈 및 시각 효과 (Lens & Visual Effects)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 구현 상태 및 특징 |
| :--- | :--- | :---: | :---: | :--- |
| **⚠️ DOF** | Depth of Field | **75%** | 🟠 높음 | (보완) 물리 보케 형태 구현 필요 |
| **Chromatic Aberration**| Chromatic Aberration | 100% | 🟢 낮음 | (완료) 렌즈 색수차 완벽 구현 |
| **Vignetting** | Vignette | 100% | 🔵 매우 낮음 | (완료) 중심점 및 감쇄 정밀 제어 |
| **Lens Distortion** | Lens Distortion | 100% | 🟢 낮음 | (완료) 배럴/핀쿠션 왜곡 구현 |
| **Film Grain** | Film Grain | 100% | 🟢 낮음 | (완료) 다채로운 노이즈 모델 적용 |

### 5. 안티앨리어싱 (Anti-aliasing)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 구현 상태 및 특징 |
| :--- | :---: | :---: | :---: | :--- |
| **FXAA** | FXAA | 100% | 🟢 낮음 | (완료) 엣지 탐색 로직 포함 |
| **⚠️ TAA** | TAA / TSR (Base) | **90%** | 🟡 보통 | (완료) 모션 벡터 추적 적용 |
| **TAASharpen** | TAA Sharpen | 100% | 🟢 낮음 | (완료) 대비 적응형 샤프닝 |

### 6. 부재 및 연구 과제 (The Missing Gap)
| 이펙트 명칭 | UE5 대응 기능 | 수준 | 부하 정도 | 향후 계획 및 필요성 |
| :--- | :--- | :---: | :---: | :--- |
| **🚨 Motion Blur** | Motion Blur | **0%** | 🟠 높음 | 객체별 모션 벡터 기반 전용 패스 신설 |
| **🚨 Auto Exposure** | Auto Exposure | **0%** | 🟢 낮음 | 히스토그램 기반 지능형 시스템 |
| **🚨 Contact Shadows** | Contact Shadows | **0%** | 🟡 보통 | 화면 공간 근접 그림자 보강 |
| **🚨 SS Shadows** | Screen Space Shadows | **0%** | 🟡 보통 | 화면 공간 보조 그림자 연구 |
| **🚨 Lens Flare** | Lens Flare | **10%** | 🟢 낮음 | 절차적 물리 시뮬레이션 |

**종합 평가:** 총 32개 핵심 항목 중 24개 항목 100% 완료. 포스트 프로세싱 레이어 기준 **평균 약 90%** 구현 완료. (언리얼급 시네마틱 정점까지 단 10% 남음)

---
**최종 업데이트:** 2026년 2월 10일
**대상 버전:** RedGPU V4.1.0+
