[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandEncoderManager

# Class: CommandEncoderManager

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:98](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L98)

GPU 커맨드 인코더 및 패스의 생명주기를 지능적으로 관리하는 클래스입니다.

기본적으로 단계별로 하나의 인코더를 공유하여 효율을 높이지만,
     패스가 열려있는 상태에서 중첩 호출이 발생하면 자동으로 새로운 인코더를 생성하여 안전성을 보장합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new CommandEncoderManager**(`redGPUContext`): `CommandEncoderManager`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:131](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L131)

CommandEncoderManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`CommandEncoderManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### addDeferredDestroy()

> **addDeferredDestroy**(`resource`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:150](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L150)

모든 커맨드 제출 후 안전한 시점에 파괴할 리소스를 등록합니다.

* ### Example
```typescript
// 더 이상 사용하지 않는 임시 버퍼를 프레임 제출 완료 후 자동 파괴하도록 지연 목록에 등록
context.commandEncoderManager.addDeferredDestroy(tempBuffer);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `resource` | \{ `destroy`: `void`; \} | 파괴할 리소스 객체 (destroy 메서드를 구현해야 함)
| `resource.destroy` | - |

#### Returns

`void`

***

### addMainComputePass()

> **addMainComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:302](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L302)

MAIN 단계의 Compute 패스를 추가합니다.

