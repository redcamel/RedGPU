import RedGPUContext from "../../context/RedGPUContext";
import DefineForVertex from "../../defineProperty/DefineForVertex";
import BitmapMaterial from "../../material/bitmapMaterial/BitmapMaterial";
import Plane from "../../primitive/Plane";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import Mesh from "../mesh/Mesh";
import MESH_TYPE from "../MESH_TYPE";
import RenderViewStateData from "../view/core/RenderViewStateData";
import PARTICLE_EASE from "./PARTICLE_EASE";
import computeModuleSource from "./shader/compute.wgsl";
import vertexModuleSource from "./shader/particleVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_PARTICLE_EMITTER'
const SHADER_INFO = parseWGSL(vertexModuleSource, 'PARTICLE_EMITTER_VERTEX');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

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
class ParticleEmitter extends Mesh {
    /**
     * [KO] 파티클의 최소 수명 (ms)
     * [EN] Minimum life of the particle (ms)
     */
    #minLife: number = 1000
    /**
     * [KO] 파티클의 최대 수명 (ms)
     * [EN] Maximum life of the particle (ms)
     */
    #maxLife: number = 5000
    //
    /** [KO] 최소 시작 X 좌표 [EN] Minimum start X coordinate */
    #minStartX: number = 0
    /** [KO] 최소 시작 Y 좌표 [EN] Minimum start Y coordinate */
    #minStartY: number = 0
    /** [KO] 최소 시작 Z 좌표 [EN] Minimum start Z coordinate */
    #minStartZ: number = 0
    //
    /** [KO] 최대 시작 X 좌표 [EN] Maximum start X coordinate */
    #maxStartX: number = 0
    /** [KO] 최대 시작 Y 좌표 [EN] Maximum start Y coordinate */
    #maxStartY: number = 0
    /** [KO] 최대 시작 Z 좌표 [EN] Maximum start Z coordinate */
    #maxStartZ: number = 0
    //
    /** [KO] 최소 종료 X 좌표 [EN] Minimum end X coordinate */
    #minEndX: number = -5
    /** [KO] 최소 종료 Y 좌표 [EN] Minimum end Y coordinate */
    #minEndY: number = -5
    /** [KO] 최소 종료 Z 좌표 [EN] Minimum end Z coordinate */
    #minEndZ: number = -5
    //
    /** [KO] 최대 종료 X 좌표 [EN] Maximum end X coordinate */
    #maxEndX: number = 5
    /** [KO] 최대 종료 Y 좌표 [EN] Maximum end Y coordinate */
    #maxEndY: number = 5
    /** [KO] 최대 종료 Z 좌표 [EN] Maximum end Z coordinate */
    #maxEndZ: number = 5
    //
    /** [KO] 최소 시작 알파 [EN] Minimum start alpha */
    #minStartAlpha: number = 1
    /** [KO] 최대 시작 알파 [EN] Maximum start alpha */
    #maxStartAlpha: number = 1
    /** [KO] 최소 종료 알파 [EN] Minimum end alpha */
    #minEndAlpha: number = 1
    /** [KO] 최대 종료 알파 [EN] Maximum end alpha */
    #maxEndAlpha: number = 1
    //
    /** [KO] 최소 시작 스케일 [EN] Minimum start scale */
    #minStartScale: number = 0
    /** [KO] 최대 시작 스케일 [EN] Maximum start scale */
    #maxStartScale: number = 1
    /** [KO] 최소 종료 스케일 [EN] Minimum end scale */
    #minEndScale: number = 0
    /** [KO] 최대 종료 스케일 [EN] Maximum end scale */
    #maxEndScale: number = 0
    //
    /** [KO] 최소 시작 X 회전 [EN] Minimum start X rotation */
    #minStartRotationX: number = -360
    /** [KO] 최소 시작 Y 회전 [EN] Minimum start Y rotation */
    #minStartRotationY: number = -360
    /** [KO] 최소 시작 Z 회전 [EN] Minimum start Z rotation */
    #minStartRotationZ: number = -360
    /** [KO] 최대 시작 X 회전 [EN] Maximum start X rotation */
    #maxStartRotationX: number = 360
    /** [KO] 최대 시작 Y 회전 [EN] Maximum start Y rotation */
    #maxStartRotationY: number = 360
    /** [KO] 최대 시작 Z 회전 [EN] Maximum start Z rotation */
    #maxStartRotationZ: number = 360
    /** [KO] 최소 종료 X 회전 [EN] Minimum end X rotation */
    #minEndRotationX: number = -360
    /** [KO] 최소 종료 Y 회전 [EN] Minimum end Y rotation */
    #minEndRotationY: number = -360
    /** [KO] 최소 종료 Z 회전 [EN] Minimum end Z rotation */
    #minEndRotationZ: number = -360
    /** [KO] 최대 종료 X 회전 [EN] Maximum end X rotation */
    #maxEndRotationX: number = 360
    /** [KO] 최대 종료 Y 회전 [EN] Maximum end Y rotation */
    #maxEndRotationY: number = 360
    /** [KO] 최대 종료 Z 회전 [EN] Maximum end Z rotation */
    #maxEndRotationZ: number = 360
    //
    /** [KO] X축 이동 이징 [EN] X-axis movement easing */
    #easeX: number = PARTICLE_EASE.CubicOut
    /** [KO] Y축 이동 이징 [EN] Y-axis movement easing */
    #easeY: number = PARTICLE_EASE.CubicOut
    /** [KO] Z축 이동 이징 [EN] Z-axis movement easing */
    #easeZ: number = PARTICLE_EASE.CubicOut
    /** [KO] 알파 변화 이징 [EN] Alpha change easing */
    #easeAlpha: number = PARTICLE_EASE.Linear
    /** [KO] 스케일 변화 이징 [EN] Scale change easing */
    #easeScale: number = PARTICLE_EASE.Linear
    /** [KO] X축 회전 이징 [EN] X-axis rotation easing */
    #easeRotationX: number = PARTICLE_EASE.CubicOut
    /** [KO] Y축 회전 이징 [EN] Y-axis rotation easing */
    #easeRotationY: number = PARTICLE_EASE.CubicOut
    /** [KO] Z축 회전 이징 [EN] Z-axis rotation easing */
    #easeRotationZ: number = PARTICLE_EASE.CubicOut
    //
    #simParamBuffer: GPUBuffer
    #particleBuffers: GPUBuffer[]
    #simParamData: Float32Array
    #computePipeline: GPUComputePipeline
    #computeBindGroup: GPUBindGroup
    /**
     * [KO] 파티클 개수
     * [EN] Number of particles
     */
    #particleNum: number = 2000

