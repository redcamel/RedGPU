---
title: Multi-Layer Splatting
order: 2
---

# 다중 레이어 스플래팅

`RedGPU.Landscape.LandscapeMaterial`과 `RedGPU.Landscape.LandscapeLayer`는 지형 표면 위에 최대 **8개의 PBR 레이어**를 가중치 맵
(`weightTexture`)과 높이 블렌딩 (`heightBlendFactor`)에 따라 자연스럽게 합성하는 **다중 레이어 스플래팅**(Multi-Layer Splatting) 시스템을 제공합니다.

---

## 1. 스플래팅 레이어 등록 (`addLayer`)

`landscape.addLayer(options)`를 호출하여 최대 8개의 `LandscapeLayer`를 등록합니다. 첫 번째 (0번) 레이어는 기본 바탕 (Base Fallback) 레이어를 겸하며, 각
레이어는 `weightTexture`의 지정된 채널 (`'R' | 'G' | 'B' | 'A'`) 가중치에 따라 혼합됩니다.

- **`nearDetailDistance` 이내 (근거리)**: 고해상도 PBR 텍스처들과 스토캐스틱 타일링 (`stochasticTiling`)을 실시간 블렌딩합니다.
- **`nearDetailDistance` 이후 (원거리)**: 타일 스트리밍 시점에 사전 베이킹된 가상 블렌드 텍스처 (VBT) 아틀라스에서 단일 샘플링하여 대역폭을 절감합니다.

```javascript
// 근접 고해상도 텍스처 블렌딩이 유지되는 거리 설정 (월드 단위)
landscape.nearDetailDistance = 350;

const weightTexture = './assets/terrain/weightTexture.jpg';

// 1. 잔디(Grass) 레이어 추가 (스플랫 맵의 'R' 채널 사용)
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/terrain/layer/grass.jpg',
    normalTexture: './assets/terrain/layer/grass_normal.jpg',
    ormTexture: './assets/terrain/layer/grass_orm.jpg',
    weightTexture,
    weightChannel: 'R',
    uvScale: [25, 25],
    roughness: 0.85,
    stochasticTiling: true
});

// 2. 암석(Rock) 레이어 추가 (스플랫 맵의 'G' 채널 사용)
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/terrain/layer/rock.jpg',
    normalTexture: './assets/terrain/layer/rock_normal.jpg',
    ormTexture: './assets/terrain/layer/rock_orm.jpg',
    weightTexture,
    weightChannel: 'G',
    uvScale: [7.5, 7.5],
    roughness: 0.7,
    normalIntensity: 1.2,
    stochasticTiling: true
});
```

### 라이브 예제: 다중 레이어 스플래팅

<iframe src="/RedGPU/examples/3d/landscape/multiLayerSplatting/" style="width:100%; height:500px;"></iframe>

---

## 2. `LandscapeLayerOptions` 주요 속성

| 분류                 | 속성명                                    | 기본값                | 설명                                                                                 |
|:---------------------|:------------------------------------------|:----------------------|:-------------------------------------------------------------------------------------|
| **식별 및 상태**     | **`name`**                                | 필수                  | 레이어 고유 이름 (식생·잔디의 `targetLayer`와 연동)                                  |
|                      | **`enabled`**                             | `true`                | 레이어 활성화 여부                                                                   |
| **텍스처 및 가중치** | **`baseColorTexture`**                    | `undefined`           | 베이스 컬러(Albedo) 텍스처 경로 또는 `BitmapTexture`                                 |
|                      | **`normalTexture`**                       | `undefined`           | 탄젠트 공간 노멀 맵 경로 또는 `BitmapTexture`                                        |
|                      | **`ormTexture`**                          | `undefined`           | Occlusion(R), Roughness(G), Metallic(B), Height(A) 패킹 텍스처                       |
|                      | **`weightTexture`**                       | `undefined`           | 레이어 분포 가중치를 담은 스플랫 맵 텍스처                                           |
|                      | **`weightChannel`**                       | `'R'`                 | `weightTexture`에서 참조할 채널 (`'R' \| 'G' \| 'B' \| 'A'` 또는 `0 ~ 3`)            |
| **UV 및 타일링**     | **`uvScale`** / **`uvOffset`**            | `[20, 20]` / `[0, 0]` | 타일 대비 텍스처 UV 반복 배율 `[u, v]` 및 오프셋 `[u, v]`                            |
|                      | **`nearUVScaleMultiplier`**               | `2.0`                 | 근접 디테일 영역에 적용되는 UV 스케일 배율                                           |
|                      | **`stochasticTiling`**                    | `true`                | 넓은 면적의 텍스처 반복 무늬(Tiling Artifact)를 억제하는 스토캐스틱 샘플링 사용 여부 |
|                      | **`stochasticScale`**                     | `1.0`                 | 스토캐스틱 타일링 셀 스케일 (`0.01` 이상)                                            |
| **PBR 및 블렌딩**    | **`roughness`**                           | `1.0`                 | 표면 거칠기 계수                                                                     |
|                      | **`normalIntensity`** / **`aoIntensity`** | `1.0` / `1.0`         | 노멀 맵 요철 강도 및 앰비언트 오클루전(AO) 강도                                      |
|                      | **`heightBlendFactor`**                   | `1.0`                 | ORM 알파 채널(Height) 기반 레이어 경계 블렌딩 대비 계수 (`0.0 ~ 5.0`)                |

---

## 3. 레이어 조회 및 관리

등록된 레이어는 이름이나 인스턴스로 언제든 조회·수정하거나 제거할 수 있으며, 속성 변경 시 VBT 아틀라스와 생태계 가중치가 자동으로 갱신됩니다.

```javascript
// 이름으로 특정 레이어 조회 후 속성 변경
const layer = landscape.getLayer('Rock');
if (layer) {
    layer.uvScale = [15, 15];
    layer.heightBlendFactor = 1.5;
}

// 특정 레이어 제거 또는 전체 초기화
landscape.removeLayer('Rock');
// landscape.clearLayers();
```

---

## 관련 예제

- [다중 레이어 스플래팅 (Multi-Layer Splatting)](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 대규모 식생과 임포스터 배우기](./foliage.md)
