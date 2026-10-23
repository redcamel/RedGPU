---
title: Foliage & Impostors
order: 3
---

# 대규모 식생과 임포스터

`RedGPU.Landscape.FoliageManager`는 지형 위에 나무, 바위, 관목 등 수만~수십만 개의 3D 메시를 서브 셀 (Sub-Cell) 단위로 스트리밍하고, 거리별 다단계 메시 LOD와 **팔면체
임포스터**(Octahedral Impostor)를 결합하여 고속으로 렌더링합니다.

---

## 1. 식생 타입 등록 (`foliageManager.addType`)

`GLTFLoader` 또는 `Mesh`로 준비한 모델을 `landscape.foliageManager.addType(options)`에 전달하여 식생 타입 (`Foliage`)을 등록합니다.

- **`lods`**: 카메라 거리에 따라 순차 전환될 3D 메시 LOD 배열 (`[{ mesh, lodDistance }]`)을 지정합니다.
- **`useImpostor: true` (기본값)**: 마지막 3D 메시 LOD 거리 너머부터 `cullingDistance` 구간까지는 엔진이 런타임에 자동 베이킹한 **팔면체 임포스터**(Octahedral
  Impostor) 빌보드로 전환하여 드로우 콜을 최소화합니다.
- **`targetLayer`**: 특정 지형 스플래팅 레이어 (예: `'Grass'`)의 가중치가 높은 영역에만 식생을 자동 분포시킵니다.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/terrain/pine_tree.glb',
    (loader) => {
        const treeMesh = loader.resultMesh;

        const pineFoliage = landscape.foliageManager.addType({
            name: 'PineTree',
            lods: [
                { mesh: treeMesh, lodDistance: 120 } // 0 ~ 120m: 3D 메시 렌더링
            ],
            useImpostor: true,          // 120m ~ cullingDistance: 팔면체 임포스터 자동 전환
            cullingDistance: 4000,      // 최대 가시 거리 (4000m)
            shadowCullDistance: 150,    // 그림자 투사 거리 (150m)
            densityPerHectare: 120,     // 헥타르(10,000㎡)당 목표 인스턴스 밀도
            targetLayer: 'Grass',       // 'Grass' 지형 레이어 가중치에 비례하여 배치
            minSlope: 0,
            maxSlope: 35,               // 35도 이하 경사면에만 배치
            minScale: [0.4, 0.4, 0.4],
            maxScale: [0.7, 0.75, 0.7],
            trunkBendScale: 1.0,        // 전역 바람(scene.windManager)에 의한 기둥 흔들림 배율
            leafFlutterScale: 1.0       // 전역 바람에 의한 잎사귀 떨림 배율
        });
    }
);
```

### 라이브 예제: 대규모 식생과 임포스터

<iframe src="/RedGPU/examples/3d/landscape/foliageAndImpostors/" style="width:100%; height:500px;"></iframe>

---

## 2. `FoliageOptions` 주요 설정 속성

| 분류                    | 속성명                                        | 기본값          | 설명                                                                  |
|:------------------------|:----------------------------------------------|:----------------|:----------------------------------------------------------------------|
| **식별 및 LOD**         | **`name`**                                    | 필수            | 식생 타입의 고유 식별 이름                                            |
|                         | **`lods`**                                    | 필수            | 거리별 LOD 구성 배열 (`[{ mesh, lodDistance, receiveShadow }]`)       |
|                         | **`useImpostor`**                             | `true`          | 원거리 팔면체 임포스터(Octahedral Impostor) 자동 베이킹 및 사용 여부  |
|                         | **`cullingDistance`**                         | `200.0`         | 인스턴스가 렌더링되는 카메라로부터의 최대 가시 거리                   |
| **밀도 및 배치**        | **`densityPerHectare`**                       | `1000.0`        | 헥타르(10,000㎡)당 기준 배치 밀도                                     |
|                         | **`densityMultiplier`**                       | `1.0`           | 기준 밀도에 곱해지는 실시간 밀도 배율                                 |
|                         | **`targetLayer`**                             | `''`            | 분포 확률을 참조할 `LandscapeLayer`의 이름 또는 인덱스                |
|                         | **`densityScaleByWeight`**                    | `true`          | `targetLayer`의 가중치에 비례하여 밀도를 스케일링할지 여부            |
| **트랜스폼 및 경사**    | **`minSlope`** / **`maxSlope`**               | `0.0` / `45.0`  | 배치 가능한 최소·최대 지형 경사각 (단위: 도)                          |
|                         | **`minScale`** / **`maxScale`**               | `[1, 1, 1]`     | 인스턴스별 랜덤 스케일 범위 `[x, y, z]`                               |
|                         | **`alignToNormal`** / **`alignFactor`**       | `false` / `1.0` | 지형 표면 법선(Normal) 기울기에 맞춰 회전 정렬할지 여부 및 정렬 강도  |
|                         | **`bottomOffset`**                            | `0.0`           | 지형 표면 대비 인스턴스 수직(Y) 오프셋                                |
| **지면 블렌딩 및 바람** | **`groundBlendStrength`**                     | `1.0`           | 식생 밑동과 지형 표면 색상·법선을 섞어주는 강도 (`0.0 ~ 1.0`)         |
|                         | **`trunkBendScale`** / **`leafFlutterScale`** | `1.0` / `1.0`   | `scene.windManager` 바람에 반응하는 기둥 휘어짐 및 잎사귀 흔들림 배율 |
| **그림자**              | **`castShadow`** / **`receiveShadow`**        | `true` / `true` | 그림자 투사 및 수신 활성화 여부                                       |
|                         | **`shadowCullDistance`**                      | `50.0`          | 그림자 패스에서 그림자를 생성할 최대 거리                             |

---

## 관련 예제

- [대규모 식생과 임포스터 (Foliage & Impostors)](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 절차적 잔디 배우기](./grass.md)
