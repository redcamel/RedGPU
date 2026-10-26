[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandEncoderManager

# Class: CommandEncoderManager

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L100)

GPU 커맨드 인코더 및 렌더/컴퓨트 패스의 생명주기를 단계별로 관리하는 클래스입니다. 단계별로 단일 인코더를 공유하며 중첩 패스 호출 시 자동으로 새 인코더를 분리 생성합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new CommandEncoderManager**(`redGPUContext`): `CommandEncoderManager`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L119)

CommandEncoderManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

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

커맨드 제출 완료 후 안전한 시점에 파괴할 리소스를 지연 파괴 목록에 등록합니다.

#### Example
```typescript
context.commandEncoderManager.addDeferredDestroy(tempBuffer);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `resource` | \{ `destroy`(): `void`; \} | 파괴할 리소스 객체 (`destroy` 메서드를 구현해야 함) |
| `resource.destroy` | () => `void` | - |

#### Returns

`void`

***

***

### addMainComputePass()

> **addMainComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L276)

`MAIN` 단계의 컴퓨트 패스를 추가하고 실행합니다.

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
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | 컴퓨트 패스의 레이블 또는 디스크립터 객체 |
| `executor` | (`pass`) => `void` | 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addMainRenderPass()

> **addMainRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L253)

`MAIN` 단계의 렌더 패스를 추가하고 실행합니다.

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
| `descriptor` | `GPURenderPassDescriptor` | 렌더 패스 디스크립터 |
| `executor` | (`pass`) => `void` | 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addPostProcessComputePass()

> **addPostProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L322)

`POST_PROCESS` 단계의 컴퓨트 패스를 추가하고 실행합니다.

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
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | 컴퓨트 패스의 레이블 또는 디스크립터 객체 |
| `executor` | (`pass`) => `void` | 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addPostProcessRenderPass()

> **addPostProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:299](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L299)

`POST_PROCESS` 단계의 렌더 패스를 추가하고 실행합니다.

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
| `descriptor` | `GPURenderPassDescriptor` | 렌더 패스 디스크립터 |
| `executor` | (`pass`) => `void` | 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addPreProcessComputePass()

> **addPreProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:230](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L230)

`PRE_PROCESS` 단계의 컴퓨트 패스를 추가하고 실행합니다.

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
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | 컴퓨트 패스의 레이블 또는 디스크립터 객체 |
| `executor` | (`pass`) => `void` | 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addPreProcessRenderPass()

> **addPreProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L207)

`PRE_PROCESS` 단계의 렌더 패스를 추가하고 실행합니다.

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
| `descriptor` | `GPURenderPassDescriptor` | 렌더 패스 디스크립터 |
| `executor` | (`pass`) => `void` | 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addResourceComputePass()

> **addResourceComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L184)

`RESOURCE` 단계의 컴퓨트 패스를 추가하고 실행합니다.

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
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | 컴퓨트 패스의 레이블 또는 디스크립터 객체 |
| `executor` | (`pass`) => `void` | 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### addResourceRenderPass()

> **addResourceRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L160)

`RESOURCE` 단계의 렌더 패스를 추가하고 실행합니다.

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
| `descriptor` | `GPURenderPassDescriptor` | 렌더 패스 디스크립터 |
| `executor` | (`pass`) => `void` | 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:550](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L550)

CommandEncoderManager 인스턴스를 파기하고 모든 커맨드 인코더 및 지연 파괴 리소스 참조를 정리합니다.

#### Returns

`void`

***

***

### immediateComputePass()

> **immediateComputePass**(`labelOrDescriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:407](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L407)

독립된 커맨드 인코더로 컴퓨트 패스를 즉시 실행하고 GPU 제출 완료까지 대기합니다.

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
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | 컴퓨트 패스의 레이블 또는 디스크립터 객체 |
| `executor` | (`pass`) => `void` | 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수 |
| `afterExecutor?` | (`encoder`) => `void` | 패스 종료 후 제출 전에 커맨드 인코더를 제어할 선택적 콜백 함수 |

#### Returns

`Promise`\<`void`\>

***

***

### immediateRenderPass()

> **immediateRenderPass**(`descriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:371](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L371)

독립된 커맨드 인코더로 렌더 패스를 즉시 실행하고 GPU 제출 완료까지 대기합니다.

#### Example
```typescript
await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | 렌더 패스 디스크립터 |
| `executor` | (`pass`) => `void` | 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수 |
| `afterExecutor?` | (`encoder`) => `void` | 패스 종료 후 제출 전에 커맨드 인코더를 제어할 선택적 콜백 함수 |

#### Returns

`Promise`\<`void`\>

***

***

### immediateSubmit()

> **immediateSubmit**(`label`, `executor`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:440](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L440)

독립된 커맨드 인코더로 명령을 즉시 제출하고 GPU 작업 완료까지 대기합니다.

#### Example
```typescript
await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
    encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | 생성할 커맨드 인코더의 레이블 |
| `executor` | (`encoder`) => `void` | 커맨드 인코더(`GPUCommandEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`Promise`\<`void`\>

***

***

### resetAll()

> **resetAll**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:537](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L537)

모든 인코더 상태와 통계를 초기화하고 등록된 지연 파괴 리소스를 정리합니다.

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

특정 단계의 모든 인코더를 종료하고 큐에 즉시 제출합니다.

#### Example
```typescript
const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | 제출할 커맨드 인코더 단계 타입 |

#### Returns

[`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

제출된 단계의 통계 정보 (제출된 버퍼가 없으면 `null`)

***

***

### submitAll()

> **submitAll**(): [`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:493](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L493)

모든 단계(`RESOURCE` -> `PRE_PROCESS` -> `MAIN` -> `POST_PROCESS`)의 인코더를 순서대로 종료하고 일괄 제출합니다.

#### Example
```typescript
const batchStats = context.commandEncoderManager.submitAll();
```

#### Returns

[`CommandBatchStats`](../interfaces/CommandBatchStats.md)

전체 일괄 제출 통계 정보 (제출된 버퍼나 지연 파괴 리소스가 없으면 `null`)

***

***

### useEncoder()

> **useEncoder**(`type`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L344)

특정 단계의 커맨드 인코더를 직접 참조하여 복사 등의 명령을 기록합니다.

#### Example
```typescript
context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
    encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | 사용할 커맨드 인코더 단계 타입 |
| `executor` | (`encoder`) => `void` | 커맨드 인코더(`GPUCommandEncoder`)를 받아 명령을 기록할 콜백 함수 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): `CommandEncoderManager`

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

`CommandEncoderManager`

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

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

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
