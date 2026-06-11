[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandEncoderManager

# Class: CommandEncoderManager

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:98](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L98)

Class that intelligently manages the lifecycle of GPU command encoders and passes.

Basically increases efficiency by sharing one encoder per phase,
     but automatically creates a new encoder when nested calls occur while a pass is open to ensure safety.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new CommandEncoderManager**(`redGPUContext`): `CommandEncoderManager`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:131](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L131)

Creates a CommandEncoderManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`CommandEncoderManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### addDeferredDestroy()

> **addDeferredDestroy**(`resource`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:150](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L150)

Registers a resource to be destroyed at a safe time after all commands are submitted.

* ### Example
```typescript
// Register a temporary buffer no longer in use to the deferred list to be automatically destroyed after frame submission
context.commandEncoderManager.addDeferredDestroy(tempBuffer);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `resource` | \{ `destroy`: `void`; \} | The resource object to destroy (must implement the destroy method) |
| `resource.destroy` | - |

#### Returns

`void`

***

### addMainComputePass()

> **addMainComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:302](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L302)

Adds a Compute pass for the MAIN phase.

* ### Example
```typescript
// Process compute calculations for the main viewport area simultaneously with rendering in the MAIN phase
context.commandEncoderManager.addMainComputePass('MainCullingCompute', (pass) => {
    pass.setPipeline(cullingPipeline);
    pass.dispatchWorkgroups(16, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the Compute pass |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Compute pass encoder |

#### Returns

`void`

***

### addMainRenderPass()

> **addMainRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:277](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L277)

Adds a Render pass for the MAIN phase.

* ### Example
```typescript
// Render mesh objects to the main screen framebuffer in the MAIN phase
context.commandEncoderManager.addMainRenderPass(mainRenderPassDescriptor, (pass) => {
    pass.setPipeline(mainPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Render pass encoder |

#### Returns

`void`

***

### addPostProcessComputePass()

> **addPostProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:352](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L352)

Adds a Compute pass for the POST_PROCESS phase.

* ### Example
```typescript
// Perform post-process effect calculations like Bloom or DOF using Compute shaders in the POST_PROCESS phase
context.commandEncoderManager.addPostProcessComputePass('BloomCompute', (pass) => {
    pass.setPipeline(bloomComputePipeline);
    pass.dispatchWorkgroups(width / 16, height / 16, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the Compute pass |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Compute pass encoder |

#### Returns

`void`

***

### addPostProcessRenderPass()

> **addPostProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:327](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L327)

Adds a Render pass for the POST_PROCESS phase.

* ### Example
```typescript
// Apply blur, post-processing quad effects in the POST_PROCESS phase
context.commandEncoderManager.addPostProcessRenderPass(postRenderPassDescriptor, (pass) => {
    pass.setPipeline(postProcessPipeline);
    pass.draw(6);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Render pass encoder |

#### Returns

`void`

***

### addPreProcessComputePass()

> **addPreProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:252](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L252)

Adds a Compute pass for the PRE_PROCESS phase.

* ### Example
```typescript
// Perform skin animation, particle simulation physics calculations in the PRE_PROCESS phase
context.commandEncoderManager.addPreProcessComputePass('ParticleSimulation', (pass) => {
    pass.setPipeline(particleComputePipeline);
    pass.dispatchWorkgroups(32, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the Compute pass |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Compute pass encoder |

#### Returns

`void`

***

### addPreProcessRenderPass()

> **addPreProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:227](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L227)

Adds a Render pass for the PRE_PROCESS phase.

* ### Example
```typescript
// Render shadow maps or G-Buffers in the PRE_PROCESS phase before main rendering
context.commandEncoderManager.addPreProcessRenderPass(shadowPassDescriptor, (pass) => {
    pass.setPipeline(shadowPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Render pass encoder |

#### Returns

`void`

***

### addResourceComputePass()

> **addResourceComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:202](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L202)

Adds a Compute pass for the RESOURCE phase.

* ### Example
```typescript
// Set pipeline and dispatch Compute operation in the RESOURCE phase
context.commandEncoderManager.addResourceComputePass('MyResourceComputePass', (pass) => {
    pass.setPipeline(myComputePipeline);
    pass.setBindGroup(0, myBindGroup);
    pass.dispatchWorkgroups(64, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the Compute pass |
| `executor` | (`pass`) => `void` | Callback function that receives the Compute pass encoder (GPUComputePassEncoder) and records commands like setting pipelines or dispatching workgroups inside the pass |

#### Returns

`void`

***

### addResourceRenderPass()

> **addResourceRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:176](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L176)

Adds a Render pass for the RESOURCE phase.

* ### Example
```typescript
// Execute a pass to render or copy textures/temporary resources in the RESOURCE phase
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
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Render pass encoder |

#### Returns

`void`

***

### immediateComputePass()

> **immediateComputePass**(`labelOrDescriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:445](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L445)

Uses an immediate Compute pass. The pass is finished and submitted immediately upon call.

* ### Example
```typescript
// Record and await compute commands that need to run immediately, such as mipmap generation or data processing
await context.commandEncoderManager.immediateComputePass('ImmediateMipmapGen', (pass) => {
    pass.setPipeline(mipmapPipeline);
    pass.dispatchWorkgroups(1, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Label or descriptor object for the Compute pass |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Compute pass encoder |
| `afterExecutor?` | (`encoder`) => `void` | Optional callback function to directly control the encoder after finishing the pass and before submission |

#### Returns

`Promise`\<`void`\>

***

### immediateRenderPass()

> **immediateRenderPass**(`descriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:407](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L407)

Uses an immediate Render pass. The pass is finished and submitted immediately upon call.

* ### Example
```typescript
// Immediately clear a specific texture or perform a one-time render operation and await GPU submission
await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
    // Record draw calls
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render pass descriptor |
| `executor` | (`pass`) => `void` | Callback function to execute commands with the Render pass encoder |
| `afterExecutor?` | (`encoder`) => `void` | Optional callback function to directly control the encoder after finishing the pass and before submission |

#### Returns

`Promise`\<`void`\>

***

### immediateSubmit()

> **immediateSubmit**(`label`, `executor`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:480](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L480)

Uses an immediate encoder. It is submitted immediately and awaits completion.

* ### Example
```typescript
// Submit and await copy commands immediately, such as buffer initialization or image data loading
await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
    encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Label of the command encoder to submit |
| `executor` | (`encoder`) => `void` | Callback function to execute immediate operations with the command encoder |

#### Returns

`Promise`\<`void`\>

***

### resetAll()

> **resetAll**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:586](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L586)

Reset all encoders

* ### Example
```typescript
// Reset encoders and states when the renderer is re-initialized or destroyed
context.commandEncoderManager.resetAll();
```

#### Returns

`void`

***

### submit()

> **submit**(`type`): [`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:506](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L506)

Finishes all encoders for the specific type and submits them immediately.

* ### Example
```typescript
// Submit all command buffers accumulated in the RESOURCE phase
const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
console.log('Submitted RESOURCE stats:', stats);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | Command encoder type to submit |

#### Returns

[`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

Submission phase statistics (null if nothing submitted)

***

### submitAll()

> **submitAll**(): [`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:538](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L538)

Finishes encoders of all types and submits them in a single call. (For performance optimization)

* ### Example
```typescript
// Batch submit RESOURCE, PRE_PROCESS, MAIN, and POST_PROCESS phases at the end of the loop
const batchStats = context.commandEncoderManager.submitAll();
```

#### Returns

[`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Batch submission statistics (null if no buffers submitted or deferred destructions)

***

### useEncoder()

> **useEncoder**(`type`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:376](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/commandEncoderManager/CommandEncoderManager.ts#L376)

Directly uses an encoder of a specific type (e.g., for copy commands).

* ### Example
```typescript
// Directly retrieve the command encoder for the RESOURCE phase to record a buffer copy command
context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
    encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | Command encoder type to use |
| `executor` | (`encoder`) => `void` | Callback function to execute commands with the GPU command encoder |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): `CommandEncoderManager`

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

`CommandEncoderManager`

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
