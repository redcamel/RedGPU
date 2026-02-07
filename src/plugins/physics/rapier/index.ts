/**
 * [KO] Rapier 물리 엔진을 사용한 RedGPU 물리 플러그인 구현체를 제공합니다.
 * [EN] Provides the RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] 이 모듈은 WASM 기반의 고성능 물리 시뮬레이션을 지원하며, RedGPU 메쉬 객체와 손쉽게 연동할 수 있는 기능을 제공합니다.
 * [EN] This module supports high-performance WASM-based physics simulation and provides features for easy integration with RedGPU mesh objects.
 *
 * [KO] 사용자는 `IPhysicsEngine` 인터페이스를 따르는 `RapierPhysics` 클래스를 통해 물리 월드를 초기화하고 바디를 생성할 수 있습니다.
 * [EN] Users can initialize the physics world and create bodies through the `RapierPhysics` class, which follows the `IPhysicsEngine` interface.
 *
 * @packageDocumentation
 */

export * from './RapierPhysics';
export * from './RapierBody';

