/**
 * [KO] Landscape 지형 렌더링 엔진의 핵심 인프라 및 파이프라인 모듈을 제공합니다.
 * [EN] Provides core infrastructure and pipeline modules for the Landscape terrain rendering engine.
 *
 * @remarks
 * **[KO]**
 * - `spatial`: GPU 프러스텀 컬링, 인스턴스 버퍼, 쿼드트리 공간 그리드, 비동기 타일 스트리밍을 담당합니다.
 * - `generator`: 가상 텍스처(VBT, VHT, VNT) 아틀라스 베이킹 제너레이터를 제공합니다.
 * - `material`: 다중 레이어 스플래팅 재질, 레이어 정의 및 가중치 맵 캐시를 관리합니다.
 *
 * **[EN]**
 * - `spatial`: Manages GPU frustum culling, instance buffers, spatial quadtree grids, and async tile streaming.
 * - `generator`: Provides virtual texture (VBT, VHT, VNT) atlas baking generators.
 * - `material`: Manages multi-layer splatting materials, layer definitions, and weight map caches.
 *
 * @packageDocumentation
 */

// 1. Material Core
import LandscapeMaterial from "./material/LandscapeMaterial";
import LandscapeLayer, {LandscapeLayerOptions, LandscapeWeightMapChannel} from "./material/LandscapeLayer";
import LandscapeWeightMapCache, {WeightMapPixelData} from "./material/LandscapeWeightMapCache";

// 2. Spatial Core
import LandscapeComponent from "./spatial/LandscapeComponent";
import {LandscapeGPUCuller} from "./spatial/LandscapeGPUCuller";
import LandscapeInstanceBuffer from "./spatial/LandscapeInstanceBuffer";
import LandscapeSharedGeometry from "./spatial/LandscapeSharedGeometry";
import LandscapeSpatialGrid from "./spatial/LandscapeSpatialGrid";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "./spatial/LandscapeTileStreamer";

// 3. Generator Core
import ALandscapeAtlasGenerator from "./generator/ALandscapeAtlasGenerator";
import LandscapeVBTGenerator from "./generator/LandscapeVBTGenerator";
import LandscapeVHTGenerator from "./generator/LandscapeVHTGenerator";
import LandscapeVNTGenerator from "./generator/LandscapeVNTGenerator";

export {
    // Material
    LandscapeMaterial,
    LandscapeLayer,
    LandscapeWeightMapCache,

    // Spatial
    LandscapeComponent,
    LandscapeGPUCuller,
    LandscapeInstanceBuffer,
    LandscapeSharedGeometry,
    LandscapeSpatialGrid,
    LandscapeTileStreamer,

    // Generator
    ALandscapeAtlasGenerator,
    LandscapeVBTGenerator,
    LandscapeVHTGenerator,
    LandscapeVNTGenerator
};

export type {
    LandscapeLayerOptions,
    LandscapeWeightMapChannel,
    WeightMapPixelData,
    LandscapeTileUrlResolver
};
