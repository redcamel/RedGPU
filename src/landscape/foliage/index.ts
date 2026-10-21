/**
 * [KO] 지형 식생(Foliage) 스트리밍, GPU 컬링 및 렌더링 모듈입니다.
 * [EN] Module for terrain foliage streaming, GPU culling, and rendering.
 * @packageDocumentation
 */
export * as Core from "./core";

import FoliageManager from "./FoliageManager";
import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./core/Foliage";
import assembleFoliageRenderUnits, {type FoliageAssemblyResult} from "./core/assembleFoliageRenderUnits";

export {
    Foliage,
    FoliageManager,
    assembleFoliageRenderUnits
};

export type {
    FoliageOptions,
    FoliageLODConfig,
    FoliageLODInfo,
    FoliageAssemblyResult
};
