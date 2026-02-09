[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_BODY\_TYPE

# Variable: PHYSICS\_BODY\_TYPE

> `const` **PHYSICS\_BODY\_TYPE**: `object`

Defined in: [src/physics/PhysicsBodyType.ts:13](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/PhysicsBodyType.ts#L13)

**`Experimental`**

물리 바디의 시뮬레이션 타입을 정의합니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="dynamic"></a> `DYNAMIC` | `"dynamic"` | `'dynamic'` | 물리 법칙(중력, 충돌 등)의 영향을 받는 동적 바디
| <a id="kinematic"></a> `KINEMATIC` | `"kinematic"` | `'kinematic'` | 물리 법칙의 영향은 받지 않으나 코드로 직접 움직임을 제어하는 바디 (위치 기반)
| <a id="kinematic_position"></a> `KINEMATIC_POSITION` | `"kinematicPosition"` | `'kinematicPosition'` | 물리 법칙의 영향은 받지 않으나 코드로 직접 움직임을 제어하는 바디 (위치 기반)
| <a id="kinematic_velocity"></a> `KINEMATIC_VELOCITY` | `"kinematicVelocity"` | `'kinematicVelocity'` | 물리 법칙의 영향은 받지 않으나 속도로 움직임을 제어하는 바디
| <a id="static"></a> `STATIC` | `"static"` | `'static'` | 움직이지 않고 고정된 정적 바디
