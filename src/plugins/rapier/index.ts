/**
 * [KO] Rapier 물리 엔진을 사용한 RedGPU 물리 플러그인 구현체를 제공합니다.
 * [EN] Provides the RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] 이 모듈은 WASM 기반의 고성능 물리 시뮬레이션을 지원하며, RedGPU 메쉬 객체와 손쉽게 연동할 수 있는 기능을 제공합니다. 사용자는 `RapierPhysics` 클래스를 통해 물리 월드를 초기화하고 `RapierBody`를 생성하여 물리 시스템을 구축할 수 있습니다.
 * [EN] This module supports high-performance WASM-based physics simulation and provides features for easy integration with RedGPU mesh objects. Users can build physics systems by initializing the physics world and creating `RapierBody` instances through the `RapierPhysics` class.
 *
 * ::: warning
 * [KO] 이 패키지의 기능들은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] The features in this package are currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @see [KO] [물리 플러그인 매뉴얼](/RedGPU/manual/ko/plugins/physics)
 * @see [EN] [Physics Plugin Manual](/RedGPU/manual/en/plugins/physics)
 * @experimental
 * @packageDocumentation
 */

export * from './RapierPhysics';
export * from './RapierBody';