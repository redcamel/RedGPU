[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Group2D

# Class: Group2D

Defined in: [src/display/group/Group2D.ts:21](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L21)

Container class for hierarchically organizing and group-controlling child objects in 2D space.

Manages only transform (position, rotation, scale) details and child hierarchy without its own geometry or material. Used to designate logical groups in a scene and apply 2D transformations to child nodes collectively.

* ### Example
```typescript
const group = new RedGPU.Display.Group2D();
group.addChild(sprite1);
group.addChild(sprite2);
scene.addChild(group);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/" ></iframe>

## Extends

- [`Group3D`](Group3D.md)

## Constructors

### Constructor

> **new Group2D**(`name?`): `Group2D`

Defined in: [src/display/group/Group2D.ts:35](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L35)

Creates an instance of Group2D.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | Identification name of the group (optional) |

#### Returns

`Group2D`

#### Overrides

[`Group3D`](Group3D.md).[`constructor`](Group3D.md#constructor)

## Properties

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [src/display/group/Group2D.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L45)

Returns or sets the rotation value of the group in radians. Setting this internally maps to the Z-axis rotation.

##### Returns

`number`

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:50](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L50)

Gets the rotation angle array [rotationX, rotationY, rotationZ] of the group in degrees.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`rotation`](Group3D.md#rotation)

***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:81](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L81)

Sets the 2D position (X and Y coordinates) of the group. If Y is omitted, it defaults to the value of X.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate of the position |
| `y?` | `number` | Y coordinate of the position (optional, default: x) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setPosition`](Group3D.md#setposition)

***

### setRotation()

> **setRotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:94](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L94)

Sets the 2D rotation of the group in radians.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation angle in radians |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setRotation`](Group3D.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:65](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group2D.ts#L65)

Sets the 2D scale of the group. If Y is omitted, it defaults to the value of X (globalStruct scaling).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Scale factor along the X-axis |
| `y?` | `number` | Scale factor along the Y-axis (optional, default: x) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setScale`](Group3D.md#setscale)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`Group3D`](Group3D.md).[`instanceId`](Group3D.md#instanceid)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:38](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L38)

Local transformation matrix of the group

#### Inherited from

[`Group3D`](Group3D.md).[`localMatrix`](Group3D.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:33](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L33)

Final global model transformation matrix of the group

#### Inherited from

[`Group3D`](Group3D.md).[`modelMatrix`](Group3D.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L44)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Group3D`](Group3D.md).[`children`](Group3D.md#children)

***

### dirtyTransform

#### Get Signature

> **get** **dirtyTransform**(): `boolean`

Defined in: [src/display/group/Group3D.ts:78](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L78)

Sets or gets whether the transformation matrix is in a state requiring update (dirty).

##### Returns

`boolean`

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:82](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L82)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`dirtyTransform`](Group3D.md#dirtytransform)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`name`](Group3D.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L52)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Group3D`](Group3D.md).[`numChildren`](Group3D.md#numchildren)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/group/Group3D.ts:90](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L90)

Sets or gets the parent container (Object3DContainer) containing this group object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:94](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`parent`](Group3D.md#parent)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/group/Group3D.ts:102](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L102)

Gets or sets the X-axis pivot (center point) coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:106](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotX`](Group3D.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/group/Group3D.ts:115](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L115)

Gets or sets the Y-axis pivot (center point) coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:119](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotY`](Group3D.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/group/Group3D.ts:128](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L128)

Gets or sets the Z-axis pivot (center point) coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:132](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L132)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotZ`](Group3D.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/display/group/Group3D.ts:180](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L180)

Gets the position coordinate array [x, y, z] of the group.

##### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Group3D`](Group3D.md).[`position`](Group3D.md#position)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/Group3D.ts:235](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L235)

Gets or sets the rotation angle (in degrees) around the X-axis.

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:239](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationX`](Group3D.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/group/Group3D.ts:248](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L248)

Gets or sets the rotation angle (in degrees) around the Y-axis.

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:252](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L252)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationY`](Group3D.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/group/Group3D.ts:261](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L261)

Gets or sets the rotation angle (in degrees) around the Z-axis.

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:265](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L265)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationZ`](Group3D.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `number`[]

Defined in: [src/display/group/Group3D.ts:227](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L227)

Gets the scale factor array [scaleX, scaleY, scaleZ] of the group.

##### Returns

`number`[]

#### Inherited from

[`Group3D`](Group3D.md).[`scale`](Group3D.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/Group3D.ts:188](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L188)

Gets or sets the scale factor along the X-axis.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:192](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L192)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleX`](Group3D.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/group/Group3D.ts:201](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L201)

Gets or sets the scale factor along the Y-axis.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:205](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L205)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleY`](Group3D.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/group/Group3D.ts:214](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L214)

Gets or sets the scale factor along the Z-axis.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:218](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L218)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleZ`](Group3D.md#scalez)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`Group3D`](Group3D.md).[`uuid`](Group3D.md#uuid)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/group/Group3D.ts:141](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L141)

Gets or sets the X-axis position coordinate of the group.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:145](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L145)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`x`](Group3D.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/group/Group3D.ts:154](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L154)

Gets or sets the Y-axis position coordinate of the group.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:158](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L158)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`y`](Group3D.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/group/Group3D.ts:167](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L167)

Gets or sets the Z-axis position coordinate of the group.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:171](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`z`](Group3D.md#z)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L71)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Group3D`](Group3D.md).[`addChild`](Group3D.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L89)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`Group2D`

현재 컨테이너

#### Inherited from

[`Group3D`](Group3D.md).[`addChildAt`](Group3D.md#addchildat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L61)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Group3D`](Group3D.md).[`contains`](Group3D.md#contains)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L111)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Group3D`](Group3D.md).[`getChildAt`](Group3D.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L125)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Group3D`](Group3D.md).[`getChildIndex`](Group3D.md#getchildindex)

***

### removeAllChildren()

> **removeAllChildren**(): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`Group2D`

현재 컨테이너

#### Inherited from

[`Group3D`](Group3D.md).[`removeAllChildren`](Group3D.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L203)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Group3D`](Group3D.md).[`removeChild`](Group3D.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L219)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Group3D`](Group3D.md).[`removeChildAt`](Group3D.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/group/Group3D.ts:354](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/group/Group3D.ts#L354)

Executes transform matrix updates for this group node and its child nodes, updating processes required for rendering.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Rendering state view data |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`render`](Group3D.md#render)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L140)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`setChildIndex`](Group3D.md#setchildindex)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L163)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`swapChildren`](Group3D.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L183)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`swapChildrenAt`](Group3D.md#swapchildrenat)


</details>