    /**
     * [KO] ParticleEmitter 인스턴스를 생성합니다.
     * [EN] Creates an instance of ParticleEmitter.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        // this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        // this.geometry = new Box(redGPUContext)
        // this.geometry = new Sphere(redGPUContext,)
        this.geometry = new Plane(redGPUContext)
        // this.primitiveState.cullMode = GPU_CULL_MODE.NONE
        // this.geometry = new TorusKnot(redGPUContext)
        // this.material = new PhongMaterial(redGPUContext,)
        this.material = new BitmapMaterial(redGPUContext)
        // this.material = new ColorMaterial(redGPUContext,)
        this.ignoreFrustumCulling = true
        // this.material.transparent = true
        this.useBillboard = true
    }

    get vertexStateBuffers(): GPUVertexBufferLayout[] {
        {
            return [
                {
                    // vertex buffer
                    arrayStride: 8 * 4,
                    stepMode: "vertex",
                    attributes: [
                        {
                            // vertex positions
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3',
                        },
                        {
                            // vertex normal
                            shaderLocation: 1,
                            offset: 3 * 4,
                            format: 'float32x3',
                        },
                        {
                            // vertex uv
                            shaderLocation: 2,
                            offset: 6 * 4,
                            format: 'float32x2'
                        }
                    ],
                },
                {
                    arrayStride: 12 * 4,
                    stepMode: "instance",
                    attributes: [
                        {
                            /* position*/
                            shaderLocation: 3, offset: 4 * 4, format: 'float32x3'
                        },
                        {
                            /* alpha*/
                            shaderLocation: 4, offset: 7 * 4, format: 'float32'
                        },
                        {
                            /* rotation*/
                            shaderLocation: 5, offset: 8 * 4, format: 'float32x3'
                        },
                        {
                            /* scale*/
                            shaderLocation: 6, offset: 11 * 4, format: 'float32'
                        },
                    ]
                },
            ]
        }
    }

    /**
     * [KO] 파티클 개수를 반환합니다. (최대 500,000, 최소 1)
     * [EN] Returns the number of particles. (Max 500,000, Min 1)
     *
     * @returns
     * [KO] 파티클 개수
     * [EN] Number of particles
     */
    get particleNum(): number {
        return this.#particleNum;
    }

    /**
     * [KO] 파티클 개수를 설정합니다. 설정 시 시뮬레이션 버퍼가 재구성됩니다.
     * [EN] Sets the number of particles. Setting this reconstructs the simulation buffer.
     *
     * @param value -
     * [KO] 파티클 개수 (1 ~ 500,000)
     * [EN] Number of particles (1 ~ 500,000)
     */
    set particleNum(value: number) {
        this.#particleNum = Math.max(Math.min(value, 500000), 1);
        if (!this.#simParamBuffer) this.#init()
        this.#setParticleData()
    }

    /**
     * [KO] 파티클의 최소 수명을 반환합니다. (ms)
     * [EN] Returns the minimum life of the particle. (ms)
     *
     * @returns
     * [KO] 최소 수명
     * [EN] Minimum life
     */
    get minLife(): number {
        return this.#minLife;
    }

    /**
     * [KO] 파티클의 최소 수명을 설정합니다. (ms)
     * [EN] Sets the minimum life of the particle. (ms)
     *
     * @param value -
     * [KO] 최소 수명
     * [EN] Minimum life
     */
    set minLife(value: number) {
        this.#minLife = value;
    }

    /**
     * [KO] 파티클의 최대 수명을 반환합니다. (ms)
     * [EN] Returns the maximum life of the particle. (ms)
     *
     * @returns
     * [KO] 최대 수명
     * [EN] Maximum life
     */
    get maxLife(): number {
        return this.#maxLife;
    }

    /**
     * [KO] 파티클의 최대 수명을 설정합니다. (ms)
     * [EN] Sets the maximum life of the particle. (ms)
     *
     * @param value -
     * [KO] 최대 수명
     * [EN] Maximum life
     */
    set maxLife(value: number) {
        this.#maxLife = value;
    }

    /**
     * [KO] 최소 시작 X 좌표를 반환합니다.
     * [EN] Returns the minimum start X coordinate.
     */
    get minStartX(): number {
        return this.#minStartX;
    }

    /**
     * [KO] 최소 시작 X 좌표를 설정합니다.
     * [EN] Sets the minimum start X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartX(value: number) {
        this.#minStartX = value;
    }

    /**
     * [KO] 최소 시작 Y 좌표를 반환합니다.
     * [EN] Returns the minimum start Y coordinate.
     */
    get minStartY(): number {
        return this.#minStartY;
    }

    /**
     * [KO] 최소 시작 Y 좌표를 설정합니다.
     * [EN] Sets the minimum start Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartY(value: number) {
        this.#minStartY = value;
    }

    /**
     * [KO] 최소 시작 Z 좌표를 반환합니다.
     * [EN] Returns the minimum start Z coordinate.
     */
    get minStartZ(): number {
        return this.#minStartZ;
    }

    /**
     * [KO] 최소 시작 Z 좌표를 설정합니다.
     * [EN] Sets the minimum start Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartZ(value: number) {
        this.#minStartZ = value;
    }

    /**
     * [KO] 최대 시작 X 좌표를 반환합니다.
     * [EN] Returns the maximum start X coordinate.
     */
    get maxStartX(): number {
        return this.#maxStartX;
    }

    /**
     * [KO] 최대 시작 X 좌표를 설정합니다.
     * [EN] Sets the maximum start X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartX(value: number) {
        this.#maxStartX = value;
    }

    /**
     * [KO] 최대 시작 Y 좌표를 반환합니다.
     * [EN] Returns the maximum start Y coordinate.
     */
    get maxStartY(): number {
        return this.#maxStartY;
    }

    /**
     * [KO] 최대 시작 Y 좌표를 설정합니다.
     * [EN] Sets the maximum start Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartY(value: number) {
        this.#maxStartY = value;
    }

    /**
     * [KO] 최대 시작 Z 좌표를 반환합니다.
     * [EN] Returns the maximum start Z coordinate.
     */
    get maxStartZ(): number {
        return this.#maxStartZ;
    }

    /**
     * [KO] 최대 시작 Z 좌표를 설정합니다.
     * [EN] Sets the maximum start Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartZ(value: number) {
        this.#maxStartZ = value;
    }

    /**
     * [KO] 최소 종료 X 좌표를 반환합니다.
     * [EN] Returns the minimum end X coordinate.
     */
    get minEndX(): number {
        return this.#minEndX;
    }

    /**
     * [KO] 최소 종료 X 좌표를 설정합니다.
     * [EN] Sets the minimum end X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndX(value: number) {
        this.#minEndX = value;
    }

    /**
     * [KO] 최소 종료 Y 좌표를 반환합니다.
     * [EN] Returns the minimum end Y coordinate.
     */
    get minEndY(): number {
        return this.#minEndY;
    }

    /**
     * [KO] 최소 종료 Y 좌표를 설정합니다.
     * [EN] Sets the minimum end Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndY(value: number) {
        this.#minEndY = value;
    }

    /**
     * [KO] 최소 종료 Z 좌표를 반환합니다.
     * [EN] Returns the minimum end Z coordinate.
     */
    get minEndZ(): number {
        return this.#minEndZ;
    }

    /**
     * [KO] 최소 종료 Z 좌표를 설정합니다.
     * [EN] Sets the minimum end Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndZ(value: number) {
        this.#minEndZ = value;
    }

    /**
     * [KO] 최대 종료 X 좌표를 반환합니다.
     * [EN] Returns the maximum end X coordinate.
     */
    get maxEndX(): number {
        return this.#maxEndX;
    }

    /**
     * [KO] 최대 종료 X 좌표를 설정합니다.
     * [EN] Sets the maximum end X coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndX(value: number) {
        this.#maxEndX = value;
    }

    /**
     * [KO] 최대 종료 Y 좌표를 반환합니다.
     * [EN] Returns the maximum end Y coordinate.
     */
    get maxEndY(): number {
        return this.#maxEndY;
    }

    /**
     * [KO] 최대 종료 Y 좌표를 설정합니다.
     * [EN] Sets the maximum end Y coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndY(value: number) {
        this.#maxEndY = value;
    }

    /**
     * [KO] 최대 종료 Z 좌표를 반환합니다.
     * [EN] Returns the maximum end Z coordinate.
     */
    get maxEndZ(): number {
        return this.#maxEndZ;
    }

    /**
     * [KO] 최대 종료 Z 좌표를 설정합니다.
     * [EN] Sets the maximum end Z coordinate.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndZ(value: number) {
        this.#maxEndZ = value;
    }

    /**
     * [KO] 최소 시작 알파를 반환합니다.
     * [EN] Returns the minimum start alpha.
     */
    get minStartAlpha(): number {
        return this.#minStartAlpha;
    }

    /**
     * [KO] 최소 시작 알파를 설정합니다.
     * [EN] Sets the minimum start alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartAlpha(value: number) {
        this.#minStartAlpha = value;
    }

    /**
     * [KO] 최대 시작 알파를 반환합니다.
     * [EN] Returns the maximum start alpha.
     */
    get maxStartAlpha(): number {
        return this.#maxStartAlpha;
    }

    /**
     * [KO] 최대 시작 알파를 설정합니다.
     * [EN] Sets the maximum start alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartAlpha(value: number) {
        this.#maxStartAlpha = value;
    }

    /**
     * [KO] 최소 종료 알파를 반환합니다.
     * [EN] Returns the minimum end alpha.
     */
    get minEndAlpha(): number {
        return this.#minEndAlpha;
    }

    /**
     * [KO] 최소 종료 알파를 설정합니다.
     * [EN] Sets the minimum end alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndAlpha(value: number) {
        this.#minEndAlpha = value;
    }

    /**
     * [KO] 최대 종료 알파를 반환합니다.
     * [EN] Returns the maximum end alpha.
     */
    get maxEndAlpha(): number {
        return this.#maxEndAlpha;
    }

    /**
     * [KO] 최대 종료 알파를 설정합니다.
     * [EN] Sets the maximum end alpha.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndAlpha(value: number) {
        this.#maxEndAlpha = value;
    }

    /**
     * [KO] 최소 시작 스케일을 반환합니다.
     * [EN] Returns the minimum start scale.
     */
    get minStartScale(): number {
        return this.#minStartScale;
    }

    /**
     * [KO] 최소 시작 스케일을 설정합니다.
     * [EN] Sets the minimum start scale.
     * @param value - [KO] 값 [EN] Value
     */
    set minStartScale(value: number) {
        this.#minStartScale = value;
    }

    /**
     * [KO] 최대 시작 스케일을 반환합니다.
     * [EN] Returns the maximum start scale.
     */
    get maxStartScale(): number {
        return this.#maxStartScale;
    }

    /**
     * [KO] 최대 시작 스케일을 설정합니다.
     * [EN] Sets the maximum start scale.
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartScale(value: number) {
        this.#maxStartScale = value;
    }

    /**
     * [KO] 최소 종료 스케일을 반환합니다.
     * [EN] Returns the minimum end scale.
     */
    get minEndScale(): number {
        return this.#minEndScale;
    }

    /**
     * [KO] 최소 종료 스케일을 설정합니다.
     * [EN] Sets the minimum end scale.
     * @param value - [KO] 값 [EN] Value
     */
    set minEndScale(value: number) {
        this.#minEndScale = value;
    }

    /**
     * [KO] 최대 종료 스케일을 반환합니다.
     * [EN] Returns the maximum end scale.
     */
    get maxEndScale(): number {
        return this.#maxEndScale;
    }

    /**
     * [KO] 최대 종료 스케일을 설정합니다.
     * [EN] Sets the maximum end scale.
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndScale(value: number) {
        this.#maxEndScale = value;
    }

    /**
     * [KO] 최소 시작 X 회전을 반환합니다. (도)
     * [EN] Returns the minimum start X rotation. (degrees)
     */
    get minStartRotationX(): number {
        return this.#minStartRotationX;
    }

    /**
     * [KO] 최소 시작 X 회전을 설정합니다. (도)
     * [EN] Sets the minimum start X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationX(value: number) {
        this.#minStartRotationX = value;
    }

    /**
     * [KO] 최소 시작 Y 회전을 반환합니다. (도)
     * [EN] Returns the minimum start Y rotation. (degrees)
     */
    get minStartRotationY(): number {
        return this.#minStartRotationY;
    }

    /**
     * [KO] 최소 시작 Y 회전을 설정합니다. (도)
     * [EN] Sets the minimum start Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationY(value: number) {
        this.#minStartRotationY = value;
    }

    /**
     * [KO] 최소 시작 Z 회전을 반환합니다. (도)
     * [EN] Returns the minimum start Z rotation. (degrees)
     */
    get minStartRotationZ(): number {
        return this.#minStartRotationZ;
    }

    /**
     * [KO] 최소 시작 Z 회전을 설정합니다. (도)
     * [EN] Sets the minimum start Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minStartRotationZ(value: number) {
        this.#minStartRotationZ = value;
    }

    /**
     * [KO] 최대 시작 X 회전을 반환합니다. (도)
     * [EN] Returns the maximum start X rotation. (degrees)
     */
    get maxStartRotationX(): number {
        return this.#maxStartRotationX;
    }

    /**
     * [KO] 최대 시작 X 회전을 설정합니다. (도)
     * [EN] Sets the maximum start X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationX(value: number) {
        this.#maxStartRotationX = value;
    }

    /**
     * [KO] 최대 시작 Y 회전을 반환합니다. (도)
     * [EN] Returns the maximum start Y rotation. (degrees)
     */
    get maxStartRotationY(): number {
        return this.#maxStartRotationY;
    }

    /**
     * [KO] 최대 시작 Y 회전을 설정합니다. (도)
     * [EN] Sets the maximum start Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationY(value: number) {
        this.#maxStartRotationY = value;
    }

    /**
     * [KO] 최대 시작 Z 회전을 반환합니다. (도)
     * [EN] Returns the maximum start Z rotation. (degrees)
     */
    get maxStartRotationZ(): number {
        return this.#maxStartRotationZ;
    }

    /**
     * [KO] 최대 시작 Z 회전을 설정합니다. (도)
     * [EN] Sets the maximum start Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxStartRotationZ(value: number) {
        this.#maxStartRotationZ = value;
    }

    /**
     * [KO] 최소 종료 X 회전을 반환합니다. (도)
     * [EN] Returns the minimum end X rotation. (degrees)
     */
    get minEndRotationX(): number {
        return this.#minEndRotationX;
    }

    /**
     * [KO] 최소 종료 X 회전을 설정합니다. (도)
     * [EN] Sets the minimum end X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationX(value: number) {
        this.#minEndRotationX = value;
    }

    /**
     * [KO] 최소 종료 Y 회전을 반환합니다. (도)
     * [EN] Returns the minimum end Y rotation. (degrees)
     */
    get minEndRotationY(): number {
        return this.#minEndRotationY;
    }

    /**
     * [KO] 최소 종료 Y 회전을 설정합니다. (도)
     * [EN] Sets the minimum end Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationY(value: number) {
        this.#minEndRotationY = value;
    }

    /**
     * [KO] 최소 종료 Z 회전을 반환합니다. (도)
     * [EN] Returns the minimum end Z rotation. (degrees)
     */
    get minEndRotationZ(): number {
        return this.#minEndRotationZ;
    }

    /**
     * [KO] 최소 종료 Z 회전을 설정합니다. (도)
     * [EN] Sets the minimum end Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set minEndRotationZ(value: number) {
        this.#minEndRotationZ = value;
    }

    /**
     * [KO] 최대 종료 X 회전을 반환합니다. (도)
     * [EN] Returns the maximum end X rotation. (degrees)
     */
    get maxEndRotationX(): number {
        return this.#maxEndRotationX;
    }

    /**
     * [KO] 최대 종료 X 회전을 설정합니다. (도)
     * [EN] Sets the maximum end X rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationX(value: number) {
        this.#maxEndRotationX = value;
    }

    /**
     * [KO] 최대 종료 Y 회전을 반환합니다. (도)
     * [EN] Returns the maximum end Y rotation. (degrees)
     */
    get maxEndRotationY(): number {
        return this.#maxEndRotationY;
    }

    /**
     * [KO] 최대 종료 Y 회전을 설정합니다. (도)
     * [EN] Sets the maximum end Y rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationY(value: number) {
        this.#maxEndRotationY = value;
    }

    /**
     * [KO] 최대 종료 Z 회전을 반환합니다. (도)
     * [EN] Returns the maximum end Z rotation. (degrees)
     */
    get maxEndRotationZ(): number {
        return this.#maxEndRotationZ;
    }

    /**
     * [KO] 최대 종료 Z 회전을 설정합니다. (도)
     * [EN] Sets the maximum end Z rotation. (degrees)
     * @param value - [KO] 값 [EN] Value
     */
    set maxEndRotationZ(value: number) {
        this.#maxEndRotationZ = value;
    }

    /**
     * [KO] X축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for X-axis movement.
     */
    get easeX(): number {
        return this.#easeX;
    }

    /**
     * [KO] X축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for X-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeX(value: number) {
        this.#easeX = value;
    }

    /**
     * [KO] Y축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Y-axis movement.
     */
    get easeY(): number {
        return this.#easeY;
    }

    /**
     * [KO] Y축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Y-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeY(value: number) {
        this.#easeY = value;
    }

    /**
     * [KO] Z축 이동에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Z-axis movement.
     */
    get easeZ(): number {
        return this.#easeZ;
    }

    /**
     * [KO] Z축 이동에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Z-axis movement.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeZ(value: number) {
        this.#easeZ = value;
    }

    /**
     * [KO] 알파 변화에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for alpha change.
     */
    get easeAlpha(): number {
        return this.#easeAlpha;
    }

    /**
     * [KO] 알파 변화에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for alpha change.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeAlpha(value: number) {
        this.#easeAlpha = value;
    }

    /**
     * [KO] 스케일 변화에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for scale change.
     */
    get easeScale(): number {
        return this.#easeScale;
    }

    /**
     * [KO] 스케일 변화에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for scale change.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeScale(value: number) {
        this.#easeScale = value;
    }

    /**
     * [KO] X축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for X-axis rotation.
     */
    get easeRotationX(): number {
        return this.#easeRotationX;
    }

    /**
     * [KO] X축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for X-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeRotationX(value: number) {
        this.#easeRotationX = value;
    }

    /**
     * [KO] Y축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Y-axis rotation.
     */
    get easeRotationY(): number {
        return this.#easeRotationY;
    }

    /**
     * [KO] Y축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Y-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeRotationY(value: number) {
        this.#easeRotationY = value;
    }

    /**
     * [KO] Z축 회전에 적용할 이징 타입을 반환합니다.
     * [EN] Returns the easing type for Z-axis rotation.
     */
    get easeRotationZ(): number {
        return this.#easeRotationZ;
    }

    /**
     * [KO] Z축 회전에 적용할 이징 타입을 설정합니다.
     * [EN] Sets the easing type for Z-axis rotation.
     * @param value - [KO] PARTICLE_EASE 값 [EN] PARTICLE_EASE value
     */
    set easeRotationZ(value: number) {
        this.#easeRotationZ = value;
    }

    /**
     * 파티클 버퍼(GPUBuffer) 배열 반환
     */
    get particleBuffers(): GPUBuffer[] {
        return this.#particleBuffers;
    }

    /**
     * 파티클 렌더링 및 시뮬레이션을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData: RenderViewStateData) {
        if (!this.#simParamBuffer) this.#init()
        this.#renderComputePass(renderViewStateData.timestamp)
        super.render(renderViewStateData)
    }

    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * @returns 생성된 셰이더 모듈
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

    /**
     * 파티클 버퍼 및 파이프라인을 초기화합니다.
     * @private
     */
    #init() {
        this.#simParamData = new Float32Array(46);
        let bufferDescriptor = {
            size: this.#simParamData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        };
        const {gpuDevice} = this.redGPUContext
        this.#simParamBuffer = gpuDevice.createBuffer(bufferDescriptor);
        gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData as BufferSource);
        this.#setParticleData()
        console.log('\t\tthis.depthStencilState', this.depthStencilState)
        this.depthStencilState.depthWriteEnabled = false
    }

    /**
     * 파티클 데이터(GPUBuffer) 생성 및 갱신
     * @private
     */
    #setParticleData() {
        this.dirtyPipeline = true
        let redGPUContext = this.redGPUContext;
        const initialParticleData = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoPosition = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoRotation = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoScale = new Float32Array(this.#particleNum * 4);
        const initialParticleInfoAlpha = new Float32Array(this.#particleNum * 4);
        const currentTime = performance.now();
        const worldPosition = this.localToWorld(this.x, this.y, this.z)
        for (let i = 0; i < this.#particleNum; ++i) {
            let life = Math.random() * this.#maxLife;
            let age = Math.random() * life;
            const startX = worldPosition[0] + Math.random() * (this.#maxStartX - this.#minStartX) + this.#minStartX
            const startY = worldPosition[1] + Math.random() * (this.#maxStartY - this.#minStartY) + this.#minStartY
            const startZ = worldPosition[2] + Math.random() * (this.#maxStartZ - this.#minStartZ) + this.#minStartZ
            const startRX = Math.random() * (this.#maxStartRotationX - this.#minStartRotationX) + this.#minStartRotationX
            const startRY = Math.random() * (this.#maxStartRotationY - this.#minStartRotationY) + this.#minStartRotationY
            const startRZ = Math.random() * (this.#maxStartRotationZ - this.#minStartRotationZ) + this.#minStartRotationZ
            const startScale = Math.random() * (this.#maxStartScale - this.#minStartScale) + this.#minStartScale
            const startAlpha = Math.random() * (this.#maxStartAlpha - this.#minStartAlpha) + this.#minStartAlpha
            initialParticleData[12 * i] = currentTime - age; // start time
            initialParticleData[12 * i + 1] = life; // life
            // position
            initialParticleData[12 * i + 4] = startX; // x
            initialParticleData[12 * i + 5] = startY; // y
            initialParticleData[12 * i + 6] = startZ; // z
            initialParticleData[12 * i + 7] = 0// alpha;
            // rotation
            initialParticleData[12 * i + 8] = startRX; // rotationX
            initialParticleData[12 * i + 9] = startRY;  // rotationY
            initialParticleData[12 * i + 10] = startRZ; // rotationZ
            initialParticleData[12 * i + 11] = 0 // scale
            // x
            initialParticleInfoPosition[4 * i] = startX; // startValue
            initialParticleInfoPosition[4 * i + 1] = Math.random() * (this.#maxEndX - this.#minEndX) + this.#minEndX; // endValue
            initialParticleInfoPosition[4 * i + 2] = this.#easeX; // #ease
            initialParticleInfoPosition[4 * i + 3] = worldPosition[0]; // startPosition
            // y
            initialParticleInfoPosition[4 * i + 4] = startY; // startValue
            initialParticleInfoPosition[4 * i + 5] = Math.random() * (this.#maxEndY - this.#minEndY) + this.#minEndY; // endValue
            initialParticleInfoPosition[4 * i + 6] = this.#easeY; // #ease
            initialParticleInfoPosition[4 * i + 7] = worldPosition[1]; // startPosition
            // z
            initialParticleInfoPosition[4 * i + 8] = startZ; // startValue
            initialParticleInfoPosition[4 * i + 9] = Math.random() * (this.#maxEndZ - this.#minEndZ) + this.#minEndZ; // endValue
            initialParticleInfoPosition[4 * i + 10] = this.#easeZ; // #ease
            initialParticleInfoPosition[4 * i + 11] = worldPosition[2]; // startPosition
            // rotationX
            initialParticleInfoRotation[4 * i] = startRX; // startValue
            initialParticleInfoRotation[4 * i + 1] = Math.random() * (this.#maxEndRotationX - this.#minEndRotationX) + this.#minEndRotationX; // endValue
            initialParticleInfoRotation[4 * i + 2] = this.#easeRotationX; // #ease
            initialParticleInfoRotation[4 * i + 3] = 0; //
            // rotationY
            initialParticleInfoRotation[4 * i + 4] = startRY; // startValue
            initialParticleInfoRotation[4 * i + 5] = Math.random() * (this.#maxEndRotationY - this.#minEndRotationY) + this.#minEndRotationY; // endValue
            initialParticleInfoRotation[4 * i + 6] = this.#easeRotationY; // #ease
            initialParticleInfoRotation[4 * i + 7] = 0; //
            // rotationZ
            initialParticleInfoRotation[4 * i + 8] = startRZ; // startValue
            initialParticleInfoRotation[4 * i + 9] = Math.random() * (this.#maxEndRotationZ - this.#minEndRotationZ) + this.#minEndRotationZ; // endValue
            initialParticleInfoRotation[4 * i + 10] = this.#easeRotationZ; // #ease
            initialParticleInfoRotation[4 * i + 11] = 0; //
            // scale
            initialParticleInfoScale[4 * i] = 0; // startValue
            initialParticleInfoScale[4 * i + 1] = Math.random() * (this.#maxEndScale - this.#minEndScale) + this.#minEndScale; // endValue
            initialParticleInfoScale[4 * i + 2] = this.#easeScale; // #ease
            initialParticleInfoScale[4 * i + 3] = 0; //
            // alpha
            initialParticleInfoAlpha[4 * i] = 0;
            initialParticleInfoAlpha[4 * i + 1] = Math.random() * (this.#maxEndAlpha - this.#minEndAlpha) + this.#minEndAlpha; // endValue
            initialParticleInfoAlpha[4 * i + 2] = this.#easeAlpha; // #ease
            initialParticleInfoAlpha[4 * i + 3] = 0; //
        }
        // console.log('initialParticleData', initialParticleData)
        const prevBuffer = this.#particleBuffers
        this.#particleBuffers = [];
        const dataList = [
            initialParticleData,
            initialParticleInfoPosition,
            initialParticleInfoRotation,
            initialParticleInfoScale,
            initialParticleInfoAlpha,
        ]
        dataList.forEach((v, index) => {
            const t0 = redGPUContext.gpuDevice.createBuffer({
                size: v.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
            });
            redGPUContext.gpuDevice.queue.writeBuffer(t0, 0, v);
            this.#particleBuffers.push(t0)
            if (prevBuffer?.length) {
                copyGPUBuffer(redGPUContext.gpuDevice, prevBuffer[index], t0)
            }
        })
        if (prevBuffer) {
            prevBuffer.forEach(v => v.destroy())
        }
        //
        let computeSource = computeModuleSource;
        let shaderModuleDescriptor = {
            code: computeSource,
        };
        console.log('shaderModuleDescriptor', shaderModuleDescriptor);
        let computeModule = redGPUContext.resourceManager.createGPUShaderModule('PARTICLE_EMITTER_MODULE', shaderModuleDescriptor);
        const computeBindGroupLayoutEntries: any = [
            {
                binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {
                    type: 'uniform',
                },
            },
        ]
        const computeBindGroupEntries = [
            {
                binding: 0,
                resource: {
                    buffer: this.#simParamBuffer,
                    offset: 0,
                    size: this.#simParamData.byteLength
                },
            },
        ]
        dataList.forEach((v, index) => {
            computeBindGroupLayoutEntries.push({
                binding: index + 1, visibility: GPUShaderStage.COMPUTE, buffer: {
                    type: 'storage',
                }
            })
            computeBindGroupEntries.push({
                binding: index + 1,
                resource: {
                    buffer: this.#particleBuffers[index],
                    offset: 0,
                    size: v.byteLength,
                },
            })
        })
        const computeBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
            entries: computeBindGroupLayoutEntries
        });
        const computePipelineLayout = redGPUContext.gpuDevice.createPipelineLayout({
            bindGroupLayouts: [computeBindGroupLayout],
        });
        this.#computeBindGroup = redGPUContext.gpuDevice.createBindGroup({
            label: 'PARTICLE_EMITTER_BIND_GROUP',
            layout: computeBindGroupLayout,
            entries: computeBindGroupEntries
        });
        this.#computePipeline = redGPUContext.gpuDevice.createComputePipeline({
            label: 'PARTICLE_EMITTER_PIPELINE',
            layout: computePipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: "main"
            },
        });
    }

    /**
     * GPU 컴퓨트 파이프라인을 통해 파티클 시뮬레이션을 수행합니다.
     * @param time 현재 시간(ms)
     * @private
     */
    #renderComputePass(time: number) {
        const worldPosition = this.localToWorld(this.x, this.y, this.z)
        this.#simParamData.set(
            [
                // startTime time
                time,
                // position
                ...worldPosition,
                // lifeRange
                this.#minLife, this.#maxLife,
                // x,y,z Range
                this.#minStartX, this.#maxStartX, this.#minEndX, this.#maxEndX, this.#easeX,
                this.#minStartY, this.#maxStartY, this.#minEndY, this.#maxEndY, this.#easeY,
                this.#minStartZ, this.#maxStartZ, this.#minEndZ, this.#maxEndZ, this.#easeZ,
                // alphaRange
                this.#minStartAlpha, this.#maxStartAlpha, this.#minEndAlpha, this.#maxEndAlpha, this.#easeAlpha,
                // scaleRange
                this.#minStartScale, this.#maxStartScale, this.#minEndScale, this.#maxEndScale, this.#easeScale,
                // x,y,z Range
                this.#minStartRotationX, this.#maxStartRotationX, this.#minEndRotationX, this.#maxEndRotationX, this.#easeRotationX,
                this.#minStartRotationY, this.#maxStartRotationY, this.#minEndRotationY, this.#maxEndRotationY, this.#easeRotationY,
                this.#minStartRotationZ, this.#maxStartRotationZ, this.#minEndRotationZ, this.#maxEndRotationZ, this.#easeRotationZ
            ],
            0
        );
        //
        const {gpuDevice} = this.redGPUContext
        gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData as BufferSource);
        //
        const commandEncoder = gpuDevice.createCommandEncoder({
            label: 'PARTICLE_EMITTER_COMPUTE_COMMAND_ENCODER'
        });
        const passEncoder = commandEncoder.beginComputePass(
            {
                label: 'PARTICLE_EMITTER_COMPUTE_PASS',
            }
        );
        passEncoder.setPipeline(this.#computePipeline);
        passEncoder.setBindGroup(0, this.#computeBindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.#particleNum / 256));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        console.log('renderComputePass')
    }
}

Object.defineProperty(ParticleEmitter.prototype, 'meshType', {
    value: MESH_TYPE.PARTICLE,
    writable: false
});
DefineForVertex.defineByPreset(ParticleEmitter, [
    DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
]);
DefineForVertex.definePositiveNumber(ParticleEmitter, [])
//
Object.freeze(ParticleEmitter)
export default ParticleEmitter
