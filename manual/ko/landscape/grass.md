---
title: Procedural Grass
order: 4
---

# 절차적 잔디

`RedGPU.Landscape.GrassManager`(`landscape.grassManager`)는 카메라 주변의 지형 표면 위에 수십만~수백만 개의 잔디 및 초목 클럼프를 **CPU 개입 없이 GPU 컴퓨트
셰이더에서 실시간 베이킹 및 컬링**하여 렌더링하는 시스템입니다.

## 1. 동작 원리 및 주요 특징

- **카메라 중심 16m 셀 GPU 베이킹**: 카메라가 일정 거리 (`16m` 셀 단위) 이상 이동할 때마다 GPU 컴퓨트 패스 (`GrassInstanceBaker`)가 VHT (고도), VNT (법선),
  VBT (지형 색상) 아틀라스와 스플래팅 가중치를 샘플링하여 잔디 인스턴스를 즉시 생성합니다.
- **양면 식생 PBR 및 서브서피스 스캐터링**: 얇은 풀잎을 통과하는 태양광의 투과광 (**Subsurface Scattering**)과 지형 바닥 색상이 풀뿌리로 자연스럽게 스며드는 **지면 블렌딩**
  (`groundBlendStrength`)을 지원합니다.
- **전역 바람 연동**: `scene.windManager`의 풍향·풍속에 따라 파도처럼 일렁이는 정점 바람 애니메이션이 자동 적용됩니다.

## 2. 잔디 타입 등록 (`grassManager.addType`)

잔디 클럼프 형태의 `Mesh`를 준비한 뒤 `landscape.grassManager.addType(options)`를 호출하여 등록합니다.

```javascript
// 잔디 메시를 사용하여 지형 잔디 타입 등록
const meadowGrass = landscape.grassManager.addType({
    name: 'MeadowGrass',
    mesh: grassBladeMesh,
    densityPerHectare: 80000,           // 헥타르당 80,000개 밀도
    cullingDistance: 100,               // 100m 거리까지 렌더링 (원거리 자동 스케일 페이드아웃)
    targetLayer: 'Grass',               // 'Grass' 지형 레이어 영역에만 생성
    maxSlope: 30,                       // 30도 이하 경사면에만 생성
    minScale: [0.8, 0.7],               // [가로, 높이] 최소 랜덤 스케일
    maxScale: [1.3, 1.4],               // [가로, 높이] 최대 랜덤 스케일
    roughness: 0.55,
    subsurfaceStrength: 0.35,           // 역광 투과(SSS) 강도
    subsurfaceColor: [0.35, 0.65, 0.15],
    groundBlendStrength: 0.85,          // 지형 VBT 색상과의 하단 블렌딩 강도
    receiveShadow: true,
    castShadow: false
});
```

## 3. `GrassOptions` 주요 설정 속성

| 속성명                             | 기본값                      | 설명                                                           |
|:-----------------------------------|:----------------------------|:---------------------------------------------------------------|
| **`name`**                         | 필수                        | 잔디 타입의 고유 식별 이름                                     |
| **`mesh`**                         | 필수                        | 잔디 지오메트리 및 기본 텍스처를 추출할 원본 `Mesh` 인스턴스   |
| **`baseColorTexture`**             | 메시 재질 참조              | 잔디 베이스 컬러 텍스처 경로 또는 `BitmapTexture`              |
| **`densityPerHectare`**            | `5000.0`                    | 헥타르(10,000㎡)당 기준 배치 밀도                              |
| **`densityMultiplier`**            | `1.0`                       | 기준 밀도에 곱해지는 밀도 배율                                 |
| **`cullingDistance`**              | `100.0`                     | 잔디가 렌더링되는 최대 카메라 거리                             |
| **`targetLayer`**                  | `''`                        | 배치 밀도를 참조할 `LandscapeLayer` 이름 또는 인덱스           |
| **`minSlope` / `maxSlope`**        | `0.0` / `35.0`              | 잔디가 자랄 수 있는 최소·최대 지형 경사각 (단위: 도)           |
| **`minScale` / `maxScale`**        | `[0.7, 0.7]` / `[1.3, 1.4]` | 인스턴스 랜덤 스케일 범위 (`[width, height]` 또는 `[x, y, z]`) |
| **`alphaCutoff`**                  | `0.2`                       | 텍스처 알파 마스크 컷오프 임계값 (`0.01 ~ 1.0`)                |
| **`roughness`**                    | `0.55`                      | 잔디 표면 거칠기 (`0.04 ~ 1.0`)                                |
| **`subsurfaceStrength`**           | `0.25`                      | 잎사귀 역광 투과(Subsurface Scattering) 강도 (`0.0 ~ 3.0`)     |
| **`subsurfaceColor`**              | `[0.35, 0.65, 0.15]`        | 서브서피스 스캐터링 RGB 색상 (`0.0 ~ 1.0`)                     |
| **`groundBlendStrength`**          | `1.0`                       | 지형 바닥 색상(VBT) 및 법선과의 하단 블렌딩 강도 (`0.0 ~ 1.0`) |
| **`receiveShadow` / `castShadow`** | `true` / `true`             | 그림자 수신 및 투사 여부                                       |

---

## 다음 단계

지형과 식생 구성을 마쳤다면, 지형과 맞닿아 굴절·커스틱 및 실시간 물결 파동 인터랙션을 수행하는 물리 기반 수체 시스템을 알아봅니다.

- **[수체 시스템 (Water)](../water/index.md)**
- **[물리 기반 호수 (Lake)](../water/lake.md)**
- **[전역 바람 시스템 (WindManager)](../environment/wind.md)**
