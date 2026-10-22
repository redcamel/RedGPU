/**
 * [KO] 식생(Foliage) 시스템의 내부 코어 클래스, 베이킹, 컬링 및 렌더링 파이프라인 구성 요소를 제공합니다.
 * [EN] Provides internal core classes, baking, culling, and rendering pipeline components for the foliage system.
 * @packageDocumentation
 */
import {type FoliageLODInfo, type FoliageSubCell} from "./Foliage";
import FoliageRenderUnit from "./FoliageRenderUnit";

import FoliageMegaBuffer from "./buffer/FoliageMegaBuffer";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
import FoliagePipelineRegistry from "./pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./renderer/FoliageRenderer";
import FoliageCuller from "./culling/FoliageCuller";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";

import bakeFoliageImpostor, {type FoliageBakeResult} from "./baking/impostor/bakeFoliageImpostor";
import OctahedralImpostorMaterial from "./baking/impostor/octahedral/OctahedralImpostorMaterial";

import assembleFoliageRenderUnits, {type FoliageAssemblyResult} from "./assembleFoliageRenderUnits";

export {
    FoliageRenderUnit,
    FoliageSlotPooler,
    FoliageMegaBuffer,
    FoliagePipelineRegistry,
    FoliageRenderer,
    FoliageCuller,
    FoliageInstanceBaker,
    OctahedralImpostorMaterial,

    assembleFoliageRenderUnits,
    bakeFoliageImpostor,

    type FoliageLODInfo,
    type FoliageSubCell,
    type FoliageAssemblyResult,
    type FoliageBakeResult
};
