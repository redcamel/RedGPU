[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / DrawDebuggerGrid

# Class: DrawDebuggerGrid

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:82](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L82)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:119](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L119)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:333](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L333)

Gets or sets the screen pixel line width for X/Z axis lines (default: 2.0).

##### Returns

`number`

Axis line width

#### Set Signature

> **set** **axisLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:337](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L337)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:371](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L371)

Gets or sets the camera distance where distance fade ends (unit: m, default: 60.0).

##### Returns

`number`

Fade end distance

#### Set Signature

> **set** **fadeEnd**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:375](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L375)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:352](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L352)

Gets or sets the camera distance where distance fade starts (unit: m, default: 25.0).

##### Returns

`number`

Fade start distance

#### Set Signature

> **set** **fadeStart**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:356](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L356)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:257](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L257)

Gets or sets the minor grid spacing (unit: m, default: 1.0).

##### Returns

`number`

Minor grid spacing

#### Set Signature

> **set** **gridSize**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:261](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L261)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:390](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L390)

Returns the minor grid line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Minor grid color instance

***

***

### lineWidth

#### Get Signature

> **get** **lineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:295](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L295)

Gets or sets the screen pixel line width for minor grid lines (default: 1.0).

##### Returns

`number`

Minor grid line width

#### Set Signature

> **set** **lineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:299](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L299)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:402](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L402)

Returns the major grid line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Major grid color instance

***

***

### majorLineWidth

#### Get Signature

> **get** **majorLineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:314](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L314)

Gets or sets the screen pixel line width for major grid lines (default: 1.5).

##### Returns

`number`

Major grid line width

#### Set Signature

> **set** **majorLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:318](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L318)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:276](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L276)

Gets or sets the major grid spacing (unit: m, default: 10.0).

##### Returns

`number`

Major grid spacing

#### Set Signature

> **set** **majorStep**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L280)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:238](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L238)

Gets or sets the width and length of the grid plane (unit: m, default: 100).

##### Returns

`number`

Grid plane size

#### Set Signature

> **set** **size**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:242](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L242)

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

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:414](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L414)

Returns the X-axis (Red) center line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

X-axis center line color instance

***

***

### zAxisColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **zAxisColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:426](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L426)

Returns the Z-axis (Blue) center line color.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Z-axis center line color instance

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:463](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L463)

Destroys the `DrawDebuggerGrid` instance and releases allocated GPU resources.

#### Returns

`void`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:438](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L438)

Updates the debug grid render bundle and registers it in the debugger layer list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

***

</details>