* ### Example
```typescript
// MAIN 단계에서 렌더링과 동시에 메인 뷰포트 영역에 대한 컴퓨트 연산 처리
context.commandEncoderManager.addMainComputePass('MainCullingCompute', (pass) => {
    pass.setPipeline(cullingPipeline);
    pass.dispatchWorkgroups(16, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Compute 패스의 레이블 또는 디스크립터 객체
| `executor` | (`pass`) => `void` | Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addMainRenderPass()

> **addMainRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:277](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L277)

MAIN 단계의 Render 패스를 추가합니다.

* ### Example
```typescript
// MAIN 단계에서 메인 화면 프레임버퍼에 메쉬 오브젝트들을 렌더링
context.commandEncoderManager.addMainRenderPass(mainRenderPassDescriptor, (pass) => {
    pass.setPipeline(mainPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render 패스 디스크립터
| `executor` | (`pass`) => `void` | Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addPostProcessComputePass()

> **addPostProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:352](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L352)

POST_PROCESS 단계의 Compute 패스를 추가합니다.

* ### Example
```typescript
// POST_PROCESS 단계에서 Bloom이나 DOF 등의 포스트 프로세스 효과 계산을 Compute 쉐이더로 수행
context.commandEncoderManager.addPostProcessComputePass('BloomCompute', (pass) => {
    pass.setPipeline(bloomComputePipeline);
    pass.dispatchWorkgroups(width / 16, height / 16, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Compute 패스의 레이블 또는 디스크립터 객체
| `executor` | (`pass`) => `void` | Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addPostProcessRenderPass()

> **addPostProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:327](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L327)

POST_PROCESS 단계의 Render 패스를 추가합니다.

* ### Example
```typescript
// POST_PROCESS 단계에서 블러(Blur), 포스트 프로세싱 쿼드 효과 적용
context.commandEncoderManager.addPostProcessRenderPass(postRenderPassDescriptor, (pass) => {
    pass.setPipeline(postProcessPipeline);
    pass.draw(6);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render 패스 디스크립터
| `executor` | (`pass`) => `void` | Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addPreProcessComputePass()

> **addPreProcessComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:252](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L252)

PRE_PROCESS 단계의 Compute 패스를 추가합니다.

* ### Example
```typescript
// PRE_PROCESS 단계에서 스킨 애니메이션, 파티클 시뮬레이션 물리 연산 수행
context.commandEncoderManager.addPreProcessComputePass('ParticleSimulation', (pass) => {
    pass.setPipeline(particleComputePipeline);
    pass.dispatchWorkgroups(32, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Compute 패스의 레이블 또는 디스크립터 객체
| `executor` | (`pass`) => `void` | Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addPreProcessRenderPass()

> **addPreProcessRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:227](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L227)

PRE_PROCESS 단계의 Render 패스를 추가합니다.

* ### Example
```typescript
// PRE_PROCESS 단계에서 메인 렌더링에 앞서 섀도우맵이나 G-Buffer 등을 렌더링
context.commandEncoderManager.addPreProcessRenderPass(shadowPassDescriptor, (pass) => {
    pass.setPipeline(shadowPipeline);
    pass.drawIndexed(indexCount);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render 패스 디스크립터
| `executor` | (`pass`) => `void` | Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### addResourceComputePass()

> **addResourceComputePass**(`labelOrDescriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:202](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L202)

RESOURCE 단계의 Compute 패스를 추가합니다.

* ### Example
```typescript
// RESOURCE 단계에서 파이프라인 설정 및 Compute 연산 디스패치 수행
context.commandEncoderManager.addResourceComputePass('MyResourceComputePass', (pass) => {
    pass.setPipeline(myComputePipeline);
    pass.setBindGroup(0, myBindGroup);
    pass.dispatchWorkgroups(64, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Compute 패스의 레이블 또는 디스크립터 객체
| `executor` | (`pass`) => `void` | Compute 패스 인코더(GPUComputePassEncoder)를 인자로 받아, 패스 안에서 수행할 파이프라인 설정 및 디스패치 명령 등을 기재하는 콜백 함수

#### Returns

`void`

***

### addResourceRenderPass()

> **addResourceRenderPass**(`descriptor`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:176](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L176)

RESOURCE 단계의 Render 패스를 추가합니다.

* ### Example
```typescript
// RESOURCE 단계에서 텍스처나 임시 리소스를 렌더링/복제하기 위한 패스 실행
context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
    pass.setPipeline(myRenderPipeline);
    pass.setVertexBuffer(0, myVertexBuffer);
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render 패스 디스크립터
| `executor` | (`pass`) => `void` | Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`

***

### immediateComputePass()

> **immediateComputePass**(`labelOrDescriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:445](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L445)

즉시 실행 Compute 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.

* ### Example
```typescript
// 밉맵 생성이나 데이터 처리 등 즉시 수행되어야 하는 컴퓨트 명령을 기록하고 대기
await context.commandEncoderManager.immediateComputePass('ImmediateMipmapGen', (pass) => {
    pass.setPipeline(mipmapPipeline);
    pass.dispatchWorkgroups(1, 1, 1);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `labelOrDescriptor` | [`ComputePassDescriptorInput`](../type-aliases/ComputePassDescriptorInput.md) | Compute 패스의 레이블 또는 디스크립터 객체
| `executor` | (`pass`) => `void` | Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
| `afterExecutor?` | (`encoder`) => `void` | 패스 종료 후 커맨드 버퍼 제출 전에 인코더를 직접 제어할 선택적 콜백 함수

#### Returns

`Promise`\<`void`\>

***

### immediateRenderPass()

> **immediateRenderPass**(`descriptor`, `executor`, `afterExecutor?`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:407](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L407)

즉시 실행 Render 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.

* ### Example
```typescript
// 즉시 화면의 특정 텍스처를 클리어하거나 일회성 렌더 작업을 수행하고 GPU 제출 대기
await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
    // 드로우 콜 기록
    pass.draw(3);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptor` | `GPURenderPassDescriptor` | Render 패스 디스크립터
| `executor` | (`pass`) => `void` | Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
| `afterExecutor?` | (`encoder`) => `void` | 패스 종료 후 커맨드 버퍼 제출 전에 인코더를 직접 제어할 선택적 콜백 함수

#### Returns

`Promise`\<`void`\>

***

### immediateSubmit()

> **immediateSubmit**(`label`, `executor`): `Promise`\<`void`\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:480](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L480)

즉시 실행 인코더를 사용합니다. 호출 즉시 서밋되고 완료를 기다립니다.

* ### Example
```typescript
// 버퍼 초기화나 이미지 데이터 로드 등 복사 명령을 즉시 제출 후 대기
await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
    encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | 제출할 커맨드 인코더의 레이블
| `executor` | (`encoder`) => `void` | 커맨드 인코더를 받아 즉각적인 연산을 실행할 콜백 함수

#### Returns

`Promise`\<`void`\>

***

### resetAll()

> **resetAll**(): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:586](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L586)

모든 인코더 초기화

* ### Example
```typescript
// 렌더러가 재설정되거나 파괴될 때 인코더 및 상태 초기화
context.commandEncoderManager.resetAll();
```

#### Returns

`void`

***

### submit()

> **submit**(`type`): [`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:506](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L506)

특정 타입의 모든 인코더를 종료하고 즉시 서밋합니다.

* ### Example
```typescript
// RESOURCE 단계에 쌓인 모든 커맨드 버퍼를 제출
const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
console.log('Submitted RESOURCE stats:', stats);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | 제출할 커맨드 인코더 타입

#### Returns

[`CommandPhaseStats`](../interfaces/CommandPhaseStats.md)

제출 결과 통계 정보 (없을 경우 null)

***

### submitAll()

> **submitAll**(): [`CommandBatchStats`](../interfaces/CommandBatchStats.md)

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:538](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L538)

모든 타입의 인코더를 한꺼번에 종료하고 단 한 번의 호출로 서밋합니다. (성능 최적화용)

* ### Example
```typescript
// 루프 마지막에서 RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS 전체 단계를 일괄 제출
const batchStats = context.commandEncoderManager.submitAll();
```

#### Returns

[`CommandBatchStats`](../interfaces/CommandBatchStats.md)

전체 일괄 제출 통계 정보 (제출할 버퍼나 파괴 대상이 없으면 null)

***

### useEncoder()

> **useEncoder**(`type`, `executor`): `void`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:376](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/commandEncoderManager/CommandEncoderManager.ts#L376)

특정 타입의 인코더를 직접 사용합니다 (복사 명령 등).

* ### Example
```typescript
// RESOURCE 단계의 커맨드 인코더를 직접 꺼내어 버퍼 복사 명령 기록
context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
    encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`CommandEncoderType`](../type-aliases/CommandEncoderType.md) | 사용할 커맨드 인코더 타입
| `executor` | (`encoder`) => `void` | 커맨드 인코더를 인자로 받아 명령을 실행할 콜백 함수

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): `CommandEncoderManager`

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

`CommandEncoderManager`

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
