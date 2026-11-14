[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicRenderPassPostEffectCode

# Function: createBasicRenderPassPostEffectCode()

> **createBasicRenderPassPostEffectCode**(`code`, `uniformStruct?`, `sourceTextureConfigs?`, `useSystemUniforms?`): `string`

Defined in: [src/postEffect/core/createBasicRenderPassPostEffectCode.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/createBasicRenderPassPostEffectCode.ts#L28)

단일 In-Place 렌더 패스 후처리 이펙트(`ASingleRenderPassPostEffect`)용 WGSL 버텍스+프래그먼트 셰이더 코드를 생성합니다.

버텍스 버퍼 없는 3-버텍스 풀스크린 삼각형(`vs_main`), 보조 입력 텍스처(Group 0), 이펙트 유니폼(Group 1), 시스템 공용 유니폼 및 G-Buffer(Group 2) 바인딩과 프래그먼트 엔트리(`fs_main`)를 자동으로 구성합니다. 기존 컬러 버퍼에 In-Place로 합성하므로 기본 `sourceTexture` 바인딩을 생략하여 WebGPU Read-Write Hazard를 원천 방지합니다.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `code` | `string` | `undefined` | `fs_main` 함수 내부에 삽입할 WGSL 프래그먼트 연산 코드 (`return vec4<f32>(...);` 반환 필수) |
| `uniformStruct?` | `string` | `''` | 이펙트 전용 `Uniforms` 구조체 정의 또는 보조 WGSL 코드 문자열 |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `undefined` | 보조 입력 소스 텍스처 바인딩 설정 (생략 시 `[]` 적용) |
| `useSystemUniforms?` | `boolean` | `true` | 시스템 유니폼 및 G-Buffer(Group 2) 바인딩 포함 여부 |

## Returns

`string`

완성된 WGSL 버텍스+프래그먼트 셰이더 코드 문자열 (`string`)
