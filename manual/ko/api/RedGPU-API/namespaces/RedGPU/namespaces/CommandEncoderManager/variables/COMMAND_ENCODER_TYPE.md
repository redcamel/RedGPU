[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / COMMAND\_ENCODER\_TYPE

# Variable: COMMAND\_ENCODER\_TYPE

> `const` **COMMAND\_ENCODER\_TYPE**: `object`

Defined in: [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L7)

GPU 커맨드 인코더의 실행 단계(Phase) 타입을 정의하는 상수 객체입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-immediate"></a> `IMMEDIATE` | `"IMMEDIATE"` | `'IMMEDIATE'` | 즉시 제출 단계 (독립된 커맨드 인코더로 즉시 큐에 제출) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L32) |
| <a id="property-main"></a> `MAIN` | `"MAIN"` | `'MAIN'` | 메인 렌더링 단계 (메인 씬 드로우 등) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L22) |
| <a id="property-post_process"></a> `POST_PROCESS` | `"POST_PROCESS"` | `'POST_PROCESS'` | 후처리 단계 (블러, 톤매핑 등 포스트 프로세싱 효과 적용) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L27) |
| <a id="property-pre_process"></a> `PRE_PROCESS` | `"PRE_PROCESS"` | `'PRE_PROCESS'` | 전처리 단계 (G-Buffer 렌더링, 섀도우 맵 생성, 물리 시뮬레이션 등) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L17) |
| <a id="property-resource"></a> `RESOURCE` | `"RESOURCE"` | `'RESOURCE'` | 리소스 처리 단계 (버퍼 쓰기, 텍스처/버퍼 복사 등) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L12) |
