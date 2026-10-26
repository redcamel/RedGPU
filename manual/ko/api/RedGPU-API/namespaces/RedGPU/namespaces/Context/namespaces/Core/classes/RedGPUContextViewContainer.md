[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextViewContainer

# Class: RedGPUContextViewContainer

Defined in: [src/context/core/RedGPUContextViewContainer.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L22)

`View3D` 인스턴스들의 추가, 제거, 순서 변경 및 조회를 관리하는 컨테이너 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

## Extended by

- [`RedGPUContext`](../../../classes/RedGPUContext.md)

## Constructors

### Constructor

> **new RedGPUContextViewContainer**(): `RedGPUContextViewContainer`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L29)

RedGPUContextViewContainer 인스턴스를 생성합니다.

#### Returns

`RedGPUContextViewContainer`

## Accessors

### numViews

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L52)

등록된 `View3D`의 총 개수를 반환합니다.

##### Returns

`number`

등록된 뷰 개수

***

### viewList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewList**(): [`View3D`](../../../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L40)

등록된 `View3D` 목록을 반환합니다.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)[]

`View3D` 배열

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L82)

뷰 리스트의 끝에 `View3D`를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 추가할 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

`view`가 `View3D` 인스턴스가 아닐 경우 에러 발생

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L101)

뷰 리스트의 지정된 인덱스에 `View3D`를 배치합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 추가할 `View3D` 인스턴스 |
| `index` | `number` | 배치할 위치 인덱스 (양의 정수) |

#### Returns

`void`

#### Throws

`view`가 `View3D` 인스턴스가 아니거나 `index`가 유효한 uint 범위가 아닐 경우 에러 발생

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:67](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L67)

지정된 `View3D`가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../../../Display/classes/View3D.md) | 포함 여부를 확인할 `View3D` 인스턴스 |

#### Returns

`boolean`

포함 여부

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L124)

지정된 인덱스에 위치한 `View3D`를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 뷰의 인덱스 |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

해당 인덱스의 `View3D` 인스턴스

#### Throws

`index`가 유효한 uint 범위가 아닐 경우 에러 발생

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L143)

지정된 `View3D`의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 검색할 `View3D` 인스턴스 |

#### Returns

`number`

뷰의 인덱스 (존재하지 않으면 `-1`)

#### Throws

`view`가 `View3D` 인스턴스가 아닐 경우 에러 발생

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L265)

뷰 리스트에 등록된 모든 `View3D`를 제거합니다.

#### Returns

`void`

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L233)

뷰 리스트에서 지정된 `View3D`를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 제거할 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

해당 뷰가 리스트에 존재하지 않을 경우 에러 발생

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L251)

뷰 리스트에서 지정된 인덱스의 `View3D`를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 뷰의 인덱스 |

#### Returns

`void`

#### Throws

`index`가 리스트 범위를 벗어난 경우 에러 발생

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L162)

등록된 `View3D`를 뷰 리스트의 지정된 인덱스로 이동합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 이동할 `View3D` 인스턴스 |
| `index` | `number` | 이동할 목표 인덱스 |

#### Returns

`void`

#### Throws

뷰가 등록되어 있지 않거나 `index`가 리스트 범위를 벗어난 경우 에러 발생

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L188)

뷰 리스트에 등록된 두 `View3D`의 순서를 서로 교환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../../../Display/classes/View3D.md) | 교환할 첫 번째 `View3D` 인스턴스 |
| `view2` | [`View3D`](../../../../Display/classes/View3D.md) | 교환할 두 번째 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

두 뷰 중 하나라도 현재 컨테이너에 등록되어 있지 않은 경우 에러 발생

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextViewContainer.ts#L211)

지정된 두 인덱스에 위치한 `View3D`들의 순서를 서로 교환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 뷰 인덱스 |
| `index2` | `number` | 두 번째 뷰 인덱스 |

#### Returns

`void`

#### Throws

두 인덱스가 동일하거나 리스트 범위를 벗어난 경우 에러 발생
