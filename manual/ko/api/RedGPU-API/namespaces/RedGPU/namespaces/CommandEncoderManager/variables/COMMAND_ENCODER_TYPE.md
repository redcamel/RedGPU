[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / COMMAND\_ENCODER\_TYPE

# Variable: COMMAND\_ENCODER\_TYPE

> `const` **COMMAND\_ENCODER\_TYPE**: `object`

Defined in: [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:6](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L6)

GPU 커맨드 인코더의 타입을 정의하는 상수 객체입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-main"></a> `MAIN` | `"MAIN"` | `'MAIN'` | 메인 렌더링 단계 (메인 씬 드로우 등)
| <a id="property-post_process"></a> `POST_PROCESS` | `"POST_PROCESS"` | `'POST_PROCESS'` | 후처리 단계 (블러, 톤맵 등 포스트 프로세싱 효과 적용)
| <a id="property-pre_process"></a> `PRE_PROCESS` | `"PRE_PROCESS"` | `'PRE_PROCESS'` | 전처리 단계 (예: G-Buffer 렌더링, 섀도 맵 렌더링, 물리 시뮬레이션 등)
| <a id="property-resource"></a> `RESOURCE` | `"RESOURCE"` | `'RESOURCE'` | 리소스 처리 단계 (예: 복사, 데이터 쓰기 등)
