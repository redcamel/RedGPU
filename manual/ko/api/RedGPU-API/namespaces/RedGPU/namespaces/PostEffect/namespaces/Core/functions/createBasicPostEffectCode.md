[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`, `earlyExit?`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/createBasicPostEffectCode.ts#L90)

단일 패스 후처리 이펙트용 MSAA/Non-MSAA WGSL 컴퓨트 셰이더 코드를 생성합니다.

입력 소스 텍스처(Group 0), 이펙트 유니폼(Group 1), 시스템 공용 유니폼 및 G-Buffer(Group 2), 출력 스토리지 텍스처(Group 3) 바인딩과 화면 경계 검사(`earlyExit`)를 자동으로 구성합니다.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | 대상 `ASinglePassPostEffect` 인스턴스 |
| `code` | `string` | `undefined` | `main` 함수 내부에 삽입할 WGSL 연산 코드 |
| `uniformStruct?` | `string` | `''` | 이펙트 전용 `Uniforms` 구조체 정의 문자열 |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | 입력 소스 텍스처 바인딩 설정 |
| `earlyExit?` | `boolean` | `true` | 출력 해상도 경계 밖 스레드 즉시 종료 여부 (워크그룹 배리어 사용 시 `false`) |

## Returns

`object`

MSAA 및 Non-MSAA용 WGSL 코드 객체 (`{ msaa: string, nonMsaa: string }`)

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/createBasicPostEffectCode.ts#L98) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/createBasicPostEffectCode.ts#L99) |
