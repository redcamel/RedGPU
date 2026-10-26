---
title: Terrain
order: 1
---

# 기본 지형 (Terrain)

`RedGPU.Landscape.Landscape` 클래스는 대규모 지형의 공간 그리드, 전역 하이트맵 (`globalHeightmapUrl`), 연속적 LOD 모핑, 고도 쿼리 (`getHeightAt`) 및 지형
디버거를 총괄합니다.

---

## 1. 지형 생성 및 전역 하이트맵 (`globalHeightmapUrl`)

`Landscape` 인스턴스를 생성한 뒤 `globalHeightmapUrl`과 `heightScale`을 지정하고 `scene.landscape`에 할당하면 지형이 생성됩니다.

### 전역 하이트맵 (`globalHeightmapUrl`)의 역할

- **단독 지형 구성 및 원거리 베이스 (Macro Base)**: 별도의 타일 스트리밍 없이 `globalHeightmapUrl` 하나만으로도 전체 지형을 즉시 렌더링할 수
  있으며, [타일 스트리밍](./tile-streaming.md) 사용 시에는 아직 고해상도 타일이 로드되지 않은 원거리 지역의 기본 윤곽 (Fallback) 역할을 수행합니다.
- **16비트 (16-bit) PNG 정밀도 지원**: 일반 8비트 이미지 (256단계)에서 발생하는 계단 현상 (Terracing) 없이 매끄러운 경사면을 표현할 수 있도록 **16비트 그레이스케일 PNG (
  65,536단계)** 파싱을 기본 지원합니다.
- **즉각적인 고도 쿼리 및 생태계 연동**: 로드와 동시에 GPU 가상 아틀라스 (고도·법선)에 베이킹될 뿐 아니라 CPU 메모리에도 캐싱되어, 전 지역에서 `getHeightAt(x, z)` 고도 조회와 잔디
  (`Grass`)·식생 (`Foliage`) 배치가 즉시 작동합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 4000m x 4000m 월드 크기의 지형 생성 (단일 수치 또는 [width, depth] 배열)
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);

// 2. 전역 하이트맵(16비트 PNG 권장) 및 최대 고도 스케일(미터 단위) 설정
landscape.globalHeightmapUrl = './assets/terrain/global_heightmap_1024.png';
landscape.heightScale = 300;

// 3. Scene에 지형 등록
scene.landscape = landscape;
```

### 라이브 예제: 기본 지형 생성

<iframe src="/RedGPU/examples/3d/landscape/basicTerrain/" style="width:100%; height:500px;"></iframe>

---

## 2. 주요 설정 속성

| 분류             | 속성명                                                     | 기본값         | 설명                                                                      |
|:-----------------|:-----------------------------------------------------------|:---------------|:--------------------------------------------------------------------------|
| **크기 및 고도** | **`worldSize`**                                            | `[2000, 2000]` | 지형의 전체 가로·세로 월드 크기 (`number` 또는 `[sizeX, sizeZ]`)          |
|                  | **`heightScale`**                                          | `200.0`        | 정규화된 하이트맵(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일                |
|                  | **`globalHeightmapUrl`**                                   | `''`           | 전체 지형의 기본 고도를 제공하는 전역 하이트맵 이미지 경로                |
|                  | **`baseColor`**                                            | `'#387d42'`    | 스플래팅 레이어가 없을 때 사용되는 지형 기본 색상 (`ColorRGBA`)           |
| **LOD**          | **`lodMetric`**                                            | `'screenSize'` | LOD 결정 기준 (`'screenSize'` 화면 투영 비율 / `'distance'` 거리)         |
|                  | **`lodMaxLevel`**                                          | `5`            | 지형 메시에 사용할 최대 LOD 단계 수 (`1 ~ 8`)                             |
|                  | **`componentSizeQuads`** / **`lod0SizeQuads`**             | `64` / `256`   | 타일 컴포넌트 격자 해상도 및 LOD 0 기준 쿼드 해상도                       |
| **그림자**       | **`receiveShadow`**                                        | `true`         | 방향성 광원(`DirectionalLight`)의 CSM 그림자 수신 여부                    |
|                  | **`castHeightmapShadow`**                                  | `false`        | 하이트맵 레이마칭 기반의 원거리 지형 자체 그림자(Self-Shadow) 활성화 여부 |
|                  | **`heightmapShadowDistance`**                              | `1000.0`       | 하이트맵 자체 그림자 레이마칭의 최대 추적 거리 (`10.0` 이상)              |
|                  | **`heightmapShadowSteps`** / **`heightmapShadowSoftness`** | `16` / `8.0`   | 자체 그림자 레이마칭 스텝 수 (`4 ~ 64`) 및 경계 부드러움 계수             |

---

## 3. 지형 고도 조회 (`getHeightAt`) 및 디버거

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
- [지형과 호수 통합 (Landscape & Water)](/RedGPU/examples/3d/landscape/landscapeAndWater/)

---

[다음 단계: 다중 레이어 스플래팅 배우기](./material-splatting.md)
