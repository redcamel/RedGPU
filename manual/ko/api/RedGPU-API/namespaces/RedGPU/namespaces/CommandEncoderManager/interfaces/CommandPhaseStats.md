[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:10](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L10)

단계별 통계 상세 정보 인터페이스

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:20](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L20)

제출된 커맨드 버퍼의 개수

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:41](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L41)

컴퓨트 패스 정보

#### count

> **count**: `number`

실행된 컴퓨트 패스의 총 개수

#### list

> **list**: `string`[]

실행된 컴퓨트 패스들의 레이블 리스트

***

### Phase?

> `optional` **Phase?**: [`CommandEncoderType`](../type-aliases/CommandEncoderType.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:15](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L15)

인코더의 단계(Phase) 타입

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:57](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L57)

인코더를 직접 참조하여 기록한 수 (예: useEncoder 사용 횟수)

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:25](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L25)

렌더 패스 정보

#### count

> **count**: `number`

실행된 렌더 패스의 총 개수

#### list

> **list**: `string`[]

실행된 렌더 패스들의 레이블 리스트
