---
title: Procedural Grass
order: 4
---

# 절차적 잔디 (Procedural Grass)

`RedGPU.Landscape.GrassManager`는 카메라 주변의 지형 표면 위에 수십만~수백만 개의 잔디 및 초목 클럼프를 **GPU 컴퓨트 셰이더에서 16m 셀 단위로 실시간 베이킹 및 컬링**하여
렌더링하는 시스템입니다.

---

## 1. 잔디 타입 등록 (`grassManager.addType`)

잔디 클럼프 형태의 `Mesh`를 준비한 뒤 `landscape.grassManager.addType(options)`를 호출하여 등록합니다. 복수 종류의 잔디나 들꽃을 함께 배치하려면 `addType()`을 추가로
호출합니다.

- **양면 식생 PBR 및 서브서피스 스캐터링**: 풀잎을 통과하는 태양광의 투과광 (`subsurfaceStrength`, `subsurfaceColor`)과 지형 바닥 색상이 풀뿌리로 자연스럽게 스며드는 지면
  블렌딩 (`groundBlendStrength`)을 지원합니다.
- **전역 바람 연동**: `scene.windManager`의 풍향·풍속에 따라 일렁이는 정점 바람 애니메이션이 자동 적용됩니다.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/terrain/grass.glb',
    (loader) => {
        const grass = landscape.grassManager.addType({
            name: 'Lawn Clump',
            mesh: loader.resultMesh,            // 인스턴싱할 잔디 클럼프 Mesh
            densityPerHectare: 20000,           // 헥타르(10,000㎡)당 20,000개 밀도
            cullingDistance: 110,               // 최대 가시 거리 (110m)
            targetLayer: 'Grass',               // 'Grass' 지형 레이어 영역에만 생성
            maxSlope: 35,                       // 35도 이하 경사면에만 생성
            minScale: [12.0, 8.0, 12.0],        // 최소 랜덤 스케일 [x, y, z]
            maxScale: [18.0, 12.0, 18.0],       // 최대 랜덤 스케일 [x, y, z]
            roughness: 0.55,
            subsurfaceStrength: 0.35,           // 역광 투과(SSS) 강도
            subsurfaceColor: [0.35, 0.65, 0.15],
            groundBlendStrength: 0.85,          // 지형 바닥(VBT) 색상과의 하단 블렌딩 강도
            receiveShadow: true,
            castShadow: true
        });
    }
);
```

### 라이브 예제: 절차적 잔디

<iframe src="/RedGPU/examples/3d/landscape/proceduralGrass/" style="width:100%; height:500px;"></iframe>

---

## 2. `GrassOptions` 주요 설정 속성

| 분류                 | 속성명                                 | 기본값                      | 설명                                                               |
|:---------------------|:---------------------------------------|:----------------------------|:-------------------------------------------------------------------|
| **식별 및 메시**     | **`name`**                             | 필수                        | 잔디 타입의 고유 식별 이름                                         |
|                      | **`mesh`**                             | 필수                        | 잔디 지오메트리 및 기본 텍스처를 추출할 원본 `Mesh` 인스턴스       |
|                      | **`baseColorTexture`**                 | 메시 재질 참조              | 잔디 베이스 컬러 텍스처 경로 또는 `BitmapTexture`                  |
| **밀도 및 컬링**     | **`densityPerHectare`**                | `5000.0`                    | 헥타르(10,000㎡)당 기준 배치 밀도                                  |
|                      | **`densityMultiplier`**                | `1.0`                       | 기준 밀도에 곱해지는 실시간 밀도 배율                              |
|                      | **`cullingDistance`**                  | `100.0`                     | 잔디가 렌더링되는 최대 카메라 거리 (원거리 자동 스케일 페이드아웃) |
|                      | **`targetLayer`**                      | `''`                        | 배치 밀도를 참조할 `LandscapeLayer` 이름 또는 인덱스               |
| **트랜스폼 및 경사** | **`minSlope`** / **`maxSlope`**        | `0.0` / `35.0`              | 잔디가 자랄 수 있는 최소·최대 지형 경사각 (단위: 도)               |
|                      | **`minScale`** / **`maxScale`**        | `[0.7, 0.7]` / `[1.3, 1.4]` | 인스턴스 랜덤 스케일 범위 (`[width, height]` 또는 `[x, y, z]`)     |
|                      | **`bottomOffset`**                     | `0.0`                       | 지형 표면 대비 인스턴스 수직(Y) 오프셋                             |
| **재질 및 PBR**      | **`alphaCutoff`**                      | `0.2`                       | 텍스처 알파 마스크 컷오프 임계값 (`0.01 ~ 1.0`)                    |
|                      | **`roughness`**                        | `0.55`                      | 잔디 표면 거칠기 (`0.04 ~ 1.0`)                                    |
|                      | **`subsurfaceStrength`**               | `0.25`                      | 잎사귀 역광 투과(Subsurface Scattering) 강도 (`0.0 ~ 3.0`)         |
|                      | **`subsurfaceColor`**                  | `[0.35, 0.65, 0.15]`        | 서브서피스 스캐터링 RGB 색상 (`0.0 ~ 1.0`)                         |
|                      | **`exposureBoost`**                    | `1.0`                       | 밝기 노출 부스트 배율                                              |
|                      | **`groundBlendStrength`**              | `1.0`                       | 지형 바닥 색상(VBT) 및 법선과의 하단 블렌딩 강도 (`0.0 ~ 1.0`)     |
| **그림자**           | **`receiveShadow`** / **`castShadow`** | `true` / `true`             | 그림자 수신 및 투사 여부                                           |
|                      | **`shadowStrength`**                   | `1.0`                       | 수신된 그림자의 어두움 강도 (`0.0 ~ 1.0`)                          |

---

## 관련 예제

- [절차적 잔디 (Procedural Grass)](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 대규모 식생과 임포스터 배우기](./foliage.md)
