# SkyAtmosphere Shader Hardcoded Constants Summary (완료)

이 문서는 `src/display/skyAtmosphere/` 경로 내의 WGSL 쉐이더 및 생성기(Generator) 클래스에 하드코딩된 주요 상수와 매직 넘버들을 정리한 분석 보고서입니다. (최종 검토 및 물리적 정합성 교정 완료)

## 1. 적분 및 샘플링 단계 (Integration & Sampling)
품질과 성능의 직접적인 타협점인 루프 반복 횟수입니다.

| 항목 | 값 | 파일 위치 | 설명 | 상태 |
| :--- | :--- | :--- | :--- | :---: |
| **CameraVolume Steps** | `32` | `cameraVolumeShaderCode.wgsl` | Aerial Perspective 3D LUT 생성 시 적분 단계 수 | ✅ |
| **Sky-View Steps** | `64` | `skyViewShaderCode.wgsl` | 전체 하늘색(Sky-View) 계산을 위한 적분 단계 수 | ✅ |
| **Transmittance Steps** | `40` | `transmittanceShaderCode.wgsl` | 대기 투과율 계산 시 적분 단계 수 | ✅ |
| **Multi-Scattering Samples** | `64` | `multiScatteringShaderCode.wgsl` | 에너지 보존을 위한 다중 산란 샘플링 수 | ✅ |
| **Multi-Scattering Steps** | `20` | `multiScatteringShaderCode.wgsl` | 다중 산란 샘플당 경로 적분 단계 수 | ✅ |
| **Irradiance Phi Samples** | `12u` | `atmosphereIrradianceShaderCode.wgsl` | 조도 계산을 위한 수평 샘플 수 | ✅ |
| **Irradiance Theta Samples** | `6u` | `atmosphereIrradianceShaderCode.wgsl` | 조도 계산을 위한 수직 샘플 수 | ✅ |

## 2. 물리적 한계치 및 상수 (Physical Constants)
물리 현상을 시뮬레이션하기 위해 설정된 임계값입니다.

| 항목 | 값 | 파일 위치 | 설명 | 상태 |
| :--- | :--- | :--- | :--- | :---: |
| **Max Aerial Dist** | `100.0` (km) | `cameraVolumeShaderCode.wgsl`, `computeCode.wgsl` | 공중 투시 효과가 적용되는 최대 거리 | ✅ |
| **MAX_TAU** | `50.0` | `skyAtmosphereFn.wgsl` | 최대 광학 두께(Optical Depth). 지면 아래 처리 시 사용 | ✅ |
| **Fog Anisotropy** | `0.7` | `cameraVolumeShaderCode.wgsl`, `skyViewShaderCode.wgsl` | 안개용 Mie 페이즈 함수의 비등방성(g) 값 | ✅ |
| **Sun Disk Scale** | `100.0` | `computeCode.wgsl` | 태양 디스크 렌더링 시 강도 가중치 | ✅ |

## 3. 임계값 및 판정 로직 (Thresholds & Magic Numbers)
정밀도 문제 해결이나 시각적 부드러움을 위한 값들입니다.

| 항목 | 값 | 파일 위치 | 설명 | 상태 |
| :--- | :--- | :--- | :--- | :---: |
| **Sky Depth** | `0.999999` | `computeCode.wgsl` | 뎁스 버퍼 값이 이보다 크면 배경(하늘)으로 판정 | ✅ |
| **Transmittance End** | `0.001` | `skyViewShaderCode.wgsl` | 투과율이 이 값보다 낮아지면 루프 조기 종료 | ✅ |
| **Sun Smoothness** | `0.001` | `computeCode.wgsl` | 태양 디스크 경계의 부드러움(smoothstep offset) | ✅ |
| **Ground Offset** | `-0.001` | `cameraVolumeShaderCode.wgsl` | 지표면 충돌 판정 시 수치적 안정성을 위한 오프셋 | ✅ |

## 4. LUT 텍스처 해상도 (Resolution)
TS 파일의 멤버 변수로 정의되어 있으나 셰이더의 샘플링 로직과 밀접하게 연관되어 있습니다.

| 생성기 클래스 | 해상도 (W x H x D) | 비디오 메모리 점유 (RGBA16F) | 상태 |
| :--- | :--- | :--- | :---: |
| **Transmittance** | 256 x 64 | ~128 KB | ✅ |
| **Sky-View** | 200 x 200 | ~320 KB | ✅ |
| **CameraVolume** | 64 x 64 x 32 | ~1,024 KB | ✅ |
| **Multi-Scattering** | 32 x 32 | ~8 KB | ✅ |
| **Irradiance** | 32 x 32 | ~8 KB | ✅ |

## 5. 컴퓨팅 워크그룹 크기 (Workgroup Sizes)
GPU 하드웨어 스케줄링 최적화 값입니다.

| 워크그룹 크기 | 적용 파일 | 비고 | 상태 |
| :--- | :--- | :--- | :---: |
| `(16, 16)` | `computeCode.wgsl`, `skyViewShaderCode.wgsl`, `transmittanceShaderCode.wgsl` | 일반적인 2D 텍스처 처리 | ✅ |
| `(4, 4, 4)` | `cameraVolumeShaderCode.wgsl` | 3D 텍스처 처리 (64개 스레드) | ✅ |
| `(8, 8)` | `multiScatteringShaderCode.wgsl`, `atmosphereIrradianceShaderCode.wgsl` | 중간 크기 2D 처리 (64개 스레드) | ✅ |
