[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateRedGPUContext

# Function: validateRedGPUContext()

> **validateRedGPUContext**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateRedGPUContext.ts:26](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/runtimeChecker/validateFunc/validateRedGPUContext.ts#L26)

주어진 값이 RedGPUContext 인스턴스인지 검증합니다.

값의 생성자 이름이 'RedGPUContext'가 아니면 예외를 발생시킵니다.

* ### Example
```typescript
RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 검증할 객체

## Returns

`boolean`

RedGPUContext 인스턴스이면 true

## Throws

RedGPUContext 인스턴스가 아닐 경우 Error 발생
