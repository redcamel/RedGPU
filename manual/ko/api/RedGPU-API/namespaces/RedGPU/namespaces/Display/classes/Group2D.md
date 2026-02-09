[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Group2D

# Class: Group2D

Defined in: [src/display/group/Group2D.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L22)

2D 공간에서의 그룹(계층) 노드입니다.


geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 관리합니다. 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.


* ### Example
```typescript
const group = new RedGPU.Display.Group2D();
group.addChild(sprite1);
group.addChild(sprite2);
scene.addChild(group);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/" ></iframe>

## Extends

- [`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md)

## Constructors

### Constructor

> **new Group2D**(`name?`): `Group2D`

Defined in: [src/display/group/Group2D.ts:46](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L46)

Group2D 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | 그룹 이름(선택)

#### Returns

`Group2D`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`constructor`](../namespaces/CoreGroup/classes/AGroupBase.md#constructor)

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/core/AGroupBase.ts:34](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L34)

로컬 변환 행렬


#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`localMatrix`](../namespaces/CoreGroup/classes/AGroupBase.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/core/AGroupBase.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L29)

모델 변환 행렬


#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`modelMatrix`](../namespaces/CoreGroup/classes/AGroupBase.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`children`](../namespaces/CoreGroup/classes/AGroupBase.md#children)

***

### dirtyTransform

#### Get Signature

> **get** **dirtyTransform**(): `boolean`

Defined in: [src/display/group/core/AGroupBase.ts:146](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L146)

변환 행렬 갱신 필요 여부 반환

##### Returns

`boolean`

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:153](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L153)

변환 행렬 갱신 필요 여부 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`dirtyTransform`](../namespaces/CoreGroup/classes/AGroupBase.md#dirtytransform)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/group/Group2D.ts:55](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L55)

그룹 이름을 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:67](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L67)

그룹 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`name`](../namespaces/CoreGroup/classes/AGroupBase.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`numChildren`](../namespaces/CoreGroup/classes/AGroupBase.md#numchildren)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/group/core/AGroupBase.ts:175](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L175)

설정된 부모 객체 반환

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:183](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L183)

부모 객체 설정

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | 부모 객체 |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`parent`](../namespaces/CoreGroup/classes/AGroupBase.md#parent)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:190](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L190)

피벗 X 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:197](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L197)

피벗 X 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`pivotX`](../namespaces/CoreGroup/classes/AGroupBase.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:205](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L205)

피벗 Y 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:212](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L212)

피벗 Y 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`pivotY`](../namespaces/CoreGroup/classes/AGroupBase.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:220](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L220)

피벗 Z 반환

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:227](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L227)

피벗 Z 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`pivotZ`](../namespaces/CoreGroup/classes/AGroupBase.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/display/group/core/AGroupBase.ts:280](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L280)

위치 배열 반환 [x, y, z]

##### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`position`](../namespaces/CoreGroup/classes/AGroupBase.md#position)

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [src/display/group/Group2D.ts:76](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L76)

그룹의 회전 값을 반환합니다. (라디안)


##### Returns

`number`

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:88](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L88)

그룹의 회전 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전 값 (라디안)

##### Returns

`void`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`rotation`](../namespaces/CoreGroup/classes/AGroupBase.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:339](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L339)

X축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:346](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L346)

X축 회전 설정 (deg)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`rotationX`](../namespaces/CoreGroup/classes/AGroupBase.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:354](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L354)

Y축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:361](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L361)

Y축 회전 설정 (deg)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`rotationY`](../namespaces/CoreGroup/classes/AGroupBase.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:369](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L369)

Z축 회전 반환 (deg)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:376](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L376)

Z축 회전 설정 (deg)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`rotationZ`](../namespaces/CoreGroup/classes/AGroupBase.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `number`[]

Defined in: [src/display/group/core/AGroupBase.ts:332](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L332)

스케일 배열 반환 [x, y, z]

##### Returns

`number`[]

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`scale`](../namespaces/CoreGroup/classes/AGroupBase.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:287](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L287)

X 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:294](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L294)

X 스케일 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`scaleX`](../namespaces/CoreGroup/classes/AGroupBase.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:302](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L302)

Y 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:309](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L309)

Y 스케일 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`scaleY`](../namespaces/CoreGroup/classes/AGroupBase.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:317](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L317)

Z 스케일 반환

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:324](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L324)

Z 스케일 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`scaleZ`](../namespaces/CoreGroup/classes/AGroupBase.md#scalez)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:235](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L235)

X 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:242](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L242)

X 좌표 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`x`](../namespaces/CoreGroup/classes/AGroupBase.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:250](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L250)

Y 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:257](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L257)

Y 좌표 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`y`](../namespaces/CoreGroup/classes/AGroupBase.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/group/core/AGroupBase.ts:265](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L265)

Z 좌표 반환

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:272](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L272)

Z 좌표 설정

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`z`](../namespaces/CoreGroup/classes/AGroupBase.md#z)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`addChild`](../namespaces/CoreGroup/classes/AGroupBase.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L87)

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

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`addChildAt`](../namespaces/CoreGroup/classes/AGroupBase.md#addchildat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`contains`](../namespaces/CoreGroup/classes/AGroupBase.md#contains)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`getChildAt`](../namespaces/CoreGroup/classes/AGroupBase.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`getChildIndex`](../namespaces/CoreGroup/classes/AGroupBase.md#getchildindex)

***

### removeAllChildren()

> **removeAllChildren**(): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`Group2D`

현재 컨테이너

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`removeAllChildren`](../namespaces/CoreGroup/classes/AGroupBase.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`removeChild`](../namespaces/CoreGroup/classes/AGroupBase.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`removeChildAt`](../namespaces/CoreGroup/classes/AGroupBase.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/group/core/AGroupBase.ts:440](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/core/AGroupBase.ts#L440)

렌더링 및 변환 행렬 계산을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 상태 데이터 |

#### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`render`](../namespaces/CoreGroup/classes/AGroupBase.md#render)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`setChildIndex`](../namespaces/CoreGroup/classes/AGroupBase.md#setchildindex)

***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:119](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L119)

그룹의 위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표
| `y?` | `number` | Y 좌표 (생략 시 x와 동일)

#### Returns

`void`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`setPosition`](../namespaces/CoreGroup/classes/AGroupBase.md#setposition)

***

### setRotation()

> **setRotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:132](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L132)

그룹의 회전 값을 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전 값 (라디안)

#### Returns

`void`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`setRotation`](../namespaces/CoreGroup/classes/AGroupBase.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:103](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/group/Group2D.ts#L103)

그룹의 스케일을 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일)

#### Returns

`void`

#### Overrides

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`setScale`](../namespaces/CoreGroup/classes/AGroupBase.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`swapChildren`](../namespaces/CoreGroup/classes/AGroupBase.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`AGroupBase`](../namespaces/CoreGroup/classes/AGroupBase.md).[`swapChildrenAt`](../namespaces/CoreGroup/classes/AGroupBase.md#swapchildrenat)
