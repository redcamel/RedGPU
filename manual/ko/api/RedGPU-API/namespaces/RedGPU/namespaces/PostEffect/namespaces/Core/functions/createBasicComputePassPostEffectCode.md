[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicComputePassPostEffectCode

# Function: createBasicComputePassPostEffectCode()

> **createBasicComputePassPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`, `earlyExit?`, `useSystemUniforms?`): `string`

Defined in: [src/postEffect/core/createBasicComputePassPostEffectCode.ts:35](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/createBasicComputePassPostEffectCode.ts#L35)

단일 컴퓨트 패스 후처리 이펙트용 WGSL 컴퓨트 셰이더 코드를 생성합니다.

입력 소스 텍스처(Group 0), 이펙트 유니폼(Group 1), 시스템 공용 유니폼 및 G-Buffer(Group 2, 선택), 출력 스토리지 텍스처(`useSystemUniforms`가 `true`일 때 Group 3, `false`일 때 Group 2) 바인딩과 화면 경계 검사(`earlyExit`)를 자동으로 구성합니다.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASingleComputePassPostEffect`](../classes/ASingleComputePassPostEffect.md) | `undefined` | 대상 `ASingleComputePassPostEffect` 인스턴스 |
| `code` | `string` | `undefined` | `main` 함수 내부에 삽입할 WGSL 연산 코드 |
| `uniformStruct?` | `string` | `''` | 이펙트 전용 `Uniforms` 구조체 정의 문자열 |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | 입력 소스 텍스처 바인딩 설정 |
| `earlyExit?` | `boolean` | `true` | 출력 해상도 경계 밖 스레드 즉시 종료 여부 (워크그룹 배리어 사용 시 `false`) |
| `useSystemUniforms?` | `boolean` | `true` | 시스템 유니폼 및 G-Buffer(Group 2) 바인딩 포함 여부 |

## Returns

`string`

완성된 WGSL 컴퓨트 셰이더 코드 문자열 (`string`)
