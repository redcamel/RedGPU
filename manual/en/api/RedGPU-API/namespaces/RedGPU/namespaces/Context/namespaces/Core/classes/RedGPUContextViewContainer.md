[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextViewContainer

# Class: RedGPUContextViewContainer

Defined in: [src/context/core/RedGPUContextViewContainer.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L22)

Container class that manages adding, removing, reordering, and querying `View3D` instances.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L29)

Creates a RedGPUContextViewContainer instance.

#### Returns

`RedGPUContextViewContainer`

## Accessors

### numViews

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L52)

Returns the total number of registered `View3D` instances.

##### Returns

`number`

Number of registered views

***

### viewList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewList**(): [`View3D`](../../../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L40)

Returns the list of registered `View3D` instances.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)[]

Array of `View3D` instances

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L82)

Appends a `View3D` to the end of the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to add |

#### Returns

`void`

#### Throws

Throws an error if `view` is not a `View3D` instance

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L101)

Places a `View3D` at the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to add |
| `index` | `number` | Target index (unsigned integer) |

#### Returns

`void`

#### Throws

Throws an error if `view` is not a `View3D` instance or `index` is not a valid uint

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L67)

Checks whether the specified `View3D` is contained in the current container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to check |

#### Returns

`boolean`

Whether the view is contained

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L124)

Returns the `View3D` at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to retrieve |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

`View3D` instance at the specified index

#### Throws

Throws an error if `index` is not a valid uint

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L143)

Returns the index of the specified `View3D`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to find |

#### Returns

`number`

Index of the view (`-1` if not found)

#### Throws

Throws an error if `view` is not a `View3D` instance

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L265)

Removes all registered `View3D` instances from the view list.

#### Returns

`void`

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:233](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L233)

Removes the specified `View3D` from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to remove |

#### Returns

`void`

#### Throws

Throws an error if the view is not found in the view list

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L251)

Removes the `View3D` at the specified index from the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the view to remove |

#### Returns

`void`

#### Throws

Throws an error if `index` is out of range

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L162)

Moves a registered `View3D` to the specified index in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to move |
| `index` | `number` | Target index to move to |

#### Returns

`void`

#### Throws

Throws an error if the view is not registered or `index` is out of bounds

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L188)

Swaps the positions of two registered `View3D` instances in the view list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../../../Display/classes/View3D.md) | First `View3D` instance to swap |
| `view2` | [`View3D`](../../../../Display/classes/View3D.md) | Second `View3D` instance to swap |

#### Returns

`void`

#### Throws

Throws an error if either view is not registered in this container

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L211)

Swaps the `View3D` instances at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First view index |
| `index2` | `number` | Second view index |

#### Returns

`void`

#### Throws

Throws an error if the indices are identical or out of bounds
