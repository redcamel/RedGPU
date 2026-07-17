import RedGPUContext from "../context/RedGPUContext";
import { CommandEncoderType } from "./COMMAND_ENCODER_TYPE";
import RedGPUObject from "../base/RedGPUObject";
/**
 * [KO] 단계별 통계 상세 정보 인터페이스
 * [EN] Detailed statistics per phase
 */
export interface CommandPhaseStats {
    /**
     * [KO] 인코더의 단계(Phase) 타입
     * [EN] Phase type of the encoder
     */
    'Phase'?: CommandEncoderType;
    /**
     * [KO] 제출된 커맨드 버퍼의 개수
     * [EN] Number of command buffers submitted
     */
    'Command Buffers': number;
    /**
     * [KO] 렌더 패스 정보
     * [EN] Render pass information
     */
    'Render Passes': {
        /**
         * [KO] 실행된 렌더 패스의 총 개수
         * [EN] Total number of executed render passes
         */
        count: number;
        /**
         * [KO] 실행된 렌더 패스들의 레이블 리스트
         * [EN] List of labels for executed render passes
         */
        list: string[];
    };
    /**
     * [KO] 컴퓨트 패스 정보
     * [EN] Compute pass information
     */
    'Compute Passes': {
        /**
         * [KO] 실행된 컴퓨트 패스의 총 개수
         * [EN] Total number of executed compute passes
         */
        count: number;
        /**
         * [KO] 실행된 컴퓨트 패스들의 레이블 리스트
         * [EN] List of labels for executed compute passes
         */
        list: string[];
    };
    /**
     * [KO] 인코더를 직접 참조하여 기록한 수 (예: useEncoder 사용 횟수)
     * [EN] Number of raw encoder usages (e.g., useEncoder call count)
     */
    'Raw Usages': number;
}
/**
 * [KO] 일괄 제출 통계 정보 인터페이스
 * [EN] Batch submission statistics
 */
export interface CommandBatchStats {
    /**
     * [KO] 각 단계(Phase)별 상세 통계 정보 레코드
     * [EN] Detailed statistics record per phase
     */
    phases: Record<string, CommandPhaseStats>;
    /**
     * [KO] 이번 제출 완료 후 지연 파괴(Deferred Destroy)된 리소스의 개수
     * [EN] Number of resources deferred destroyed after this submission
     */
    deferredDestroyCount: number;
}
/**
 * [KO] Compute 패스 디스크립터 입력을 위한 타입 (레이블 문자열 또는 전체 디스크립터 객체)
 * [EN] Type for compute pass descriptor input (label string or full descriptor object)
 */
export type ComputePassDescriptorInput = string | GPUComputePassDescriptor;
/**
 * [KO] GPU 커맨드 인코더 및 패스의 생명주기를 지능적으로 관리하는 클래스입니다.
 * [EN] Class that intelligently manages the lifecycle of GPU command encoders and passes.
 *
 * [KO] 기본적으로 단계별로 하나의 인코더를 공유하여 효율을 높이지만,
 *      패스가 열려있는 상태에서 중첩 호출이 발생하면 자동으로 새로운 인코더를 생성하여 안전성을 보장합니다.
 * [EN] Basically increases efficiency by sharing one encoder per phase,
 *      but automatically creates a new encoder when nested calls occur while a pass is open to ensure safety.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category CommandEncoderManager
 */
