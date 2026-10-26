[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Debugger](../README.md) / LandscapeDebuggerManager

# Class: LandscapeDebuggerManager

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L24)

Manager class that controls wireframe, LOD coloration, and debug rendering modes for `Landscape`. Automatically created internally when a `Landscape` is instantiated.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access the debugger manager from a Landscape instance and enable debug rendering
const debuggerManager = landscape.debuggerManager;
debuggerManager.landscapeWireframe = true;
debuggerManager.landscapeLodColoration = true;
```

## Constructors

### Constructor

> **new LandscapeDebuggerManager**(`onDebugPropertyChange?`): `LandscapeDebuggerManager`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L38)

Creates a `LandscapeDebuggerManager` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onDebugPropertyChange?` | `DebuggerPropertyChangeHandler` | Callback handler invoked when a debug property changes |

#### Returns

`LandscapeDebuggerManager`

## Accessors

### landscapeDebugMode

#### Get Signature

> **get** **landscapeDebugMode**(): `number`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L69)

Gets or sets the landscape debug rendering mode. (Refer to `LANDSCAPE_DEBUG_MODE` constants)

##### Returns

`number`

Debug mode value

#### Set Signature

> **set** **landscapeDebugMode**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### landscapeLodColoration

#### Get Signature

> **get** **landscapeLodColoration**(): `boolean`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L88)

Gets or sets whether landscape LOD coloration is enabled.

##### Returns

`boolean`

Whether LOD coloration is enabled

#### Set Signature

> **set** **landscapeLodColoration**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### landscapeWireframe

#### Get Signature

> **get** **landscapeWireframe**(): `boolean`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L50)

Gets or sets whether landscape wireframe rendering is enabled.

##### Returns

`boolean`

Whether wireframe is enabled

#### Set Signature

> **set** **landscapeWireframe**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L54)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/debugger/LandscapeDebuggerManager.ts#L103)

Resets debugger states and releases callback references.

#### Returns

`void`
