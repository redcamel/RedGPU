---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape (16km Open World)"]
        Landscape -->|Tile Streaming| VHT["VHT / VNT Atlas (Virtual Height & Normal)"]
        Landscape -->|8-Layer PBR| Material["LandscapeMaterial & Hybrid VBT"]
        Landscape -->|Scatter| Foliage["FoliageManager (LOD & Octahedral Impostor)"]
        Landscape -->|Scatter| Grass["GrassManager (16m Cell GPU Baking)"]
        VHT --> Culler["Unified GPU Compute Culler (Frustum + HZB)"]
        Culler --> Indirect["Multi-Draw Indirect Rendering"]

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

RedGPU는 수십 제곱킬로미터 (16km × 16km 이상) 규모의 오픈월드 환경을 60 FPS로 렌더링하기 위해 GPU 기반의 **지형**(Landscape) 및 **생태계**(Ecosystem) 파이프라인을
제공합니다.

CPU 병목을 제거하기 위해 지형 타일, 수십만 그루의 나무 (`Foliage`), 수백만 개의 잔디 (`Grass`)가 모두 **단일 통합 컴퓨트 패스**(Unified Compute Pass)에서 절두체
(Frustum) 및 계층적 Z-버퍼 (**HZB**) 오클루전 컬링을 거친 뒤 **간접 드로우**(Indirect Draw) 방식으로 렌더링됩니다.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

## 1. 핵심 아키텍처

- **가상 하이트/노멀 텍스처**(Virtual Height & Normal Texture, VHT/VNT): 전역 하이트맵과 카메라 주변 타일 스트리밍을 결합하여 대규모 고도 데이터를 GPU 아틀라스로 관리하고
  실시간 중앙 차분 법선 (Central Difference Normal)을 베이킹합니다.
- **연속적 지형 LOD 및 스커트**(Continuous LOD & Skirt): 카메라 화면 크기 (`screenSize`) 또는 거리 (`distance`) 기준으로 최대 8단계 LOD를 결정하며, 정점 모핑
  (Vertex Morphing)과 경계 스커트 지오메트리를 통해 팝핑 (Popping)과 타일 간 균열 (Crack)을 원천 차단합니다.
- **하이브리드 다중 레이어 스플래팅**(Hybrid Multi-Layer Splatting): 근거리에서는 최대 8개의 PBR 레이어와 **스토캐스틱 타일링**(Stochastic Tiling)을 실시간
  블렌딩하고, 원거리에서는 사전 베이킹된 **가상 블렌드 텍스처**(Virtual Blend Texture, VBT) 아틀라스를 단일 샘플링하여 대역폭을 절감합니다.
- **식생 및 팔면체 임포스터**(Foliage & Octahedral Impostor): 서브 셀 단위 스트리밍과 32바이트 압축 메가 버퍼를 사용하며, 원거리 식생은 런타임에 자동 베이킹되는 **팔면체
  임포스터**(Octahedral Impostor) 빌보드로 전환하여 드로우 콜을 최소화합니다.
- **절차적 잔디**(Procedural Grass): 카메라 주변 16m 셀 단위로 GPU 컴퓨트 셰이더에서 인스턴스를 즉시 베이킹하고, 양면 식생 PBR (**Two-Sided Foliage PBR**) 및
  서브서피스 스캐터링을 적용합니다.

## 2. 학습 로드맵

1. **[지형 생성 및 스트리밍](./terrain.md)** : `Landscape` 초기화, 타일 스트리밍, 연속적 LOD, 고도 조회 (`getHeightAt`) 및 자체 그림자 설정
2. **[다중 레이어 스플래팅](./material-splatting.md)** : `LandscapeMaterial` 및 `LandscapeLayer`를 활용한 8레이어 PBR 텍스처 블렌딩과 스토캐스틱 타일링
3. **[대규모 식생과 임포스터](./foliage.md)** : `FoliageManager`를 통한 나무·바위 산포, 다단계 LOD 및 팔면체 임포스터 활용
4. **[절차적 잔디](./grass.md)** : `GrassManager`를 통한 고밀도 초목 스캐터링 및 바람 연동

---

## 관련 예제

- [기본 지형 생성 (Basic Terrain)](/RedGPU/examples/3d/landscape/basicTerrain/)
- [타일 스트리밍 (Tile Streaming)](/RedGPU/examples/3d/landscape/tileStreaming/)
- [다중 레이어 스플래팅 (Multi-Layer Splatting)](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [대규모 식생과 임포스터 (Foliage & Impostors)](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [절차적 잔디 (Procedural Grass)](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 지형 생성 및 스트리밍 배우기](./terrain.md)
