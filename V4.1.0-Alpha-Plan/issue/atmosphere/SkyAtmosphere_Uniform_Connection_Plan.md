# [Plan] SkyAtmosphere Uniform Connection & Logic Integration Plan

## 1. 개요 (Overview)
현재 `SkyAtmosphere` 시스템의 WGSL 셰이더 내부에 하드코딩된 물리 상수 및 제어 파라미터들을 유니폼(Uniform)으로 분리하여, 런타임에서 동적으로 품질과 표현을 조절할 수 있도록 개선하는 계획입니다.

## 2. 유니폼 연결 대상 리스트 (Connection Targets)

### 2.1 Aerial Perspective (AP) 거리 동기화 - [완료]
*   **현상**: AP 효과의 기준 거리(`100.0` km)가 `cameraVolumeShaderCode.wgsl`와 `computeCode.wgsl` 양쪽에 하드코딩되어 있음.
*   **해결**: `aerialPerspectiveMaxDistance` 항목을 유니폼에 추가하여 두 셰이더의 샘플링/적분 기준을 동기화 완료. (2026-03-04)

### 2.2 Mie Phase Function 파라미터 연결 - [완료]
*   **현상**: `skyAtmosphereFn.wgsl`의 `phaseMieDual` 함수 내에 `0.99`(Halo)와 `0.2`(Glow Mix)가 고정값으로 사용됨.
*   **해결**: 기존 유니폼 항목인 `mieHalo`와 `mieGlow`를 실제 셰이더 수식에 연결 완료. (2026-03-04)

### 2.3 높이 안개 비등방성 (Height Fog Anisotropy)
*   **현상**: `integrateScatSegment` 함수 내에서 안개용 Mie 산란 계수로 `0.7`이 하드코딩됨.
*   **해결**: `heightFogAnisotropy` 유니폼을 추가하여 안개의 전방 산란 강도를 조절 가능하게 변경.

### 2.4 적분 단계 수 (Integration Steps) 유니폼화
*   **현상**: 각 LUT 생성기(`Transmittance`, `SkyView`, `Volume` 등)의 루프 횟수가 셰이더에 고정되어 있어 저사양 기기 최적화가 어려움.
*   **해결**: `qualityLevel`에 따른 단계 수 가중치를 도입하거나, 주요 적분 단계 수를 유니폼으로 전달.

### 2.5 태양 디스크 표현 세부 조절
*   **현상**: `computeCode.wgsl` 내 태양의 강도 배율(`100.0`) 및 경계 부드러움(`0.001`)이 하드코딩됨.
*   **해결**: `sunDiskScale`, `sunDiskSmoothness` 유니폼 추가.

### 2.6 미사용 유니폼 로직 구현 (Implementation of Unused Uniforms)
*   **현상**: `groundSpecular`, `groundShininess`, `horizonHaze` 등이 유니폼 구조체에는 정의되어 있으나 실제 물리 로직(WGSL)에는 반영되지 않음.
*   **해결**: 지면 조도 계산 시 Specular 반사 로직을 추가하고, 지평선 산란 보정 로직에 `horizonHaze` 연결.

## 3. 구현 우선순위 (Priority)

1.  **High**: `aerialPerspectiveMaxDistance` (시각적 정합성 핵심)
2.  **High**: `mieHalo`, `mieGlow` 연결 (기존 유니폼 활용)
3.  **Medium**: `heightFogAnisotropy` 및 `sunDisk` 관련 파라미터
4.  **Low**: 적분 단계 수 유니폼화 (성능 최적화 단계)

## 4. 기대 효과 (Expected Benefits)
*   **동적 품질 조절**: 하드웨어 성능에 따라 적분 정밀도를 실시간으로 변경 가능.
*   **예술적 제어력 강화**: 태양의 후광(Halo)이나 지평선 연무(Haze)를 UI에서 즉시 튜닝 가능.
*   **코드 일관성**: TS 파라미터와 셰이더 로직 간의 수치 불일치 문제 완전 해결.

---
**기록일**: 2026-03-04
**상태**: 계획 수립 (Planned)
**프로젝트**: RedGPU
