import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import {IPostEffectResult} from "./types";
import RedGPUObject from "../../base/RedGPUObject";
import ColorRGB from "../../color/ColorRGB";
import ColorRGBA from "../../color/ColorRGBA";

const resourceIdMap = new WeakMap<GPUTexture, number>();
let nextResourceId = 0;

interface ASingleComputePassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean
}

/**
 * [KO] 단일 컴퓨트 패스(Compute Pass)로 동작하는 후처리 이펙트의 추상 기본 클래스입니다.
 * [EN] Abstract base class for post-processing effects that execute in a single compute pass.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
abstract class ASingleComputePassPostEffect extends RedGPUObject {
    #isLdr: boolean = false
    #useGroup2: boolean = true
    #computeShader: GPUShaderModule
    #computeBindGroupLayout0: GPUBindGroupLayout
    #computeBindGroupLayout1: GPUBindGroupLayout
    #outputBindGroupLayout: GPUBindGroupLayout
    #computeBindGroup0: GPUBindGroup
    #computeBindGroup1: GPUBindGroup
    #outputBindGroup: GPUBindGroup
    #computeBindGroupEntries0: GPUBindGroupEntry[]
    #computeBindGroupEntries1: GPUBindGroupEntry[]
    #outputBindGroupEntries: GPUBindGroupEntry[]
    #computePipeline: GPUComputePipeline
    #uniformBuffer: UniformBuffer
    #uniformsInfo
    #name: string
    #passLabel: string
    #shaderInfo
    #prevWidth: number = 0
    #prevHeight: number = 0
    #WORK_SIZE_X: number = 16
    #WORK_SIZE_Y: number = 16
    #WORK_SIZE_Z: number = 1
    #videoMemorySize: number = 0
    #bindGroupCache0 = new Map<string, GPUBindGroup>();
    #bindGroupCache1: GPUBindGroup;
    #bindGroupCache3 = new Map<number, GPUBindGroup>();
    #currentGbufferBindGroup: GPUBindGroup = null
    #currentDispatchX: number = 1
    #currentDispatchY: number = 1
    #destroyed: boolean = false

    /**
     * [KO] ASingleComputePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASingleComputePassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 초기화 옵션 (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`)
     * [EN] Initialization options (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`)
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        options?: {
            workSizeX?: number;
            workSizeY?: number;
            workSizeZ?: number;
            isLdr?: boolean;
        }
    ) {
        super(redGPUContext)
        if (options) {
            const {workSizeX, workSizeY, workSizeZ, isLdr} = options;
            if (workSizeX !== undefined) this.#WORK_SIZE_X = workSizeX;
            if (workSizeY !== undefined) this.#WORK_SIZE_Y = workSizeY;
            if (workSizeZ !== undefined) this.#WORK_SIZE_Z = workSizeZ;
            if (isLdr !== undefined) this.#isLdr = isLdr;
        }
    }

    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.
     *
     * @defaultValue false
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean {
        return this.#isLdr
    }

    /**
     * [KO] 이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the video memory usage (in bytes) of the effect's dedicated buffer.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /**
     * [KO] WGSL 셰이더 파싱 정보를 반환합니다.
     * [EN] Returns the WGSL shader parsing information.
     *
     * @returns
     * [KO] WGSL 셰이더 파싱 정보
     * [EN] WGSL shader parsing information
     */
    get shaderInfo() {
        return this.#shaderInfo;
    }

    /**
     * [KO] 이펙트 전용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the effect-specific uniform buffer.
     *
     * @returns
     * [KO] `UniformBuffer` 인스턴스
     * [EN] `UniformBuffer` instance
     */
    get uniformBuffer(): UniformBuffer {
        return this.#uniformBuffer;
    }

    /**
     * [KO] 이펙트 전용 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the effect-specific uniform struct information.
     *
     * @returns
     * [KO] 유니폼 구조체 정보
     * [EN] Uniform struct information
     */
    get uniformsInfo() {
        return this.#uniformsInfo
    }

    /**
     * [KO] 컴퓨트 워크그룹 X축 크기를 반환합니다.
     * [EN] Returns the compute workgroup X-axis size.
     *
     * @defaultValue 16
     * @returns
     * [KO] 워크그룹 X 크기
     * [EN] Workgroup X size
     */
    get WORK_SIZE_X(): number {
        return this.#WORK_SIZE_X;
    }

    /**
     * [KO] 컴퓨트 워크그룹 Y축 크기를 반환합니다.
     * [EN] Returns the compute workgroup Y-axis size.
     *
     * @defaultValue 16
     * @returns
     * [KO] 워크그룹 Y 크기
     * [EN] Workgroup Y size
     */
    get WORK_SIZE_Y(): number {
        return this.#WORK_SIZE_Y;
    }

    /**
     * [KO] 컴퓨트 워크그룹 Z축 크기를 반환합니다.
     * [EN] Returns the compute workgroup Z-axis size.
     *
     * @defaultValue 1
     * @returns
     * [KO] 워크그룹 Z 크기
     * [EN] Workgroup Z size
     */
    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
    }

    /**
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear() {
        this.#bindGroupCache0.clear();
        this.#bindGroupCache1 = null;
        this.#bindGroupCache3.clear();
    }

    /**
     * [KO] 이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.
     * [EN] Destroys the effect's uniform buffer and cached resources.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true
        this.clear()
        this.#uniformBuffer?.destroy()
        this.#uniformBuffer = null
        this.#uniformsInfo = null
        this.#name = null
        this.#passLabel = null
        this.#shaderInfo = null
        this.#computeShader = null
        this.#computePipeline = null
    }

    /**
     * [KO] 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating the compute shader module and the uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param computeCode -
     * [KO] 컴퓨트 셰이더 WGSL 코드 문자열
     * [EN] Compute shader WGSL code string
     */
    init(redGPUContext: RedGPUContext, name: string, computeCode: string) {
        this.#name = this.#isLdr ? `${name}_LDR` : name;
        this.#passLabel = `ASingleComputePassPostEffect_${this.#name}_ComputePass`;
        const {resourceManager} = redGPUContext;

        this.#computeShader = resourceManager.createGPUShaderModule(this.#name, {code: computeCode});
        this.#shaderInfo = resourceManager.wgslParser.parse(this.#name, computeCode);

        const {uniforms} = this.#shaderInfo;
        this.#uniformsInfo = uniforms.uniforms;
        this.#useGroup2 = Boolean(uniforms.systemUniforms);

        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
            this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
        }

        {
            const {members} = this.#uniformsInfo || {}
            if (members) {
                for (const k in members) {
                    const property = this[k];
                    if (property instanceof ColorRGBA) {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property.rgbaNormalLinear);
                    } else if (property instanceof ColorRGB) {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property.rgbNormalLinear);
                    } else {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property);
                    }
                }
            }
        }

    }

    /**
     * [KO] 텍스처 풀에서 출력 텍스처를 할당받아 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.
     * [EN] Allocates an output texture from the texture pool, executes the compute pass, and returns the result texture information.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보 목록
     * [EN] List of input source texture information
     * @returns
     * [KO] 렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Rendering result texture and view (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult {
        const result = view.postEffectManager.texturePool.allocResult(width, height, this.#isLdr ? 'rgba8unorm' : 'rgba16float');
        return this.executePass(view, width, height, result, ...sourceTextureInfo);
    }

    /**
     * [KO] 지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.
     * [EN] Writes the value of the specified uniform member to the uniform buffer.
     *
     * @param key -
     * [KO] 유니폼 멤버 키 이름
     * [EN] Uniform member key name
     * @param value -
     * [KO] 기록할 값
     * [EN] Value to write
     */
    updateUniform(key: string, value: number | number[] | boolean) {
        const memberInfo = this.uniformsInfo?.members[key];
        if (memberInfo) {
            this.uniformBuffer.writeOnlyBuffer(memberInfo, value);
        }
    }

    /**
     * [KO] 지정된 출력 타겟(`result`)에 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.
     * [EN] Executes the compute pass into the specified output target (`result`) and returns the result texture information.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param result -
     * [KO] 결과를 기록할 출력 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Output texture and view to write the result (`IPostEffectResult`)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보 목록
     * [EN] List of input source texture information
     * @returns
     * [KO] 렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Rendering result texture and view (`IPostEffectResult`)
     */
    protected executePass(
        view: View3D,
        width: number,
        height: number,
        result: IPostEffectResult,
        ...sourceTextureInfo: IPostEffectResult[]
    ): IPostEffectResult {
        const {gpuDevice} = this;

        if (this.#prevWidth !== width || this.#prevHeight !== height) {
            this.#bindGroupCache0.clear();
            this.#bindGroupCache3.clear();
        }

        this.#checkAndCreatePipeline(view, gpuDevice);

        this.#updateBindGroups(sourceTextureInfo, result, gpuDevice);

        this.#execute(width, height, this.#useGroup2 ? view.postEffectManager.gbufferBindGroup : null);

        this.#prevWidth = width;
        this.#prevHeight = height;
        this.#calcVideoMemory();

        return result;
    }

    #getResourceId(resource: GPUTexture): number {
        if (!resource) return 0;
        let id = resourceIdMap.get(resource);
        if (id === undefined) {
            id = nextResourceId++;
            resourceIdMap.set(resource, id);
        }
        return id;
    }

    #executeComputePass = (computePassEncoder: GPUComputePassEncoder): void => {
        computePassEncoder.setPipeline(this.#computePipeline);

        if (this.#computeBindGroup0) computePassEncoder.setBindGroup(0, this.#computeBindGroup0);
        if (this.#computeBindGroup1) computePassEncoder.setBindGroup(1, this.#computeBindGroup1);
        if (this.#useGroup2) {
            if (this.#currentGbufferBindGroup) computePassEncoder.setBindGroup(2, this.#currentGbufferBindGroup);
            if (this.#outputBindGroup) computePassEncoder.setBindGroup(3, this.#outputBindGroup);
        } else {
            if (this.#outputBindGroup) computePassEncoder.setBindGroup(2, this.#outputBindGroup);
        }

        computePassEncoder.dispatchWorkgroups(this.#currentDispatchX, this.#currentDispatchY);
    };

    #execute(width: number, height: number, gbufferBindGroup: GPUBindGroup) {
        this.#currentGbufferBindGroup = gbufferBindGroup;
        this.#currentDispatchX = Math.ceil(width / this.WORK_SIZE_X);
        this.#currentDispatchY = Math.ceil(height / this.WORK_SIZE_Y);

        this.commandEncoderManager.addPostProcessComputePass(this.#passLabel, this.#executeComputePass);

        this.#currentGbufferBindGroup = null;
    }

    #checkAndCreatePipeline(view: View3D, gpuDevice: GPUDevice) {
        if (this.#computePipeline) return;

        const {resourceManager} = this;
        const currentShaderInfo = this.#shaderInfo;
        const outputGroupIndex = this.#useGroup2 ? 3 : 2;

        const layout0Name = `${this.#name}_BIND_GROUP_LAYOUT_0`;
        const layout1Name = `${this.#name}_BIND_GROUP_LAYOUT_1`;
        const layoutOutputName = `${this.#name}_BIND_GROUP_LAYOUT_${outputGroupIndex}`;

        this.#computeBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0));

        this.#computeBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1));

        this.#outputBindGroupLayout = resourceManager.getGPUBindGroupLayout(layoutOutputName) ||
            resourceManager.createBindGroupLayout(layoutOutputName, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, outputGroupIndex));

        const bindGroupLayouts: GPUBindGroupLayout[] = this.#useGroup2
            ? [
                this.#computeBindGroupLayout0,
                this.#computeBindGroupLayout1,
                view.postEffectManager.gbufferBindGroupLayout,
                this.#outputBindGroupLayout
            ]
            : [
                this.#computeBindGroupLayout0,
                this.#computeBindGroupLayout1,
                this.#outputBindGroupLayout
            ];

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${this.#name}_COMPUTE_PIPELINE`,
            layout: gpuDevice.createPipelineLayout({
                label: `${this.#name}_PIPELINE_LAYOUT`,
                bindGroupLayouts
            }),
            compute: {module: this.#computeShader, entryPoint: 'main'}
        });
    }

    #updateBindGroups(sourceTextureInfoList: IPostEffectResult[], targetOutputResult: IPostEffectResult, gpuDevice: GPUDevice) {
        const {textures, samplers} = this.#shaderInfo;

        let group0Key: string;
        const sourceCount = sourceTextureInfoList.length;
        if (sourceCount === 1) {
            group0Key = `${this.#getResourceId(sourceTextureInfoList[0].texture)}`;
        } else {
            group0Key = '';
            for (let i = 0; i < sourceCount; i++) {
                if (i > 0) group0Key += '_';
                group0Key += this.#getResourceId(sourceTextureInfoList[i].texture);
            }
        }
        const cachedBG0 = this.#bindGroupCache0.get(group0Key);
        if (cachedBG0) {
            this.#computeBindGroup0 = cachedBG0;
        } else {
            this.#computeBindGroupEntries0 = [];

            for (let i = 0, len = textures.length; i < len; i++) {
                const {binding, group} = textures[i];
                if (group === 0) {
                    const resource = sourceTextureInfoList[binding]?.textureView;
                    if (resource) {
                        this.#computeBindGroupEntries0.push({binding, resource});
                    }
                }
            }
            if (samplers) {
                for (let i = 0, len = samplers.length; i < len; i++) {
                    const {binding, group} = samplers[i];
                    if (group === 0) {
                        this.#computeBindGroupEntries0.push({
                            binding,
                            resource: this.redGPUContext.resourceManager.basicSampler.gpuSampler
                        });
                    }
                }
            }

            this.#computeBindGroup0 = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_0`,
                layout: this.#computeBindGroupLayout0,
                entries: this.#computeBindGroupEntries0
            });

            this.#bindGroupCache0.set(group0Key, this.#computeBindGroup0);
        }

        if (this.#bindGroupCache1) {
            this.#computeBindGroup1 = this.#bindGroupCache1;
        } else if (this.#uniformBuffer && this.uniformsInfo) {
            this.#computeBindGroupEntries1 = [{
                binding: 0,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            }];
            this.#computeBindGroup1 = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_1`,
                layout: this.#computeBindGroupLayout1,
                entries: this.#computeBindGroupEntries1
            });
            this.#bindGroupCache1 = this.#computeBindGroup1;
        } else {
            this.#computeBindGroup1 = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_1_EMPTY`,
                layout: this.#computeBindGroupLayout1,
                entries: []
            });
            this.#bindGroupCache1 = this.#computeBindGroup1;
        }

        const outputTextureId = this.#getResourceId(targetOutputResult.texture);
        if (this.#bindGroupCache3.has(outputTextureId)) {
            this.#outputBindGroup = this.#bindGroupCache3.get(outputTextureId);
        } else {
            const outputGroupIndex = this.#useGroup2 ? 3 : 2;
            this.#outputBindGroupEntries = [{binding: 0, resource: targetOutputResult.textureView}];
            this.#outputBindGroup = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_${outputGroupIndex}`,
                layout: this.#outputBindGroupLayout,
                entries: this.#outputBindGroupEntries
            });
            this.#bindGroupCache3.set(outputTextureId, this.#outputBindGroup);
        }

    }

    #calcVideoMemory() {
        this.#videoMemorySize = this.#uniformBuffer ? this.#uniformBuffer.size : 0;
    }

}

Object.defineProperty(ASingleComputePassPostEffect.prototype, 'isInstanceofPostEffect', {
    value: true,
    writable: false
});
Object.freeze(ASingleComputePassPostEffect)
export default ASingleComputePassPostEffect
