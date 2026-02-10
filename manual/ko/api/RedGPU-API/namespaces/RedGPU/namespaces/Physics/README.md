[**RedGPU API v4.0.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / Physics

# Physics

**`Experimental`**

물리 엔진 통합을 위한 핵심 인터페이스와 공통 타입을 제공합니다.


RedGPU의 물리 시스템은 플러그인 방식으로 설계되어 있습니다. 특정 물리 엔진에 종속되지 않는 공통 인터페이스를 통해 다양한 물리 라이브러리를 유연하게 연결하여 사용할 수 있는 구조를 제공합니다.


현재는 **Rapier** 물리 엔진이 기본 플러그인으로 지원되고 있습니다.


::: warning
이 패키지의 기능들은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## Other

- [BodyParams](interfaces/BodyParams.md)
- [PhysicsBodyType](type-aliases/PhysicsBodyType.md)
- [PhysicsShape](type-aliases/PhysicsShape.md)

## Physics

- [IPhysicsBody](interfaces/IPhysicsBody.md)
- [IPhysicsEngine](interfaces/IPhysicsEngine.md)
- [PHYSICS\_BODY\_TYPE](variables/PHYSICS_BODY_TYPE.md)
- [PHYSICS\_SHAPE](variables/PHYSICS_SHAPE.md)
