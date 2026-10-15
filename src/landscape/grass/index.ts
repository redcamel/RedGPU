/**
 * [KO] 절차적 잔디(Grass) 렌더링 및 관리 기능을 제공하는 모듈입니다.
 * [EN] Module providing procedural grass rendering and management functionality.
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
