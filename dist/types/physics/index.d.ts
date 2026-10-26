/**
 * [KO] 물리 엔진 통합을 위한 핵심 인터페이스와 공통 타입(`IPhysicsEngine`, `IPhysicsBody`, `PHYSICS_BODY_TYPE`, `PHYSICS_SHAPE`)을 제공합니다.
 * [EN] Provides core interfaces and common types (`IPhysicsEngine`, `IPhysicsBody`, `PHYSICS_BODY_TYPE`, `PHYSICS_SHAPE`) for physics engine integration.
 *
 * ::: warning
 * [KO] 이 패키지의 기능들은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] The features in this package are currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @experimental
 * @packageDocumentation
 */
export * from './PhysicsShape';
export * from './PhysicsBodyType';
export * from './IPhysicsBody';
export * from './IPhysicsEngine';
