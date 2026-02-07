/**
 * [KO] 머티리얼 시스템의 핵심 추상 클래스들과 렌더링 정보 클래스들을 제공합니다.
 * [EN] Provides core abstract classes and rendering information classes for the material system.
 *
 * [KO] 이 모듈은 모든 머티리얼의 공통 기반이 되는 `ABaseMaterial`, 비트맵 기반의 `ABitmapBaseMaterial`, UV 변환 기능을 지원하는 `AUVTransformBaseMaterial` 등 머티리얼 확장을 위한 핵심 구조를 포함합니다.
 * [EN] This module includes the core structures for material extension, such as `ABaseMaterial` (the common base for all materials), `ABitmapBaseMaterial` (bitmap-based), and `AUVTransformBaseMaterial` (supporting UV transformations).
 * @packageDocumentation
 */
import ABaseMaterial from "./ABaseMaterial";
import ABitmapBaseMaterial from "./ABitmapBaseMaterial";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
import AUVTransformBaseMaterial from "./AUVTransformBaseMaterial";

export * from "./getBindGroupLayoutDescriptorFromShaderInfo";
export {
    ABaseMaterial,
    ABitmapBaseMaterial,
    AUVTransformBaseMaterial,
    FragmentGPURenderInfo
}
