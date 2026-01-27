import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../../../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import parseWGSL from "../../../wgslParser/parseWGSL";

const MANAGED_STATE_KEY = 'managedBitmapTextureState';

/** [KO] 노이즈 정의 인터페이스 [EN] Noise definition interface */
export interface NoiseDefine {
    mainLogic: string;
    uniformStruct: string;
    uniformDefaults: {};
    helperFunctions?: string;
}

const BASIC_OPTIONS = {
    animationSpeed: 1,
    animationX: 0.1,
    animationY: 0.1
}

/**
 * [KO] 노이즈 텍스처의 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class for noise textures.
 *
 * [KO] 이 클래스는 컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.
 * [EN] This class provides functionality to generate noise patterns in real-time using compute shaders.
 *
 * @experimental
 * @category NoiseTexture
 */
abstract class ANoiseTexture extends ManagementResourceBase {
    mipLevelCount;
    useMipmap;
    src;
    #gpuTexture: GPUTexture;
    #COMPUTE_WORKGROUP_SIZE_X = 8;
    #COMPUTE_WORKGROUP_SIZE_Y = 8;
    #COMPUTE_WORKGROUP_SIZE_Z = 1;
    #textureComputeShaderModule: GPUShaderModule;
    #textureComputeBindGroup: GPUBindGroup;
    #textureComputeBindGroupLayout: GPUBindGroupLayout;
    #textureComputePipeline: GPUComputePipeline;
    #uniformBuffer: UniformBuffer;
    #uniformInfo: any;
    #width: number;
    #height: number;
    #currentEffect: NoiseDefine;
    #time: number = 0
    #animationSpeed: number = 1
    #animationX: number = BASIC_OPTIONS.animationX
    #animationY: number = BASIC_OPTIONS.animationY
    #videoMemorySize: number = 0

    /**
     * [KO] ANoiseTexture 인스턴스를 생성합니다.
     * [EN] Creates an ANoiseTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 너비 [EN] Texture width
     * @param height - [KO] 텍스처 높이 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 [EN] Noise definition object
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1024,
        height: number = 1024,
        define: NoiseDefine
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        validateUintRange(width, 2, 2048);
        validateUintRange(height, 2, 2048);
        this.#width = width;
        this.#height = height;
        this.#currentEffect = define;
        this.#init(redGPUContext);
        this.cacheKey = `NoiseTexture_${width}x${height}_${Date.now()}`
        this.#gpuTexture = this.#createStorageTexture(redGPUContext, width, height);
        this.#videoMemorySize = calculateTextureByteSize(this.#gpuTexture);
        this.#executeComputePass();
        this.#registerResource();
    }

    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /** [KO] 리소스 매니저 키 [EN] Resource manager key */
    get resourceManagerKey(): string {
        return MANAGED_STATE_KEY
    }

    /** [KO] 애니메이션 속도를 반환합니다. [EN] Returns the animation speed. */
    get animationSpeed(): number {
        return this.#animationSpeed;
    }

    /** [KO] 애니메이션 속도를 설정합니다. [EN] Sets the animation speed. */
    set animationSpeed(value: number) {
        validatePositiveNumberRange(value);
        this.#animationSpeed = value;
        this.updateUniform('animationSpeed', value);
    }

    /** [KO] X축 애니메이션 값을 반환합니다. [EN] Returns the animation X value. */
    get animationX(): number {
        return this.#animationX;
    }

    /** [KO] X축 애니메이션 값을 설정합니다. [EN] Sets the animation X value. */
    set animationX(value: number) {
        validateNumber(value);
        this.#animationX = value;
        this.updateUniform('animationX', value);
    }

    /** [KO] Y축 애니메이션 값을 반환합니다. [EN] Returns the animation Y value. */
    get animationY(): number {
        return this.#animationY;
    }

    /** [KO] Y축 애니메이션 값을 설정합니다. [EN] Sets the animation Y value. */
    set animationY(value: number) {
        validateNumber(value);
        this.#animationY = value;
        this.updateUniform('animationY', value);
    }

    /** [KO] 유니폼 정보를 반환합니다. [EN] Returns the uniform information. */
    get uniformInfo(): any {
        return this.#uniformInfo;
    }

