/**
 * [KO] 평면 호수 수면을 렌더링하는 Lake와 수면 재질인 LakeMaterial을 제공합니다.
 * [EN] Provides Lake, which renders a flat lake surface, and LakeMaterial, the lake water surface material.
 * @packageDocumentation
 */
export * as Interaction from "./interaction";

import Lake from "./Lake";
import LakeMaterial from "./LakeMaterial";
import LakeInteractionRegistry from "./interaction/LakeInteractionRegistry";

export {
    Lake,
    LakeMaterial,
    LakeInteractionRegistry
};
