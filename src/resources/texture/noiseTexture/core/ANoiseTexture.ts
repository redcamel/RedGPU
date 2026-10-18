import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../../../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";

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
 * ::: warning [KO] 직접 인스턴스 생성 금지
 * 이 클래스는 추상 베이스 클래스로 설계되었으므로 직접 인스턴스를 생성할 수 없습니다.
 * 구체적인 서브클래스(예: `SimplexTexture`)를 인스턴스화하여 사용하십시오.
 * :::
 *
 * ::: warning [EN] Do Not Instantiate Directly
 * This class is designed as an abstract base class and cannot be instantiated directly.
 * Use concrete subclasses (e.g., `SimplexTexture`) instead.
 * :::
 *
 * [KO] 노이즈 텍스처의 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class for noise textures.
 *
 * [KO] 컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.
 * [EN] Provides functionality to generate noise patterns in real-time using compute shaders.
 *
 * @category NoiseTexture
 */
abstract class ANoiseTexture extends ManagementResourceBase {
    mipLevelCount: number = 1;
    useMipmap: boolean = true;
    src: string;
    #gpuTexture: GPUTexture;
    #COMPUTE_WORKGROUP_SIZE_X = 8;
    #COMPUTE_WORKGROUP_SIZE_Y = 8;
    #COMPUTE_WORKGROUP_SIZE_Z = 1;
    #textureComputeShaderModule: GPUShaderModule;
    #textureComputeBindGroup: GPUBindGroup;
    #textureComputeBindGroupLayout: GPUBindGroupLayout;
    #textureComputePipeline: GPUComputePipeline;
    #textureDescriptor: GPUTextureDescriptor;
    #uniformBuffer: UniformBuffer;
    #uniformInfo: any;
    #width: number;
    #height: number;
    #currentEffect: NoiseDefine;
    #time: number = 0;
    #animationSpeed: number = 1;
    #animationX: number = BASIC_OPTIONS.animationX;
    #animationY: number = BASIC_OPTIONS.animationY;
    #videoMemorySize: number = 0;

    /**
     * [KO] ANoiseTexture 인스턴스를 초기화합니다.
     * [EN] Initializes an ANoiseTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 텍스처 너비 (기본값: 1024)
     * [EN] Texture width (default: 1024)
     * @param height -
     * [KO] 텍스처 높이 (기본값: 1024)
     * [EN] Texture height (default: 1024)
     * @param define -
     * [KO] 노이즈 정의 객체
     * [EN] Noise definition object
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1024,
        height: number = 1024,
        define: NoiseDefine,
        useMipmap: boolean = true
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        validateUintRange(width, 2, 2048);
        validateUintRange(height, 2, 2048);
        this.#width = width;
        this.#height = height;
        this.#currentEffect = define;
        this.useMipmap = useMipmap;
        this.#init(redGPUContext);
        this.cacheKey = `NoiseTexture_${width}x${height}_${Date.now()}`;
        this.#gpuTexture = this.#createStorageTexture(redGPUContext, width, height);
        this.#videoMemorySize = calculateTextureByteSize(this.#gpuTexture);
        this.#executeComputePass();
        this.#registerResource();
    }

    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 리소스 매니저 상태 키를 반환합니다.
     * [EN] Returns the resource manager state key.
     */
    get resourceManagerKey(): string {
        return MANAGED_STATE_KEY;
    }

    /**
     * [KO] 애니메이션 속도를 반환합니다.
     * [EN] Returns the animation speed.
     */
    get animationSpeed(): number {
        return this.#animationSpeed;
    }

    /**
     * [KO] 애니메이션 속도를 설정합니다.
     * [EN] Sets the animation speed.
     *
     * @param value -
     * [KO] 애니메이션 속도
     * [EN] Animation speed
     */
    set animationSpeed(value: number) {
        validatePositiveNumberRange(value);
        this.#animationSpeed = value;
        this.updateUniform('animationSpeed', value);
    }

    /**
     * [KO] X축 애니메이션 값을 반환합니다.
     * [EN] Returns the animation X value.
     */
    get animationX(): number {
        return this.#animationX;
    }

    /**
     * [KO] X축 애니메이션 값을 설정합니다.
     * [EN] Sets the animation X value.
     *
     * @param value -
     * [KO] X축 애니메이션 값
     * [EN] Animation X value
     */
    set animationX(value: number) {
        validateNumber(value);
        this.#animationX = value;
        this.updateUniform('animationX', value);
    }

    /**
     * [KO] Y축 애니메이션 값을 반환합니다.
     * [EN] Returns the animation Y value.
     */
    get animationY(): number {
        return this.#animationY;
    }

    /**
     * [KO] Y축 애니메이션 값을 설정합니다.
     * [EN] Sets the animation Y value.
     *
     * @param value -
     * [KO] Y축 애니메이션 값
     * [EN] Animation Y value
     */
    set animationY(value: number) {
        validateNumber(value);
        this.#animationY = value;
        this.updateUniform('animationY', value);
    }

    /**
     * [KO] 유니폼 정보를 반환합니다.
     * [EN] Returns the uniform information.
     */
    get uniformInfo(): any {
        return this.#uniformInfo;
    }

