# 🌌 SkyAtmosphere 개선 프로젝트 (V4.1.0)

본 디렉토리는 RedGPU의 대기 산란 시스템을 언리얼 엔진 5(UE5) 수준으로 격상시키기 위한 분석 보고서 및 구현 계획서를 포함하고 있습니다.

## 📋 문서 목록 (Index)

1. **[구현 심층 분석 및 UE5 비교 보고서](./SkyAtmosphere_UE5_Comparison_Analysis.md)**
    * 현재 구현도 측정 (80~85%) 및 항목별 상세 비교.
    * UE5 대비 부족한 점 및 개선 우선순위 정의.

2. **[Frustum-Aligned 3D Froxel 도입 계획서](./Froxel_AerialPerspective_Implementation_Plan.md)**
    * 공중 투시(Aerial Perspective) 정밀도 향상을 위한 핵심 기술 로드맵.
    * 단계별 구현 로직 및 리스크 관리 전략.

---

## 🚀 로드맵 (Roadmap)

- [x] **[Research]** 기존 SkyAtmosphere 소스 코드 및 WGSL 심층 분석.
- [x] **[Strategy]** UE5 비교 분석 및 개선 항목 도출.
- [x] **[Design]** Froxel 기반 Aerial Perspective 상세 설계.
- [x] **[Execution - Stage 1]** `CameraVolumeGenerator` 및 3D LUT 좌표계 리팩토링.
- [x] **[Execution - Stage 2]** Froxel 기반 컴퓨트 셰이더 및 포스트 이펙트 적용.
- [ ] **[Execution - Stage 3]** 시각적 완성도 향상 (Dithering & Temporal Filtering).
- [ ] **[Validation]** UE5와 시각적/성능적 결과물 비교 검증.

---

## 🔗 주요 참조 파일
- 핵심 로직: `src/display/skyAtmosphere/SkyAtmosphere.ts`
- 컴퓨트 셰이더: `src/display/skyAtmosphere/wgsl/computeCode.wgsl`
- AP 생성기: `src/display/skyAtmosphere/core/generator/cameraVolume/CameraVolumeGenerator.ts`
