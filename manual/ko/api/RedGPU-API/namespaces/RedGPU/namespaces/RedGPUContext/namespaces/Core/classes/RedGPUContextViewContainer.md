[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [RedGPUContext](../../../README.md) / [Core](../README.md) / RedGPUContextViewContainer

# Class: RedGPUContextViewContainer

Defined in: [src/context/core/RedGPUContextViewContainer.ts:13](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L13)

View3D 객체들을 관리하는 컨테이너 클래스입니다.


뷰의 추가, 제거, 순서 변경 및 조회를 담당합니다.


## Extended by

- [`RedGPUContext`](../../../classes/RedGPUContext.md)

## Constructors

### Constructor

> **new RedGPUContextViewContainer**(): `RedGPUContextViewContainer`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:24](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L24)

RedGPUContextViewContainer 생성자


#### Returns

`RedGPUContextViewContainer`

## Accessors

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:39](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L39)

소유한 View3D 객체의 개수를 반환합니다.


##### Returns

`number`

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:31](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L31)

이 인스턴스가 소유한 View3D 목록을 반환합니다.


##### Returns

[`View3D`](../../../../Display/classes/View3D.md)[]

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:64](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L64)

뷰 리스트에 뷰를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 추가할 View3D 객체

#### Returns

`void`

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:79](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L79)

뷰 리스트의 지정된 인덱스에 뷰를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 추가할 View3D 객체
| `index` | `number` | 삽입할 인덱스

#### Returns

`void`

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:53](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L53)

주어진 자식 View3D가 현재 컨테이너에 포함되어 있는지 확인합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../../../Display/classes/View3D.md) | 확인할 자식 View3D

#### Returns

`boolean`

포함 여부


***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:95](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L95)

지정된 인덱스의 뷰를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 뷰의 인덱스

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:107](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L107)

지정된 뷰의 인덱스를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 검색할 View3D 객체

#### Returns

`number`

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:217](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L217)

뷰 리스트의 모든 뷰를 제거합니다.


#### Returns

`void`

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:189](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L189)

뷰 리스트에서 지정된 뷰를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 제거할 View3D 객체

#### Returns

`void`

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:203](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L203)

뷰 리스트에서 지정된 인덱스의 뷰를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 뷰의 인덱스

#### Returns

`void`

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L125)

지정된 뷰를 뷰 리스트의 특정 인덱스로 이동시킵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 이동할 View3D 객체
| `index` | `number` | 이동할 인덱스

#### Returns

`void`

#### Throws

뷰가 등록되지 않았거나 인덱스가 범위를 벗어난 경우 에러 발생


***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:152](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L152)

뷰 리스트에서 두 뷰의 위치를 교환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../../../Display/classes/View3D.md) | 교환할 첫 번째 View3D
| `view2` | [`View3D`](../../../../Display/classes/View3D.md) | 교환할 두 번째 View3D

#### Returns

`void`

#### Throws

뷰가 이 컨텍스트의 자식이 아닐 경우 에러 발생


***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:171](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/context/core/RedGPUContextViewContainer.ts#L171)

지정된 인덱스에 있는 두 뷰의 위치를 교환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스
| `index2` | `number` | 두 번째 인덱스

#### Returns

`void`
