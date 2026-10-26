[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Scene

# Class: Scene

Defined in: [src/display/scene/Scene.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L26)

View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.

조명(LightManager), 그림자(ShadowManager), 바람(WindManager), 물리 엔진(IPhysicsEngine), 지형(Landscape), 수체(Lake) 및 3D 디스플레이 객체 계층을 통합 관리합니다.

***

### Example
```typescript
const scene = new RedGPU.Display.Scene();
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#111111');
```

## Extends

- [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

## Constructors



***

### Constructor

> **new Scene**(): `Scene`

Defined in: [src/display/scene/Scene.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L42)

Scene 인스턴스를 생성합니다.

#### Returns

`Scene`

#### Overrides

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`constructor`](../namespaces/CoreMesh/classes/Object3DContainer.md#constructor)

## Properties



## Accessors



***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/display/scene/Scene.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L106)

씬의 배경 색상을 나타내는 ColorRGBA 인스턴스를 가져오거나 설정합니다.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

배경 색상(ColorRGBA) 인스턴스

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L110)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) |

##### Returns

`void`

***

***

### landscape

#### Get Signature

> **get** **landscape**(): [`Landscape`](../../Landscape/classes/Landscape.md)

Defined in: [src/display/scene/Scene.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L139)

씬에 바인딩된 지형(Landscape) 객체를 가져오거나 설정합니다. `null` 전달 시 지형이 해제됩니다.

##### Returns

[`Landscape`](../../Landscape/classes/Landscape.md)

바인딩된 Landscape 인스턴스 또는 `null`

#### Set Signature

> **set** **landscape**(`val`): `void`

Defined in: [src/display/scene/Scene.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`Landscape`](../../Landscape/classes/Landscape.md) |

##### Returns

`void`

***

***

### lightManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lightManager**(): [`LightManager`](../../Light/classes/LightManager.md)

Defined in: [src/display/scene/Scene.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L54)

씬의 조명을 관리하는 LightManager 인스턴스를 반환합니다.

##### Returns

[`LightManager`](../../Light/classes/LightManager.md)

LightManager 인스턴스

***

***

### physicsEngine

#### Get Signature

> **get** **physicsEngine**(): [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

Defined in: [src/display/scene/Scene.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L90)

씬에 적용된 물리 엔진 인스턴스를 가져오거나 설정합니다.

##### Returns

[`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

물리 엔진(IPhysicsEngine) 인스턴스

#### Set Signature

> **set** **physicsEngine**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md) |

##### Returns

`void`

***

***

### shadowManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowManager**(): [`ShadowManager`](../../Shadow/classes/ShadowManager.md)

Defined in: [src/display/scene/Scene.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L66)

씬의 그림자를 관리하는 ShadowManager 인스턴스를 반환합니다.

##### Returns

[`ShadowManager`](../../Shadow/classes/ShadowManager.md)

ShadowManager 인스턴스

***

***

### useBackgroundColor

#### Get Signature

> **get** **useBackgroundColor**(): `boolean`

Defined in: [src/display/scene/Scene.ts:123](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L123)

씬의 배경 색상 사용 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

배경 색상 사용 여부

#### Set Signature

> **set** **useBackgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L127)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### waterChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **waterChildren**(): [`Lake`](../../Water/classes/Lake.md)[]

Defined in: [src/display/scene/Scene.ts:158](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L158)

씬에 바인딩된 수체(Lake) 객체 리스트를 반환합니다.

##### Returns

[`Lake`](../../Water/classes/Lake.md)[]

등록된 Lake 인스턴스 배열

***

***

### windManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **windManager**(): [`WindManager`](../../Wind/classes/WindManager.md)

Defined in: [src/display/scene/Scene.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L78)

씬의 바람 물리 환경을 총괄하는 WindManager 인스턴스를 반환합니다.

##### Returns

[`WindManager`](../../Wind/classes/WindManager.md)

WindManager 인스턴스

## Methods



***

### addWater()

> **addWater**(`water`): `void`

Defined in: [src/display/scene/Scene.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L170)

수체 객체(Lake)를 씬 수체 리스트에 등록하고 자식 노드로 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `water` | [`Lake`](../../Water/classes/Lake.md) | 등록할 Lake 인스턴스 |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/scene/Scene.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L207)

씬과 내부 관리 리소스를 해제하고 파괴합니다.

#### Returns

`void`

#### Overrides

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`destroy`](../namespaces/CoreMesh/classes/Object3DContainer.md#destroy)

***

***

### removeWater()

> **removeWater**(`water`): `void`

Defined in: [src/display/scene/Scene.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/scene/Scene.ts#L188)

씬에서 수체 객체(Lake)를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `water` | [`Lake`](../../Water/classes/Lake.md) | 제거할 Lake 인스턴스 |

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L27)

객체의 월드 변환을 나타내는 모델 행렬입니다.

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`modelMatrix`](../namespaces/CoreMesh/classes/Object3DContainer.md#modelmatrix)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`children`](../namespaces/CoreMesh/classes/Object3DContainer.md#children)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`instanceId`](../namespaces/CoreMesh/classes/Object3DContainer.md#instanceid)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`name`](../namespaces/CoreMesh/classes/Object3DContainer.md#name)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`numChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#numchildren)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`uuid`](../namespaces/CoreMesh/classes/Object3DContainer.md#uuid)

***

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

지정한 인덱스 위치에 자식 객체를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입할 인덱스 위치 |

#### Returns

`Scene`

현재 컨테이너 인스턴스

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchildat)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`contains`](../namespaces/CoreMesh/classes/Object3DContainer.md#contains)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildat)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildindex)

***

***

### removeAllChildren()

> **removeAllChildren**(): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

컨테이너의 모든 자식 객체를 제거합니다.

#### Returns

`Scene`

현재 컨테이너 인스턴스

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeAllChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#removeallchildren)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechild)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechildat)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`setChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#setchildindex)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildren)

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildrenAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildrenat)

</details>
