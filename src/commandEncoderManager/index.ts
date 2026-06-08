/**
 * @packageDocumentation
 *
 * RedGPU의 GPU 커맨드 인코더 및 패스 생명주기 관리 시스템 모듈입니다.
 *
 * 이 모듈은 GPU 명령 실행의 기초가 되는 커맨드 인코더(Command Encoder)와 렌더/컴퓨트 패스(Render/Compute Pass)의
 * 생성, 공유, 안전한 회수 및 제출을 효율적으로 제어하는 {@link CommandEncoderManager} 클래스와 관련 상수를 제공합니다.
 *
 * @remarks
 * **[KO]**
 * - 단계(Phase: RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS)별로 단일 인코더를 공유하도록 설계되어 성능 효율을 높집니다.
 * - 중첩 패스 호출이 감지될 경우, 시스템의 안전을 보장하기 위해 자동으로 새 인코더를 분리하여 생성합니다.
 * - 밉맵 생성이나 리소스 복사 등 즉각 처리가 필요한 경우를 위한 `immediate*` 헬퍼 메서드를 지원합니다.
 * - 커맨드 제출 완료 후 안전한 파괴 시점에 리소스를 지연 처리하는 지연 파괴(Deferred Destroy) 기능을 내장하고 있습니다.
 *
 * **[EN]**
 * - Designed to share a single encoder per phase (RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS) to improve performance.
 * - Automatically isolates and spawns a new encoder if a nested pass call is detected to guarantee system safety.
 * - Supports `immediate*` helper methods for tasks that require instant execution, such as mipmap generation or resource copies.
 * - Features built-in deferred destruction to cleanly dispose of WebGPU resources at a safe timing after command submission.
 *
 * @example
 * ```typescript
 * // [KO] RESOURCE 단계에서 렌더 패스를 실행하여 텍스처 데이터 등 처리
 * // [EN] Run a render pass in the RESOURCE phase to process texture data, etc.
 * context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
 *     pass.setPipeline(myPipeline);
 *     pass.draw(3);
 * });
 *
 * // [KO] 모든 단계(Phases)의 명령들을 일괄적으로 GPU 대기열에 제출
 * // [EN] Batch submit commands from all phases to the GPU queue
 * context.commandEncoderManager.submitAll();
 * ```
 */

import CommandEncoderManager, {
    CommandBatchStats,
    CommandPhaseStats,
    ComputePassDescriptorInput
} from "./CommandEncoderManager";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "./COMMAND_ENCODER_TYPE";

export {
    CommandEncoderManager,
    COMMAND_ENCODER_TYPE,
    CommandEncoderType,
    ComputePassDescriptorInput,
    CommandPhaseStats,
    CommandBatchStats
};