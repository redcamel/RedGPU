import DefineForVertex from "../../defineProperty/DefineForVertex";
import BitmapMaterial from "../../material/bitmapMaterial/BitmapMaterial";
import Plane from "../../primitive/Plane";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import Mesh from "../mesh/Mesh";
import MESH_TYPE from "../MESH_TYPE";
import PARTICLE_EASE from "./PARTICLE_EASE";
import computeModuleSource from "./shader/compute.wgsl";
import vertexModuleSource from "./shader/particleVertex.wgsl";
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_PARTICLE_EMITTER';
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/**
 * GPU 기반 파티클 시스템을 위한 이미터(Emitter) 클래스입니다.
 *
 * 다양한 파티클 속성(수명, 위치, 스케일, 회전, 알파, 이징 등)과 GPU 연산 기반의 대량 파티클 처리를 지원합니다.
 *
 * 파티클의 초기값/최종값 범위, 이징, 버퍼 구조, 컴퓨트 파이프라인 등 파티클 시뮬레이션에 필요한 모든 기능을 제공합니다.
 *
 * <iframe src="/RedGPU/examples/3d/particle/basic/"></iframe>
 *
 * 아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [ParticleEmitter Performance](/RedGPU/examples/3d/particle/performance/)
 *
 * ## Roadmap
 * - **다양한 파티클 이미터 타입 지원**
 * @category Particle
 */
