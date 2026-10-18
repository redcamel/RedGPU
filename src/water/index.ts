/**
 * [KO] 호수 수면(WaterLake), 단일 레이어 물 재질, 수면 상호작용(파동 시뮬레이션) 등 물 렌더링 기능을 제공합니다.
 * [EN] Provides water rendering features including lake surfaces (WaterLake), single-layer water material, and surface interaction (wave simulation).
 * @packageDocumentation
 */
export * as Lake from "./lake";
export * as Core from "./core";
export * as Interaction from "./interaction";

import WaterLake from "./lake/WaterLake";

export {
    WaterLake
};
export default WaterLake;

