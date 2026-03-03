# [Issue] SkyAtmosphere Naming Standardization & Logic Consistency

## 1. 개요 (Overview) - [완료]
`SkyAtmosphere` 시스템의 리소스 명칭을 표준화하고, 물리 시뮬레이션의 논리적 정합성을 최종 확정했습니다.

---

## 2. 주요 확정 사항 (Final Decisions)

### 2.1 리소스 명칭 표준화 (Naming Convention)
*   **규칙**: 모든 대기 관련 공개/내부 리소스에 **`atmosphere` 접두어**를 일관되게 적용했습니다.
*   **변경 내역**:
    *   `skyAtmosphereReflectionTexture` → **`atmosphereReflectionTexture`**
    *   `transmittanceTexture` → **`atmosphereTransmittanceTexture`**
    *   `skyViewTexture` → **`atmosphereSkyViewTexture`**
    *   `cameraVolumeTexture` → **`atmosphereCameraVolumeTexture`**
    *   `skyAtmosphereSampler` → **`atmosphereSampler`**
*   **이점**: 엔진 전역(View3D, Material 등)에서 대기 시스템 소유의 리소스를 즉시 식별 가능.

### 2.2 물리 시뮬레이션 논리 유지 (Logic Integrity)
*   **지표면 기준**: 지하 1km 시뮬레이션 시의 수치적 불안정성으로 인해, 시각적으로 가장 정확한 **Y=0(해수면) 기준 물리 모델**로 복구했습니다.
*   **거리 기반 안개 (AP)**: 유클리드 거리 대신 **Z-Depth 방식**을 최종 채택하여 광각에서의 시각적 왜곡(어항 효과)을 방지하고 화면 전체의 평면적 일관성을 확보했습니다.
*   **지하 아티팩트 방어**: 지하에서 아래를 볼 때 적분 거리가 무한대로 튀는 현상을 막기 위한 `tMax` 클램핑 로직은 유지하여 수치 안정성을 높였습니다.

### 2.3 실시간 IBL 갱신 시스템
*   **`revision` 시스템 고착**: 언리얼 엔진 컨벤션을 따라 `ResourceBase`에 `revision` 카운터를 도입했습니다.
*   **내용물 감지**: 텍스처 객체 참조가 같아도 내부 데이터가 갱신되면 `revision` 변화를 보고 IBL 바인드 그룹을 즉시 재구성합니다.

---

## 3. 적용 가이드 (Usage Guide)

1.  **지하 월드 구축 시**: `skyAtmosphere.seaLevel = -1.0;` 속성을 사용하여 지표면 오프셋을 조절합니다. (물리 수식은 상대 고도를 사용하여 안정적으로 동작)
2.  **실시간 IBL 연동**: `view.iblTexture = skyAtmosphere.atmosphereReflectionTexture;` 설정 시 대기 변화가 glTF에 자동 반영됩니다.

---

## 4. 기대 효과 (Expected Benefits)
*   **완벽한 비주얼 정합성**: 화면 외곽까지 깨끗한 거리 기반 안개 효과.
*   **전문적인 명칭 체계**: 접두어 통일을 통한 코드 가독성 및 유지보수성 향상.
*   **실시간 조명 동기화**: 대기 상태 변화가 PBR 모델의 반사에 즉각 반영.

---
**최종 업데이트:** 2026-03-02
**상태:** 최종 완료 (Finalized)
**프로젝트:** RedGPU

