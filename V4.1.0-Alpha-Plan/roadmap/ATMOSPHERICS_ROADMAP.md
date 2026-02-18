# RedGPU Atmospherics & Volumetrics Roadmap (The Atmosphere)

본 문서는 RedGPU의 대기 및 환경 렌더링 시스템을 언리얼 엔진급의 물리적 정확도와 감성 수준으로 끌어올리기 위한 기술 로드맵을 정의합니다.

---

## 🎯 전략적 우선순위 및 난이도 분석
공간의 공기감과 깊이감을 결정짓는 핵심 대기 기술들의 개발 순위입니다.

| 우선순위 | 기능 명칭 | 임팩트 | 난이도 | 부하 정도 | 핵심 가치 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **1순위** | **PB Atmosphere** | 🟠 높음 | 🟠 높음 | 🟡 보통 | 물리 법칙(산란)에 기반한 사실적인 하늘과 노을 구현 |
| **2순위** | **Volumetric Light** | 🔴 최고 | 🟡 보통 | 🟡 보통 | 안개나 먼지를 뚫고 나오는 입체적인 빛줄기(God Rays) 표현 |
| **3순위** | **Ray-marched Cloud** | 🟠 높음 | 🟠 높음 | 🟠 높음 | 2D 텍스처가 아닌 실제 부피를 가진 3D 입체 구름 생성 |
| **4순위** | **Advanced Fog** | 🟡 보통 | 🟡 보통 | 🟢 낮음 | 높이와 거리에 따라 조밀하게 반응하는 고정밀 안개 시스템 |

---

## 🟢 Phase 1: 물리 기반 하늘 및 안개 (Foundation)
가장 기초가 되는 대기층의 물리적 거동을 구현합니다.

### 1. Physically Based Atmosphere (Sky & Sunset)
- **개념:** 대기 중의 입자들이 태양광을 산란시키는 현상(Rayleigh/Mie Scattering)을 수학적으로 모델링.
- **전략:**
  - 태양의 고도에 따라 실시간으로 하늘의 색상과 노을의 그라데이션이 변하는 동적 시스템 구축.
  - Precomputed Atmospheric Scattering 기술을 활용하여 성능과 품질 확보.

### 2. Advanced Height/Distance Fog
- **개념:** 지면으로부터의 높이와 카메라로부터의 거리에 따라 안개의 농도가 비선형적으로 변하는 시스템.
- **전략:**
  - Exponential Height Fog 모델 도입.
  - 현재 RedGPU의 `HeightFog`를 더 정밀한 지수 모델로 고도화.

---

## 🟡 Phase 2: 입체 광학 효과 (Volumetrics)
매질(매체)을 통과하는 빛의 물리적 산란을 시각화합니다.

### 1. Volumetric Lighting (God Rays)
- **개념:** 안개나 수증기가 섞인 공기를 지나는 조명이 그 궤적을 드러내는 현상.
- **전략:**
  - **Ray-marching in Shadow Map**: 쉐도우 맵 데이터를 따라 빛의 산란량을 누적 계산.
  - TAA 인프라와의 결합을 통한 업샘플링으로 낮은 연산량에서 고품질 빛줄기 구현.

---

## 🔴 Phase 3: 입체 기상 시스템 (Future Tech)
역동적이고 살아있는 환경을 위한 고난도 시뮬레이션 기술입니다.

### 1. Ray-marched Volumetric Clouds
- **개념:** 3D 노이즈(Worley/Perlin)를 활용하여 구름의 부피와 모양을 실시간 생성.
- **전략:**
  - 대형 볼륨 텍스처를 활용한 레이마칭 알고리즘 구현.
  - 구름 내부의 다중 산란(Multiple Scattering) 및 그림자 투영 시스템 연구.

---

## 📊 대기 환경 시스템 구현 수준 및 부하 비교 (UE5 vs RedGPU)

| 기능 명칭 | 현재 수준 (RedGPU) | 부하 정도 | UE5 대비 | 향후 과제 |
| :--- | :--- | :---: | :---: | :--- |
| **Sky Rendering** | 물리 기반 동적 모델 완비 | 🟡 보통 | 100% | (완료) UE5 표준 하이브리드 LUT 시스템 구축 |
| **Material Sync** | 전역 재질 연동 시작 | 🟠 높음 | 60% | `useSkyAtmosphere` 플래그 및 Group 0 전역 바인딩을 통한 3D LUT 자동 적용 (MSAA 대응 포함) |
| **Global Composition**| 3D LUT 기반 메시 합성 중 | 🟠 높음 | 80% | Scene Color 및 Multisampled Depth 연동 최적화 |
| **Volumetric Light** | 2D 스크린 효과 수준 | 🟡 보통 | 20% | 3D 볼륨 레이마칭 기반 정밀 시스템 신설 |
| **Height Fog** | 물리 모델 고도화 완료 | 🟢 낮음 | 100% | (완료) 지수 모델 및 3D LUT 연동 |
| **Volumetric Cloud** | 텍스처 기반 | 🟠 높음 | 10% | 3D 노이즈 기반 레이마칭 구름 시스템 연구 |

**종합 평가:** 현재 약 **70%** 구현 완료. '대기 산란'의 물리적 정합성은 언리얼 엔진 수준에 도달했으며, 이제 모든 물체를 대기 속으로 녹여내는 **'전역 재질 통합 및 합성'** 단계에 집중합니다.

---
**최종 업데이트:** 2026년 2월 13일
**대상 버전:** RedGPU V4.1.0+
