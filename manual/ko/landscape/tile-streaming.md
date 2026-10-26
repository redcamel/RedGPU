---
title: Tile Streaming
order: 3
---

# 타일 스트리밍 (Tile Streaming)

광활한 오픈월드 지형에서는 모든 지역의 고해상도 하이트맵을 한 번에 메모리에 적재하는 대신, 카메라 이동에 따라 필요한 주변 타일만 실시간으로 비동기 스트리밍 (`tileUrlResolver`)할 수 있습니다.

---

## 1. 전역 하이트맵과 타일 스트리밍 구성

타일 스트리밍은 **전역 하이트맵 (`globalHeightmapUrl`)** 과 **개별 고해상도 타일 (`tileUrlResolver`)** 의 2계층 구조로 동작합니다.

1. **`globalHeightmapUrl` (원거리 기본 윤곽)**: 아직 고해상도 타일이 로드되지 않은 원거리 영역 (`tileLoadingRadius` 바깥)의 빈 공간을 채워주는 기본 지형 고도 역할을
   합니다.
2. **`tileUrlResolver` (근거리 고해상도 디테일)**: 카메라가 `tileLoadingRadius` 반경에 진입할 때, 16×16 (256개) 그리드 좌표 (`row: 0~15`,
   `col: 0~15`)에 해당하는 고해상도 (16비트 PNG 권장) 타일 하이트맵을 비동기로 로드하여 가상 아틀라스 (VHT/VNT/VBT)의 해당 타일 슬롯에 부분 베이킹합니다.

```javascript
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
landscape.heightScale = 300;

// 1. 미로드 원거리 영역의 기본 윤곽을 담당하는 전역 하이트맵 설정
landscape.globalHeightmapUrl = './assets/terrain/global_heightmap_1024.png';

// 2. 카메라 반경 1250m 이내의 타일을 프레임당 최대 2개씩 비동기 스트리밍
landscape.tileLoadingRadius = 1250;
landscape.tileMaxLoadsPerFrame = 2;

// 3. 16x16 그리드 좌표(row, col)에 대응하는 16비트 PNG 타일 URL 반환 콜백
landscape.tileUrlResolver = (row, col) => {
    const r = String(row).padStart(2, '0');
    const c = String(col).padStart(2, '0');
    return `./assets/tiles/height_tile_${r}_${c}.png`;
};

scene.landscape = landscape;
```

### 라이브 예제: 타일 스트리밍

<iframe src="/RedGPU/examples/3d/landscape/tileStreaming/" style="width:100%; height:500px;"></iframe>

---

## 2. 타일 스트리밍 주요 속성 및 메서드

| 구분       | 속성 / 메서드                | 기본값    | 설명                                                                                   |
|:-----------|:-----------------------------|:----------|:---------------------------------------------------------------------------------------|
| **속성**   | **`tileUrlResolver`**        | `null`    | 타일의 행(`row`)과 열(`col`) 인덱스를 받아 타일 하이트맵 URL을 반환하는 콜백 함수      |
|            | **`tileLoadingRadius`**      | `2500.0`  | 카메라 위치를 중심으로 고해상도 타일을 스트리밍 로드할 반경 (월드 단위)                |
|            | **`tileMaxLoadsPerFrame`**   | `1`       | 프레임 스파이크 방지를 위해 단일 프레임당 동시에 디코딩·베이킹을 시작할 최대 타일 개수 |
|            | **`tileLoadedCount`**        | 읽기 전용 | 현재까지 스트리밍 로드가 완료되어 활성화된 타일의 총개수                               |
| **메서드** | **`isTileLoaded(row, col)`** | -         | 특정 행(`row`)과 열(`col`) 타일의 고해상도 하이트맵 로드 완료 여부(`boolean`) 반환     |

---

## 관련 예제

- [타일 스트리밍 (Tile Streaming)](/RedGPU/examples/3d/landscape/tileStreaming/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 절차적 잔디 배우기](./grass.md)
