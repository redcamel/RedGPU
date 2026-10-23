---
title: Terrain & Streaming
order: 1
---

# 지형 생성 및 스트리밍

`RedGPU.Landscape.Landscape` 클래스는 대규모 지형의 공간 그리드, 하이트맵 타일 스트리밍, 연속적 LOD 모핑, 고도 쿼리 (`getHeightAt`) 및 지형 디버거를 총괄합니다.

---

## 1. 지형 생성 및 Scene 등록

`Landscape` 인스턴스를 생성한 뒤 `scene.landscape` 속성에 할당하면 씬의 렌더링 파이프라인에 즉시 통합됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 4000m x 4000m 월드 크기의 지형 생성 (단일 수치 또는 [width, depth] 배열)
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);

// 2. 전역 하이트맵 URL 및 최대 고도 스케일(미터 단위) 설정
landscape.globalHeightmapUrl = './assets/terrain/global_heightmap_1024.png';
landscape.heightScale = 300;

// 3. Scene에 지형 등록
scene.landscape = landscape;
```

### 라이브 예제: 기본 지형 생성

<iframe src="/RedGPU/examples/3d/landscape/basicTerrain/" style="width:100%; height:500px;"></iframe>

---

## 2. 타일 스트리밍 (`tileUrlResolver`)

광활한 오픈월드에서 모든 지역의 고해상도 하이트맵을 한 번에 로드하지 않고, 카메라 이동에 따라 필요한 주변 타일만 비동기로 스트리밍할 수 있습니다.

```javascript
// 카메라 반경 1250m 이내의 고해상도 타일을 프레임당 최대 2개씩 비동기 스트리밍
landscape.tileLoadingRadius = 1250;
landscape.tileMaxLoadsPerFrame = 2;

landscape.tileUrlResolver = (row, col) => {
    const r = String(row).padStart(2, '0');
    const c = String(col).padStart(2, '0');
    return `./assets/tiles/height_tile_${r}_${c}.png`;
};
```

### 라이브 예제: 타일 스트리밍

<iframe src="/RedGPU/examples/3d/landscape/tileStreaming/" style="width:100%; height:500px;"></iframe>

---

## 3. 주요 설정 속성

| 분류              | 속성명                                                     | 기본값         | 설명                                                                      |
|:------------------|:-----------------------------------------------------------|:---------------|:--------------------------------------------------------------------------|
| **크기 및 고도**  | **`worldSize`**                                            | `[2000, 2000]` | 지형의 전체 가로·세로 월드 크기 (`number` 또는 `[sizeX, sizeZ]`)          |
|                   | **`heightScale`**                                          | `200.0`        | 정규화된 하이트맵(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일                |
|                   | **`globalHeightmapUrl`**                                   | `null`         | 전체 지형의 기본 고도를 제공하는 전역 하이트맵 이미지 경로                |
| **타일 스트리밍** | **`tileUrlResolver`**                                      | `null`         | 타일(`row`, `col`)별 고해상도 하이트맵 URL을 반환하는 콜백 함수           |
|                   | **`tileLoadingRadius`**                                    | `2500.0`       | 카메라 중심 고해상도 타일 스트리밍 반경                                   |
|                   | **`tileMaxLoadsPerFrame`**                                 | `2`            | 단일 프레임당 동시에 디코딩·베이킹을 시작할 최대 타일 개수                |
| **LOD**           | **`lodMetric`**                                            | `'screenSize'` | LOD 결정 기준 (`'screenSize'` 화면 투영 비율 / `'distance'` 거리)         |
|                   | **`lodMaxLevel`**                                          | `5`            | 지형 메시에 사용할 최대 LOD 단계 수 (`1 ~ 8`)                             |
|                   | **`componentSizeQuads`** / **`lod0SizeQuads`**             | `64` / `256`   | 타일 컴포넌트 격자 해상도 및 LOD 0 기준 쿼드 해상도                       |
| **그림자**        | **`receiveShadow`**                                        | `true`         | 방향성 광원(`DirectionalLight`)의 CSM 그림자 수신 여부                    |
|                   | **`castHeightmapShadow`**                                  | `false`        | 하이트맵 레이마칭 기반의 원거리 지형 자체 그림자(Self-Shadow) 활성화 여부 |
|                   | **`heightmapShadowDistance`**                              | `1000.0`       | 하이트맵 자체 그림자 레이마칭의 최대 추적 거리 (`10.0` 이상)              |
|                   | **`heightmapShadowSteps`** / **`heightmapShadowSoftness`** | `16` / `8.0`   | 자체 그림자 레이마칭 스텝 수 (`4 ~ 64`) 및 경계 부드러움 계수             |

---

## 4. 지형 고도 조회 (`getHeightAt`) 및 디버거

캐릭터나 일반 `Mesh` 객체를 지형 표면 위에 안착시킬 때는 `landscape.getHeightAt(x, z)`를 사용하며, `landscape.debuggerManager`로 와이어프레임 및 LOD 분포를
시각적으로 점검할 수 있습니다.

```javascript
// 1. 월드 좌표 (x, z) 지점의 지형 표면 높이(Y) 조회
characterMesh.y = landscape.getHeightAt(characterMesh.x, characterMesh.z);

// 2. 와이어프레임 및 LOD 단계별 색상 시각화 활성화
landscape.debuggerManager.landscapeWireframe = true;
landscape.debuggerManager.landscapeLodColoration = true;
```

---

## 관련 예제

- [기본 지형 생성 (Basic Terrain)](/RedGPU/examples/3d/landscape/basicTerrain/)
- [타일 스트리밍 (Tile Streaming)](/RedGPU/examples/3d/landscape/tileStreaming/)
- [지형과 호수 통합 (Landscape & Water)](/RedGPU/examples/3d/landscape/landscapeAndWater/)

---

[다음 단계: 다중 레이어 스플래팅 배우기](./material-splatting.md)
