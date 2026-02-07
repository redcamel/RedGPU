/**
 * [KO] 물리 엔진 통합을 위한 핵심 인터페이스와 공통 타입을 제공합니다.
 * [EN] Provides core interfaces and common types for physics engine integration.
 *
 * [KO] RedGPU의 물리 시스템은 플러그인 방식으로 설계되어 있습니다. 특정 물리 엔진에 종속되지 않는 공통 인터페이스를 통해 다양한 물리 라이브러리를 유연하게 연결하여 사용할 수 있는 구조를 제공합니다.
 * [EN] RedGPU's physics system is designed with a plugin-based architecture. It provides a structure that allows various physics libraries to be flexibly connected through a common interface that is not dependent on a specific physics engine.
 *
 * [KO] 현재는 **Rapier** 물리 엔진이 기본 플러그인으로 지원되고 있습니다.
 * [EN] Currently, the **Rapier** physics engine is supported as the primary plugin.
 *
 * @packageDocumentation
 */

export * from './PhysicsShape';

export * from './PhysicsBodyType';

export * from './IPhysicsBody';

export * from './IPhysicsEngine';