    /** [KO] GPUTexture 객체를 반환합니다. [EN] Returns the GPUTexture object. */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] 현재 시간을 반환합니다. [EN] Returns the current time. */
    get time(): number {
        return this.#time;
    }

    /** [KO] 현재 시간을 설정합니다. [EN] Sets the current time. */
    set time(value: number) {
        validatePositiveNumberRange(value);
        this.#time = value;
        this.updateUniform('time', value / 1000);
    }

    /** [KO] 개별 유니폼 파라미터를 업데이트합니다. [EN] Updates an individual uniform parameter. */
    updateUniform(name: string, value: any) {
        if (this.#uniformInfo.members[name]) {
            this.#uniformBuffer.writeOnlyBuffer(this.#uniformInfo.members[name], value);
            this.#currentEffect[name] = value
        }
        this.#executeComputePass();
    }

    /** [KO] 여러 유니폼 파라미터를 일괄 업데이트합니다. [EN] Updates multiple uniform parameters at once. */
    updateUniforms(uniforms: Record<string, any>) {
        Object.entries(uniforms).forEach(([name, value]) => {
            if (this.#uniformInfo.members[name]) {
                this.#uniformBuffer.writeOnlyBuffer(this.#uniformInfo.members[name], value);
                this.#currentEffect[name] = value
            }
        });
        this.#executeComputePass();
    }

    /** [KO] 지정된 시간으로 노이즈를 렌더링합니다. [EN] Renders noise at the specified time. */
    render(time: number) {
        this.updateUniform('time', time);
        this.#executeComputePass();
    }

    /** [KO] 리소스를 파괴합니다. [EN] Destroys the resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.__fireListenerList(true)
        this.#unregisterResource()
        if (temp) temp.destroy()
        this.src = null
        this.cacheKey = null
        this.#gpuTexture = null
    }

    /** [KO] 노이즈 시스템을 초기화합니다. [EN] Initializes the noise system. */
    #init(redGPUContext: RedGPUContext) {
        const {gpuDevice} = redGPUContext;
        const textureComputeShader = this.#generateShader();
        this.cacheKey = this.uuid
        this.#textureComputeShaderModule = gpuDevice.createShaderModule({
            code: textureComputeShader,
        });
        this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
        this.#textureComputePipeline = this.#createTextureComputePipeline(
            gpuDevice,
            this.#textureComputeShaderModule,
            this.#textureComputeBindGroupLayout
        );
        const SHADER_INFO = parseWGSL(textureComputeShader);
        this.#uniformInfo = SHADER_INFO.uniforms.uniforms;
        const uniformData = new ArrayBuffer(this.#uniformInfo.arrayBufferByteLength);
        this.#uniformBuffer = new UniformBuffer(
            redGPUContext,
            uniformData,
            `${this.constructor.name}_UniformBuffer`,
        );
        if (this.#currentEffect.uniformDefaults) {
            this.updateUniforms({
                ...BASIC_OPTIONS,
                ...this.#currentEffect.uniformDefaults
            });
        }
    }

    /** [KO] 셰이더 코드를 생성합니다. [EN] Generates shader code. */
    #generateShader(): string {
        const baseUniforms = `
            struct Uniforms {
                time: f32,
								animationSpeed: f32,
								animationX: f32,
								animationY: f32,
                ${this.#currentEffect.uniformStruct || ''}
            };
        `;
        const helperFunctions = this.#currentEffect.helperFunctions || '';
        return `
            ${baseUniforms}
            @group(0) @binding(0) var<uniform> uniforms : Uniforms;
            @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba8unorm, write>;
            
            ${helperFunctions}
            @compute @workgroup_size(${this.#COMPUTE_WORKGROUP_SIZE_X},${this.#COMPUTE_WORKGROUP_SIZE_Y},${this.#COMPUTE_WORKGROUP_SIZE_Z})
            fn main (
              @builtin(global_invocation_id) global_id : vec3<u32>,
            ){
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(outputTexture);
                
                if (index.x >= dimensions.x || index.y >= dimensions.y) {
                    return;
                }
                
                let dimW = f32(dimensions.x);
                let dimH = f32(dimensions.y);
                let base_uv = vec2<f32>((f32(index.x) + 0.5) / dimW, (f32(index.y) + 0.5) / dimH);
                ${this.#currentEffect.mainLogic}
                
                textureStore(outputTexture, index, finalColor);
            }
        `;
    }

    /** [KO] 컴퓨트 패스를 실행합니다. [EN] Executes the compute pass. */
    #executeComputePass() {
        if (!this.#textureComputeBindGroup) return
        const commandEncoder = this.redGPUContext.gpuDevice.createCommandEncoder();
        const computePassEncoder = commandEncoder.beginComputePass();
        computePassEncoder.setPipeline(this.#textureComputePipeline);
        computePassEncoder.setBindGroup(0, this.#textureComputeBindGroup);
        computePassEncoder.dispatchWorkgroups(
            Math.ceil(this.#width / this.#COMPUTE_WORKGROUP_SIZE_X),
            Math.ceil(this.#height / this.#COMPUTE_WORKGROUP_SIZE_Y)
        );
        computePassEncoder.end();
        this.redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    /** [KO] 컴퓨트 바인드 그룹 레이아웃을 생성합니다. [EN] Creates the compute bind group layout. */
    #createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
        return redGPUContext.resourceManager.createBindGroupLayout('NoiseTextureBindGroupLayout', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba8unorm'}},
            ]
        });
    }

    /** [KO] 스토리지 텍스처를 생성합니다. [EN] Creates the storage texture. */
    #createStorageTexture(redGPUContext: RedGPUContext, width: number, height: number) {
        const storageTexture = redGPUContext.gpuDevice.createTexture({
            size: {width: width, height: height},
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
            label: this.cacheKey,
        });
        const storageTextureView = storageTexture.createView();
        this.#textureComputeBindGroup = this.#createTextureBindGroup(
            redGPUContext,
            this.#textureComputeBindGroupLayout,
            storageTextureView,
        );
        return storageTexture;
    }

    /** [KO] 컴퓨트 바인드 그룹을 생성합니다. [EN] Creates the compute bind group. */
    #createTextureBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, storageTextureView: GPUTextureView) {
        return redGPUContext.gpuDevice.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#uniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.#uniformBuffer.gpuBuffer.size
                    }
                },
                {binding: 1, resource: storageTextureView},
            ]
        });
    }

    /** [KO] 컴퓨트 파이프라인을 생성합니다. [EN] Creates the compute pipeline. */
    #createTextureComputePipeline(gpuDevice: GPUDevice, shaderModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
        return gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            }
        });
    }

    /** [KO] 리소스를 관리 대상으로 등록합니다. [EN] Registers the resource for management. */
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    /** [KO] 리소스 등록을 해제합니다. [EN] Unregisters the resource from management. */
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

export default ANoiseTexture;