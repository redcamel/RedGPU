[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateRedGPUContext

# Function: validateRedGPUContext()

> **validateRedGPUContext**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateRedGPUContext.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/validateFunc/validateRedGPUContext.ts#L23)

값이 RedGPUContext 인스턴스인지 생성자 이름으로 검증하며, 실패 시 예외를 발생시킵니다.

### Example
```typescript
RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 검증할 객체 |

## Returns

`boolean`

RedGPUContext 인스턴스이면 true

## Throws

생성자 이름이 'RedGPUContext'가 아닌 경우 Error 발생
