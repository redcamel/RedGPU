[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:9](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L9)

Detailed statistics per phase

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:19](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L19)

Number of command buffers submitted

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L40)

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

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:14](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L14)

Phase type of the encoder

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:56](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L56)

Number of raw encoder usages (e.g., useEncoder call count)

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:24](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L24)

Render pass information

#### count

> **count**: `number`

Total number of executed render passes

#### list

> **list**: `string`[]

List of labels for executed render passes
