[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Group2D

# Class: Group2D

Defined in: [src/display/group/Group2D.ts:21](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L21)

2D 공간 내에서 자식 객체들을 계층적으로 구성하고 그룹 제어하기 위한 컨테이너 클래스입니다.

자체적인 geometry나 material 없이 오직 트랜스폼(위치, 회전, 스케일) 정보와 자식 계층만을 관리합니다. 씬 내에서 논리적인 그룹을 지정하고 자식 노드들에게 2D 변환을 일괄 적용할 때 사용됩니다.

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

Defined in: [src/display/group/Group2D.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L35)

Group2D 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | 그룹의 식별 이름 (선택)

#### Returns

`Group2D`

#### Overrides

[`Group3D`](Group3D.md).[`constructor`](Group3D.md#constructor)

## Properties

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [src/display/group/Group2D.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L45)

그룹의 회전 값(라디안)을 반환하거나 설정합니다. 설정 시 내부적으로 Z축 회전에 연동됩니다.

##### Returns

`number`

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:50](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L50)

그룹의 회전각 [rotationX, rotationY, rotationZ] 배열(Degree)을 가져옵니다.

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

Defined in: [src/display/group/Group2D.ts:81](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L81)

그룹의 2D 위치(X, Y 좌표)를 설정합니다. Y값을 생략하면 X값과 동일하게 대입됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 좌표값
| `y?` | `number` | Y축 좌표값 (선택, 기본값: x)

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setPosition`](Group3D.md#setposition)

***

### setRotation()

> **setRotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:94](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L94)

그룹의 2D 회전 값을 라디안(Radian) 단위로 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전각 (라디안 단위)

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setRotation`](Group3D.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:65](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group2D.ts#L65)

그룹의 2D 스케일을 일괄적으로 설정합니다. Y값을 생략하면 X값과 동일하게 통일되어 적용됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 배율
| `y?` | `number` | Y축 스케일 배율 (선택, 기본값: x)

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setScale`](Group3D.md#setscale)

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`Group3D`](Group3D.md).[`instanceId`](Group3D.md#instanceid)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:38](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L38)

그룹의 로컬 변환 행렬

#### Inherited from

[`Group3D`](Group3D.md).[`localMatrix`](Group3D.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:33](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L33)

그룹의 최종 전역 모델 변환 행렬

#### Inherited from

[`Group3D`](Group3D.md).[`modelMatrix`](Group3D.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L44)

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

Defined in: [src/display/group/Group3D.ts:78](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L78)

변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 설정하거나 가져옵니다.

##### Returns

`boolean`

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:82](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L82)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`name`](Group3D.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L52)

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

Defined in: [src/display/group/Group3D.ts:90](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L90)

이 그룹 객체가 포함된 부모 컨테이너(Object3DContainer)를 설정하거나 가져옵니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:94](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L94)

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

Defined in: [src/display/group/Group3D.ts:102](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L102)

X축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:106](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L106)

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

Defined in: [src/display/group/Group3D.ts:115](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L115)

Y축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:119](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L119)

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

Defined in: [src/display/group/Group3D.ts:128](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L128)

Z축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:132](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L132)

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

Defined in: [src/display/group/Group3D.ts:180](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L180)

그룹의 X, Y, Z 위치 좌표 배열 [x, y, z]을 가져옵니다.

##### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Group3D`](Group3D.md).[`position`](Group3D.md#position)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/Group3D.ts:235](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L235)

X축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:239](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L239)

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

Defined in: [src/display/group/Group3D.ts:248](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L248)

Y축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:252](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L252)

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

Defined in: [src/display/group/Group3D.ts:261](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L261)

Z축 회전각(Degree)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:265](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L265)

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

Defined in: [src/display/group/Group3D.ts:227](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L227)

그룹의 X, Y, Z 스케일 배율 배열 [scaleX, scaleY, scaleZ]을 가져옵니다.

##### Returns

`number`[]

#### Inherited from

[`Group3D`](Group3D.md).[`scale`](Group3D.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/Group3D.ts:188](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L188)

X축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:192](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L192)

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

Defined in: [src/display/group/Group3D.ts:201](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L201)

Y축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:205](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L205)

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

Defined in: [src/display/group/Group3D.ts:214](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L214)

Z축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:218](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L218)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`Group3D`](Group3D.md).[`uuid`](Group3D.md#uuid)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/group/Group3D.ts:141](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L141)

그룹의 X축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:145](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L145)

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

Defined in: [src/display/group/Group3D.ts:154](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L154)

그룹의 Y축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:158](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L158)

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

Defined in: [src/display/group/Group3D.ts:167](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L167)

그룹의 Z축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:171](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L171)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L71)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L89)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L61)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L111)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L125)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`Group2D`

현재 컨테이너

#### Inherited from

[`Group3D`](Group3D.md).[`removeAllChildren`](Group3D.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L203)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L219)

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

Defined in: [src/display/group/Group3D.ts:354](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/group/Group3D.ts#L354)

이 그룹 노드 및 하위 자식 노드들의 트랜스폼 행렬 갱신을 실행하고 렌더링에 필요한 처리를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더링 상태 뷰 데이터

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`render`](Group3D.md#render)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L140)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L163)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L183)

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
