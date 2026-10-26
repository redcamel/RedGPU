/**
 * [KO] 지형 절차적 잔디(Grass) 베이킹, GPU 컬링 및 렌더링 모듈입니다.
 * [EN] Module for terrain procedural grass baking, GPU culling, and rendering.
 * @packageDocumentation
 */
export * as Core from "./core";

import GrassManager from "./GrassManager";
import Grass, {type GrassOptions} from "./core/Grass";

export {
    Grass,
    GrassManager
};

export type {
    GrassOptions
};
