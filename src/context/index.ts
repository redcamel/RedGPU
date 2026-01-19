/**
 * [KO] WebGPU 초기화 및 컨텍스트 관리 기능을 제공합니다.
 * [EN] Provides WebGPU initialization and context management features.
 *
 * [KO] 시스템의 최상위 객체인 RedGPUContext를 포함하여 디바이스 감지, 크기 관리, 뷰 컨테이너 등 핵심 인프라를 포함합니다.
 * [EN] Includes core infrastructure such as the system's top-level object RedGPUContext, device detection, size management, and view containers.
 * @packageDocumentation
 */
import * as Core from "./core"
import RedGPUContext from "./RedGPUContext";

export {
    RedGPUContext,
    Core,
}
