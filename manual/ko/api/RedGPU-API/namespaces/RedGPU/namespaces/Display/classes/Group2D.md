[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Group2D

# Class: Group2D

Defined in: [src/display/group/Group2D.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L20)

2D 공간에서 자식 객체들을 계층적으로 그룹화하고 일괄 변환(위치, 회전, 스케일)을 적용하는 컨테이너 클래스입니다.

***

### Example
```typescript
const group = new RedGPU.Display.Group2D();
group.addChild(sprite1);
group.addChild(sprite2);
scene.addChild(group);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/" style="width:100%; height:500px;"></iframe>

## See

[Group2D basic example](https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/)

## Extends

- [`Group3D`](Group3D.md)

## Constructors



***

### Constructor

> **new Group2D**(`name?`): `Group2D`

Defined in: [src/display/group/Group2D.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L36)

`Group2D` 인스턴스를 생성합니다.

#### Example
```typescript
const group = new RedGPU.Display.Group2D('myGroup2D');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | 그룹 식별 이름 (선택) |

#### Returns

`Group2D`

#### Overrides

[`Group3D`](Group3D.md).[`constructor`](Group3D.md#constructor)

## Properties



## Accessors



***

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [src/display/group/Group2D.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L50)

그룹의 2D 회전각(단위: Degree)을 가져오거나 설정합니다. 설정 시 내부적으로 Z축 회전(`rotationZ`)에 연동됩니다.

##### Returns

`number`

2D 회전각 (Degree)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L55)

그룹의 회전각 배열(`[rotationX, rotationY, rotationZ]`, 단위: Degree)을 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

`[rotationX, rotationY, rotationZ]` 회전각 배열 (Degree)

#### Overrides

[`Group3D`](Group3D.md).[`rotation`](Group3D.md#rotation)

***

## Methods



***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L98)

그룹의 2D 위치를 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.

#### Example
```typescript
group.setPosition(100, 200);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 좌표 |
| `y?` | `number` | Y축 좌표 (선택, 기본값: `x`) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setPosition`](Group3D.md#setposition)

***

***

### setRotation()

> **setRotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L117)

그룹의 2D 회전각(단위: Degree)을 설정합니다.

#### Example
```typescript
group.setRotation(45);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전각 (단위: Degree) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setRotation`](Group3D.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group2D.ts#L76)

그룹의 2D 스케일을 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.

#### Example
```typescript
group.setScale(2, 2);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 배율 |
| `y?` | `number` | Y축 스케일 배율 (선택, 기본값: `x`) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setScale`](Group3D.md#setscale)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L37)

그룹의 로컬 변환 행렬(`mat4`)

#### Inherited from

[`Group3D`](Group3D.md).[`localMatrix`](Group3D.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L32)

그룹의 월드 변환 행렬(`mat4`)

#### Inherited from

[`Group3D`](Group3D.md).[`modelMatrix`](Group3D.md#modelmatrix)

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L46)

자식 객체 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 Mesh 배열 (`Mesh[]`)

#### Inherited from

[`Group3D`](Group3D.md).[`children`](Group3D.md#children)

***

***

### dirtyTransform

#### Get Signature

> **get** **dirtyTransform**(): `boolean`

Defined in: [src/display/group/Group3D.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L87)

변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

변환 행렬 갱신 필요 여부

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`dirtyTransform`](Group3D.md#dirtytransform)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`Group3D`](Group3D.md).[`instanceId`](Group3D.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`name`](Group3D.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L58)

등록된 자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 객체 개수

#### Inherited from

[`Group3D`](Group3D.md).[`numChildren`](Group3D.md#numchildren)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/group/Group3D.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L103)

이 그룹 객체가 속한 부모 컨테이너(`Object3DContainer`)를 가져오거나 설정합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

부모 컨테이너 객체

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:107](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L107)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`parent`](Group3D.md#parent)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/group/Group3D.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L119)

X축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 피벗 좌표

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:123](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L123)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotX`](Group3D.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/group/Group3D.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L136)

Y축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 피벗 좌표

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L140)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotY`](Group3D.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/group/Group3D.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L153)

Z축 피벗(중심점) 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z축 피벗 좌표

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L157)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotZ`](Group3D.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/display/group/Group3D.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L221)

그룹의 위치 좌표 배열(`[x, y, z]`)을 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

`[x, y, z]` 위치 좌표 배열

#### Inherited from

[`Group3D`](Group3D.md).[`position`](Group3D.md#position)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/Group3D.ts:296](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L296)

X축 회전각(단위: Degree)을 가져오거나 설정합니다.

##### Returns

`number`

X축 회전각 (Degree)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L300)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationX`](Group3D.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/group/Group3D.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L313)

