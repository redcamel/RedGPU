// 1. Entities & SubMeshes
import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./Foliage";
import FoliageSubMesh from "./submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./submesh/FoliageShadowMergedSubMesh";

// 2. GPU Buffer & Culling & Baking Infrastructure
import FoliageMegaBuffer from "./buffer/FoliageMegaBuffer";
import {FoliageInstanceBaker} from "./baking/FoliageInstanceBaker";
import FoliageSpatialGrid from "./spatial/FoliageSpatialGrid";
import FoliagePipelineRegistry from "./pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./culling/FoliageCullingDispatcher";

// 3. Impostors
import FoliageImpostorBaker from "./impostor/FoliageImpostorBaker";
import OctahedralImpostorMaterial from "./impostor/octahedral/OctahedralImpostorMaterial";

// 4. SubCell Partitioning & Streaming
import FoliageSubCellPartitioner from "./subcell/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./subcell/FoliageSubCellStreamer";

// 5. Assembler
import assembleFoliageSubMeshes from "./assembler/assembleFoliageSubMeshes";

export {
    // Runtime Classes & Functions
    Foliage,
    FoliageSubMesh,
    FoliageShadowMergedSubMesh,
    FoliageMegaBuffer,
    FoliageInstanceBaker,
    FoliageSpatialGrid,
    FoliagePipelineRegistry,
    FoliageRenderer,
    FoliageCullingDispatcher,
    FoliageImpostorBaker,
    OctahedralImpostorMaterial,
    FoliageSubCellPartitioner,
    FoliageSubCellStreamer,
    assembleFoliageSubMeshes,

    // Code Hint Interfaces
    type FoliageOptions,
    type FoliageLODConfig,
    type FoliageLODInfo
};
