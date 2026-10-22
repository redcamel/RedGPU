---
title: Multi-Layer Splatting
order: 2
---

# 다중 레이어 스플래팅

`RedGPU.Landscape.LandscapeMaterial`과 `RedGPU.Landscape.LandscapeLayer`는 지형 표면 위에 최대 **8개의 PBR 레이어**를 가중치 맵 (Weight Map)
및 고도·경사도에 따라 자연스럽게 합성하는 **다중 레이어 스플래팅**(Multi-Layer Splatting) 시스템을 제공합니다.

## 1. 하이브리드 렌더링 아키텍처 (Near Detail + VBT)

대규모 지형에서 8개 레이어의 텍스처 (BaseColor, Normal, ORM)를 모든 픽셀마다 샘플링하면 심각한 GPU 텍스처 대역폭 병목이 발생합니다. RedGPU는 이를 해결하기 위해 **하이브리드 VBT**
(Virtual Blend Texture) 파이프라인을 사용합니다.

- **근거리 (`nearDetailDistance` 이내)**: 고해상도 PBR 레이어들과 **스토캐스틱 타일링**(Stochastic Tiling)을 실시간으로 블렌딩하여 선명한 표면 디테일을 표현합니다.
- **원거리 (`nearDetailDistance` 이후)**: 타일 스트리밍 시점에 사전 베이킹된 **가상 블렌드 텍스처**(VBT) 아틀라스에서 단 한 번의 샘플링만으로 색상을 가져와 렌더링 비용을 획기적으로
  낮춥니다.

```javascript
// 근접 고해상도 텍스처 블렌딩이 유지되는 거리 설정 (월드 단위)
landscape.nearDetailDistance = 350;
```

## 2. 스플래팅 레이어 추가 (`addLayer`)

`landscape.addLayer(options)` 메서드를 호출하여 최대 8개의 `LandscapeLayer`를 순차적으로 등록할 수 있습니다. 첫 번째 레이어는 기본 베이스 레이어로 동작하며, 이후 레이어들은
`weightTexture`(스플랫 맵)의 지정된 채널 (`weightChannel`) 가중치에 따라 혼합됩니다.

```javascript
// 1. 기본 토양(Dirt) 베이스 레이어 추가
const dirtLayer = landscape.addLayer({
    name: 'Dirt',
    baseColorTexture: './assets/terrain/dirt_diff.ktx2',
    normalTexture: './assets/terrain/dirt_norm.ktx2',
    ormTexture: './assets/terrain/dirt_orm.ktx2',
    uvScale: 40,
    roughnessFactor: 0.85,
    stochasticTiling: true
});

// 2. 잔디(Grass) 레이어 추가 (스플랫 맵의 R 채널: 0 사용)
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/terrain/grass_diff.ktx2',
    normalTexture: './assets/terrain/grass_norm.ktx2',
    ormTexture: './assets/terrain/grass_orm.ktx2',
    weightTexture: './assets/terrain/splat_map.png',
    weightChannel: 0, // 0: R, 1: G, 2: B, 3: A
    uvScale: 60,
    roughnessFactor: 0.7,
    stochasticTiling: true
});

// 3. 암석(Rock) 레이어 추가 (스플랫 맵의 G 채널: 1 사용)
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/terrain/rock_diff.ktx2',
    normalTexture: './assets/terrain/rock_norm.ktx2',
    ormTexture: './assets/terrain/rock_orm.ktx2',
    weightTexture: './assets/terrain/splat_map.png',
    weightChannel: 1,
    uvScale: 25,
    normalStrength: 1.4,
    stochasticTiling: true
});
```

## 3. `LandscapeLayerOptions` 주요 속성

| 속성명                 | 기본값    | 설명                                                                                   |
|:-----------------------|:----------|:---------------------------------------------------------------------------------------|
| **`name`**             | `'Layer'` | 레이어 고유 식별 이름 (식생·잔디의 `targetLayer`와 연동)                               |
| **`baseColorTexture`** | `null`    | 베이스 컬러(Albedo) 텍스처 경로 또는 `BitmapTexture`                                   |
| **`normalTexture`**    | `null`    | 탄젠트 공간 노멀 맵 경로 또는 `BitmapTexture`                                          |
| **`ormTexture`**       | `null`    | Occlusion(R), Roughness(G), Metallic(B) 패킹 텍스처                                    |
| **`weightTexture`**    | `null`    | 레이어 분포 가중치를 담은 스플랫 맵 텍스처                                             |
| **`weightChannel`**    | `0`       | `weightTexture`에서 참조할 채널 인덱스 (`0`: R, `1`: G, `2`: B, `3`: A)                |
| **`uvScale`**          | `10.0`    | 지형 타일 대비 텍스처 UV 반복 배율 (`number` 또는 `[u, v]`)                            |
| **`normalStrength`**   | `1.0`     | 노멀 맵 요철 강도 배율                                                                 |
| **`roughnessFactor`**  | `0.8`     | 표면 거칠기 계수 (`0.0 ~ 1.0`)                                                         |
| **`metallicFactor`**   | `0.0`     | 금속성 계수 (`0.0 ~ 1.0`)                                                              |
| **`aoFactor`**         | `1.0`     | 앰비언트 오클루전 강도 계수                                                            |
| **`stochasticTiling`** | `false`   | 넓은 면적의 텍스처 반복 무늬(Tiling Artifact)를 제거하는 스토캐스틱 샘플링 활성화 여부 |

## 4. 레이어 조회 및 관리

등록된 레이어는 이름이나 인스턴스로 언제든 조회·수정하거나 제거할 수 있으며, 속성 변경 시 VBT 아틀라스와 생태계 가중치가 자동으로 재계산됩니다.

```javascript
// 이름으로 특정 레이어 조회 후 속성 변경
const layer = landscape.getLayer('Rock');
if (layer) {
    layer.uvScale = 30;
    layer.normalStrength = 1.6;
}

// 특정 레이어 제거 또는 전체 초기화
landscape.removeLayer('Rock');
// landscape.clearLayers();
```

---

## 다음 단계

지형 레이어 가중치 (`targetLayer`)와 경사도를 기반으로 수만 그루의 나무와 바위를 배치하는 식생 시스템을 알아봅니다.

- **[대규모 식생과 임포스터](./foliage.md)**