Y축 회전각(단위: Degree)을 가져오거나 설정합니다.

##### Returns

`number`

Y축 회전각 (Degree)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:317](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L317)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationY`](Group3D.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/group/Group3D.ts:330](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L330)

Z축 회전각(단위: Degree)을 가져오거나 설정합니다.

##### Returns

`number`

Z축 회전각 (Degree)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:334](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L334)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationZ`](Group3D.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `number`[]

Defined in: [src/display/group/Group3D.ts:284](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L284)

그룹의 스케일 배율 배열(`[scaleX, scaleY, scaleZ]`)을 반환합니다.

##### Returns

`number`[]

`[scaleX, scaleY, scaleZ]` 스케일 배열

#### Inherited from

[`Group3D`](Group3D.md).[`scale`](Group3D.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/Group3D.ts:233](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L233)

X축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

X축 스케일 배율

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleX`](Group3D.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/group/Group3D.ts:250](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L250)

Y축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

Y축 스케일 배율

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:254](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L254)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleY`](Group3D.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/group/Group3D.ts:267](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L267)

Z축 스케일 배율을 가져오거나 설정합니다.

##### Returns

`number`

Z축 스케일 배율

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:271](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L271)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleZ`](Group3D.md#scalez)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`Group3D`](Group3D.md).[`uuid`](Group3D.md#uuid)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/group/Group3D.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L170)

그룹의 X축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 위치 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L174)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`x`](Group3D.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/group/Group3D.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L187)

그룹의 Y축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 위치 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L191)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`y`](Group3D.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/group/Group3D.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L204)

그룹의 Z축 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z축 위치 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L208)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`z`](Group3D.md#z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L89)

자식 객체를 컨테이너 끝에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 자식 객체 (실패 시 `null`)

#### Inherited from

[`Group3D`](Group3D.md).[`addChild`](Group3D.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

지정한 인덱스 위치에 자식 객체를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입할 인덱스 위치 |

#### Returns

`Group2D`

현재 컨테이너 인스턴스

#### Inherited from

[`Group3D`](Group3D.md).[`addChildAt`](Group3D.md#addchildat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L73)

지정한 객체가 현재 컨테이너의 자식인지 확인합니다.

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

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L322)

컨테이너 내 모든 자식 객체를 파괴하고 컨테이너에서 제거합니다.

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`destroy`](Group3D.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L143)

지정한 인덱스에 위치한 자식 객체를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 인덱스 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 (범위 초과 시 `undefined`)

#### Inherited from

[`Group3D`](Group3D.md).[`getChildAt`](Group3D.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L163)

지정한 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 인덱스를 조회할 자식 객체 |

#### Returns

`number`

자식 객체의 인덱스 (존재하지 않으면 `-1`)

#### Inherited from

[`Group3D`](Group3D.md).[`getChildIndex`](Group3D.md#getchildindex)

***

***

### removeAllChildren()

> **removeAllChildren**(): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

컨테이너의 모든 자식 객체를 제거합니다.

#### Returns

`Group2D`

현재 컨테이너 인스턴스

#### Inherited from

[`Group3D`](Group3D.md).[`removeAllChildren`](Group3D.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L265)

지정한 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Inherited from

[`Group3D`](Group3D.md).[`removeChild`](Group3D.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L290)

지정한 인덱스의 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 자식 객체의 인덱스 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Throws

해당 인덱스에 자식 객체가 존재하지 않을 경우 Error 발생

#### Inherited from

[`Group3D`](Group3D.md).[`removeChildAt`](Group3D.md#removechildat)

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/group/Group3D.ts:446](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/group/Group3D.ts#L446)

그룹의 변환 행렬을 갱신하고 하위 자식 객체들을 순회하며 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`render`](Group3D.md#render)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L184)

자식 객체의 인덱스 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 위치를 변경할 자식 객체 |
| `index` | `number` | 새로 지정할 인덱스 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`setChildIndex`](Group3D.md#setchildindex)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L213)

두 자식 객체의 배열 내 순서(인덱스)를 서로 맞바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 자식 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 자식 객체 |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`swapChildren`](Group3D.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L239)

지정된 두 인덱스에 있는 자식 객체들의 위치를 서로 맞바꿉니다.

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
