[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextViewContainer

# Class: RedGPUContextViewContainer

Defined in: [src/context/core/RedGPUContextViewContainer.ts:21](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L21)


Container class that manages View3D objects.


Handles adding, removing, reordering, and retrieving views.

* ### Example
```typescript
// RedGPUContext extends RedGPUContextViewContainer
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

## Extended by

- [`RedGPUContext`](../../../classes/RedGPUContext.md)

## Constructors

### Constructor

> **new RedGPUContextViewContainer**(): `RedGPUContextViewContainer`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:32](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L32)


RedGPUContextViewContainer constructor

#### Returns

`RedGPUContextViewContainer`

## Accessors

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:47](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L47)


Returns the number of View3D objects owned.

##### Returns

`number`

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:39](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L39)


Returns the list of View3D objects owned by this instance.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)[]

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:72](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L72)


Adds a view to the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D object to add |

#### Returns

`void`

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L87)


Adds a view at the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D object to add |
| `index` | `number` | Index to insert at |

#### Returns

`void`

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:61](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L61)


Checks if the given child View3D is contained in the current container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../../../Display/classes/View3D.md) | Child View3D to check |

#### Returns

`boolean`


Containment status

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:103](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L103)


Retrieves the view at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to retrieve |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:115](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L115)


Returns the index of the specified view.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D object to search for |

#### Returns

`number`

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:225](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L225)


Removes all views from the view list.

#### Returns

`void`

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:197](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L197)


Removes the specified view from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D object to remove |

#### Returns

`void`

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L211)


Removes the view at the specified index from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to remove |

#### Returns

`void`

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:133](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L133)


Moves the specified view to a specific index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D object to move |
| `index` | `number` | Index to move to |

#### Returns

`void`

#### Throws


Throws error if view is not registered or index is out of bounds

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:160](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L160)


Swaps the positions of two views in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../../../Display/classes/View3D.md) | First View3D to swap |
| `view2` | [`View3D`](../../../../Display/classes/View3D.md) | Second View3D to swap |

#### Returns

`void`

#### Throws


Throws error if view is not a child of this context

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:179](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/context/core/RedGPUContextViewContainer.ts#L179)


Swaps the positions of two views at the specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`
