---
title: Foliage & Impostors
order: 3
---

# 대규모 식생과 임포스터

`FoliageManager` (`landscape.foliageManager`)는 지형 위에 나무, 바위, 관목 등 수만~수십만 개의 3D 메시를 서브 셀 단위로 스트리밍하고, 거리별 다단계 메시 LOD와
**팔면체 임포스터**(Octahedral Impostor)를 결합하여 렌더링합니다.

## 1. 동작 원리 및 주요 특징

- **서브 셀 스트리밍 및 32바이트 메가 버퍼**: 카메라 이동에 따라 주변 서브 셀 (Sub-Cell)만 마운트하며, 각 인스턴스의 위치·회전·스케일 데이터를 32바이트로 압축하여 단일
  `FoliageMegaBuffer` 에 적재합니다.
- **팔면체 임포스터 자동 베이킹**: `useImpostor: true`(기본값) 설정 시, 마지막 3D 메시 LOD 거리 너머의 원거리 식생들을 다각도 반구형 아틀라스 (Albedo + Normal/Depth)
  로 자동 베이킹하여 쿼드 빌보드로 렌더링합니다.
- **지형 레이어 및 경사도 연동**: `targetLayer` 와 `minSlope`·`maxSlope` 를 통해 지정된 스플래팅 레이어 및 경사도 조건에 맞는 영역에만 식생을 자동 배치합니다.

---

## 2. 식생 타입 등록

`GLTFLoader` 또는 `Mesh` 로 준비한 모델을 `landscape.foliageManager.addType(options)` 에 전달하여 식생 타입 (`Foliage`)을 등록합니다.

```javascript
// glTF 나무 모델 로드 후 식생 타입으로 등록하는 예시
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/foliage/pine_tree.glb',
    (loader) => {
        const treeMesh = loader.resultMesh;

        const pineFoliage = landscape.foliageManager.addType({
            name: 'PineTree',
            lods: [
                { mesh: treeMesh, lodDistance: 120 } // 0 ~ 120m: 원본 3D 메시 렌더링
            ],
            useImpostor: true,          // 120m ~ cullingDistance: 팔면체 임포스터 자동 전환
            cullingDistance: 1500,      // 최대 가시 거리 (1500m)
            shadowCullDistance: 150,    // 그림자 투사 거리 (150m)
            densityPerHectare: 150,     // 헥타르(100m x 100m)당 기준 밀도
            targetLayer: 'Grass',       // 'Grass' 지형 레이어 가중치에 비례하여 배치
            minSlope: 0,
            maxSlope: 35,               // 35도 이하의 완만한 경사면에만 배치
            minScale: [0.8, 0.8, 0.8],
            maxScale: [1.3, 1.4, 1.3],
            trunkBendScale: 1.0,        // 바람에 의한 기둥 흔들림 배율
            leafFlutterScale: 1.0       // 바람에 의한 잎사귀 떨림 배율
        });
    }
);
```

---

## 3. `FoliageOptions` 주요 속성

| 속성명                             | 기본값          | 설명                                                                     |
|:-----------------------------------|:----------------|:-------------------------------------------------------------------------|
| **`name`**                         | 필수            | 식생 타입의 고유 식별 이름                                               |
| **`lods`**                         | 필수            | 거리별 LOD 구성 배열 (`[{ mesh, lodDistance, receiveShadow }]`)          |
| **`useImpostor`**                  | `true`          | 원거리 팔면체 임포스터(Octahedral Impostor) 자동 베이킹 및 사용 여부     |
| **`cullingDistance`**              | `200.0`         | 인스턴스가 렌더링되는 카메라로부터의 최대 가시 거리                      |
| **`shadowCullDistance`**           | `50.0`          | 그림자 패스에서 그림자를 생성할 최대 거리                                |
| **`castShadow` / `receiveShadow`** | `true` / `true` | 그림자 투사 및 수신 활성화 여부                                          |
| **`densityPerHectare`**            | `1000.0`        | 헥타르(10,000㎡)당 기준 배치 밀도                                        |
| **`densityMultiplier`**            | `1.0`           | 기준 밀도에 곱해지는 실시간 밀도 배율                                    |
| **`targetLayer`**                  | `''`            | 분포 확률을 참조할 `LandscapeLayer` 의 이름 또는 인덱스                  |
| **`minSlope` / `maxSlope`**        | `0.0` / `45.0`  | 배치 가능한 최소·최대 지형 경사각 (단위: 도)                             |
| **`minScale` / `maxScale`**        | `[1, 1, 1]`     | 인스턴스별 랜덤 스케일 범위 `[x, y, z]`                                  |
| **`alignToNormal`**                | `false`         | 지형 표면의 법선(Normal) 기울기에 맞춰 인스턴스를 회전 정렬할지 여부     |
| **`groundBlendStrength`**          | `1.0`           | 식생 밑동과 지형 표면 색상·법선을 자연스럽게 섞어주는 강도 (`0.0 ~ 1.0`) |
| **`trunkBendScale`**               | `1.0`           | `scene.windManager` 바람에 반응하는 기둥 휘어짐 강도 배율                |
| **`leafFlutterScale`**             | `1.0`           | `scene.windManager` 바람에 반응하는 잎사귀 흔들림 강도 배율              |

---

## 관련 예제

- [대규모 식생과 임포스터 (Foliage & Impostors)](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

## 다음 단계

- **[절차적 잔디](./grass.md)** : 지표면을 채우는 고밀도 잔디 스캐터링 시스템
