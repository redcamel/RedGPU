[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L25)

Class that manages the global anti-aliasing mode across the context.

Only one anti-aliasing technique among MSAA, FXAA, and TAA can be applied at a time. Upon initial creation, it detects the screen resolution (`window.devicePixelRatio > 1.0`) and enables `useTAA` by default on high-DPI (e.g., Retina) displays, or `useMSAA` on standard displays.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access AntialiasingManager from RedGPUContext and switch modes
const { antialiasingManager } = redGPUContext;
antialiasingManager.useTAA = true;
```

## Constructors

### Constructor

> **new AntialiasingManager**(): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L35)

Initializes the `AntialiasingManager` instance and sets the default anti-aliasing mode based on the display pixel ratio.

#### Returns

`AntialiasingManager`

## Accessors

### msaaID

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L127)

Returns the unique identifier (UUID) used to track MSAA state changes.

##### Returns

`string`

UUID string for identifying MSAA state

***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L109)

Gets or sets whether FXAA (Fast Approximate Anti-Aliasing) is enabled. Enabling this automatically disables `useMSAA` and `useTAA`.

#### Example
```typescript
// Enable FXAA
redGPUContext.antialiasingManager.useFXAA = true;
```

##### Returns

`boolean`

Whether FXAA is enabled

#### Set Signature

> **set** **useFXAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L113)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### useMSAA

#### Get Signature

> **get** **useMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L83)

Gets or sets whether MSAA (Multi-Sample Anti-Aliasing) is enabled. When changed, a new `msaaID` is issued and `useFXAA` and `useTAA` are automatically disabled.

#### Example
```typescript
// Enable MSAA
redGPUContext.antialiasingManager.useMSAA = true;
```

##### Returns

`boolean`

Whether MSAA is enabled

#### Set Signature

> **set** **useMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L87)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### useTAA

#### Get Signature

> **get** **useTAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L58)

Gets or sets whether TAA (Temporal Anti-Aliasing) is enabled. Enabling this automatically disables `useMSAA` and `useFXAA`.

#### Example
```typescript
// Enable TAA
redGPUContext.antialiasingManager.useTAA = true;
```

##### Returns

`boolean`

Whether TAA is enabled

#### Set Signature

> **set** **useTAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L62)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

## Methods

### resetHistory()

> **resetHistory**(`view?`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/AntialiasingManager.ts#L146)

Resets the accumulated TAA history frames for the specified view (`View3D`). Call this when the camera teleports or the scene changes abruptly to immediately eliminate ghosting artifacts.

#### Example
```typescript
// Reset TAA history after an abrupt camera position change
redGPUContext.antialiasingManager.resetHistory(view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | \{ `taa?`: \{ `reset`(): `void`; \}; \} | Target view object whose TAA history will be reset |
| `view.taa?` | \{ `reset`(): `void`; \} | - |
| `view.taa.reset` | () => `void` | - |

#### Returns

`void`
