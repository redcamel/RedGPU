[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L12)

Interface defining command submission and pass statistics per execution phase.

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L22)

Total number of submitted command buffers

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:43](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L43)

Compute pass execution statistics

#### count

> **count**: `number`

Total number of executed compute passes

#### list

> **list**: `string`[]

List of labels for executed compute passes

***

### Phase?

> `optional` **Phase?**: [`CommandEncoderType`](../type-aliases/CommandEncoderType.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:17](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L17)

Execution phase type of the encoder

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:59](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L59)

Number of direct encoder usages (`useEncoder` call count)

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:27](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/commandEncoderManager/CommandEncoderManager.ts#L27)

Render pass execution statistics

#### count

> **count**: `number`

Total number of executed render passes

#### list

> **list**: `string`[]

List of labels for executed render passes
