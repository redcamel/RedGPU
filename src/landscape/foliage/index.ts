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

