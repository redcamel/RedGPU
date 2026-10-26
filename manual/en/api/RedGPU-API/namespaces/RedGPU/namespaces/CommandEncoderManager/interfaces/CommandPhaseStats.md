[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandPhaseStats

# Interface: CommandPhaseStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L12)

Interface defining command submission and pass statistics per execution phase.

## Properties

### Command Buffers

> **Command Buffers**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L22)

Total number of submitted command buffers

***

### Compute Passes

> **Compute Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L43)

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

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L17)

Execution phase type of the encoder

***

### Raw Usages

> **Raw Usages**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L59)

Number of direct encoder usages (`useEncoder` call count)

***

### Render Passes

> **Render Passes**: `object`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L27)

Render pass execution statistics

#### count

> **count**: `number`

Total number of executed render passes

#### list

> **list**: `string`[]

List of labels for executed render passes
