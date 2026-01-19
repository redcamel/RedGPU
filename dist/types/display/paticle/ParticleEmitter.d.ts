import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
interface ParticleEmitter {
    useBillboard: boolean;
}
/**
 * [KO] GPU 기반 파티클 시스템을 위한 이미터(Emitter) 클래스입니다.
 * [EN] Emitter class for a GPU-based particle system.
 *
 * [KO] 다양한 파티클 속성(수명, 위치, 스케일, 회전, 알파, 이징 등)과 GPU 연산 기반의 대량 파티클 처리를 지원합니다. 파티클의 초기값/최종값 범위, 이징, 버퍼 구조, 컴퓨트 파이프라인 등 파티클 시뮬레이션에 필요한 모든 기능을 제공합니다.
 * [EN] Supports various particle properties (life, position, scale, rotation, alpha, easing, etc.) and mass particle processing based on GPU computation. Provides all features necessary for particle simulation, including range of initial/final values, easing, buffer structures, and compute pipelines.
 *
 * * ### Example
 * ```typescript
 * const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
 * emitter.particleNum = 5000;
 * scene.addChild(emitter);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/particle/basic/"></iframe>
 *
 * [KO] 아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of ParticleEmitter.
 * @see [ParticleEmitter Performance](/RedGPU/examples/3d/particle/performance/)
 *
 * ## Roadmap
 * - **[KO] 다양한 파티클 이미터 타입 지원**
 * - **[EN] Support for various particle emitter types**
 * @category Particle
 */
declare class ParticleEmitter extends Mesh {
    #private;
    /**
     * [KO] ParticleEmitter 인스턴스를 생성합니다.
     * [EN] Creates an instance of ParticleEmitter.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    get vertexStateBuffers(): GPUVertexBufferLayout[];
    /**
     * 파티클 개수 (최대 500,000, 최소 1)
     */
    get particleNum(): number;
    set particleNum(value: number);
    /**
     * 파티클의 최소/최대 수명(ms)
     */
    get minLife(): number;
    set minLife(value: number);
    get maxLife(): number;
    set maxLife(value: number);
    /**
     * 파티클의 시작/종료 위치 범위
     */
    get minStartX(): number;
    set minStartX(value: number);
    get minStartY(): number;
    set minStartY(value: number);
    get minStartZ(): number;
    set minStartZ(value: number);
    get maxStartX(): number;
    set maxStartX(value: number);
    get maxStartY(): number;
    set maxStartY(value: number);
    get maxStartZ(): number;
    set maxStartZ(value: number);
    get minEndX(): number;
    set minEndX(value: number);
    get minEndY(): number;
    set minEndY(value: number);
    get minEndZ(): number;
    set minEndZ(value: number);
    get maxEndX(): number;
    set maxEndX(value: number);
    get maxEndY(): number;
    set maxEndY(value: number);
    get maxEndZ(): number;
    set maxEndZ(value: number);
    /**
     * 파티클의 시작/종료 알파(투명도) 범위
     */
    get minStartAlpha(): number;
    set minStartAlpha(value: number);
    get maxStartAlpha(): number;
    set maxStartAlpha(value: number);
    get minEndAlpha(): number;
    set minEndAlpha(value: number);
    get maxEndAlpha(): number;
    set maxEndAlpha(value: number);
    /**
     * 파티클의 시작/종료 스케일 범위
     */
    get minStartScale(): number;
    set minStartScale(value: number);
    get maxStartScale(): number;
    set maxStartScale(value: number);
    get minEndScale(): number;
    set minEndScale(value: number);
    get maxEndScale(): number;
    set maxEndScale(value: number);
    /**
     * 파티클의 시작/종료 회전(X/Y/Z) 범위
     */
    get minStartRotationX(): number;
    set minStartRotationX(value: number);
    get minStartRotationY(): number;
    set minStartRotationY(value: number);
    get minStartRotationZ(): number;
    set minStartRotationZ(value: number);
    get maxStartRotationX(): number;
    set maxStartRotationX(value: number);
    get maxStartRotationY(): number;
    set maxStartRotationY(value: number);
    get maxStartRotationZ(): number;
    set maxStartRotationZ(value: number);
    get minEndRotationX(): number;
    set minEndRotationX(value: number);
    get minEndRotationY(): number;
    set minEndRotationY(value: number);
    get minEndRotationZ(): number;
    set minEndRotationZ(value: number);
    get maxEndRotationX(): number;
    set maxEndRotationX(value: number);
    get maxEndRotationY(): number;
    set maxEndRotationY(value: number);
    get maxEndRotationZ(): number;
    set maxEndRotationZ(value: number);
    /**
     * 파티클의 위치/스케일/회전/알파에 적용할 이징 타입
     */
    get easeX(): number;
    set easeX(value: number);
    get easeY(): number;
    set easeY(value: number);
    get easeZ(): number;
    set easeZ(value: number);
    get easeAlpha(): number;
    set easeAlpha(value: number);
    get easeScale(): number;
    set easeScale(value: number);
    get easeRotationX(): number;
    set easeRotationX(value: number);
    get easeRotationY(): number;
    set easeRotationY(value: number);
    get easeRotationZ(): number;
    set easeRotationZ(value: number);
    /**
     * 파티클 버퍼(GPUBuffer) 배열 반환
     */
    get particleBuffers(): GPUBuffer[];
    /**
     * 파티클 렌더링 및 시뮬레이션을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * @returns 생성된 셰이더 모듈
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default ParticleEmitter;
