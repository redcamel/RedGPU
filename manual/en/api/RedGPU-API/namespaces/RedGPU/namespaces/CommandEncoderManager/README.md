[**RedGPU API v4.2.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / CommandEncoderManager

# CommandEncoderManager

RedGPU의 GPU 커맨드 인코더 및 패스 생명주기 관리 시스템 모듈입니다.

이 모듈은 GPU 명령 실행의 기초가 되는 커맨드 인코더(Command Encoder)와 렌더/컴퓨트 패스(Render/Compute Pass)의
생성, 공유, 안전한 회수 및 제출을 효율적으로 제어하는 [CommandEncoderManager](classes/CommandEncoderManager.md) 클래스와 관련 상수를 제공합니다.

## Remarks


***
- Designed to share a single encoder per phase (RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS) to improve performance.
- Automatically isolates and spawns a new encoder if a nested pass call is detected to guarantee system safety.
- Supports `immediate*` helper methods for tasks that require instant execution, such as mipmap generation or resource copies.
- Features built-in deferred destruction to cleanly dispose of WebGPU resources at a safe timing after command submission.

## Example

```typescript
// Run a render pass in the RESOURCE phase to process texture data, etc.
context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
    pass.setPipeline(myPipeline);
    pass.draw(3);
});

// Batch submit commands from all phases to the GPU queue
context.commandEncoderManager.submitAll();
```

## CommandEncoderManager

- [CommandEncoderManager](classes/CommandEncoderManager.md)
- [CommandEncoderType](type-aliases/CommandEncoderType.md)
- [COMMAND\_ENCODER\_TYPE](variables/COMMAND_ENCODER_TYPE.md)

## Other

- [CommandBatchStats](interfaces/CommandBatchStats.md)
- [CommandPhaseStats](interfaces/CommandPhaseStats.md)
- [ComputePassDescriptorInput](type-aliases/ComputePassDescriptorInput.md)
