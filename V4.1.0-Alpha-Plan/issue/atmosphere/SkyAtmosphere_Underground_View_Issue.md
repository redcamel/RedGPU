# [Issue] SkyAtmosphere Underground View & Aerial Perspective Absence

## 1. 현상 요약 (Issue Summary)
카메라 또는 오브젝트가 **월드 좌표 Y < 0 (지표면 아래)**에 위치할 때, 위를 쳐다보거나 오브젝트를 렌더링하면 지표면(Y=0)에 도달하기 전까지의 구간에서 **대기 효과(산란 및 공중 투시)가 전혀 나타나지 않는 현상**입니다.

## 2. 원인 분석 (Root Cause Analysis)

### 2.1 대기 밀도 하드 차단 (Hardcoded Density Cutoff)
`skyAtmosphereFn.wgsl` 내의 대기 밀도 계산 함수에서 높이(`h`)가 0보다 작으면 물리적 밀도를 강제로 0으로 설정하고 있습니다.
```wgsl
// skyAtmosphereFn.wgsl
fn getAtmosphereDensities(h: f32, params: SkyAtmosphere) -> AtmosphereDensities {
    if (h < 0.0) {
        d.rhoR = 0.0; d.rhoM = 0.0; // 지표면 아래는 진공 처리
    }
    // ...
}
```

### 2.2 카메라 높이 클램핑 (Camera Height Clamping)
`SkyAtmosphere.ts`에서 시뮬레이션의 안정성을 위해 카메라의 고도를 지표면 위 1m(`0.001km`)로 강제 고정합니다.
```typescript
// SkyAtmosphere.ts
const currentHeightKm = Math.max(0.001, cameraPos[1] / 1000.0);
```
이로 인해 카메라가 지하 -100m에 있더라도 셰이더는 "지표면 위 1m에 있는 카메라"를 기준으로 LUT를 샘플링하게 되어, 지하 구간의 안개 데이터가 소실됩니다.

### 2.3 적분 구간 건너뛰기 (Integration Skipping)
적분 루프(`integrateSegment`)에서 지표면 아래(`h < -0.001`)인 샘플 포인트는 계산에서 제외됩니다. 지하에서 지표면 방향으로 발사된 레이는 지표면을 뚫고 나오기 전까지 아무런 산란광을 축적하지 못합니다.

---

## 3. 업계 사례 비교 (Industry Standard: Unreal Engine)

언리얼 엔진의 `SkyAtmosphere`는 다음과 같은 유연한 방식을 제공합니다.

1.  **Transformable Sea Level**: `SkyAtmosphere` 컴포넌트의 위치(Z)를 기준으로 지표면 높이가 결정됩니다. 컴포넌트를 내리면 지하 깊은 곳도 대기권에 포함될 수 있습니다.
2.  **Aerial Perspective for Underground**: 카메라가 지하에 있더라도 지표면 위로 이어지는 대기 산란을 올바르게 계산하여 시각적 연속성을 보장합니다.
3.  **Ground Offset**: 행성의 반지름과 별개로 시각적/물리적 지표면 오프셋을 설정할 수 있습니다.

---

## 4. 해결 방안 (Proposed Solutions)

### 계획 A: `seaLevel` (또는 `groundOffset`) 파라미터 도입
사용자가 월드 좌표계 상에서 어디를 "지표면"으로 간주할지 설정할 수 있는 기능을 추가합니다.

*   **Property**: `skyAtmosphere.seaLevel = -0.1;` (단위: km, -100m 설정 시)
*   **Shader Update**: `h = (worldY / 1000.0) - params.seaLevel` 형태로 상대 높이를 계산하도록 수정.
*   **Clamping Update**: `Math.max(params.seaLevel + 0.001, currentHeightKm)`으로 카메라 높이 보정 기준 변경.

### 계획 B: 지하 적분 허용 및 감쇄 (Hollow Planet Support)
`useGround = false`인 경우와 유사하게, 지표면 아래에서도 대기 밀도가 (지수적으로 증가하거나 상수로 유지되며) 존재하도록 물리 모델을 확장합니다.

---

## 5. 기대 효과 (Expected Benefits)
*   지하 동굴, 깊은 협곡, 또는 Y < 0에서 시작하는 커스텀 월드에서 자연스러운 대기 및 안개 효과 구현 가능.
*   카메라 이동에 따른 대기 효과의 급격한 단절(Popping) 현상 해결.
*   언리얼 엔진 수준의 유연한 환경 설정 워크플로우 확보.

---
**작성일:** 2026-03-02
**상태:** 이슈 분석 완료 및 해결 방안 수립 중
**프로젝트:** RedGPU
