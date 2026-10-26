[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_BODY\_TYPE

# Variable: PHYSICS\_BODY\_TYPE

> `const` **PHYSICS\_BODY\_TYPE**: `object`

Defined in: [src/physics/PhysicsBodyType.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L13)

**`Experimental`**

물리 바디의 시뮬레이션 타입 상수입니다.

::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-dynamic"></a> `DYNAMIC` | `"dynamic"` | `'dynamic'` | 물리 법칙(중력, 충돌 등)의 영향을 받는 동적 바디 | [src/physics/PhysicsBodyType.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L18) |
| <a id="property-kinematic"></a> `KINEMATIC` | `"kinematic"` | `'kinematic'` | 위치 기반으로 직접 제어하는 키네마틱 바디 | [src/physics/PhysicsBodyType.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L28) |
| <a id="property-kinematic_position"></a> `KINEMATIC_POSITION` | `"kinematicPosition"` | `'kinematicPosition'` | 위치 기반으로 직접 제어하는 키네마틱 바디 | [src/physics/PhysicsBodyType.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L33) |
| <a id="property-kinematic_velocity"></a> `KINEMATIC_VELOCITY` | `"kinematicVelocity"` | `'kinematicVelocity'` | 속도 기반으로 제어하는 키네마틱 바디 | [src/physics/PhysicsBodyType.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L38) |
| <a id="property-static"></a> `STATIC` | `"static"` | `'static'` | 움직이지 않고 고정된 정적 바디 | [src/physics/PhysicsBodyType.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/PhysicsBodyType.ts#L23) |
