[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreGroup](../README.md) / AGroupBase

# Abstract Class: AGroupBase

Defined in: [src/display/group/core/AGroupBase.ts:23](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L23)


Abstract base class providing common group behavior and transformations (position, rotation, scale, pivot, etc.) for both 3D and 2D.

::: warning

This class is an abstract class used internally by the system.<br/>Do not create instances directly.
:::

## Extends

- [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

## Extended by

- [`Group2D`](../../../classes/Group2D.md)
- [`Group3D`](../../../classes/Group3D.md)

## Constructors

### Constructor

> **new AGroupBase**(`name?`): `GroupBase`

Defined in: [src/display/group/core/AGroupBase.ts:137](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L137)


GroupBase constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | Group name (optional) |

#### Returns

`GroupBase`

#### Overrides

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`constructor`](../../CoreMesh/classes/Object3DContainer.md#constructor)

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/group/core/AGroupBase.ts:33](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L33)


Local transformation matrix

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/group/core/AGroupBase.ts:28](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L28)


Model transformation matrix

#### Overrides

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`modelMatrix`](../../CoreMesh/classes/Object3DContainer.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](../../../classes/Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](../../../classes/Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`children`](../../CoreMesh/classes/Object3DContainer.md#children)

***

### dirtyTransform

#### Get Signature

> **get** **dirtyTransform**(): `boolean`

Defined in: [src/display/group/core/AGroupBase.ts:145](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L145)

변환 행렬 갱신 필요 여부 반환

##### Returns

`boolean`

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:152](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L152)

변환 행렬 갱신 필요 여부 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/group/core/AGroupBase.ts:159](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L159)

그룹 이름 반환

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:167](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L167)

그룹 이름 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`numChildren`](../../CoreMesh/classes/Object3DContainer.md#numchildren)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/group/core/AGroupBase.ts:174](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L174)

설정된 부모 객체 반환

##### Returns

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:182](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L182)

부모 객체 설정

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md) | 부모 객체 |

##### Returns

`void`

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:189](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L189)

피벗 X 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:196](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L196)

피벗 X 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:204](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L204)

피벗 Y 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:211](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L211)

피벗 Y 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:219](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L219)

피벗 Z 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:226](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L226)

피벗 Z 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/display/group/core/AGroupBase.ts:279](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L279)

위치 배열 반환 [x, y, z]

##### Returns

\[`number`, `number`, `number`\]

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`[]

Defined in: [src/display/group/core/AGroupBase.ts:383](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L383)

회전 배열 반환 [x, y, z] (deg)

##### Returns

`number`[]

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:338](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L338)

X축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:345](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L345)

X축 회전 설정 (deg)

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

Defined in: [src/display/group/core/AGroupBase.ts:353](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L353)

Y축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:360](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L360)

Y축 회전 설정 (deg)

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

Defined in: [src/display/group/core/AGroupBase.ts:368](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L368)

Z축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:375](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L375)

Z축 회전 설정 (deg)

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

Defined in: [src/display/group/core/AGroupBase.ts:331](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L331)

스케일 배열 반환 [x, y, z]

##### Returns

`number`[]

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:286](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L286)

X 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:293](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L293)

X 스케일 설정

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

Defined in: [src/display/group/core/AGroupBase.ts:301](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L301)

Y 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:308](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L308)

Y 스케일 설정

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

Defined in: [src/display/group/core/AGroupBase.ts:316](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L316)

Z 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:323](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L323)

Z 스케일 설정

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

Defined in: [src/display/group/core/AGroupBase.ts:234](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L234)

X 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:241](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L241)

X 좌표 설정

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

Defined in: [src/display/group/core/AGroupBase.ts:249](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L249)

Y 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:256](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L256)

Y 좌표 설정

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

Defined in: [src/display/group/core/AGroupBase.ts:264](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L264)

Z 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:271](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L271)

Z 좌표 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`addChild`](../../CoreMesh/classes/Object3DContainer.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `GroupBase`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`GroupBase`

현재 컨테이너

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`addChildAt`](../../CoreMesh/classes/Object3DContainer.md#addchildat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`contains`](../../CoreMesh/classes/Object3DContainer.md#contains)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`getChildAt`](../../CoreMesh/classes/Object3DContainer.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`getChildIndex`](../../CoreMesh/classes/Object3DContainer.md#getchildindex)

***

### removeAllChildren()

> **removeAllChildren**(): `GroupBase`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`GroupBase`

현재 컨테이너

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`removeAllChildren`](../../CoreMesh/classes/Object3DContainer.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

제거된 객체

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`removeChild`](../../CoreMesh/classes/Object3DContainer.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

제거된 객체

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`removeChildAt`](../../CoreMesh/classes/Object3DContainer.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:439](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L439)

렌더링 및 변환 행렬 계산을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | 렌더 상태 데이터 |

#### Returns

`void`

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`setChildIndex`](../../CoreMesh/classes/Object3DContainer.md#setchildindex)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:409](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L409)

위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표 |
| `y?` | `number` | Y 좌표(생략 시 x와 동일) |
| `z?` | `number` | Z 좌표(생략 시 x와 동일) |

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:425](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L425)

회전을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전(도) |
| `rotationY?` | `number` | Y축 회전(도, 생략 시 rotationX와 동일) |
| `rotationZ?` | `number` | Z축 회전(도, 생략 시 rotationX와 동일) |

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:393](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/group/core/AGroupBase.ts#L393)

스케일을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 스케일 |
| `y?` | `number` | Y 스케일(생략 시 x와 동일) |
| `z?` | `number` | Z 스케일(생략 시 x와 동일) |

#### Returns

`void`

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](../../../classes/Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](../../../classes/Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`swapChildren`](../../CoreMesh/classes/Object3DContainer.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md).[`swapChildrenAt`](../../CoreMesh/classes/Object3DContainer.md#swapchildrenat)
