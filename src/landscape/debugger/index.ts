/**
 * [KO] 지형(Landscape) 디버거 매니저 및 관련 모듈을 제공합니다.
 * [EN] Provides the landscape debugger manager and related modules.
 * @packageDocumentation
 */
export * as Core from "./core";

import LandscapeDebuggerManager, {
    type DebuggerPropertyChangeHandler,
    type DebuggerPropertyKey,
    type LandscapeDebuggerManagerOptions
} from "./LandscapeDebuggerManager";

export {
    LandscapeDebuggerManager,
    type LandscapeDebuggerManagerOptions,
    type DebuggerPropertyKey,
    type DebuggerPropertyChangeHandler
};
