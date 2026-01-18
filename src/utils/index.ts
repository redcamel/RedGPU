/**
 * [KO] 다양한 유틸리티 함수와 클래스(keepLog, createUUID, uuidToUint, copyGPUBuffer, InstanceIdGenerator 등) 및 변환, 파일, 수학, 텍스처 관련 유틸리티를 제공합니다.
 * [EN] Provides various utility functions and classes (keepLog, createUUID, uuidToUint, copyGPUBuffer, InstanceIdGenerator, etc.) as well as utilities related to conversion, files, math, and textures.
 *
 * [KO] 각 유틸리티를 통해 공통적으로 필요한 기능(로깅, UUID 생성, 버퍼 복사, 색상 변환, 파일 처리, 수학 연산, 텍스처 처리 등)을 손쉽게 사용할 수 있습니다.
 * [EN] Through each utility, you can easily use commonly needed features (logging, UUID generation, buffer copying, color conversion, file processing, math operations, texture processing, etc.).
 *
 * @packageDocumentation
 */
import copyGPUBuffer from "./copyGPUBuffer";

/**
 * [KO] 빌드시 사라지지않는 console.log
 * [EN] console.log that does not disappear during build
 * @category Log
 */
const keepLog = console.log.bind(console);
export * from "./convertColor";
export * from "./file";
export * from "./math";
export * from "./texture";
export * from "./uuid";
export {
    keepLog,
    copyGPUBuffer,
}