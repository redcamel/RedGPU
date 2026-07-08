[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:92](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/postEffect/core/createBasicPostEffectCode.ts#L92)

기본 후처리 이펙트용 WGSL 코드를 생성하는 고수준 헬퍼 함수입니다.

이 함수는 반복적인 보일러플레이트 코드를 자동화하며 다음 기능을 수행합니다:
1. MSAA/Non-MSAA 대응 소스 자동 분기 생성.
2. 입력 소스 텍스처(Group 0) 바인딩 자동화.
3. 이펙트 전용 유니폼(Group 1) 및 시스템 공용 리소스(Group 2: G-Buffer, Depth 등) 자동 포함.
4. 출력용 스토리지 텍스처(Group 3) 정의.
5. 클래스에 정의된 워크그룹 사이즈 반영.


## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | ASinglePassPostEffect를 상속받은 이펙트 인스턴스
| `code` | `string` | `undefined` | main 함수 내부에 삽입될 WGSL 로직
| `uniformStruct` | `string` | `''` | (선택) 이펙트에서 사용할 Uniforms 구조체 정의
| `sourceTextureConfigs` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | (선택) 입력 소스들에 대한 설정 (기본값: {name: 'sourceTexture'})

## Returns

`object`

MSAA와 Non-MSAA용으로 각각 생성된 WGSL 코드 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:99](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/postEffect/core/createBasicPostEffectCode.ts#L99) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:100](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/postEffect/core/createBasicPostEffectCode.ts#L100) |
