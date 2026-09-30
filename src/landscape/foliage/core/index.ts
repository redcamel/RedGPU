import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./Foliage";
import FoliageSubMesh, {type FoliageRenderPassType, type FoliageSubMeshInitOptions} from "./submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh, {
    type FoliageShadowMergedSubMeshInitOptions
} from "./submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {type CascadeCullingParam, type FoliageTypeAllocation} from "./buffer/FoliageMegaBuffer";
import {FoliageInstanceBaker} from "./baking/FoliageInstanceBaker";
import FoliageSpatialGrid from "./spatial/FoliageSpatialGrid";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "./pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./culling/FoliageCullingDispatcher";
import FoliageSubMeshAssembler, {type FoliageAssemblyResult} from "./assembler/FoliageSubMeshAssembler";

export {
    Foliage,
    type FoliageLODConfig,
    type FoliageLODInfo,
    type FoliageOptions,
    FoliageSubMesh,
    type FoliageSubMeshInitOptions,
    type FoliageRenderPassType,
    FoliageShadowMergedSubMesh,
    type FoliageShadowMergedSubMeshInitOptions,
    FoliageMegaBuffer,
    type FoliageTypeAllocation,
    type CascadeCullingParam,
    FoliageInstanceBaker,
    FoliageSpatialGrid,
    FoliagePipelineRegistry,
    type FoliageDepthPassMode,
    FoliageRenderer,
    FoliageCullingDispatcher,
    FoliageSubMeshAssembler,
    type FoliageAssemblyResult
};
