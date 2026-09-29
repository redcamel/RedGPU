/**
 * [KO] Landscape 지형 렌더링 엔진의 핵심 인프라 및 파이프라인 모듈을 제공합니다.
 * [EN] Provides core infrastructure and pipeline modules for the Landscape terrain rendering engine.
 *
 * @remarks
 * **[KO]**
 * - `Material`: 다중 레이어 스플래팅 재질, 레이어 정의 및 가중치 맵 캐시를 관리합니다.
 * - `Spatial`: GPU 프러스텀 컬링, 인스턴스 버퍼, 쿼드트리 공간 그리드, 비동기 타일 스트리밍을 담당합니다.
 * - `Generator`: 가상 텍스처(VBT, VHT, VNT) 아틀라스 베이킹 제너레이터를 제공합니다.
 * - `Geometry`: 복합 계층 메쉬 재귀 순회 및 버텍스/인덱스 버퍼 결합 코어 엔진을 제공합니다.
 *
 * **[EN]**
 * - `Material`: Manages multi-layer splatting materials, layer definitions, and weight map caches.
 * - `Spatial`: Manages GPU frustum culling, instance buffers, spatial quadtree grids, and async tile streaming.
 * - `Generator`: Provides virtual texture (VBT, VHT, VNT) atlas baking generators.
 * - `Geometry`: Provides core engines for composite hierarchical mesh traversal and vertex/index buffer combining.
 *
 * @packageDocumentation
 */

export * as Material from "./material";
export * as Spatial from "./spatial";
export * as Generator from "./generator";
export * as Geometry from "./geometry";
