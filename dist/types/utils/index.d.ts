/**
 * [KO] RedGPU에서 공통적으로 사용되는 다양한 유틸리티 함수와 클래스들을 제공합니다.
 * [EN] Provides various utility functions and classes commonly used in RedGPU.
 *
 * [KO] 파일 처리, 수학 연산, 텍스처 관리 및 고유 ID 생성 등 핵심 시스템을 지원하는 도구들을 포함합니다.
 * [EN] Includes tools that support core systems such as file processing, mathematical operations, texture management, and unique ID generation.
 *
 * @packageDocumentation
 */
import copyGPUBuffer from "./copyGPUBuffer";
/**
 * [KO] 빌드 시 제거되지 않는 콘솔 로그 함수입니다.
 * [EN] Console log function that is not removed during build.
 * * ### Example
 * ```typescript
 * RedGPU.Util.keepLog("Important debug message");
 * ```
 * @category Log
 */
declare const keepLog: any;
export * from "./file";
export * from "./math";
export * from "./texture";
export * from "./uuid";
export { keepLog, copyGPUBuffer, };
