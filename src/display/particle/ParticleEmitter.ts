import RedGPUContext from "../../context/RedGPUContext";
import BitmapMaterial from "../../material/bitmapMaterial/BitmapMaterial";
import Plane from "../../primitive/Plane";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import Mesh from "../mesh/Mesh";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RenderViewStateData from "../view/core/RenderViewStateData";
import PARTICLE_EASE from "./PARTICLE_EASE";
import computeModuleSource from "./shader/compute.wgsl";
import vertexModuleSource from "./shader/particleVertex.wgsl";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_PARTICLE_EMITTER'
const SHADER_INFO = parseWGSL('PARTICLE_EMITTER_VERTEX', vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

interface ParticleEmitter {
    /**
     * [KO] 파티클을 카메라를 항상 마주보도록 할지 여부
     * [EN] Whether to make particles always face the camera
     */
    useBillboard: boolean;
    /**
     * [KO] ParticleEmitter 인스턴스인지 판별하는 식별자
     * [EN] Identifier to determine if it is a ParticleEmitter instance
     */
    isInstanceofParticle: boolean
}

/**
 * [KO] GPU 연산(Compute Shader) 기반의 고성능 파티클 시스템을 생성 및 관리하는 클래스입니다.
 * [EN] Class that creates and manages a high-performance particle system based on GPU computation (Compute Shader).
 *
 * [KO] 수천에서 수십만 개의 파티클을 GPU에서 시뮬레이션하고 병렬로 렌더링합니다. 수명, 크기, 시작/종료 트랜스폼(위치, 회전, 스케일), 알파값의 변화와 이를 보간하는 다양한 이징(Easing) 함수를 실시간으로 제어할 수 있습니다.
 * [EN] Simulates and renders thousands to hundreds of thousands of particles in parallel on the GPU. Allows real-time control over life, size, starting/ending transforms (position, rotation, scale), alpha values, and various easing functions for interpolation.
 *
 * * ### Example
 * ```typescript
 * const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
 * emitter.particleNum = 5000;
 *
 * // [KO] 파티클에 텍스처 적용 예시 (기본 제공되는 BitmapMaterial의 diffuseTexture 속성을 설정합니다)
 * // [EN] Example of applying texture to particles (sets the diffuseTexture property of the default BitmapMaterial)
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/particle.png');
 * emitter.material.diffuseTexture = texture;
 *
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
    #minLife: number = 1000
    #maxLife: number = 5000

    #minStartX: number = 0
    #minStartY: number = 0
    #minStartZ: number = 0

    #maxStartX: number = 0
    #maxStartY: number = 0
    #maxStartZ: number = 0

    #minEndX: number = -5
    #minEndY: number = -5
    #minEndZ: number = -5

    #maxEndX: number = 5
    #maxEndY: number = 5
    #maxEndZ: number = 5

    #minStartAlpha: number = 1
    #maxStartAlpha: number = 1
    #minEndAlpha: number = 1
    #maxEndAlpha: number = 1

    #minStartScale: number = 0
    #maxStartScale: number = 1
    #minEndScale: number = 0
    #maxEndScale: number = 0

    #minStartRotationX: number = -360
    #minStartRotationY: number = -360
    #minStartRotationZ: number = -360
    #maxStartRotationX: number = 360
    #maxStartRotationY: number = 360
    #maxStartRotationZ: number = 360
    #minEndRotationX: number = -360
    #minEndRotationY: number = -360
    #minEndRotationZ: number = -360
    #maxEndRotationX: number = 360
    #maxEndRotationY: number = 360
    #maxEndRotationZ: number = 360

    #easeX: number = PARTICLE_EASE.CubicOut
    #easeY: number = PARTICLE_EASE.CubicOut
    #easeZ: number = PARTICLE_EASE.CubicOut
    #easeAlpha: number = PARTICLE_EASE.Linear
    #easeScale: number = PARTICLE_EASE.Linear
    #easeRotationX: number = PARTICLE_EASE.CubicOut
    #easeRotationY: number = PARTICLE_EASE.CubicOut
    #easeRotationZ: number = PARTICLE_EASE.CubicOut

    #simParamBuffer: GPUBuffer
    #particleBuffers: GPUBuffer[]
    #simParamData: Float32Array
    #computePipeline: GPUComputePipeline
    #computeBindGroup: GPUBindGroup
    #particleNum: number = 2000

    /**
     * [KO] ParticleEmitter 인스턴스를 생성합니다. 기본 지오메트리로 Plane, 기본 재질로 BitmapMaterial이 내부적으로 지정됩니다.
     * [EN] Creates an instance of ParticleEmitter. Internally initializes Plane as the default geometry and BitmapMaterial as the default material.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 객체
     * [EN] RedGPU context object
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.geometry = new Plane(redGPUContext)
        this.material = new BitmapMaterial(redGPUContext)
        this.ignoreFrustumCulling = true
    }

    /**
     * [KO] 파티클 개별 렌더링에 사용되는 인스턴스 기반 GPU 버텍스 버퍼 레이아웃 정보를 가져옵니다.
     * [EN] Gets the instance-based GPU vertex buffer layout details used for rendering individual particles.
     */
    get vertexStateBuffers(): GPUVertexBufferLayout[] {
        const primitiveBuffer = this.geometry.gpuRenderInfo.buffers[0];
        const vertexAttributeCount = Array.from(primitiveBuffer.attributes).length;
        return [
            primitiveBuffer,
            {
                arrayStride: 12 * 4,
                stepMode: "instance",
                attributes: [
                    {
                        /* position*/
                        shaderLocation: vertexAttributeCount, offset: 4 * 4, format: 'float32x3'
                    },
                    {
                        /* alpha*/
                        shaderLocation: vertexAttributeCount + 1, offset: 7 * 4, format: 'float32'
                    },
                    {
                        /* rotation*/
                        shaderLocation: vertexAttributeCount + 2, offset: 8 * 4, format: 'float32x3'
                    },
                    {
                        /* scale*/
                        shaderLocation: vertexAttributeCount + 3, offset: 11 * 4, format: 'float32'
                    },
                ]
            },
        ]
    }

    /**
     * [KO] 시뮬레이션할 총 파티클 개수를 조회하거나 설정합니다. 설정 가능한 값의 범위는 1부터 최대 500,000개까지이며, 변경 시 GPU 시뮬레이션 버퍼가 재구축됩니다.
     * [EN] Gets or sets the total number of particles to simulate. The value ranges from 1 to a maximum of 500,000, and modifying this will rebuild the GPU simulation buffers.
     */
    get particleNum(): number {
        return this.#particleNum;
    }

    set particleNum(value: number) {
        this.#particleNum = Math.max(Math.min(value, 500000), 1);
        if (!this.#simParamBuffer) this.#init()
        this.#setParticleData()
    }

    /**
     * [KO] 파티클 수명의 최소값(ms)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum life value (in ms) of particles.
     */
    get minLife(): number {
        return this.#minLife;
    }

    set minLife(value: number) {
        this.#minLife = value;
    }

    /**
     * [KO] 파티클 수명의 최대값(ms)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum life value (in ms) of particles.
     */
    get maxLife(): number {
        return this.#maxLife;
    }

    set maxLife(value: number) {
        this.#maxLife = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start X coordinate position particles can have upon generation.
     */
    get minStartX(): number {
        return this.#minStartX;
    }

    set minStartX(value: number) {
        this.#minStartX = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start Y coordinate position particles can have upon generation.
     */
    get minStartY(): number {
        return this.#minStartY;
    }

    set minStartY(value: number) {
        this.#minStartY = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start Z coordinate position particles can have upon generation.
     */
    get minStartZ(): number {
        return this.#minStartZ;
    }

    set minStartZ(value: number) {
        this.#minStartZ = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start X coordinate position particles can have upon generation.
     */
    get maxStartX(): number {
        return this.#maxStartX;
    }

    set maxStartX(value: number) {
        this.#maxStartX = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start Y coordinate position particles can have upon generation.
     */
    get maxStartY(): number {
        return this.#maxStartY;
    }

    set maxStartY(value: number) {
        this.#maxStartY = value;
    }

    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start Z coordinate position particles can have upon generation.
     */
    get maxStartZ(): number {
        return this.#maxStartZ;
    }

    set maxStartZ(value: number) {
        this.#maxStartZ = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end X coordinate position particles can reach before dying.
     */
    get minEndX(): number {
        return this.#minEndX;
    }

    set minEndX(value: number) {
        this.#minEndX = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end Y coordinate position particles can reach before dying.
     */
    get minEndY(): number {
        return this.#minEndY;
    }

    set minEndY(value: number) {
        this.#minEndY = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end Z coordinate position particles can reach before dying.
     */
    get minEndZ(): number {
        return this.#minEndZ;
    }

    set minEndZ(value: number) {
        this.#minEndZ = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end X coordinate position particles can reach before dying.
     */
    get maxEndX(): number {
        return this.#maxEndX;
    }

    set maxEndX(value: number) {
        this.#maxEndX = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end Y coordinate position particles can reach before dying.
     */
    get maxEndY(): number {
        return this.#maxEndY;
    }

    set maxEndY(value: number) {
        this.#maxEndY = value;
    }

    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end Z coordinate position particles can reach before dying.
     */
    get maxEndZ(): number {
        return this.#maxEndZ;
    }

    set maxEndZ(value: number) {
        this.#maxEndZ = value;
    }

    /**
     * [KO] 파티클의 최소 시작 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting opacity of particles.
     */
    get minStartAlpha(): number {
        return this.#minStartAlpha;
    }

    set minStartAlpha(value: number) {
        this.#minStartAlpha = value;
    }

    /**
     * [KO] 파티클의 최대 시작 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting opacity of particles.
     */
    get maxStartAlpha(): number {
        return this.#maxStartAlpha;
    }

    set maxStartAlpha(value: number) {
        this.#maxStartAlpha = value;
    }

    /**
     * [KO] 파티클의 최소 종료 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending opacity of particles.
     */
    get minEndAlpha(): number {
        return this.#minEndAlpha;
    }

    set minEndAlpha(value: number) {
        this.#minEndAlpha = value;
    }

    /**
     * [KO] 파티클의 최대 종료 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending opacity of particles.
     */
    get maxEndAlpha(): number {
        return this.#maxEndAlpha;
    }

    set maxEndAlpha(value: number) {
        this.#maxEndAlpha = value;
    }

    /**
     * [KO] 파티클의 최소 시작 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting scale of particles.
     */
    get minStartScale(): number {
        return this.#minStartScale;
    }

    set minStartScale(value: number) {
        this.#minStartScale = value;
    }

    /**
     * [KO] 파티클의 최대 시작 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting scale of particles.
     */
    get maxStartScale(): number {
        return this.#maxStartScale;
    }

    set maxStartScale(value: number) {
        this.#maxStartScale = value;
    }

    /**
     * [KO] 파티클의 최소 종료 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending scale of particles.
     */
    get minEndScale(): number {
        return this.#minEndScale;
    }

    set minEndScale(value: number) {
        this.#minEndScale = value;
    }

    /**
     * [KO] 파티클의 최대 종료 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending scale of particles.
     */
    get maxEndScale(): number {
        return this.#maxEndScale;
    }

    set maxEndScale(value: number) {
        this.#maxEndScale = value;
    }

    /**
     * [KO] 파티클의 최소 시작 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting X-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationX(): number {
        return this.#minStartRotationX;
    }

    set minStartRotationX(value: number) {
        this.#minStartRotationX = value;
    }

    /**
     * [KO] 파티클의 최소 시작 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting Y-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationY(): number {
        return this.#minStartRotationY;
    }

    set minStartRotationY(value: number) {
        this.#minStartRotationY = value;
    }

    /**
     * [KO] 파티클의 최소 시작 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting Z-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationZ(): number {
        return this.#minStartRotationZ;
    }

    set minStartRotationZ(value: number) {
        this.#minStartRotationZ = value;
    }

    /**
     * [KO] 파티클의 최대 시작 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting X-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationX(): number {
        return this.#maxStartRotationX;
    }

    set maxStartRotationX(value: number) {
        this.#maxStartRotationX = value;
    }

    /**
     * [KO] 파티클의 최대 시작 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting Y-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationY(): number {
        return this.#maxStartRotationY;
    }

    set maxStartRotationY(value: number) {
        this.#maxStartRotationY = value;
    }

    /**
     * [KO] 파티클의 최대 시작 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting Z-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationZ(): number {
        return this.#maxStartRotationZ;
    }

    set maxStartRotationZ(value: number) {
        this.#maxStartRotationZ = value;
    }

    /**
     * [KO] 파티클의 최소 종료 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending X-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationX(): number {
        return this.#minEndRotationX;
    }

    set minEndRotationX(value: number) {
        this.#minEndRotationX = value;
    }

    /**
     * [KO] 파티클의 최소 종료 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending Y-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationY(): number {
        return this.#minEndRotationY;
    }

    set minEndRotationY(value: number) {
        this.#minEndRotationY = value;
    }

    /**
     * [KO] 파티클의 최소 종료 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending Z-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationZ(): number {
        return this.#minEndRotationZ;
    }

    set minEndRotationZ(value: number) {
        this.#minEndRotationZ = value;
    }

    /**
     * [KO] 파티클의 최대 종료 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending X-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationX(): number {
        return this.#maxEndRotationX;
    }

    set maxEndRotationX(value: number) {
        this.#maxEndRotationX = value;
    }

    /**
     * [KO] 파티클의 최대 종료 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending Y-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationY(): number {
        return this.#maxEndRotationY;
    }

    set maxEndRotationY(value: number) {
        this.#maxEndRotationY = value;
    }

    /**
     * [KO] 파티클의 최대 종료 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending Z-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationZ(): number {
        return this.#maxEndRotationZ;
    }

    set maxEndRotationZ(value: number) {
        this.#maxEndRotationZ = value;
    }

    /**
     * [KO] X축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis coordinate change.
     */
    get easeX(): number {
        return this.#easeX;
    }

    set easeX(value: number) {
        this.#easeX = value;
    }

    /**
     * [KO] Y축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis coordinate change.
     */
    get easeY(): number {
        return this.#easeY;
    }

    set easeY(value: number) {
        this.#easeY = value;
    }

    /**
     * [KO] Z축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis coordinate change.
     */
    get easeZ(): number {
        return this.#easeZ;
    }

    set easeZ(value: number) {
        this.#easeZ = value;
    }

    /**
     * [KO] 알파(투명도) 수치 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the alpha (opacity) change.
     */
    get easeAlpha(): number {
        return this.#easeAlpha;
    }

    set easeAlpha(value: number) {
        this.#easeAlpha = value;
    }

    /**
     * [KO] 스케일 크기 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the scale change.
     */
    get easeScale(): number {
        return this.#easeScale;
    }

    set easeScale(value: number) {
        this.#easeScale = value;
    }

    /**
     * [KO] X축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis rotation change.
     */
    get easeRotationX(): number {
        return this.#easeRotationX;
    }

    set easeRotationX(value: number) {
        this.#easeRotationX = value;
    }

    /**
     * [KO] Y축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis rotation change.
     */
    get easeRotationY(): number {
        return this.#easeRotationY;
    }

    set easeRotationY(value: number) {
        this.#easeRotationY = value;
    }

    /**
     * [KO] Z축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis rotation change.
     */
    get easeRotationZ(): number {
        return this.#easeRotationZ;
    }

    set easeRotationZ(value: number) {
        this.#easeRotationZ = value;
    }

    /**
     * [KO] 파티클 데이터 및 속성을 저장하는 GPUBuffer들의 배열을 가져옵니다.
     * [EN] Gets the array of GPUBuffers storing particle data and attributes.
     */
    get particleBuffers(): GPUBuffer[] {
        return this.#particleBuffers;
    }

    /**
     * [KO] 파티클 이미터를 렌더링 프레임 단위로 갱신 및 시뮬레이션합니다. 매 프레임마다 GPU 컴퓨트 패스(Compute Pass)를 수행하여 위치 정보를 재계산합니다.
     * [EN] Updates and simulates the particle emitter on a per-frame basis. Triggers the GPU Compute Pass each frame to recalculate position and transform states.
     * @param renderViewStateData -
     * [KO] 렌더 뷰 상태 데이터 객체
     * [EN] Render view state data object
     */
    render(renderViewStateData: RenderViewStateData) {
        if (!this.#simParamBuffer) this.#init()
        this.#renderComputePass(renderViewStateData.timestamp)
        super.render(renderViewStateData)
    }

    /**
     * [KO] 파티클용 커스텀 버텍스 셰이더 모듈을 컴파일하고 반환합니다.
     * [EN] Compiles and returns a custom vertex shader module for particles.
     * @returns
     * [KO] 컴파일 완료된 GPUShaderModule
     * [EN] Compiled GPUShaderModule
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

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
            initialParticleData[12 * i] = currentTime - age; // start time
            initialParticleData[12 * i + 1] = life; // life
            initialParticleData[12 * i + 4] = startX; // x
            initialParticleData[12 * i + 5] = startY; // y
            initialParticleData[12 * i + 6] = startZ; // z
            initialParticleData[12 * i + 7] = 0
            initialParticleData[12 * i + 8] = startRX; // rotationX
            initialParticleData[12 * i + 9] = startRY;  // rotationY
            initialParticleData[12 * i + 10] = startRZ; // rotationZ
            initialParticleData[12 * i + 11] = 0
            initialParticleInfoPosition[4 * i] = startX; // startValue
            initialParticleInfoPosition[4 * i + 1] = Math.random() * (this.#maxEndX - this.#minEndX) + this.#minEndX; // endValue
            initialParticleInfoPosition[4 * i + 2] = this.#easeX; // ease
            initialParticleInfoPosition[4 * i + 3] = worldPosition[0]; // startPosition
            initialParticleInfoPosition[4 * i + 4] = startY; // startValue
            initialParticleInfoPosition[4 * i + 5] = Math.random() * (this.#maxEndY - this.#minEndY) + this.#minEndY; // endValue
            initialParticleInfoPosition[4 * i + 6] = this.#easeY; // ease
            initialParticleInfoPosition[4 * i + 7] = worldPosition[1]; // startPosition
            initialParticleInfoPosition[4 * i + 8] = startZ; // startValue
            initialParticleInfoPosition[4 * i + 9] = Math.random() * (this.#maxEndZ - this.#minEndZ) + this.#minEndZ; // endValue
            initialParticleInfoPosition[4 * i + 10] = this.#easeZ; // ease
            initialParticleInfoPosition[4 * i + 11] = worldPosition[2]; // startPosition
            initialParticleInfoRotation[4 * i] = startRX; // startValue
            initialParticleInfoRotation[4 * i + 1] = Math.random() * (this.#maxEndRotationX - this.#minEndRotationX) + this.#minEndRotationX; // endValue
            initialParticleInfoRotation[4 * i + 2] = this.#easeRotationX; // ease
            initialParticleInfoRotation[4 * i + 3] = 0;
            initialParticleInfoRotation[4 * i + 4] = startRY; // startValue
            initialParticleInfoRotation[4 * i + 5] = Math.random() * (this.#maxEndRotationY - this.#minEndRotationY) + this.#minEndRotationY; // endValue
            initialParticleInfoRotation[4 * i + 6] = this.#easeRotationY; // ease
            initialParticleInfoRotation[4 * i + 7] = 0;
            initialParticleInfoRotation[4 * i + 8] = startRZ; // startValue
            initialParticleInfoRotation[4 * i + 9] = Math.random() * (this.#maxEndRotationZ - this.#minEndRotationZ) + this.#minEndRotationZ; // endValue
            initialParticleInfoRotation[4 * i + 10] = this.#easeRotationZ; // ease
            initialParticleInfoRotation[4 * i + 11] = 0;
            initialParticleInfoScale[4 * i] = 0; // startValue
            initialParticleInfoScale[4 * i + 1] = Math.random() * (this.#maxEndScale - this.#minEndScale) + this.#minEndScale; // endValue
            initialParticleInfoScale[4 * i + 2] = this.#easeScale; // ease
            initialParticleInfoScale[4 * i + 3] = 0;
            initialParticleInfoAlpha[4 * i] = 0;
            initialParticleInfoAlpha[4 * i + 1] = Math.random() * (this.#maxEndAlpha - this.#minEndAlpha) + this.#minEndAlpha; // endValue
            initialParticleInfoAlpha[4 * i + 2] = this.#easeAlpha; // ease
            initialParticleInfoAlpha[4 * i + 3] = 0;
        }
        const prevBuffer = this.#particleBuffers
        this.#particleBuffers = [];
        const dataList = [
            initialParticleData,
            initialParticleInfoPosition,
            initialParticleInfoRotation,
            initialParticleInfoScale,
            initialParticleInfoAlpha,
        ]
        const {commandEncoderManager, gpuDevice} = redGPUContext;
        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            dataList.forEach((v, index) => {
                const t0 = gpuDevice.createBuffer({
                    size: v.byteLength,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
                });
                gpuDevice.queue.writeBuffer(t0, 0, v);
                this.#particleBuffers.push(t0)
                if (prevBuffer?.length) {
                    copyGPUBuffer(encoder, prevBuffer[index], t0)
                }
            })
        });
        if (prevBuffer) {
            prevBuffer.forEach(v => commandEncoderManager.addDeferredDestroy(v));
        }
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

    #renderComputePass(time: number) {
        const worldPosition = this.localToWorld(this.x, this.y, this.z)
        this.#simParamData.set(
            [
                time,
                ...worldPosition,
                this.#minLife, this.#maxLife,
                this.#minStartX, this.#maxStartX, this.#minEndX, this.#maxEndX, this.#easeX,
                this.#minStartY, this.#maxStartY, this.#minEndY, this.#maxEndY, this.#easeY,
                this.#minStartZ, this.#maxStartZ, this.#minEndZ, this.#maxEndZ, this.#easeZ,
                this.#minStartAlpha, this.#maxStartAlpha, this.#minEndAlpha, this.#maxEndAlpha, this.#easeAlpha,
                this.#minStartScale, this.#maxStartScale, this.#minEndScale, this.#maxEndScale, this.#easeScale,
                this.#minStartRotationX, this.#maxStartRotationX, this.#minEndRotationX, this.#maxEndRotationX, this.#easeRotationX,
                this.#minStartRotationY, this.#maxStartRotationY, this.#minEndRotationY, this.#maxEndRotationY, this.#easeRotationY,
                this.#minStartRotationZ, this.#maxStartRotationZ, this.#minEndRotationZ, this.#maxEndRotationZ, this.#easeRotationZ
            ],
            0
        );
        const {commandEncoderManager} = this.redGPUContext
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData as BufferSource);
        commandEncoderManager.addPreProcessComputePass('PARTICLE_EMITTER_COMPUTE_PASS', (computePass) => {
            computePass.setPipeline(this.#computePipeline);
            computePass.setBindGroup(0, this.#computeBindGroup);
            computePass.dispatchWorkgroups(Math.ceil(this.#particleNum / 256));
        });
    }
}

Object.defineProperty(ParticleEmitter.prototype, 'isInstanceofParticle', {
    value: true,
    writable: false
});
defineBoolean(ParticleEmitter, [
    {key: 'useBillboard', value: true},
])
Object.freeze(ParticleEmitter)
export default ParticleEmitter
