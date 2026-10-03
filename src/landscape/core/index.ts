/**
 * [KO] Landscape 지형 렌더링 엔진의 핵심 인프라 및 파이프라인 모듈을 제공합니다.
 * [EN] Provides core infrastructure and pipeline modules for the Landscape terrain rendering engine.
 *
 * **[KO] 코어 아키텍처 및 데이터 흐름:**
 * - **`Spatial` (공간 분할 & 스트리밍)**: 2D 타일 그리드(`LandscapeSpatialGrid`)를 기반으로 카메라와의 거리에 따른 비동기 높이맵 스트리밍(`LandscapeTileStreamer`)을 수행하며, GPU 프러스텀/HZB 컬링(`LandscapeGPUCuller`)을 통해 가시 타일의 LOD를 선정하고 인스턴스 간접 드로우 버퍼를 갱신합니다.
 * - **`Generator` (가상 텍스처 아틀라스 생성기)**: GPU Compute 셰이더를 활용하여 가상 높이 텍스처(VHT), 해석적 중앙 차분 노멀(VNT), 다중 스플랫 PBR 베이스 텍스처(VBT) 및 타일 밉체인을 실시간 병렬 베이킹합니다.
 * - **`Scatter` (식생/잔디 공통 인프라)**: 지형 표면에 인스턴싱되는 3D 모델(나무, 바위, 잔디)을 재질별로 자동 결합(`combineScatterMeshes`)하고, Multi-Draw Indirect 렌더링을 위한 지오메트리 단위(`ScatterSubMesh`, `AScatterGeometryUnit`)를 제공합니다.
 *
 * **[EN] Core Architecture & Data Flow:**
 * - **`Spatial` (Partitioning & Streaming)**: Handles distance-based async heightmap streaming (`LandscapeTileStreamer`) across a 2D tile grid (`LandscapeSpatialGrid`), selects per-tile LODs via GPU frustum/HZB culling (`LandscapeGPUCuller`), and populates multi-LOD indirect draw buffers.
 * - **`Generator` (Virtual Texture Atlas Bakers)**: Leverages WebGPU compute pipelines to bake Virtual Height (VHT), central difference normals (VNT), multi-splat PBR base materials (VBT), and per-tile mip-chains in parallel.
 * - **`Scatter` (Foliage & Grass Shared Infrastructure)**: Merges composite 3D hierarchical meshes by material (`combineScatterMeshes`) and provides base units (`ScatterSubMesh`, `AScatterGeometryUnit`) for Multi-Draw Indirect instanced rendering.
 *
 * @packageDocumentation
 */

export * as Spatial from "./spatial";
export * as Generator from "./generator";
export * as Scatter from "./scatter";
export * as Cache from "./cache";

