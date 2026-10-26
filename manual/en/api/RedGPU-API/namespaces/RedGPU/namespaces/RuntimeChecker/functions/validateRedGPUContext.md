[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateRedGPUContext

# Function: validateRedGPUContext()

> **validateRedGPUContext**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateRedGPUContext.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/runtimeChecker/validateFunc/validateRedGPUContext.ts#L23)

Validates that the value is a RedGPUContext instance by its constructor name and throws an exception on failure.

### Example
```typescript
RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Object to validate |

## Returns

`boolean`

True if the value is a RedGPUContext instance

## Throws

Throws Error if the constructor name is not 'RedGPUContext'
