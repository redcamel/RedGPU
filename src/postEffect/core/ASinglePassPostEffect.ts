import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import {IPostEffectResult} from "./types";
import RedGPUObject from "../../base/RedGPUObject";

const resourceIdMap = new WeakMap<GPUTexture, number>();
let nextResourceId = 0;

/**
 * [KO] 단일 패스 후처리 이펙트의 타입 판별 프로퍼티를 정의하는 인터페이스입니다.
 * [EN] Interface defining the type guard property for single-pass post-processing effects.
 *
 * @category PostEffect
 */
interface ASinglePassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
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
abstract class ASinglePassPostEffect extends RedGPUObject {
    #isLdr: boolean = false
    #computeShaderMSAA: GPUShaderModule
    #computeShaderNonMSAA: GPUShaderModule
    #computeBindGroupLayout0: GPUBindGroupLayout
    #computeBindGroupLayout1: GPUBindGroupLayout
    #outputBindGroupLayout: GPUBindGroupLayout
    #computeBindGroup0List_swap0: GPUBindGroup
    #computeBindGroup0List_swap1: GPUBindGroup
    #computeBindGroup1: GPUBindGroup
    #outputBindGroup: GPUBindGroup
    #computeBindGroupEntries0_swap0: GPUBindGroupEntry[]
    #computeBindGroupEntries0_swap1: GPUBindGroupEntry[]
    #computeBindGroupEntries1: GPUBindGroupEntry[]
    #outputBindGroupEntries: GPUBindGroupEntry[]
    #computePipeline: GPUComputePipeline
    #computePipelineMSAA: GPUComputePipeline
    #computePipelineNonMSAA: GPUComputePipeline
    #uniformBuffer: UniformBuffer
    #uniformsInfo
    #systemUniformsInfo
    #storageInfo
    #name: string
    #SHADER_INFO_MSAA
    #SHADER_INFO_NON_MSAA
    #prevWidth: number = 0
    #prevHeight: number = 0
    #outputTexture: GPUTexture
    #outputTextureView: GPUTextureView
    #WORK_SIZE_X: number = 16
    #WORK_SIZE_Y: number = 16
    #WORK_SIZE_Z: number = 1
    #videoMemorySize: number = 0
    #prevMSAA: boolean
    #prevMSAAID: string
    #bindGroupCache0 = new Map<string, GPUBindGroup>();
    #bindGroupCache1: GPUBindGroup;
    #bindGroupCache3 = new Map<number, GPUBindGroup>();
    #destroyed: boolean = false

    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 초기화 옵션 (컴퓨트 워크그룹 크기 `workSizeX`, `workSizeY`, `workSizeZ` 및 LDR 공간 동작 여부 `isLdr`)
     * [EN] Initialization options (compute workgroup size `workSizeX`, `workSizeY`, `workSizeZ` and LDR space operation flag `isLdr`)
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
     * [KO] 이펙트가 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.
     *
     * @returns
     * [KO] LDR 공간 동작 여부 (기본값: `false`)
     * [EN] Whether the effect operates in LDR space (default: `false`)
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
     * [KO] 파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.
     * [EN] Returns the parsed shader's storage binding structure information.
     *
     * @returns
     * [KO] 스토리지 바인딩 구조 정보
     * [EN] Storage binding structure information
     */
    get storageInfo() {
        return this.#storageInfo
    }

    /**
     * [KO] 현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.
     * [EN] Returns the WGSL shader parsing information corresponding to the current MSAA state.
     *
     * @returns
     * [KO] WGSL 셰이더 파싱 정보
     * [EN] WGSL shader parsing information
     */
    get shaderInfo() {
        return this.antialiasingManager.useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
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
     * [KO] 시스템 공용 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the system common uniform struct information.
     *
     * @returns
     * [KO] 시스템 유니폼 구조체 정보
     * [EN] System uniform struct information
     */
    get systemUniformsInfo() {
        return this.#systemUniformsInfo
    }

    /**
     * [KO] 컴퓨트 워크그룹 X축 크기를 반환합니다.
     * [EN] Returns the compute workgroup X-axis size.
     *
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
     * @returns
     * [KO] 워크그룹 Z 크기
     * [EN] Workgroup Z size
     */
    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
    }

