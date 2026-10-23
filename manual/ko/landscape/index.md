---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape"]
        Landscape --> Terrain["1. Terrain (Global Heightmap & LOD)"]
        Landscape --> Material["2. Multi-Layer Splatting (LandscapeMaterial)"]
        Landscape --> Streaming["3. Tile Streaming (On-Demand Tiles)"]
        Landscape --> Grass["4. Procedural Grass (GrassManager)"]
        Landscape --> Foliage["5. Foliage & Impostors (FoliageManager)"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Terrain fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Streaming fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# 대규모 지형 및 생태계 (Landscape & Ecosystem)

<img src="/RedGPU/manual/landscape/landscape.jpg" alt="Landscape" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:16px;" />

RedGPU는 수십 제곱킬로미터 규모의 오픈월드 환경을 60 FPS로 렌더링하기 위해 GPU 기반의 **지형**(`Landscape`) 및 **생태계**(`GrassManager`, `FoliageManager`)
시스템을 제공합니다.

지형 타일, 수백만 개의 잔디 (`Grass`), 수십만 그루의 나무 (`Foliage`)가 모두 GPU 컴퓨트 패스에서 절두체 (Frustum) 및 계층적 Z-버퍼 (**HZB**) 오클루전 컬링을 거친 뒤 간접
드로우 (Indirect Draw) 방식으로 고속 렌더링됩니다.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

---

## 구성 요소 요약

| 순서  | 구성 요소                                                                   | 핵심 클래스                           | 주요 기능                                                                                                |
|:-----:|:----------------------------------------------------------------------------|:--------------------------------------|:---------------------------------------------------------------------------------------------------------|
| **1** | **[기본 지형 (Terrain)](./terrain.md)**                                     | `Landscape`                           | 전역 하이트맵(16비트 PNG 지원), 연속적 LOD 모핑, 고도 조회(`getHeightAt`), 하이트맵 레이마칭 자체 그림자 |
| **2** | **[다중 레이어 스플래팅 (Multi-Layer Splatting)](./material-splatting.md)** | `LandscapeMaterial`, `LandscapeLayer` | 단일 RGBA 가중치 맵 기반 최대 8개 PBR 레이어 블렌딩, 스토캐스틱 타일링, 원거리 가상 블렌드 텍스처(VBT)   |
| **3** | **[타일 스트리밍 (Tile Streaming)](./tile-streaming.md)**                   | `LandscapeTileStreamer`               | 카메라 반경(`tileLoadingRadius`) 기반 고해상도 16비트 타일 온디맨드 비동기 스트리밍(`tileUrlResolver`)   |
| **4** | **[절차적 잔디 (Procedural Grass)](./grass.md)**                            | `GrassManager`, `Grass`               | 카메라 주변 16m 셀 단위 GPU 실시간 베이킹, 양면 식생 PBR 및 서브서피스 스캐터링, 지면 색상 블렌딩        |
| **5** | **[대규모 식생과 임포스터 (Foliage & Impostors)](./foliage.md)**            | `FoliageManager`, `Foliage`           | 나무·바위 서브 셀 스트리밍, 다단계 메시 LOD, 원거리 팔면체 임포스터(Octahedral Impostor) 자동 전환       |

---

## 관련 예제

- [기본 지형 생성 (Basic Terrain)](/RedGPU/examples/3d/landscape/basicTerrain/)
- [다중 레이어 스플래팅 (Multi-Layer Splatting)](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [타일 스트리밍 (Tile Streaming)](/RedGPU/examples/3d/landscape/tileStreaming/)
- [절차적 잔디 (Procedural Grass)](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [대규모 식생과 임포스터 (Foliage & Impostors)](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [지형과 호수 통합 (Landscape & Water)](/RedGPU/examples/3d/landscape/landscapeAndWater/)
- [오픈월드 통합 (Open World Integration)](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[다음 단계: 기본 지형 (Terrain) 배우기](./terrain.md)
