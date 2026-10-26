[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L12)

실행 단계(Phase)별 커맨드 제출 및 패스 통계 정보를 정의하는 인터페이스입니다.

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L22)

제출된 커맨드 버퍼의 총 개수

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L43)

컴퓨트 패스 실행 통계 정보

#### count

> **count**: `number`

실행된 컴퓨트 패스의 총 개수

#### list

> **list**: `string`[]

실행된 컴퓨트 패스들의 레이블 목록

***

### Phase?

> `optional` **Phase?**: [`CommandEncoderType`](../type-aliases/CommandEncoderType.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L17)

인코더의 실행 단계(Phase) 타입

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L59)

인코더 직접 참조(`useEncoder`) 호출 횟수

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L27)

렌더 패스 실행 통계 정보

#### count

> **count**: `number`

실행된 렌더 패스의 총 개수

#### list

> **list**: `string`[]

실행된 렌더 패스들의 레이블 목록
