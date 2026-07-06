[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreInstancingMesh](../README.md) / instancingMeshObject3D

# Class: instancingMeshObject3D

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:31](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L31)

인스턴싱된 메시의 개별 인스턴스를 제어하기 위한 클래스입니다.

InstancingMesh 내에서 특정 단일 인스턴스의 위치, 회전, 스케일 및 불투명도(Opacity)와 같은 개별적인 트랜스폼 상태를 관리하고, 인스턴스의 모델 행렬을 업데이트하여 GPU Storage Buffer에 동적으로 반영합니다.

## Constructors

### Constructor

> **new instancingMeshObject3D**(`redGPUContext`, `location`, `instancingMesh`): `InstancingMeshObject3D`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:81](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L81)

InstancingMeshObject3D 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `location` | `number` | 인스턴싱 메시 내에서의 인덱스 위치
| `instancingMesh` | [`InstancingMesh`](../../../classes/InstancingMesh.md) | 부모 InstancingMesh 객체

#### Returns

`InstancingMeshObject3D`

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:41](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L41)

인스턴스의 로컬 행렬 (Local Matrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:36](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L36)

인스턴스의 모델 행렬 (Model Matrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L46)

인스턴스의 노말 모델 행렬 (Normal Model Matrix)

## Accessors

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:93](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L93)

인스턴스의 불투명도(Opacity) 값을 가져오거나 설정합니다. 허용 범위는 0.0에서 1.0 사이입니다.

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:97](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:146](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L146)

인스턴스의 X, Y, Z 위치 배열 [x, y, z]을 가져오거나, 모든 축의 위치를 단일 값으로 동일하게 설정합니다.

##### Returns

`number`[]

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:150](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:254](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L254)

인스턴스의 회전각 [rotationX, rotationY, rotationZ] 배열을 가져오거나, 모든 축의 회전각을 단일 값으로 일괄 설정합니다.

##### Returns

`number`[]

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:258](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L258)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:215](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L215)

인스턴스의 X축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:219](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L219)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:228](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L228)

인스턴스의 Y축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:232](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:241](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L241)

인스턴스의 Z축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:245](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L245)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scale

#### Get Signature

> **get** **scale**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:200](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L200)

인스턴스의 스케일 [scaleX, scaleY, scaleZ] 배열을 가져오거나, 모든 축의 스케일을 단일 값으로 일괄 설정합니다.

##### Returns

`number`[]

#### Set Signature

> **set** **scale**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:204](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:161](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L161)

인스턴스의 X축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:165](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L165)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:174](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L174)

인스턴스의 Y축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:178](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:187](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L187)

인스턴스의 Z축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:191](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L191)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:107](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L107)

인스턴스의 X축 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:111](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L111)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:120](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L120)

인스턴스의 Y축 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:124](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L124)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:133](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L133)

인스턴스의 Z축 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:137](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:301](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L301)

인스턴스의 X, Y, Z축 위치를 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 위치 좌표
| `y?` | `number` | Y축 위치 좌표 (선택, 기본값: x)
| `z?` | `number` | Z축 위치 좌표 (선택, 기본값: x)

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:324](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L324)

인스턴스의 X, Y, Z축 회전각(Degree)을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전각 (Degree)
| `rotationY?` | `number` | Y축 회전각 (Degree, 선택, 기본값: rotationX)
| `rotationZ?` | `number` | Z축 회전각 (Degree, 선택, 기본값: rotationX)

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:278](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L278)

인스턴스의 X, Y, Z축 스케일을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 통일되어 적용됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 값
| `y?` | `number` | Y축 스케일 값 (선택, 기본값: x)
| `z?` | `number` | Z축 스케일 값 (선택, 기본값: x)

#### Returns

`void`