declare class CommandEncoderManager extends RedGPUObject {
    #private;
    /**
     * [KO] CommandEncoderManager 인스턴스를 생성합니다.
     * [EN] Creates a CommandEncoderManager instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 모든 커맨드 제출 후 안전한 시점에 파괴할 리소스를 등록합니다.
     * [EN] Registers a resource to be destroyed at a safe time after all commands are submitted.
     *
     * * ### Example
     * ```typescript
     * // [KO] 더 이상 사용하지 않는 임시 버퍼를 프레임 제출 완료 후 자동 파괴하도록 지연 목록에 등록
     * // [EN] Register a temporary buffer no longer in use to the deferred list to be automatically destroyed after frame submission
     * context.commandEncoderManager.addDeferredDestroy(tempBuffer);
     * ```
     *
     * @param resource -
     * [KO] 파괴할 리소스 객체 (destroy 메서드를 구현해야 함)
     * [EN] The resource object to destroy (must implement the destroy method)
     */
    addDeferredDestroy(resource: {
        destroy(): void;
    }): void;
    /**
     * [KO] RESOURCE 단계의 Render 패스를 추가합니다.
     * [EN] Adds a Render pass for the RESOURCE phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] RESOURCE 단계에서 텍스처나 임시 리소스를 렌더링/복제하기 위한 패스 실행
     * // [EN] Execute a pass to render or copy textures/temporary resources in the RESOURCE phase
     * context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
     *     pass.setPipeline(myRenderPipeline);
     *     pass.setVertexBuffer(0, myVertexBuffer);
     *     pass.draw(3);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] Render 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Render pass encoder
     */
    addResourceRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void;
    /**
     * [KO] RESOURCE 단계의 Compute 패스를 추가합니다.
     * [EN] Adds a Compute pass for the RESOURCE phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] RESOURCE 단계에서 파이프라인 설정 및 Compute 연산 디스패치 수행
     * // [EN] Set pipeline and dispatch Compute operation in the RESOURCE phase
     * context.commandEncoderManager.addResourceComputePass('MyResourceComputePass', (pass) => {
     *     pass.setPipeline(myComputePipeline);
     *     pass.setBindGroup(0, myBindGroup);
     *     pass.dispatchWorkgroups(64, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] Compute 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the Compute pass
     * @param executor -
     * [KO] Compute 패스 인코더(GPUComputePassEncoder)를 인자로 받아, 패스 안에서 수행할 파이프라인 설정 및 디스패치 명령 등을 기재하는 콜백 함수
     * [EN] Callback function that receives the Compute pass encoder (GPUComputePassEncoder) and records commands like setting pipelines or dispatching workgroups inside the pass
     */
    addResourceComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void;
    /**
     * [KO] PRE_PROCESS 단계의 Render 패스를 추가합니다.
     * [EN] Adds a Render pass for the PRE_PROCESS phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] PRE_PROCESS 단계에서 메인 렌더링에 앞서 섀도우맵이나 G-Buffer 등을 렌더링
     * // [EN] Render shadow maps or G-Buffers in the PRE_PROCESS phase before main rendering
     * context.commandEncoderManager.addPreProcessRenderPass(shadowPassDescriptor, (pass) => {
     *     pass.setPipeline(shadowPipeline);
     *     pass.drawIndexed(indexCount);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] Render 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Render pass encoder
     */
    addPreProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void;
    /**
     * [KO] PRE_PROCESS 단계의 Compute 패스를 추가합니다.
     * [EN] Adds a Compute pass for the PRE_PROCESS phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] PRE_PROCESS 단계에서 스킨 애니메이션, 파티클 시뮬레이션 물리 연산 수행
     * // [EN] Perform skin animation, particle simulation physics calculations in the PRE_PROCESS phase
     * context.commandEncoderManager.addPreProcessComputePass('ParticleSimulation', (pass) => {
     *     pass.setPipeline(particleComputePipeline);
     *     pass.dispatchWorkgroups(32, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] Compute 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the Compute pass
     * @param executor -
     * [KO] Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Compute pass encoder
     */
    addPreProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void;
    /**
     * [KO] MAIN 단계의 Render 패스를 추가합니다.
     * [EN] Adds a Render pass for the MAIN phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] MAIN 단계에서 메인 화면 프레임버퍼에 메쉬 오브젝트들을 렌더링
     * // [EN] Render mesh objects to the main screen framebuffer in the MAIN phase
     * context.commandEncoderManager.addMainRenderPass(mainRenderPassDescriptor, (pass) => {
     *     pass.setPipeline(mainPipeline);
     *     pass.drawIndexed(indexCount);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] Render 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Render pass encoder
     */
    addMainRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void;
    /**
     * [KO] MAIN 단계의 Compute 패스를 추가합니다.
     * [EN] Adds a Compute pass for the MAIN phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] MAIN 단계에서 렌더링과 동시에 메인 뷰포트 영역에 대한 컴퓨트 연산 처리
     * // [EN] Process compute calculations for the main viewport area simultaneously with rendering in the MAIN phase
     * context.commandEncoderManager.addMainComputePass('MainCullingCompute', (pass) => {
     *     pass.setPipeline(cullingPipeline);
     *     pass.dispatchWorkgroups(16, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] Compute 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the Compute pass
     * @param executor -
     * [KO] Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Compute pass encoder
     */
    addMainComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void;
    /**
     * [KO] POST_PROCESS 단계의 Render 패스를 추가합니다.
     * [EN] Adds a Render pass for the POST_PROCESS phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] POST_PROCESS 단계에서 블러(Blur), 포스트 프로세싱 쿼드 효과 적용
     * // [EN] Apply blur, post-processing quad effects in the POST_PROCESS phase
     * context.commandEncoderManager.addPostProcessRenderPass(postRenderPassDescriptor, (pass) => {
     *     pass.setPipeline(postProcessPipeline);
     *     pass.draw(6);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] Render 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Render pass encoder
     */
    addPostProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void;
    /**
     * [KO] POST_PROCESS 단계의 Compute 패스를 추가합니다.
     * [EN] Adds a Compute pass for the POST_PROCESS phase.
     *
     * * ### Example
     * ```typescript
     * // [KO] POST_PROCESS 단계에서 Bloom이나 DOF 등의 포스트 프로세스 효과 계산을 Compute 쉐이더로 수행
     * // [EN] Perform post-process effect calculations like Bloom or DOF using Compute shaders in the POST_PROCESS phase
     * context.commandEncoderManager.addPostProcessComputePass('BloomCompute', (pass) => {
     *     pass.setPipeline(bloomComputePipeline);
     *     pass.dispatchWorkgroups(width / 16, height / 16, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] Compute 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the Compute pass
     * @param executor -
     * [KO] Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Compute pass encoder
     */
    addPostProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void;
    /**
     * [KO] 특정 타입의 인코더를 직접 사용합니다 (복사 명령 등).
     * [EN] Directly uses an encoder of a specific type (e.g., for copy commands).
     *
     * * ### Example
     * ```typescript
     * // [KO] RESOURCE 단계의 커맨드 인코더를 직접 꺼내어 버퍼 복사 명령 기록
     * // [EN] Directly retrieve the command encoder for the RESOURCE phase to record a buffer copy command
     * context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
     *     encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
     * });
     * ```
     *
     * @param type -
     * [KO] 사용할 커맨드 인코더 타입
     * [EN] Command encoder type to use
     * @param executor -
     * [KO] 커맨드 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the GPU command encoder
     */
    useEncoder(type: CommandEncoderType, executor: (encoder: GPUCommandEncoder) => void): void;
    /**
     * [KO] 즉시 실행 Render 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.
     * [EN] Uses an immediate Render pass. The pass is finished and submitted immediately upon call.
     *
     * * ### Example
     * ```typescript
     * // [KO] 즉시 화면의 특정 텍스처를 클리어하거나 일회성 렌더 작업을 수행하고 GPU 제출 대기
     * // [EN] Immediately clear a specific texture or perform a one-time render operation and await GPU submission
     * await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
     *     // [KO] 드로우 콜 기록
     *     // [EN] Record draw calls
     *     pass.draw(3);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] Render 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] Render 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Render pass encoder
     * @param afterExecutor -
     * [KO] 패스 종료 후 커맨드 버퍼 제출 전에 인코더를 직접 제어할 선택적 콜백 함수
     * [EN] Optional callback function to directly control the encoder after finishing the pass and before submission
     */
    immediateRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void, afterExecutor?: (encoder: GPUCommandEncoder) => void): Promise<void>;
    /**
     * [KO] 즉시 실행 Compute 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.
     * [EN] Uses an immediate Compute pass. The pass is finished and submitted immediately upon call.
     *
     * * ### Example
     * ```typescript
     * // [KO] 밉맵 생성이나 데이터 처리 등 즉시 수행되어야 하는 컴퓨트 명령을 기록하고 대기
     * // [EN] Record and await compute commands that need to run immediately, such as mipmap generation or data processing
     * await context.commandEncoderManager.immediateComputePass('ImmediateMipmapGen', (pass) => {
     *     pass.setPipeline(mipmapPipeline);
     *     pass.dispatchWorkgroups(1, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] Compute 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the Compute pass
     * @param executor -
     * [KO] Compute 패스 인코더를 인자로 받아 명령을 실행할 콜백 함수
     * [EN] Callback function to execute commands with the Compute pass encoder
     * @param afterExecutor -
     * [KO] 패스 종료 후 커맨드 버퍼 제출 전에 인코더를 직접 제어할 선택적 콜백 함수
     * [EN] Optional callback function to directly control the encoder after finishing the pass and before submission
     */
    immediateComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void, afterExecutor?: (encoder: GPUCommandEncoder) => void): Promise<void>;
    /**
     * [KO] 즉시 실행 인코더를 사용합니다. 호출 즉시 서밋되고 완료를 기다립니다.
     * [EN] Uses an immediate encoder. It is submitted immediately and awaits completion.
     *
     * * ### Example
     * ```typescript
     * // [KO] 버퍼 초기화나 이미지 데이터 로드 등 복사 명령을 즉시 제출 후 대기
     * // [EN] Submit and await copy commands immediately, such as buffer initialization or image data loading
     * await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
     *     encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
     * });
     * ```
     *
     * @param label -
     * [KO] 제출할 커맨드 인코더의 레이블
     * [EN] Label of the command encoder to submit
     * @param executor -
     * [KO] 커맨드 인코더를 받아 즉각적인 연산을 실행할 콜백 함수
     * [EN] Callback function to execute immediate operations with the command encoder
     */
    immediateSubmit(label: string, executor: (encoder: GPUCommandEncoder) => void): Promise<void>;
    /**
     * [KO] 특정 타입의 모든 인코더를 종료하고 즉시 서밋합니다.
     * [EN] Finishes all encoders for the specific type and submits them immediately.
     *
     * * ### Example
     * ```typescript
     * // [KO] RESOURCE 단계에 쌓인 모든 커맨드 버퍼를 제출
     * // [EN] Submit all command buffers accumulated in the RESOURCE phase
     * const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
     * console.log('Submitted RESOURCE stats:', stats);
     * ```
     *
     * @param type -
     * [KO] 제출할 커맨드 인코더 타입
     * [EN] Command encoder type to submit
     * @returns
     * [KO] 제출 결과 통계 정보 (없을 경우 null)
     * [EN] Submission phase statistics (null if nothing submitted)
     */
    submit(type: CommandEncoderType): CommandPhaseStats | null;
    /**
     * [KO] 모든 타입의 인코더를 한꺼번에 종료하고 단 한 번의 호출로 서밋합니다. (성능 최적화용)
     * [EN] Finishes encoders of all types and submits them in a single call. (For performance optimization)
     *
     * * ### Example
     * ```typescript
     * // [KO] 루프 마지막에서 RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS 전체 단계를 일괄 제출
     * // [EN] Batch submit RESOURCE, PRE_PROCESS, MAIN, and POST_PROCESS phases at the end of the loop
     * const batchStats = context.commandEncoderManager.submitAll();
     * ```
     *
     * @returns
     * [KO] 전체 일괄 제출 통계 정보 (제출할 버퍼나 파괴 대상이 없으면 null)
     * [EN] Batch submission statistics (null if no buffers submitted or deferred destructions)
     */
    submitAll(): CommandBatchStats | null;
    /**
     * [KO] 모든 인코더 초기화
     * [EN] Reset all encoders
     *
     * * ### Example
     * ```typescript
     * // [KO] 렌더러가 재설정되거나 파괴될 때 인코더 및 상태 초기화
     * // [EN] Reset encoders and states when the renderer is re-initialized or destroyed
     * context.commandEncoderManager.resetAll();
     * ```
     */
    resetAll(): void;
    /**
     * [KO] CommandEncoderManager 인스턴스를 파기하고 모든 커맨드 인코더 및 지연 리소스 참조를 정리합니다.
     * [EN] Destroys the CommandEncoderManager instance and cleans up all command encoder and deferred resource references.
     */
    destroy(): void;
}
export default CommandEncoderManager;
