[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:22](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L22)


Class that manages anti-aliasing settings.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// RedGPUContext 또는 View를 통해 접근합니다.
// Access via RedGPUContext or View.
const antialiasingManager = redGPUContext.antialiasingManager;
```

## Constructors

### Constructor

> **new AntialiasingManager**(`redGPUContext`): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:39](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L39)


AntialiasingManager constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`AntialiasingManager`

## Accessors

### changedMSAA

#### Get Signature

> **get** **changedMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:168](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L168)

**`Internal`**


Returns whether the MSAA setting has changed.

##### Returns

`boolean`


Whether MSAA has changed

#### Set Signature

> **set** **changedMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:181](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L181)

**`Internal`**


Sets whether the MSAA setting has changed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether MSAA has changed |

##### Returns

`void`

***

### msaaID

#### Get Signature

> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:194](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L194)

**`Internal`**


Returns the unique ID of the current MSAA.

##### Returns

`string`


Unique ID of MSAA

***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:136](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L136)


Returns whether FXAA (Fast Approximate Anti-Aliasing) is used.

* ### Example
```typescript
const useFXAA = antialiasingManager.useFXAA;
```

##### Returns

`boolean`


Whether FXAA is used

#### Set Signature

> **set** **useFXAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:153](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L153)


Sets whether to use FXAA (Fast Approximate Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useFXAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use FXAA |

##### Returns

`void`

***

### useMSAA

#### Get Signature

> **get** **useMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:98](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L98)


Returns whether MSAA (Multi-Sample Anti-Aliasing) is used.

* ### Example
```typescript
const useMSAA = antialiasingManager.useMSAA;
```

##### Returns

`boolean`


Whether MSAA is used

#### Set Signature

> **set** **useMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:115](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L115)


Sets whether to use MSAA (Multi-Sample Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useMSAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use MSAA |

##### Returns

`void`

***

### useTAA

#### Get Signature

> **get** **useTAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:62](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L62)


Returns whether TAA (Temporal Anti-Aliasing) is used.

* ### Example
```typescript
const useTAA = antialiasingManager.useTAA;
```

##### Returns

`boolean`


Whether TAA is used

#### Set Signature

> **set** **useTAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:79](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/antialiasing/AntialiasingManager.ts#L79)


Sets whether to use TAA (Temporal Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useTAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use TAA |

##### Returns

`void`