    /**
     * [KO] GPUTexture 객체를 반환합니다.
     * [EN] Returns the GPUTexture object.
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] 현재 시간을 반환합니다.
     * [EN] Returns the current time.
     */
    get time(): number {
        return this.#time;
    }

    /**
     * [KO] 현재 시간을 설정합니다.
     * [EN] Sets the current time.
     *
     * @param value -
     * [KO] 시간 (밀리초)
     * [EN] Time in milliseconds
     */
    set time(value: number) {
        validatePositiveNumberRange(value);
        this.#time = value;
        this.updateUniform('time', value / 1000);
    }

    /**
     * [KO] 개별 유니폼 파라미터를 업데이트합니다.
     * [EN] Updates an individual uniform parameter.
     *
     * @param name -
     * [KO] 유니폼 이름
     * [EN] Uniform name
     * @param value -
     * [KO] 설정할 값
     * [EN] Value to set
     */
    updateUniform(name: string, value: any) {
        if (this.#uniformInfo.members[name]) {
            this.#uniformBuffer.writeOnlyBuffer(this.#uniformInfo.members[name], value);
            this.#currentEffect[name] = value;
        }
        this.#executeComputePass();
    }

    /**
     * [KO] 여러 유니폼 파라미터를 일괄 업데이트합니다.
     * [EN] Updates multiple uniform parameters at once.
     *
     * @param uniforms -
     * [KO] 업데이트할 유니폼 키-값 레코드
     * [EN] Record of uniform key-value pairs to update
     */
    updateUniforms(uniforms: Record<string, any>) {
        Object.entries(uniforms).forEach(([name, value]) => {
            if (this.#uniformInfo.members[name]) {
                this.#uniformBuffer.writeOnlyBuffer(this.#uniformInfo.members[name], value);
                this.#currentEffect[name] = value;
            }
        });
        this.#executeComputePass();
    }

    /**
     * [KO] 지정된 시간으로 노이즈를 렌더링합니다.
     * [EN] Renders noise at the specified time.
     *
     * @param time -
     * [KO] 렌더링할 시간
     * [EN] Time to render
     */
    render(time: number) {
        this.updateUniform('time', time);
    }

    /**
     * [KO] 리소스를 파괴합니다.
     * [EN] Destroys the resource.
     */
    destroy() {
        const temp = this.#gpuTexture;
        this.notifyUpdate(true);
        this.#unregisterResource();
        if (temp) temp.destroy();
        this.src = null;
        this.cacheKey = null;
        this.#gpuTexture = null;
    }

    #init(redGPUContext: RedGPUContext) {
        const {gpuDevice} = redGPUContext;
        const textureComputeShader = this.#generateShader();
        this.cacheKey = this.uuid;
        this.#textureComputeShaderModule = gpuDevice.createShaderModule({
            code: textureComputeShader,
        });
        this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
        this.#textureComputePipeline = this.#createTextureComputePipeline(
            gpuDevice,
            this.#textureComputeShaderModule,
            this.#textureComputeBindGroupLayout
        );
        const SHADER_INFO = redGPUContext.resourceManager.wgslParser.parse(this.cacheKey, textureComputeShader);
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
            @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba16float, write>;
            
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

    #executeComputePass() {
        if (!this.#textureComputeBindGroup) return;
        const {redGPUContext} = this;
        const {commandEncoderManager, resourceManager} = redGPUContext;
        const passDescriptor = {
            label: `NoiseTexture_${this.uuid}_ComputePass`
        };
        commandEncoderManager.addResourceComputePass(passDescriptor, (computePassEncoder: GPUComputePassEncoder) => {
            computePassEncoder.setPipeline(this.#textureComputePipeline);
            computePassEncoder.setBindGroup(0, this.#textureComputeBindGroup);
            computePassEncoder.dispatchWorkgroups(
                Math.ceil(this.#width / this.#COMPUTE_WORKGROUP_SIZE_X),
                Math.ceil(this.#height / this.#COMPUTE_WORKGROUP_SIZE_Y)
            );
        });
        if (this.useMipmap) {
            resourceManager.mipmapGenerator.generateMipmap(this.#gpuTexture, this.#textureDescriptor);
        }
    }

    #createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
        return redGPUContext.resourceManager.createBindGroupLayout('NoiseTextureBindGroupLayout', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba16float'}},
            ]
        });
    }

    #createStorageTexture(redGPUContext: RedGPUContext, width: number, height: number) {
        this.mipLevelCount = this.useMipmap ? getMipLevelCount(width, height) : 1;
        this.#textureDescriptor = {
            size: {width: width, height: height},
            format: 'rgba16float',
            mipLevelCount: this.mipLevelCount,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
            label: this.cacheKey,
        };
        const storageTexture = redGPUContext.gpuDevice.createTexture(this.#textureDescriptor);
        const storageTextureView = storageTexture.createView({
            baseMipLevel: 0,
            mipLevelCount: 1
        });
        this.#textureComputeBindGroup = this.#createTextureBindGroup(
            redGPUContext,
            this.#textureComputeBindGroupLayout,
            storageTextureView,
        );
        return storageTexture;
    }

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

    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(ANoiseTexture);
export default ANoiseTexture;