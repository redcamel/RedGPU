/**
 * [KO] 식생 렌더 단위(Render Unit) 및 Dynamic Offset UBO 슬롯 풀러 모듈 모음입니다.
 * [EN] Collection of foliage render units and dynamic offset UBO slot pooler modules.
 * @packageDocumentation
 */

import AFoliageRenderUnitBase, {type AFoliageRenderUnitBaseInitOptions} from "./AFoliageRenderUnitBase";
import FoliageRenderUnit, {type FoliageRenderPassType, type FoliageRenderUnitInitOptions} from "./FoliageRenderUnit";
import FoliageShadowMergedRenderUnit, {
    type FoliageShadowMergedRenderUnitInitOptions
} from "./FoliageShadowMergedRenderUnit";
import FoliageSlotPooler from "./FoliageSlotPooler";

export {
    AFoliageRenderUnitBase,
    type AFoliageRenderUnitBaseInitOptions,
    FoliageRenderUnit,
    type FoliageRenderPassType,
    type FoliageRenderUnitInitOptions,
    FoliageShadowMergedRenderUnit,
    type FoliageShadowMergedRenderUnitInitOptions,
    FoliageSlotPooler
};
