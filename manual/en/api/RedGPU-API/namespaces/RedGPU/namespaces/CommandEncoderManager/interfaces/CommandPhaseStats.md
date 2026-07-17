[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:10](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L10)

Detailed statistics per phase

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:20](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L20)

Number of command buffers submitted

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:41](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L41)

Compute pass information

#### count

> **count**: `number`

Total number of executed compute passes

#### list

> **list**: `string`[]

List of labels for executed compute passes

***

### Phase?

> `optional` **Phase?**: [`CommandEncoderType`](../type-aliases/CommandEncoderType.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:15](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L15)

Phase type of the encoder

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:57](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L57)

Number of raw encoder usages (e.g., useEncoder call count)

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:25](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/commandEncoderManager/CommandEncoderManager.ts#L25)

Render pass information

#### count

> **count**: `number`

Total number of executed render passes

#### list

> **list**: `string`[]

List of labels for executed render passes
