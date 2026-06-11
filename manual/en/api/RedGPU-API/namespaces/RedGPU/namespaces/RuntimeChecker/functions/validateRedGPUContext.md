[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateRedGPUContext

# Function: validateRedGPUContext()

> **validateRedGPUContext**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateRedGPUContext.ts:26](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/runtimeChecker/validateFunc/validateRedGPUContext.ts#L26)

Validates if the given value is a RedGPUContext instance.

Throws an exception if the constructor name of the value is not 'RedGPUContext'.

* ### Example
```typescript
RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Value to validate |

## Returns

`boolean`

True if the value is a RedGPUContext instance

## Throws

Throws Error if the value is not a RedGPUContext instance
