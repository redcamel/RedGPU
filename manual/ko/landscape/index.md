---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape (16km 오픈월드 지형)"]
        Landscape -->|타일 스트리밍| VHT["VHT / VNT 아틀라스 (가상 고도·법선 맵)"]
        Landscape -->|8레이어 스플래팅| Material["LandscapeMaterial 및 하이브리드 VBT"]
        Landscape -->|식생 산포| Foliage["FoliageManager (LOD 및 팔면체 임포스터)"]
        Landscape -->|잔디 산포| Grass["GrassManager (16m 셀 GPU 베이킹)"]
        VHT --> Culler["통합 GPU 컴퓨트 컬링 (절두체 + HZB)"]
        Culler --> Indirect["Multi-Draw Indirect 렌더링"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style VHT fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Culler fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Indirect fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# 대규모 지형 및 생태계

RedGPU의 **지형**(Landscape) 및 **생태계**(Ecosystem) 시스템은 16km × 16km 이상의 대규모 오픈월드 환경을 렌더링하는 GPU 기반 파이프라인입니다. 지형 타일, 식생
(`Foliage`), 잔디 (`Grass`)를 단일 통합 컴퓨트 패스 (Unified Compute Pass)에서 절두체 (Frustum) 및 계층적 Z-버퍼 (**HZB**) 오클루전 컬링 후 간접 드로우
(Indirect Draw) 방식으로 처리합니다.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

---

## 1. 핵심 구성 요소

| 구성 요소                     | 핵심 클래스                           | 주요 역할                                                                                                                                                                     |
|:------------------------------|:--------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **가상 하이트/노멀 텍스처**   | `Landscape`                           | 전역 하이트맵과 카메라 주변 타일 스트리밍을 결합해 고도(VHT)와 실시간 중앙 차분 법선(VNT)을 GPU 아틀라스로 관리합니다.                                                        |
| **연속적 지형 LOD 및 스커트** | `Landscape`                           | 화면 투영 비율(`screenSize`) 또는 거리(`distance`) 기준으로 최대 8단계 LOD를 결정하며, 정점 모핑과 경계 스커트로 팝핑 및 타일 균열을 방지합니다.                              |
| **하이브리드 스플래팅**       | `LandscapeMaterial`, `LandscapeLayer` | 근거리에서는 최대 8개 PBR 레이어와 스토캐스틱 타일링(Stochastic Tiling)을 실시간 블렌딩하고, 원거리에서는 사전 베이킹된 가상 블렌드 텍스처(VBT) 아틀라스를 단일 샘플링합니다. |
| **대규모 식생과 임포스터**    | `FoliageManager`, `Foliage`           | 서브 셀 스트리밍과 32바이트 압축 메가 버퍼를 사용하며, 원거리 식생을 런타임 베이킹된 **팔면체 임포스터**(Octahedral Impostor) 빌보드로 전환합니다.                            |
| **절차적 잔디**               | `GrassManager`, `Grass`               | 카메라 주변 16m 셀 단위로 GPU 컴퓨트 셰이더에서 잔디 인스턴스를 즉시 베이킹하고, 양면 식생 PBR 및 서브서피스 스캐터링을 적용합니다.                                           |

---

## 2. 학습 로드맵

1. **[지형 생성 및 스트리밍](./terrain.md)** : `Landscape` 초기화, 타일 스트리밍, 연속적 LOD, 고도 조회 (`getHeightAt`) 및 자체 그림자 설정
2. **[다중 레이어 스플래팅](./material-splatting.md)** : `LandscapeMaterial` 및 `LandscapeLayer` 를 활용한 8레이어 PBR 텍스처 블렌딩과 스토캐스틱 타일링
3. **[대규모 식생과 임포스터](./foliage.md)** : `FoliageManager` 를 통한 나무·바위 산포, 다단계 LOD 및 팔면체 임포스터 활용
4. **[절차적 잔디](./grass.md)** : `GrassManager` 를 통한 고밀도 초목 스캐터링 및 바람 연동

---

## 관련 예제

- [기본 지형 생성 (Basic Terrain)](/RedGPU/examples/3d/landscape/basicTerrain/)
- [타일 스트리밍 (Tile Streaming)](/RedGPU/examples/3d/landscape/tileStreaming/)
- [다중 레이어 스플래팅 (Multi-Layer Splatting)](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [대규모 식생과 임포스터 (Foliage & Impostors)](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [절차적 잔디 (Procedural Grass)](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)