    /**
     * [KO] 현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the output texture view allocated to the current pass.
     *
     * @returns
     * [KO] 출력 `GPUTextureView`
     * [EN] Output `GPUTextureView`
     */
    get outputTextureView(): GPUTextureView {
        return this.#outputTextureView;
    }

    /**
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear() {
        this.#outputTexture = null;
        this.#outputTextureView = null;
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
        this.#systemUniformsInfo = null
        this.#storageInfo = null
        this.#name = null
        this.#SHADER_INFO_MSAA = null
        this.#SHADER_INFO_NON_MSAA = null
    }

    /**
     * [KO] MSAA/Non-MSAA 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating MSAA/Non-MSAA compute shader modules and the uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param computeCodes -
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드 객체
     * [EN] Compute shader code object for MSAA and Non-MSAA
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string,
        nonMsaa: string
    }) {
        this.#name = name;
        const {resourceManager} = redGPUContext;

        this.#computeShaderMSAA = resourceManager.createGPUShaderModule(`${name}_MSAA`, {code: computeCodes.msaa});
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(`${name}_NonMSAA`, {code: computeCodes.nonMsaa});

        this.#SHADER_INFO_MSAA = resourceManager.wgslParser.parse(`${name}_MSAA`, computeCodes.msaa);
        this.#SHADER_INFO_NON_MSAA = resourceManager.wgslParser.parse(`${name}_NonMSAA`, computeCodes.nonMsaa);

        const {storage, uniforms} = this.#SHADER_INFO_MSAA;
        this.#storageInfo = storage;
        this.#uniformsInfo = uniforms.uniforms;
        this.#systemUniformsInfo = uniforms.systemUniforms;

        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
            this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
        }

        {
            const {members} = this.#uniformsInfo || {}
            if (members) {
                for (const k in members) {
                    this.uniformBuffer.writeOnlyBuffer(members[k], this[k]);
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
     * [KO] 렌더링 너비 (픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보 목록
     * [EN] List of input source texture information
     * @returns
     * [KO] 렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Rendering result texture and view (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult {
        const {gpuDevice, antialiasingManager} = this;
        const {useMSAA, msaaID} = antialiasingManager;

        const result = view.postEffectManager.texturePool.allocResult(width, height, 'rgba16float');
        this.#outputTexture = result.texture;
        this.#outputTextureView = result.textureView;

        const dimensionsChanged = this.#prevWidth !== width || this.#prevHeight !== height;
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;

        if (dimensionsChanged || msaaChanged) {
            this.#bindGroupCache0.clear();
            this.#bindGroupCache1 = null;
            this.#bindGroupCache3.clear();
        }

        this.#checkAndCreatePipeline(view, useMSAA, gpuDevice);

        this.#updateBindGroups(sourceTextureInfo, this.#outputTextureView, useMSAA, gpuDevice);

        this.#execute(view, width, height, view.postEffectManager.gbufferBindGroup);

        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;
        this.#prevWidth = width;
        this.#prevHeight = height;
        this.#calcVideoMemory();

        return result;
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

    #getResourceId(resource: GPUTexture): number {
        if (!resource) return 0;
        let id = resourceIdMap.get(resource);
        if (id === undefined) {
            id = nextResourceId++;
            resourceIdMap.set(resource, id);
        }
        return id;
    }

    #execute(view: View3D, width: number, height: number, gbufferBindGroup: GPUBindGroup) {
        const {commandEncoderManager} = this;
        const {renderViewStateData} = view;

        commandEncoderManager.addPostProcessComputePass(`ASinglePassPostEffect_${this.#name}_ComputePass`, (computePassEncoder) => {
            computePassEncoder.setPipeline(this.#computePipeline);

            const bg0 = renderViewStateData.swapBufferIndex ? this.#computeBindGroup0List_swap1 : this.#computeBindGroup0List_swap0;
            if (bg0) computePassEncoder.setBindGroup(0, bg0);

            if (this.#computeBindGroup1) computePassEncoder.setBindGroup(1, this.#computeBindGroup1);
            if (gbufferBindGroup) computePassEncoder.setBindGroup(2, gbufferBindGroup);
            if (this.#outputBindGroup) computePassEncoder.setBindGroup(3, this.#outputBindGroup);

            computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
        });
    }

    #checkAndCreatePipeline(view: View3D, useMSAA: boolean, gpuDevice: GPUDevice) {
        const cachedPipeline = useMSAA ? this.#computePipelineMSAA : this.#computePipelineNonMSAA;
        if (cachedPipeline) {
            this.#computePipeline = cachedPipeline;
            return;
        }

        const {resourceManager} = this;
        const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
        const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;

        const layout0Name = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
        const layout1Name = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;
        const layout3Name = `${this.#name}_BIND_GROUP_LAYOUT_3_USE_MSAA_${useMSAA}`;

        this.#computeBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA));

        this.#computeBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA));

        this.#outputBindGroupLayout = resourceManager.getGPUBindGroupLayout(layout3Name) ||
            resourceManager.createBindGroupLayout(layout3Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 3, useMSAA));

        const pipeline = gpuDevice.createComputePipeline({
            label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    this.#computeBindGroupLayout0,
                    this.#computeBindGroupLayout1,
                    view.postEffectManager.gbufferBindGroupLayout,
                    this.#outputBindGroupLayout
                ]
            }),
            compute: {module: currentShader, entryPoint: 'main'}
        });

        if (useMSAA) this.#computePipelineMSAA = pipeline;
        else this.#computePipelineNonMSAA = pipeline;

        this.#computePipeline = pipeline;
    }

    #updateBindGroups(sourceTextureInfoList: IPostEffectResult[], targetOutputView: GPUTextureView, useMSAA: boolean, gpuDevice: GPUDevice) {
        const {storage, textures} = this.shaderInfo;

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
        const cachedBG0_swap0 = this.#bindGroupCache0.get(`${group0Key}_swap0`);
        const cachedBG0_swap1 = this.#bindGroupCache0.get(`${group0Key}_swap1`);
        if (cachedBG0_swap0 && cachedBG0_swap1) {
            this.#computeBindGroup0List_swap0 = cachedBG0_swap0;
            this.#computeBindGroup0List_swap1 = cachedBG0_swap1;

        } else {
            this.#computeBindGroupEntries0_swap0 = [];
            this.#computeBindGroupEntries0_swap1 = [];


            for (const k in storage) {
                const {binding, name, group} = storage[k];
                if (group === 0 && name !== 'outputTexture') {
                    const resource = sourceTextureInfoList[binding]?.textureView;
                    if (resource) {
                        this.#computeBindGroupEntries0_swap0.push({binding, resource});
                        this.#computeBindGroupEntries0_swap1.push({binding, resource});
                    }
                }
            }
            for (let i = 0, len = textures.length; i < len; i++) {
                const {binding, group} = textures[i];
                if (group === 0) {
                    const resource = sourceTextureInfoList[binding]?.textureView;
                    if (resource) {
                        this.#computeBindGroupEntries0_swap0.push({binding, resource});
                        this.#computeBindGroupEntries0_swap1.push({binding, resource});
                    }
                }
            }

            this.#computeBindGroup0List_swap0 = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP0`,
                layout: this.#computeBindGroupLayout0,
                entries: this.#computeBindGroupEntries0_swap0
            });

            this.#computeBindGroup0List_swap1 = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP1`,
                layout: this.#computeBindGroupLayout0,
                entries: this.#computeBindGroupEntries0_swap1
            });

            this.#bindGroupCache0.set(`${group0Key}_swap0`, this.#computeBindGroup0List_swap0);
            this.#bindGroupCache0.set(`${group0Key}_swap1`, this.#computeBindGroup0List_swap1);
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
                label: `${this.#name}_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
                layout: this.#computeBindGroupLayout1,
                entries: this.#computeBindGroupEntries1
            });
            this.#bindGroupCache1 = this.#computeBindGroup1;
        }

        const outputTextureId = this.#getResourceId(this.#outputTexture);
        if (this.#bindGroupCache3.has(outputTextureId)) {
            this.#outputBindGroup = this.#bindGroupCache3.get(outputTextureId);
        } else {
            this.#outputBindGroupEntries = [{binding: 0, resource: targetOutputView}];
            this.#outputBindGroup = gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_3_USE_MSAA_${useMSAA}`,
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

Object.defineProperty(ASinglePassPostEffect.prototype, 'isInstanceofPostEffect', {
    value: true,
    writable: false
});
Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