class ParticleEmitter extends Mesh {
    #minLife = 1000;
    #maxLife = 5000;
    //
    #minStartX = 0;
    #minStartY = 0;
    #minStartZ = 0;
    //
    #maxStartX = 0;
    #maxStartY = 0;
    #maxStartZ = 0;
    //
    #minEndX = -5;
    #minEndY = -5;
    #minEndZ = -5;
    //
    #maxEndX = 5;
    #maxEndY = 5;
    #maxEndZ = 5;
    //
    #minStartAlpha = 1;
    #maxStartAlpha = 1;
    #minEndAlpha = 1;
    #maxEndAlpha = 1;
    //
    #minStartScale = 0;
    #maxStartScale = 1;
    #minEndScale = 0;
    #maxEndScale = 0;
    //
    #minStartRotationX = -360;
    #minStartRotationY = -360;
    #minStartRotationZ = -360;
    #maxStartRotationX = 360;
    #maxStartRotationY = 360;
    #maxStartRotationZ = 360;
    #minEndRotationX = -360;
    #minEndRotationY = -360;
    #minEndRotationZ = -360;
    #maxEndRotationX = 360;
    #maxEndRotationY = 360;
    #maxEndRotationZ = 360;
    //
    #easeX = PARTICLE_EASE.CubicOut;
    #easeY = PARTICLE_EASE.CubicOut;
    #easeZ = PARTICLE_EASE.CubicOut;
    #easeAlpha = PARTICLE_EASE.Linear;
    #easeScale = PARTICLE_EASE.Linear;
    #easeRotationX = PARTICLE_EASE.CubicOut;
    #easeRotationY = PARTICLE_EASE.CubicOut;
    #easeRotationZ = PARTICLE_EASE.CubicOut;
    //
    #simParamBuffer;
    #particleBuffers;
    #simParamData;
    #computePipeline;
    #computeBindGroup;
    #particleNum = 2000;
    /**
     * ParticleEmitter 인스턴스를 생성합니다.
     * @param redGPUContext RedGPU 컨텍스트
     */
    constructor(redGPUContext) {
        super(redGPUContext);
        // this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        // this.geometry = new Box(redGPUContext)
        // this.geometry = new Sphere(redGPUContext,)
        this.geometry = new Plane(redGPUContext);
        // this.primitiveState.cullMode = GPU_CULL_MODE.NONE
        // this.geometry = new TorusKnot(redGPUContext)
        // this.material = new PhongMaterial(redGPUContext,)
        this.material = new BitmapMaterial(redGPUContext);
        // this.material = new ColorMaterial(redGPUContext,)
        this.ignoreFrustumCulling = true;
        // this.material.transparent = true
        this.useBillboard = true;
    }
    get vertexStateBuffers() {
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
            ];
        }
    }
    /**
     * 파티클 개수 (최대 500,000, 최소 1)
     */
    get particleNum() {
        return this.#particleNum;
    }
    set particleNum(value) {
        this.#particleNum = Math.max(Math.min(value, 500000), 1);
        if (!this.#simParamBuffer)
            this.#init();
        this.#setParticleData();
    }
    /**
     * 파티클의 최소/최대 수명(ms)
     */
    get minLife() {
        return this.#minLife;
    }
    set minLife(value) {
        this.#minLife = value;
    }
    get maxLife() {
        return this.#maxLife;
    }
    set maxLife(value) {
        this.#maxLife = value;
    }
    /**
     * 파티클의 시작/종료 위치 범위
     */
    get minStartX() {
        return this.#minStartX;
    }
    set minStartX(value) {
        this.#minStartX = value;
    }
    get minStartY() {
        return this.#minStartY;
    }
    set minStartY(value) {
        this.#minStartY = value;
    }
    get minStartZ() {
        return this.#minStartZ;
    }
    set minStartZ(value) {
        this.#minStartZ = value;
    }
    get maxStartX() {
        return this.#maxStartX;
    }
    set maxStartX(value) {
        this.#maxStartX = value;
    }
    get maxStartY() {
        return this.#maxStartY;
    }
    set maxStartY(value) {
        this.#maxStartY = value;
    }
    get maxStartZ() {
        return this.#maxStartZ;
    }
    set maxStartZ(value) {
        this.#maxStartZ = value;
    }
    get minEndX() {
        return this.#minEndX;
    }
    set minEndX(value) {
        this.#minEndX = value;
    }
    get minEndY() {
        return this.#minEndY;
    }
    set minEndY(value) {
        this.#minEndY = value;
    }
    get minEndZ() {
        return this.#minEndZ;
    }
    set minEndZ(value) {
        this.#minEndZ = value;
    }
    get maxEndX() {
        return this.#maxEndX;
    }
    set maxEndX(value) {
        this.#maxEndX = value;
    }
    get maxEndY() {
        return this.#maxEndY;
    }
    set maxEndY(value) {
        this.#maxEndY = value;
    }
    get maxEndZ() {
        return this.#maxEndZ;
    }
    set maxEndZ(value) {
        this.#maxEndZ = value;
    }
    /**
     * 파티클의 시작/종료 알파(투명도) 범위
     */
    get minStartAlpha() {
        return this.#minStartAlpha;
    }
    set minStartAlpha(value) {
        this.#minStartAlpha = value;
    }
    get maxStartAlpha() {
        return this.#maxStartAlpha;
    }
    set maxStartAlpha(value) {
        this.#maxStartAlpha = value;
    }
    get minEndAlpha() {
        return this.#minEndAlpha;
    }
    set minEndAlpha(value) {
        this.#minEndAlpha = value;
    }
    get maxEndAlpha() {
        return this.#maxEndAlpha;
    }
    set maxEndAlpha(value) {
        this.#maxEndAlpha = value;
    }
    /**
     * 파티클의 시작/종료 스케일 범위
     */
    get minStartScale() {
        return this.#minStartScale;
    }
    set minStartScale(value) {
        this.#minStartScale = value;
    }
    get maxStartScale() {
        return this.#maxStartScale;
    }
    set maxStartScale(value) {
        this.#maxStartScale = value;
    }
    get minEndScale() {
        return this.#minEndScale;
    }
    set minEndScale(value) {
        this.#minEndScale = value;
    }
    get maxEndScale() {
        return this.#maxEndScale;
    }
    set maxEndScale(value) {
        this.#maxEndScale = value;
    }
    /**
     * 파티클의 시작/종료 회전(X/Y/Z) 범위
     */
    get minStartRotationX() {
        return this.#minStartRotationX;
    }
    set minStartRotationX(value) {
        this.#minStartRotationX = value;
    }
    get minStartRotationY() {
        return this.#minStartRotationY;
    }
    set minStartRotationY(value) {
        this.#minStartRotationY = value;
    }
    get minStartRotationZ() {
        return this.#minStartRotationZ;
    }
    set minStartRotationZ(value) {
        this.#minStartRotationZ = value;
    }
    get maxStartRotationX() {
        return this.#maxStartRotationX;
    }
    set maxStartRotationX(value) {
        this.#maxStartRotationX = value;
    }
    get maxStartRotationY() {
        return this.#maxStartRotationY;
    }
    set maxStartRotationY(value) {
        this.#maxStartRotationY = value;
    }
    get maxStartRotationZ() {
        return this.#maxStartRotationZ;
    }
    set maxStartRotationZ(value) {
        this.#maxStartRotationZ = value;
    }
    get minEndRotationX() {
        return this.#minEndRotationX;
    }
    set minEndRotationX(value) {
        this.#minEndRotationX = value;
    }
    get minEndRotationY() {
        return this.#minEndRotationY;
    }
    set minEndRotationY(value) {
        this.#minEndRotationY = value;
    }
    get minEndRotationZ() {
        return this.#minEndRotationZ;
    }
    set minEndRotationZ(value) {
        this.#minEndRotationZ = value;
    }
    get maxEndRotationX() {
        return this.#maxEndRotationX;
    }
    set maxEndRotationX(value) {
        this.#maxEndRotationX = value;
    }
    get maxEndRotationY() {
        return this.#maxEndRotationY;
    }
    set maxEndRotationY(value) {
        this.#maxEndRotationY = value;
    }
    get maxEndRotationZ() {
        return this.#maxEndRotationZ;
    }
    set maxEndRotationZ(value) {
        this.#maxEndRotationZ = value;
    }
    /**
     * 파티클의 위치/스케일/회전/알파에 적용할 이징 타입
     */
    get easeX() {
        return this.#easeX;
    }
    set easeX(value) {
        this.#easeX = value;
    }
    get easeY() {
        return this.#easeY;
    }
    set easeY(value) {
        this.#easeY = value;
    }
    get easeZ() {
        return this.#easeZ;
    }
    set easeZ(value) {
        this.#easeZ = value;
    }
    get easeAlpha() {
        return this.#easeAlpha;
    }
    set easeAlpha(value) {
        this.#easeAlpha = value;
    }
    get easeScale() {
        return this.#easeScale;
    }
    set easeScale(value) {
        this.#easeScale = value;
    }
    get easeRotationX() {
        return this.#easeRotationX;
    }
    set easeRotationX(value) {
        this.#easeRotationX = value;
    }
    get easeRotationY() {
        return this.#easeRotationY;
    }
    set easeRotationY(value) {
        this.#easeRotationY = value;
    }
    get easeRotationZ() {
        return this.#easeRotationZ;
    }
    set easeRotationZ(value) {
        this.#easeRotationZ = value;
    }
    /**
     * 파티클 버퍼(GPUBuffer) 배열 반환
     */
    get particleBuffers() {
        return this.#particleBuffers;
    }
    /**
     * 파티클 렌더링 및 시뮬레이션을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData) {
        if (!this.#simParamBuffer)
            this.#init();
        this.#renderComputePass(renderViewStateData.timestamp);
        super.render(renderViewStateData);
    }
    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * @returns 생성된 셰이더 모듈
     */
    createCustomMeshVertexShaderModule() {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
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
        const { gpuDevice } = this.redGPUContext;
        this.#simParamBuffer = gpuDevice.createBuffer(bufferDescriptor);
        gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData);
        this.#setParticleData();
        console.log('\t\tthis.depthStencilState', this.depthStencilState);
        this.depthStencilState.depthWriteEnabled = false;
    }
    /**
     * 파티클 데이터(GPUBuffer) 생성 및 갱신
     * @private
     */
    #setParticleData() {
        this.dirtyPipeline = true;
        let redGPUContext = this.redGPUContext;
        const initialParticleData = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoPosition = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoRotation = new Float32Array(this.#particleNum * 12);
        const initialParticleInfoScale = new Float32Array(this.#particleNum * 4);
        const initialParticleInfoAlpha = new Float32Array(this.#particleNum * 4);
        const currentTime = performance.now();
        const worldPosition = this.localToWorld(this.x, this.y, this.z);
        for (let i = 0; i < this.#particleNum; ++i) {
            let life = Math.random() * this.#maxLife;
            let age = Math.random() * life;
            const startX = worldPosition[0] + Math.random() * (this.#maxStartX - this.#minStartX) + this.#minStartX;
            const startY = worldPosition[1] + Math.random() * (this.#maxStartY - this.#minStartY) + this.#minStartY;
            const startZ = worldPosition[2] + Math.random() * (this.#maxStartZ - this.#minStartZ) + this.#minStartZ;
            const startRX = Math.random() * (this.#maxStartRotationX - this.#minStartRotationX) + this.#minStartRotationX;
            const startRY = Math.random() * (this.#maxStartRotationY - this.#minStartRotationY) + this.#minStartRotationY;
            const startRZ = Math.random() * (this.#maxStartRotationZ - this.#minStartRotationZ) + this.#minStartRotationZ;
            const startScale = Math.random() * (this.#maxStartScale - this.#minStartScale) + this.#minStartScale;
            const startAlpha = Math.random() * (this.#maxStartAlpha - this.#minStartAlpha) + this.#minStartAlpha;
            initialParticleData[12 * i] = currentTime - age; // start time
            initialParticleData[12 * i + 1] = life; // life
            // position
            initialParticleData[12 * i + 4] = startX; // x
            initialParticleData[12 * i + 5] = startY; // y
            initialParticleData[12 * i + 6] = startZ; // z
            initialParticleData[12 * i + 7] = 0; // alpha;
            // rotation
            initialParticleData[12 * i + 8] = startRX; // rotationX
            initialParticleData[12 * i + 9] = startRY; // rotationY
            initialParticleData[12 * i + 10] = startRZ; // rotationZ
            initialParticleData[12 * i + 11] = 0; // scale
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
        const prevBuffer = this.#particleBuffers;
        this.#particleBuffers = [];
        const dataList = [
            initialParticleData,
            initialParticleInfoPosition,
            initialParticleInfoRotation,
            initialParticleInfoScale,
            initialParticleInfoAlpha,
        ];
        dataList.forEach((v, index) => {
            const t0 = redGPUContext.gpuDevice.createBuffer({
                size: v.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
            });
            redGPUContext.gpuDevice.queue.writeBuffer(t0, 0, v);
            this.#particleBuffers.push(t0);
            if (prevBuffer?.length) {
                copyGPUBuffer(redGPUContext.gpuDevice, prevBuffer[index], t0);
            }
        });
        if (prevBuffer) {
            prevBuffer.forEach(v => v.destroy());
        }
        //
        let computeSource = computeModuleSource;
        let shaderModuleDescriptor = {
            code: computeSource,
        };
        console.log('shaderModuleDescriptor', shaderModuleDescriptor);
        let computeModule = redGPUContext.resourceManager.createGPUShaderModule('PARTICLE_EMITTER_MODULE', shaderModuleDescriptor);
        const computeBindGroupLayoutEntries = [
            {
                binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {
                    type: 'uniform',
                },
            },
        ];
        const computeBindGroupEntries = [
            {
                binding: 0,
                resource: {
                    buffer: this.#simParamBuffer,
                    offset: 0,
                    size: this.#simParamData.byteLength
                },
            },
        ];
        dataList.forEach((v, index) => {
            computeBindGroupLayoutEntries.push({
                binding: index + 1, visibility: GPUShaderStage.COMPUTE, buffer: {
                    type: 'storage',
                }
            });
            computeBindGroupEntries.push({
                binding: index + 1,
                resource: {
                    buffer: this.#particleBuffers[index],
                    offset: 0,
                    size: v.byteLength,
                },
            });
        });
        const computeBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
            entries: computeBindGroupLayoutEntries
        });
        const computePipelineLayout = redGPUContext.gpuDevice.createPipelineLayout({
            bindGroupLayouts: [computeBindGroupLayout],
        });
        this.#computeBindGroup = redGPUContext.gpuDevice.createBindGroup({
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
    #renderComputePass(time) {
        const worldPosition = this.localToWorld(this.x, this.y, this.z);
        this.#simParamData.set([
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
        ], 0);
        //
        const { gpuDevice } = this.redGPUContext;
        gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData);
        //
        const commandEncoder = gpuDevice.createCommandEncoder({});
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#computePipeline);
        passEncoder.setBindGroup(0, this.#computeBindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.#particleNum / 256));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        console.log('renderComputePass');
    }
}
Object.defineProperty(ParticleEmitter.prototype, 'meshType', {
    value: MESH_TYPE.PARTICLE,
    writable: false
});
DefineForVertex.defineByPreset(ParticleEmitter, [
    DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
]);
DefineForVertex.definePositiveNumber(ParticleEmitter, []);
//
Object.freeze(ParticleEmitter);
export default ParticleEmitter;
