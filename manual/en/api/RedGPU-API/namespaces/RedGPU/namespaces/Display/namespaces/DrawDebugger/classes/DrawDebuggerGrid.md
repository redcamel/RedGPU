[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / DrawDebuggerGrid

# Class: DrawDebuggerGrid

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L49)

Debugger class that renders a procedural anti-aliased grid on the base ground plane (XZ plane) of a 3D scene.

Displays minor grid lines, major grid lines, X-axis (Red) and Z-axis (Blue) center lines, and supports distance-based fadeout.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable via the grid property of View3D.
view.grid = true;
```

## See

[DrawDebugger basic example](https://redcamel.github.io/RedGPU/examples/3d/drawDebugger/basic/)

## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Constructors



***

### Constructor

> **new DrawDebuggerGrid**(`redGPUContext`): `DrawDebuggerGrid`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L96)

Creates a `DrawDebuggerGrid` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`DrawDebuggerGrid`

#### Overrides

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Accessors



***

### axisLineWidth

#### Get Signature

> **get** **axisLineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:312](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L312)

Gets or sets the screen pixel line width for X/Z axis lines (default: 2.0).

##### Returns

`number`

Axis line width

#### Set Signature

> **set** **axisLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:335](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L335)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeEnd

#### Get Signature

> **get** **fadeEnd**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:350](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L350)

Gets or sets the camera distance where distance fade ends (unit: m, default: 60.0).

##### Returns

`number`

Fade end distance

#### Set Signature

> **set** **fadeEnd**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:373](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L373)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeStart

#### Get Signature

> **get** **fadeStart**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:331](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L331)

Gets or sets the camera distance where distance fade starts (unit: m, default: 25.0).

##### Returns

`number`

Fade start distance

#### Set Signature

> **set** **fadeStart**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:354](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L354)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### gridSize

#### Get Signature

> **get** **gridSize**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L236)

Gets or sets the minor grid spacing (unit: m, default: 1.0).

##### Returns

`number`

Minor grid spacing

#### Set Signature

> **set** **gridSize**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lineColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lineColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L369)

Returns the minor grid line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Minor grid color instance

***

***

### lineWidth

#### Get Signature

> **get** **lineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:274](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L274)

Gets or sets the screen pixel line width for minor grid lines (default: 1.0).

##### Returns

`number`

Minor grid line width

#### Set Signature

> **set** **lineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:297](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L297)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### majorLineColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **majorLineColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:388](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L388)

Returns the major grid line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Major grid color instance

***

***

### majorLineWidth

#### Get Signature

> **get** **majorLineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L293)

Gets or sets the screen pixel line width for major grid lines (default: 1.5).

##### Returns

`number`

Major grid line width

#### Set Signature

> **set** **majorLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L316)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### majorStep

#### Get Signature

> **get** **majorStep**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L255)

Gets or sets the major grid spacing (unit: m, default: 10.0).

##### Returns

`number`

Major grid spacing

#### Set Signature

> **set** **majorStep**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:278](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L278)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:224](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L224)

Gets or sets the width and length of the grid plane (unit: m, default: 100).

##### Returns

`number`

Grid plane size

#### Set Signature

> **set** **size**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:240](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L240)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### xAxisColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **xAxisColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:400](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L400)

Returns the X-axis (Red) center line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

X-axis center line color instance

***

***

### zAxisColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **zAxisColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:412](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L412)

Returns the Z-axis (Blue) center line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Z-axis center line color instance

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:471](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L471)

Destroys the `DrawDebuggerGrid` instance and releases allocated GPU resources and draw command slots.

#### Returns

`void`

***

***

### render()

> **render**(`view`, `targetTextureView`, `depthTextureView`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:430](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L430)

Renders the debug grid.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | View3D instance to render |
| `targetTextureView` | `GPUTextureView` | Color render target texture view |
| `depthTextureView` | `GPUTextureView` | Depth render target texture view |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`instanceId`](../../../../BaseObject/classes/BaseObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`name`](../../../../BaseObject/classes/BaseObject.md#name)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

***

</details>
