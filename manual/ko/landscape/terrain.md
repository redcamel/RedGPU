---
title: Terrain & Streaming
order: 1
---

# 지형 생성 및 스트리밍

`RedGPU.Landscape.Landscape` 클래스는 대규모 지형의 공간 그리드, 가상 하이트 텍스처 (**VHT**) 타일 스트리밍, 연속적 LOD 모핑, 고도 쿼리 및 지형 디버거를 총괄합니다.

## 1. 지형 생성 및 Scene 등록

`Landscape` 인스턴스를 생성한 뒤 `scene.landscape` 속성에 할당하면 씬의 렌더링 파이프라인에 즉시 통합됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 4000m x 4000m 월드 크기의 지형 생성 (단일 수치 또는 [width, depth] 배열)
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);

// 2. 전역 하이트맵 URL 및 최대 고도 스케일(미터 단위) 설정
landscape.globalHeightmapUrl = 'https://redcamel.github.io/RedGPU/examples/assets/landscape/heightmap.png';
landscape.heightScale = 600;

// 3. Scene에 지형 등록
scene.landscape = landscape;
```

## 2. 타일 스트리밍과 해상도 제어

광활한 오픈월드에서 모든 지역의 고해상도 하이트맵을 한 번에 로드하지 않고, 카메라 이동에 따라 필요한 타일만 비동기로 스트리밍할 수 있습니다.

- **`globalHeightmapUrl`**: 전체 지형의 기본 고도를 제공하는 전역 하이트맵 이미지 경로입니다.
- **`tileUrlResolver`**: 타일의 행 (`row`)과 열 (`col`) 인덱스를 받아 개별 고해상도 타일 하이트맵 URL을 반환하는 콜백 함수입니다.
- **`tileLoadingRadius`**: 카메라를 중심으로 고해상도 타일을 스트리밍 로드할 반경 (기본값: `2500.0`)입니다.
- **`tileMaxLoadsPerFrame`**: 프레임 스파이크 방지를 위해 단일 프레임당 동시에 디코딩·베이킹을 시작할 최대 타일 개수입니다.

```javascript
// 카메라 반경 3000m 이내의 타일을 프레임당 최대 2개씩 비동기 스트리밍
landscape.tileLoadingRadius = 3000;
landscape.tileMaxLoadsPerFrame = 2;

landscape.tileUrlResolver = (row, col) => {
    return `./assets/tiles/height_r${row}_c${col}.png`;
};
```

## 3. 연속적 LOD 및 그림자 설정

지형 타일은 GPU 컴퓨트 패스에서 절두체 및 `View3D`의 계층적 Z-버퍼 (**HZB**)를 참조하여 가시성을 판별하고 LOD 레벨을 결정합니다.

| 속성명                        | 기본값         | 설명                                                                      |
|:------------------------------|:---------------|:--------------------------------------------------------------------------|
| **`worldSize`**               | `[2000, 2000]` | 지형의 전체 가로·세로 월드 크기 (`number` 또는 `[sizeX, sizeZ]`)          |
| **`componentCount`**          | `[16, 16]`     | 지형을 분할하는 X/Z축 타일 컴포넌트 개수                                  |
| **`heightScale`**             | `200.0`        | 정규화된 하이트맵(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일                |
| **`lodMetric`**               | `'screenSize'` | LOD 결정 기준 (`'screenSize'` 화면 투영 비율 / `'distance'` 거리)         |
| **`lodMaxLevel`**             | `5`            | 지형 메시에 사용할 최대 LOD 단계 수 (`1 ~ 8`)                             |
| **`receiveShadow`**           | `true`         | 방향성 광원(`DirectionalLight`)의 CSM 그림자 맵 수신 여부                 |
| **`castHeightmapShadow`**     | `false`        | 하이트맵 레이마칭 기반의 원거리 지형 자체 그림자(Self-Shadow) 활성화 여부 |
| **`heightmapShadowDistance`** | `1000.0`       | 하이트맵 자체 그림자 레이마칭의 최대 추적 거리 (`10.0` 이상)              |
| **`heightmapShadowSteps`**    | `16`           | 하이트맵 자체 그림자 레이마칭 샘플링 스텝 수 (`4 ~ 64`)                   |
| **`heightmapShadowSoftness`** | `8.0`          | 하이트맵 자체 그림자 경계의 부드러움 계수 (`0.1` 이상)                    |

```javascript
// 원거리 산맥이 계곡에 드리우는 하이트맵 레이마칭 자체 그림자 활성화
landscape.castHeightmapShadow = true;
landscape.heightmapShadowDistance = 1500;
landscape.heightmapShadowSteps = 24;
landscape.heightmapShadowSoftness = 8.0;
```

## 4. 지형 고도 조회 (`getHeightAt`)

캐릭터나 일반 `Mesh` 객체를 지형 표면 위에 정확히 안착시키려면 `landscape.getHeightAt(x, z)` 메서드를 사용합니다. CPU 하이트맵 캐시로부터 보간된 월드 Y 좌표를 즉시 반환합니다.

```javascript
// 월드 좌표 (x: 120, z: -45) 지점의 지형 표면 높이(Y) 조회
const groundY = landscape.getHeightAt(120, -45);
characterMesh.y = groundY;
```

## 5. 지형 디버거 (`LandscapeDebuggerManager`)

`landscape.debuggerManager`를 통해 지형의 와이어프레임이나 LOD 분포 상태를 시각적으로 점검할 수 있습니다.

```javascript
// 와이어프레임 및 LOD 단계별 색상 시각화 활성화
landscape.debuggerManager.landscapeWireframe = true;
landscape.debuggerManager.landscapeLodColoration = true;
```

---

## 다음 단계

지형의 뼈대와 고도가 완성되었다면, 이제 바위·흙·잔디 등 다중 PBR 재질을 입히는 스플래팅 시스템을 알아봅니다.

- **[다중 레이어 스플래팅](./material-splatting.md)**
