/**
 * [KO] 식생(Foliage) 렌더링 및 관리 기능을 제공하는 모듈입니다.
 * [EN] Module providing foliage rendering and management functionality.
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
