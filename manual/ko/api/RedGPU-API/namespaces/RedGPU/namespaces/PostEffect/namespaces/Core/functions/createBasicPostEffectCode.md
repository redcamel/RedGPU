[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct?`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:54](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/postEffect/core/createBasicPostEffectCode.ts#L54)

기본 후처리 이펙트 WGSL 코드를 생성하는 헬퍼 함수입니다.


MSAA/Non-MSAA, 유니폼 구조, 딥스 텍스처 등 옵션에 따라 WGSL 코드를 자동 생성합니다.


내부적으로 시스템 유니폼, 소스/출력 텍스처, 워크그룹 크기 등을 자동으로 포함합니다.


## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | ASinglePassPostEffect 인스턴스
| `code` | `string` | `undefined` | WGSL 메인 코드 (main 함수 내부)
| `uniformStruct` | `string` | `''` | 유니폼 구조 WGSL 코드 (선택)

## Returns

`object`

{ msaa: string, nonMsaa: string } - MSAA/Non-MSAA용 WGSL 코드


* ### Example
```typescript
const shader = createBasicPostEffectCode(effect, '...main code...', 'struct Uniforms {...};');
// shader.msaa, shader.nonMsaa 사용
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:56](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/postEffect/core/createBasicPostEffectCode.ts#L56) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:57](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/postEffect/core/createBasicPostEffectCode.ts#L57) |
