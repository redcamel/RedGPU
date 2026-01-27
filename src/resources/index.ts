/**
 * [KO] 다양한 리소스 객체와 유틸리티(버퍼, 텍스처, 샘플러, 리소스 매니저, WGSL 파서 등)를 제공합니다.
 * [EN] Provides various resource objects and utilities (buffers, textures, samplers, resource manager, WGSL parser, etc.).
 *
 * [KO] 각 리소스 및 유틸리티를 통해 GPU 메모리 관리, 데이터 버퍼링, 텍스처 처리, 샘플링, WGSL 파싱 등 렌더링에 필요한 다양한 리소스 관리 기능을 손쉽게 사용할 수 있습니다.
 * [EN] Through each resource and utility, you can easily use various resource management functions required for rendering, such as GPU memory management, data buffering, texture processing, sampling, and WGSL parsing.
 *
 * @packageDocumentation
 */
export * as Core from "./core";
export * from './buffer'
export * from './texture'
export * from './sampler'
export * from './wgslParser'