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
     * [KO] 파티클 개수를 반환합니다. (최대 500,000, 최소 1)
     * [EN] Returns the number of particles. (Max 500,000, Min 1)
     *
     * @returns
     * [KO] 파티클 개수
     * [EN] Number of particles
     */
    get particleNum(): number;
    /**
     * [KO] 파티클 개수를 설정합니다. 설정 시 시뮬레이션 버퍼가 재구성됩니다.
     * [EN] Sets the number of particles. Setting this reconstructs the simulation buffer.
     *
     * @param value -
     * [KO] 파티클 개수 (1 ~ 500,000)
     * [EN] Number of particles (1 ~ 500,000)
     */
    set particleNum(value: number);
    /**
     * [KO] 파티클의 최소 수명을 반환합니다. (ms)
     * [EN] Returns the minimum life of the particle. (ms)
     *
     * @returns
     * [KO] 최소 수명
     * [EN] Minimum life
     */
    get minLife(): number;
    /**
     * [KO] 파티클의 최소 수명을 설정합니다. (ms)
     * [EN] Sets the minimum life of the particle. (ms)
     *
     * @param value -
     * [KO] 최소 수명
     * [EN] Minimum life
     */
    set minLife(value: number);
    /**
     * [KO] 파티클의 최대 수명을 반환합니다. (ms)
     * [EN] Returns the maximum life of the particle. (ms)
     *
     * @returns
     * [KO] 최대 수명
     * [EN] Maximum life
     */
    get maxLife(): number;
    /**
     * [KO] 파티클의 최대 수명을 설정합니다. (ms)
     * [EN] Sets the maximum life of the particle. (ms)
     *
     * @param value -
     * [KO] 최대 수명
     * [EN] Maximum life
     */
    set maxLife(value: number);
    /**
     * [KO] 최소 시작 X 좌표를 반환합니다.
     * [EN] Returns the minimum start X coordinate.
     */
    get minStartX(): number;
    /**
     * [KO] 최소 시작 X 좌표를 설정합니다.
     * [EN] Sets the minimum start X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartX(value: number);
    /**
     * [KO] 최소 시작 Y 좌표를 반환합니다.
     * [EN] Returns the minimum start Y coordinate.
     */
    get minStartY(): number;
    /**
     * [KO] 최소 시작 Y 좌표를 설정합니다.
     * [EN] Sets the minimum start Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartY(value: number);
    /**
     * [KO] 최소 시작 Z 좌표를 반환합니다.
     * [EN] Returns the minimum start Z coordinate.
     */
    get minStartZ(): number;
    /**
     * [KO] 최소 시작 Z 좌표를 설정합니다.
     * [EN] Sets the minimum start Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartZ(value: number);
    /**
     * [KO] 최대 시작 X 좌표를 반환합니다.
     * [EN] Returns the maximum start X coordinate.
     */
    get maxStartX(): number;
    /**
     * [KO] 최대 시작 X 좌표를 설정합니다.
     * [EN] Sets the maximum start X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartX(value: number);
    /**
     * [KO] 최대 시작 Y 좌표를 반환합니다.
     * [EN] Returns the maximum start Y coordinate.
     */
    get maxStartY(): number;
    /**
     * [KO] 최대 시작 Y 좌표를 설정합니다.
     * [EN] Sets the maximum start Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartY(value: number);
    /**
     * [KO] 최대 시작 Z 좌표를 반환합니다.
     * [EN] Returns the maximum start Z coordinate.
     */
    get maxStartZ(): number;
    /**
     * [KO] 최대 시작 Z 좌표를 설정합니다.
     * [EN] Sets the maximum start Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartZ(value: number);
    /**
     * [KO] 최소 종료 X 좌표를 반환합니다.
     * [EN] Returns the minimum end X coordinate.
     */
    get minEndX(): number;
    /**
     * [KO] 최소 종료 X 좌표를 설정합니다.
     * [EN] Sets the minimum end X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndX(value: number);
    /**
     * [KO] 최소 종료 Y 좌표를 반환합니다.
     * [EN] Returns the minimum end Y coordinate.
     */
    get minEndY(): number;
    /**
     * [KO] 최소 종료 Y 좌표를 설정합니다.
     * [EN] Sets the minimum end Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndY(value: number);
    /**
     * [KO] 최소 종료 Z 좌표를 반환합니다.
     * [EN] Returns the minimum end Z coordinate.
     */
    get minEndZ(): number;
    /**
     * [KO] 최소 종료 Z 좌표를 설정합니다.
     * [EN] Sets the minimum end Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndZ(value: number);
    /**
     * [KO] 최대 종료 X 좌표를 반환합니다.
     * [EN] Returns the maximum end X coordinate.
     */
    get maxEndX(): number;
    /**
     * [KO] 최대 종료 X 좌표를 설정합니다.
     * [EN] Sets the maximum end X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndX(value: number);
    /**
     * [KO] 최대 종료 Y 좌표를 반환합니다.
     * [EN] Returns the maximum end Y coordinate.
     */
    get maxEndY(): number;
    /**
     * [KO] 최대 종료 Y 좌표를 설정합니다.
     * [EN] Sets the maximum end Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndY(value: number);
    /**
     * [KO] 최대 종료 Z 좌표를 반환합니다.
     * [EN] Returns the maximum end Z coordinate.
     */
    get maxEndZ(): number;
    /**
     * [KO] 최대 종료 Z 좌표를 설정합니다.
     * [EN] Sets the maximum end Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndZ(value: number);
    /**
     * [KO] 최소 시작 알파를 반환합니다.
     * [EN] Returns the minimum start alpha.
     */
    get minStartAlpha(): number;
    /**
     * [KO] 최소 시작 알파를 설정합니다.
     * [EN] Sets the minimum start alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartAlpha(value: number);
    /**
     * [KO] 최대 시작 알파를 반환합니다.
     * [EN] Returns the maximum start alpha.
     */
    get maxStartAlpha(): number;
    /**
     * [KO] 최대 시작 알파를 설정합니다.
     * [EN] Sets the maximum start alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartAlpha(value: number);
    /**
     * [KO] 최소 종료 알파를 반환합니다.
     * [EN] Returns the minimum end alpha.
     */
    get minEndAlpha(): number;
    /**
     * [KO] 최소 종료 알파를 설정합니다.
     * [EN] Sets the minimum end alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndAlpha(value: number);
    /**
     * [KO] 최대 종료 알파를 반환합니다.
     * [EN] Returns the maximum end alpha.
     */
    get maxEndAlpha(): number;
    /**
     * [KO] 최대 종료 알파를 설정합니다.
     * [EN] Sets the maximum end alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndAlpha(value: number);
    /**
     * [KO] 최소 시작 스케일을 반환합니다.
     * [EN] Returns the minimum start scale.
     */
    get minStartScale(): number;
    /**
     * [KO] 최소 시작 스케일을 설정합니다.
     * [EN] Sets the minimum start scale.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartScale(value: number);
    /**
     * [KO] 최대 시작 스케일을 반환합니다.
     * [EN] Returns the maximum start scale.
     */
    get maxStartScale(): number;
    /**
     * [KO] 최대 시작 스케일을 설정합니다.
     * [EN] Sets the maximum start scale.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartScale(value: number);
    /**
     * [KO] 최소 종료 스케일을 반환합니다.
     * [EN] Returns the minimum end scale.
     */
    get minEndScale(): number;
    /**
     * [KO] 최소 종료 스케일을 설정합니다.
     * [EN] Sets the minimum end scale.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndScale(value: number);
    /**
     * [KO] 최대 종료 스케일을 반환합니다.
     * [EN] Returns the maximum end scale.
     */
    get maxEndScale(): number;
    /**
     * [KO] 최대 종료 스케일을 설정합니다.
     * [EN] Sets the maximum end scale.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndScale(value: number);
    /**
     * [KO] 최소 시작 X 회전을 반환합니다. (도)
     * [EN] Returns the minimum start X rotation. (degrees)
     */
    get minStartRotationX(): number;
    /**
     * [KO] 최소 시작 X 회전을 설정합니다. (도)
     * [EN] Sets the minimum start X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationX(value: number);
    /**
     * [KO] 최소 시작 Y 회전을 반환합니다. (도)
     * [EN] Returns the minimum start Y rotation. (degrees)
     */
    get minStartRotationY(): number;
    /**
     * [KO] 최소 시작 Y 회전을 설정합니다. (도)
     * [EN] Sets the minimum start Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationY(value: number);
    /**
     * [KO] 최소 시작 Z 회전을 반환합니다. (도)
     * [EN] Returns the minimum start Z rotation. (degrees)
     */
    get minStartRotationZ(): number;
    /**
     * [KO] 최소 시작 Z 회전을 설정합니다. (도)
     * [EN] Sets the minimum start Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationZ(value: number);
    /**
     * [KO] 최대 시작 X 회전을 반환합니다. (도)
     * [EN] Returns the maximum start X rotation. (degrees)
     */
    get maxStartRotationX(): number;
    /**
     * [KO] 최대 시작 X 회전을 설정합니다. (도)
     * [EN] Sets the maximum start X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationX(value: number);
    /**
     * [KO] 최대 시작 Y 회전을 반환합니다. (도)
     * [EN] Returns the maximum start Y rotation. (degrees)
     */
    get maxStartRotationY(): number;
    /**
     * [KO] 최대 시작 Y 회전을 설정합니다. (도)
     * [EN] Sets the maximum start Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationY(value: number);
    /**
     * [KO] 최대 시작 Z 회전을 반환합니다. (도)
     * [EN] Returns the maximum start Z rotation. (degrees)
     */
    get maxStartRotationZ(): number;
    /**
     * [KO] 최대 시작 Z 회전을 설정합니다. (도)
     * [EN] Sets the maximum start Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationZ(value: number);
    /**
     * [KO] 최소 종료 X 회전을 반환합니다. (도)
     * [EN] Returns the minimum end X rotation. (degrees)
     */
    get minEndRotationX(): number;
    /**
     * [KO] 최소 종료 X 회전을 설정합니다. (도)
     * [EN] Sets the minimum end X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationX(value: number);
    /**
     * [KO] 최소 종료 Y 회전을 반환합니다. (도)
     * [EN] Returns the minimum end Y rotation. (degrees)
     */
    get minEndRotationY(): number;
    /**
     * [KO] 최소 종료 Y 회전을 설정합니다. (도)
     * [EN] Sets the minimum end Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationY(value: number);
    /**
     * [KO] 최소 종료 Z 회전을 반환합니다. (도)
     * [EN] Returns the minimum end Z rotation. (degrees)
     */
    get minEndRotationZ(): number;
    /**
     * [KO] 최소 종료 Z 회전을 설정합니다. (도)
     * [EN] Sets the minimum end Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationZ(value: number);
    /**
     * [KO] 최대 종료 X 회전을 반환합니다. (도)
     * [EN] Returns the maximum end X rotation. (degrees)
     */
    get maxEndRotationX(): number;
    /**
     * [KO] 최대 종료 X 회전을 설정합니다. (도)
     * [EN] Sets the maximum end X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationX(value: number);
    /**
     * [KO] 최대 종료 Y 회전을 반환합니다. (도)
     * [EN] Returns the maximum end Y rotation. (degrees)
     */
    get maxEndRotationY(): number;
    /**
     * [KO] 최대 종료 Y 회전을 설정합니다. (도)
     * [EN] Sets the maximum end Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationY(value: number);
    /**
     * [KO] 최대 종료 Z 회전을 반환합니다. (도)
     * [EN] Returns the maximum end Z rotation. (degrees)
     */
    get maxEndRotationZ(): number;
    /**
     * [KO] 최대 종료 Z 회전을 설정합니다. (도)
     * [EN] Sets the maximum end Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationZ(value: number);
    /**
     * [KO] X축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for X-axis movement.
     */
    get easeX(): number;
    /**
     * [KO] X축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for X-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeX(value: number);
    /**
     * [KO] Y축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Y-axis movement.
     */
    get easeY(): number;
    /**
     * [KO] Y축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Y-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeY(value: number);
    /**
     * [KO] Z축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Z-axis movement.
     */
    get easeZ(): number;
    /**
     * [KO] Z축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Z-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeZ(value: number);
    /**
     * [KO] 알파 변화에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for alpha change.
     */
    get easeAlpha(): number;
    /**
     * [KO] 알파 변화에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for alpha change.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeAlpha(value: number);
    /**
     * [KO] 스케일 변화에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for scale change.
     */
    get easeScale(): number;
    /**
     * [KO] 스케일 변화에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for scale change.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeScale(value: number);
    /**
     * [KO] X축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for X-axis rotation.
     */
    get easeRotationX(): number;
    /**
     * [KO] X축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for X-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeRotationX(value: number);
    /**
     * [KO] Y축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Y-axis rotation.
     */
    get easeRotationY(): number;
    /**
     * [KO] Y축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Y-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeRotationY(value: number);
    /**
     * [KO] Z축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Z-axis rotation.
     */
    get easeRotationZ(): number;
    /**
     * [KO] Z축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Z-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
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
