/**
 * [KO] 물리 엔진 통합을 위한 핵심 인터페이스와 공통 타입을 제공합니다.
 * [EN] Provides core interfaces and common types for physics engine integration.
 *
 * [KO] RedGPU의 물리 시스템은 플러그인 방식으로 설계되어 있어, 특정 물리 엔진에 종속되지 않고 다양한 라이브러리(Rapier 등)를 연결하여 사용할 수 있습니다.
 * [EN] RedGPU's physics system is designed as a plugin-based architecture, allowing various libraries (such as Rapier) to be connected and used without being dependent on a specific physics engine.
 *
 * @packageDocumentation
 */

export * from './PhysicsShape';

export * from './PhysicsBodyType';

export * from './IPhysicsBody';

export * from './IPhysicsEngine';
