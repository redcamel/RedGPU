[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandEncoderManager

# Class: CommandEncoderManager

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L100)

Class that manages the lifecycle of GPU command encoders and render/compute passes by phase. Shares a single encoder per phase and automatically spawns a new encoder when nested pass calls occur.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new CommandEncoderManager**(`redGPUContext`): `CommandEncoderManager`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L119)

Creates a CommandEncoderManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`CommandEncoderManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### addDeferredDestroy()

> **addDeferredDestroy**(`resource`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L136)

Registers a resource to the deferred destroy list to be safely destroyed after command submission completes.

#### Example
```typescript
context.commandEncoderManager.addDeferredDestroy(tempBuffer);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `resource` | \{ `destroy`(): `void`; \} | Resource object to destroy (must implement the `destroy` method) |
| `resource.destroy` | () => `void` | - |

#### Returns

`void`

***

***

### addMainComputePass()

> **addMainComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L276)

Adds and executes a compute pass for the `MAIN` phase.

#### Example
```typescript
context.commandEncoderManager.addMainComputePass('MainCullingCompute', (pass) => {
    pass.setPipeline(cullingPipeline);
    pass.dispatchWorkgroups(16, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands |

#### Returns

`void`

***

***

### addMainRenderPass()

> **addMainRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L253)

Adds and executes a render pass for the `MAIN` phase.

#### Example
```typescript
context.commandEncoderManager.addMainRenderPass(mainRenderPassDescriptor, (pass) => {
    pass.setPipeline(mainPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands |

#### Returns

`void`

***

***

### addPostProcessComputePass()

> **addPostProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L322)

Adds and executes a compute pass for the `POST_PROCESS` phase.

#### Example
```typescript
context.commandEncoderManager.addPostProcessComputePass('BloomCompute', (pass) => {
    pass.setPipeline(bloomComputePipeline);
    pass.dispatchWorkgroups(width / 16, height / 16, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands |

#### Returns

`void`

***

***

### addPostProcessRenderPass()

> **addPostProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:299](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L299)

Adds and executes a render pass for the `POST_PROCESS` phase.

#### Example
```typescript
context.commandEncoderManager.addPostProcessRenderPass(postRenderPassDescriptor, (pass) => {
    pass.setPipeline(postProcessPipeline);
    pass.draw(6);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands |

#### Returns

`void`

***

***

### addPreProcessComputePass()

> **addPreProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:230](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L230)

Adds and executes a compute pass for the `PRE_PROCESS` phase.

#### Example
```typescript
context.commandEncoderManager.addPreProcessComputePass('ParticleSimulation', (pass) => {
    pass.setPipeline(particleComputePipeline);
    pass.dispatchWorkgroups(32, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands |

#### Returns

`void`

***

***

### addPreProcessRenderPass()

> **addPreProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L207)

Adds and executes a render pass for the `PRE_PROCESS` phase.

#### Example
```typescript
context.commandEncoderManager.addPreProcessRenderPass(shadowPassDescriptor, (pass) => {
    pass.setPipeline(shadowPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands |

#### Returns

`void`

***

***

### addResourceComputePass()

> **addResourceComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L184)

Adds and executes a compute pass for the `RESOURCE` phase.

#### Example
```typescript
context.commandEncoderManager.addResourceComputePass('MyResourceComputePass', (pass) => {
    pass.setPipeline(myComputePipeline);
    pass.setBindGroup(0, myBindGroup);
    pass.dispatchWorkgroups(64, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands |

#### Returns

`void`

***

***

### addResourceRenderPass()

> **addResourceRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L160)

Adds and executes a render pass for the `RESOURCE` phase.

#### Example
```typescript
context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
    pass.setPipeline(myRenderPipeline);
    pass.setVertexBuffer(0, myVertexBuffer);
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:550](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L550)

Destroys the CommandEncoderManager instance and cleans up all command encoder and deferred destroy resource references.

#### Returns

`void`

***

***

### immediateComputePass()

> **immediateComputePass**(`labelOrDescriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:407](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L407)

Immediately executes a compute pass with an independent command encoder and awaits GPU submission completion.

#### Example
```typescript
await context.commandEncoderManager.immediateComputePass('ImmediateMipmapGen', (pass) => {
    pass.setPipeline(mipmapPipeline);
    pass.dispatchWorkgroups(1, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands |
| `afterExecutor?` | (`encoder`) => `void` | Optional callback function to control the command encoder after the pass ends and before submission |

#### Returns

`Promise`\<`void`\>

***

***

### immediateRenderPass()

> **immediateRenderPass**(`descriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:371](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L371)

Immediately executes a render pass with an independent command encoder and awaits GPU submission completion.

#### Example
```typescript
await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands |
| `afterExecutor?` | (`encoder`) => `void` | Optional callback function to control the command encoder after the pass ends and before submission |

#### Returns

`Promise`\<`void`\>

***

***

### immediateSubmit()

> **immediateSubmit**(`label`, `executor`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:440](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L440)

Immediately submits commands with an independent command encoder and awaits GPU work completion.

#### Example
```typescript
await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
    encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Label of the command encoder to create |
| `executor` | (`encoder`) => `void` | Callback function that receives the command encoder (`GPUCommandEncoder`) to record commands |

#### Returns

`Promise`\<`void`\>

***

***

### resetAll()

> **resetAll**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:537](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L537)

Resets all encoder states and statistics, and processes registered deferred destroy resources.

#### Example
```typescript
context.commandEncoderManager.resetAll();
```

#### Returns

`void`

***

***

### submit()

> **submit**(`type`): [`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:463](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L463)

Finishes all encoders for the specified phase and immediately submits them to the queue.

#### Example
```typescript
const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | Command encoder phase type to submit |

#### Returns

[`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

Statistics for the submitted phase (`null` if no buffers were submitted)

***

***

### submitAll()

> **submitAll**(): [`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:493](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L493)

Finishes encoders across all phases (`RESOURCE` -> `PRE_PROCESS` -> `MAIN` -> `POST_PROCESS`) in order and submits them in a single batch.

#### Example
```typescript
const batchStats = context.commandEncoderManager.submitAll();
```

#### Returns

[`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Batch submission statistics (`null` if no buffers were submitted and no deferred resources were destroyed)

***

***

### useEncoder()

> **useEncoder**(`type`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L344)

Directly accesses the command encoder of a specific phase to record commands such as resource copies.

#### Example
```typescript
context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
    encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | Command encoder phase type to use |
| `executor` | (`encoder`) => `void` | Callback function that receives the command encoder (`GPUCommandEncoder`) to record commands |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): `CommandEncoderManager`

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

`CommandEncoderManager`

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
