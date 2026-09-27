/**
 * [KO] Landscape 실시간 시각 디버깅(Debugger) 시스템 모듈입니다.
 * [EN] Real-time visual debugging system module for Landscape.
 *
 * @remarks
 * **[KO]**
 * - `LandscapeDebuggerManager`: 온스크린 디버거 뷰어 표시 및 토글 제어를 총괄 관리합니다.
 * - `Core`: 개별 디버거 뷰어(SpatialGrid, VHT, VNT, VBT) 및 기반 추상 클래스를 제공합니다.
 *
 * **[EN]**
 * - `LandscapeDebuggerManager`: Orchestrates on-screen debugger viewers and display toggle control.
 * - `Core`: Provides individual debugger viewers (SpatialGrid, VHT, VNT, VBT) and base abstract classes.
 *
 * @packageDocumentation
 */
export * as Core from "./core";

import LandscapeDebuggerManager, {
    type LandscapeDebuggerManagerOptions,
    type LandscapeDebugPropertyChangeHandler,
    type LandscapeDebugPropertyKey
} from "./LandscapeDebuggerManager";
import {
    LandscapeSpatialGridDebugger,
    LandscapeVBTDebugger,
    LandscapeVBTNormalDebugger,
    LandscapeVBTORMDebugger,
    LandscapeVHTDebugger,
    LandscapeVNTDebugger
} from "./core";

export {
    LandscapeDebuggerManager,
    type LandscapeDebuggerManagerOptions,
    type LandscapeDebugPropertyKey,
    type LandscapeDebugPropertyChangeHandler,
    LandscapeSpatialGridDebugger,
    LandscapeVHTDebugger,
    LandscapeVNTDebugger,
    LandscapeVBTDebugger,
    LandscapeVBTNormalDebugger,
    LandscapeVBTORMDebugger
};
