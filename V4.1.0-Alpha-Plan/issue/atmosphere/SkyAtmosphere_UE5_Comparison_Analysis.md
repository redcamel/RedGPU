# SkyAtmosphere 구현 심층 분석 및 UE5 비교 보고서

## 1. 개요 (Summary)
RedGPU의 `SkyAtmosphere` 시스템은 Sebastien Hillaire(2020)의 물리 기반 대기 산란 파이프라인을 충실히 구현하고 있습니다. 
**언리얼 엔진 5(UE5)를 100%로 기준했을 때, 현재 약 80~85% 수준의 높은 완성도**를 보여줍니다.

---

## 2. 항목별 구현도 및 평가 (Scorecard)

| 항목 | 달성도 | 상세 평가 |
| :--- | :---: | :--- |
| **LUT 파이프라인** | **95%** | Transmittance, Multi-Scat, Sky-View, AP(3D)의 4단계 구조가 UE5와 동일하게 설계됨. |
| **물리적 산란 모델** | **90%** | Rayleigh/Mie/Ozone/Ground Albedo 및 Height Fog의 물리적 통합이 우수함. |
| **IBL 및 태양 렌더링** | **90%** | Limb Darkening 적용 및 1024 샘플 Hammersley 적분을 통한 고퀄리티 IBL 생성. |
| **공중 투시 (AP)** | **90%** | Frustum-Aligned Froxel 격자 도입 완료. Z-depth vs Ray-length 오차 보정 및 근거리 분석적 보정 적용. |
| **최적화 및 확장성** | **75%** | Froxel 매 프레임 업데이트 적용. 향후 Temporal 분산 처리(Stage 3) 필요. |

---

## 3. 심층 분석 리포트

### 3.1 아키텍처 및 LUT 파이프라인 (Architecture)
* **UE5 방식 호환**: 투과율의 비선형 매핑(`getTransmittanceUV`)과 다중 산란의 에너지 보존 로직이 교과서적으로 구현됨.
* **강점**: 대기 산란 루프(`integrateScatSegment`) 내부에 `heightFog`를 물리적으로 통합하여 일관된 대기 표현이 가능함. 예술적 제어를 위한 `phaseMieDual` 하이브리드 접근법이 돋보임.

### 3.2 공중 투시 (Aerial Perspective) - Froxel 도입 완료
* **Frustum Alignment**: 기존 Spherical 3D LUT를 제거하고 카메라 절두체에 정렬된 Froxel 격자 구조로 전면 교체함.
* **정밀도 보정**: 
    * `RayLengthRatio`를 도입하여 Z-depth와 실제 광선 길이 간의 단위 불일치 해결.
    * 3D LUT 해상도 한계 극복을 위해 200m 이내 영역에 대한 **분석적 근거리 보정(Analytical Near-field Fix)** 적용.
* **God Rays 기초**: Froxel 구조 완성을 통해 섀도우 맵 연동(Volumetric Shadows)을 위한 기술적 토대 마련.

### 3.3 최적화 이슈
* **동적 환경의 병목**: 태양 위치 변경 시 모든 LUT와 IBL(GGX 프리필터링 포함)을 한 프레임에 재계산함. 상용 엔진 수준의 부드러운 시간 변화(Time-of-Day)를 위해서는 연산 분산이 필수적임.

---

## 4. UE5(100%) 도달을 위한 개선 과제 (Action Items)

### [P0] Frustum-Aligned 3D Froxel 도입
* **내용**: `CameraVolumeGenerator`의 3D LUT를 구면 좌표계에서 **Camera Frustum (Screen XY + Exponential Z)** 기반으로 변경.
* **효과**: 해상도 낭비 제거 및 근거리/중거리 안개 디테일 비약적 상승.

### [P0] 볼류메트릭 섀도우 (God Rays) 지원
* **내용**: 산란 적분 루프 내에서 Directional Light의 **섀도우 맵(CSM)** 을 샘플링하여 차폐 계산 추가.
* **효과**: 지형이나 구름에 의한 물리적 빛 내림 효과 구현.

### [P1] 연산의 시간적 분산 처리 (Temporal Amortization)
* **내용**: Multi-Scattering 및 IBL 업데이트를 여러 프레임에 걸쳐 나누어 계산(Time-slicing).
* **효과**: 태양 이동 시 발생하는 프레임 드랍(Stuttering) 제거.

### [P2] 다중 대기 광원 (Multiple Directional Lights)
* **내용**: 태양 외에 달(Moon)이나 보조 광원이 대기 산란에 기여할 수 있도록 확장.

### [P2] 우주 시점 (Space View) 최적화
* **내용**: 대기권 밖에서 행성을 바라볼 때 외곽선(Limb) 부근의 정밀도를 높이기 위한 LUT 매핑 공식 개선.

### [P3] Volumetric Cloud 상호작용
* **내용**: 향후 구름 시스템 추가 시 대기 산란광(In-scattering)을 구름 렌더링에 전달하기 위한 API 구조 확보.

---

## 5. 기술적 최종 점검 및 판단 (Technical Final Check)
* **성능 타당성**: Froxel 방식은 매 프레임 재계산이 필요하지만, WebGPU의 Compute Shader 성능으로 약 3.2만 개의 보셀 연산(보셀당 16~20단계 적분)은 최신 GPU에서 충분히 감당 가능함.
* **시각적 이득**: 기존의 하드코딩된 근거리 보정(`if apDist < 0.2`)을 제거하고 순수 물리 수식으로 통합 가능함.
* **확장성**: 이 구조는 향후 **Volumetric Shadows(God Rays)** 구현을 위한 필수적인 데이터 구조임.

---

## 🔗 관련 문서 (Related Documents)

* **[구현 계획서] [Frustum-Aligned 3D Froxel Aerial Perspective 도입 계획](./Froxel_AerialPerspective_Implementation_Plan.md)**

