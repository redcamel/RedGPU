import ColorRGB from "../../color/ColorRGB";
import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import BlendState from "../../renderState/BlendState";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceBase from "../../resources/core/ResourceBase";
import Sampler from "../../resources/sampler/Sampler";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "./getBindGroupLayoutDescriptorFromShaderInfo";
import definePositiveNumber from "../../defineProperty/funcs/number/definePositiveNumber";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";
import updateTargetUniform from "../../defineProperty/core/updateTargetUniform";

/**
 * [KO] ABaseMaterial의 동적 공통 속성 인터페이스입니다.
 * [EN] Dynamic common property interface for ABaseMaterial.
 * @category Material
 */
interface ABaseMaterial {
    /**
     * [KO] 머티리얼의 불투명도 (0.0 ~ 1.0)
     * [EN] Opacity of the material (0.0 to 1.0)
     */
    opacity: number;
    /**
     * [KO] 머티리얼의 틴트 컬러 (ColorRGBA)
     * [EN] Tint color of the material (ColorRGBA)
     */
    tint: ColorRGBA;
    /**
     * [KO] 틴트 컬러 적용 여부
     * [EN] Whether to apply tint color
     */
    useTint: boolean;
    /**
     * [KO] 머티리얼 인스턴스 여부 플래그
     * [EN] Flag indicating whether it is a material instance
     */
    isInstanceofMaterial: boolean
}

/**
 * [KO] 모든 머티리얼의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract class that serves as the common base for all materials.
 *
 * [KO] 프래그먼트 셰이더 모듈, 바인드 그룹 레이아웃, 블렌드 상태 및 공통 유니폼(투명도, 틴트)을 관리합니다.
 * [EN] Manages fragment shader modules, bind group layouts, blend states, and common uniforms (opacity, tint).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Material
 */
abstract class ABaseMaterial extends ResourceBase {
    /**
     * [KO] 2패스 렌더링 사용 여부
     * [EN] Whether to use 2-pass rendering
     */
    use2PathRender: boolean
    /**
     * [KO] 프래그먼트 GPU 렌더 파이프라인 정보 객체
     * [EN] Fragment GPU render pipeline information object
     */
    gpuRenderInfo: FragmentGPURenderInfo
    /**
     * [KO] 파이프라인 갱신 필요 여부 플래그
     * [EN] Flag indicating whether the pipeline needs updating
     */
    dirtyPipeline: boolean = false
    /**
     * [KO] 머티리얼 투명 렌더링 활성화 여부
     * [EN] Whether transparent rendering is enabled for the material
     */
    transparent: boolean = false
    readonly #blendColorState: BlendState
    readonly #blendAlphaState: BlendState
    #writeMaskState: GPUFlagsConstant = GPUColorWrite.ALL
    readonly #basicGPUSampler: GPUSampler
    readonly #emptyBitmapGPUTextureView: GPUTextureView
    readonly #emptyCubeTextureView: GPUTextureView
    readonly #FRAGMENT_SHADER_MODULE_NAME: string
    readonly #FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME: string
    readonly #FRAGMENT_BIND_GROUP_LAYOUT_NAME: string
    readonly #SHADER_INFO: any
    readonly #STORAGE_STRUCT: any
    readonly #UNIFORM_STRUCT: any
    #TEXTURE_STRUCT: any
    #SAMPLER_STRUCT: any
    readonly #MODULE_NAME: string
    readonly #bindGroupLayout: GPUBindGroupLayout
    readonly #targetGroupIndex: number;
    #tintBlendMode: number = TINT_BLEND_MODE.MULTIPLY;
    #globalFragmentSlotIndex: number = -1

    /**
     * [KO] ABaseMaterial 인스턴스를 초기화합니다.
     * [EN] Initializes an ABaseMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈 고유 이름
     * [EN] Unique name of the material module
     * @param fragmentSource -
     * [KO] 프래그먼트 셰이더 WGSL 소스 코드
     * [EN] Fragment shader WGSL source code
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 타겟 인덱스
     * [EN] Bind group target index
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        moduleName: string,
        fragmentSource: string,
        targetGroupIndex: number
    ) {
        super(redGPUContext)
        const {resourceManager} = redGPUContext
        const SHADER_INFO = resourceManager.wgslParser.parse(moduleName, fragmentSource)
        this.#MODULE_NAME = moduleName
        this.#FRAGMENT_SHADER_MODULE_NAME = `FRAGMENT_MODULE_${this.#MODULE_NAME}`
        this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = `FRAGMENT_BIND_GROUP_DESCRIPTOR_${moduleName}`
        this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME = `FRAGMENT_BIND_GROUP_LAYOUT_${moduleName}`
        this.#SHADER_INFO = SHADER_INFO
        this.#STORAGE_STRUCT = SHADER_INFO?.storage;
        this.#UNIFORM_STRUCT = SHADER_INFO?.uniforms.uniforms;
        this.#targetGroupIndex = targetGroupIndex;
        this.#TEXTURE_STRUCT = SHADER_INFO.shaderSourceVariant.getUnionTextures();
        this.#SAMPLER_STRUCT = SHADER_INFO.shaderSourceVariant.getUnionSamplers();

        this.#bindGroupLayout = resourceManager.getGPUBindGroupLayout(this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME) || resourceManager.createBindGroupLayout(
            this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME,
            getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex)
        )
        this.#blendColorState = new BlendState(this)
        this.#blendAlphaState = new BlendState(this)

        this.#basicGPUSampler = resourceManager.basicSampler.gpuSampler
        this.#emptyBitmapGPUTextureView = resourceManager.emptyBitmapTextureView
        this.#emptyCubeTextureView = resourceManager.emptyCubeTextureView
    }

    /**
     * [KO] 현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.
     * [EN] Returns the key name of the currently set tint blend mode or sets a new mode.
     *
     * @returns
     * [KO] 틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)
     * [EN] Tint blend mode key string (e.g., `'MULTIPLY'`)
     * @throws
     * [KO] 유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생
     * [EN] Throws an Error if an invalid tint blend mode value or key is specified
     */
    get tintBlendMode(): string {
        const entry = Object.entries(TINT_BLEND_MODE).find(([, value]) => value === this.#tintBlendMode);
        if (!entry) {
            throw new Error(`Invalid tint mode value: ${this.#tintBlendMode}`);
        }
        return entry[0];
    }

    set tintBlendMode(value: TINT_BLEND_MODE | keyof typeof TINT_BLEND_MODE) {
        const {fragmentUniformInfo, fragmentUniformBuffer} = this.gpuRenderInfo;
        let valueIdx: number;
        if (typeof value === "string") {
            if (!(value in TINT_BLEND_MODE)) {
                throw new Error(`Invalid tint mode key: ${value}`);
            }
            valueIdx = TINT_BLEND_MODE[value];
        } else if (typeof value === "number" && Object.values(TINT_BLEND_MODE).includes(value)) {
            valueIdx = value;
        } else {
            throw new Error(`Invalid tint mode: ${value}`);
        }
        updateTargetUniform(this, 'tintBlendMode', valueIdx)
        this.#tintBlendMode = valueIdx;
    }

    /**
     * [KO] 머티리얼 모듈 이름을 반환합니다.
     * [EN] Returns the material module name.
     *
     * @returns
     * [KO] 모듈 이름
     * [EN] Module name
     */
    get MODULE_NAME(): string {
        return this.#MODULE_NAME;
    }

    /**
     * [KO] 프래그먼트 셰이더 모듈 이름을 반환합니다.
     * [EN] Returns the fragment shader module name.
     *
     * @returns
     * [KO] 프래그먼트 셰이더 모듈 이름
     * [EN] Fragment shader module name
     */
    get FRAGMENT_SHADER_MODULE_NAME(): string {
        return this.#FRAGMENT_SHADER_MODULE_NAME;
    }

    /**
     * [KO] 프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.
     * [EN] Returns the fragment bind group descriptor name.
     *
     * @returns
     * [KO] 바인드 그룹 디스크립터 이름
     * [EN] Bind group descriptor name
     */
    get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string {
        return this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME;
    }

    /**
     * [KO] 파싱된 셰이더 스토리지 구조체 정보를 반환합니다.
     * [EN] Returns the parsed shader storage structure information.
     *
     * @returns
     * [KO] 스토리지 구조체 정보
     * [EN] Storage structure information
     */
    get STORAGE_STRUCT(): any {
        return this.#STORAGE_STRUCT;
    }

    /**
     * [KO] 파싱된 WGSL 셰이더 전체 정보를 반환합니다.
     * [EN] Returns the complete parsed WGSL shader information.
     *
     * @returns
     * [KO] 파싱된 셰이더 정보 객체
     * [EN] Parsed shader information object
     */
    get SHADER_INFO(): any {
        return this.#SHADER_INFO;
    }

    /**
     * [KO] 파싱된 셰이더 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the parsed shader uniform structure information.
     *
     * @returns
     * [KO] 유니폼 구조체 정보
     * [EN] Uniform structure information
     */
    get UNIFORM_STRUCT(): any {
        return this.#UNIFORM_STRUCT;
    }

    /**
     * [KO] 컬러 블렌드 상태 객체를 반환합니다.
     * [EN] Returns the color blend state object.
     *
     * @returns
     * [KO] 컬러 BlendState 인스턴스
     * [EN] Color BlendState instance
     */
    get blendColorState(): BlendState {
        return this.#blendColorState;
    }

    /**
     * [KO] 알파 블렌드 상태 객체를 반환합니다.
     * [EN] Returns the alpha blend state object.
     *
     * @returns
     * [KO] 알파 BlendState 인스턴스
     * [EN] Alpha BlendState instance
     */
    get blendAlphaState(): BlendState {
        return this.#blendAlphaState;
    }

    /**
     * [KO] 컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.
     * [EN] Returns or sets the color write mask (GPUColorWrite) state.
     *
     * @returns
     * [KO] GPUFlagsConstant 값
     * [EN] GPUFlagsConstant value
     */
    get writeMaskState(): GPUFlagsConstant {
        return this.#writeMaskState;
    }

    set writeMaskState(value: GPUFlagsConstant) {
        this.#writeMaskState = value;
    }

    /**
     * [KO] 글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.
     * [EN] Returns the allocated slot index within the global fragment SSBO.
     *
     * @returns
     * [KO] 할당된 슬롯 인덱스 (미할당 시 `-1`)
     * [EN] Allocated slot index (`-1` if unallocated)
     */
    get globalFragmentSlotIndex(): number {
        return this.#globalFragmentSlotIndex;
    }

    /**
     * [KO] GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.
     * [EN] Initializes GPU fragment render pipeline information and uniform buffers.
     */
    initGPURenderInfos() {
        const {redGPUContext} = this
        const {resourceManager} = redGPUContext
        const shaderModule = resourceManager.createGPUShaderModule(
            this.#FRAGMENT_SHADER_MODULE_NAME,
            {code: this.#SHADER_INFO.defaultSource}
        )
        if (this['isPBRMaterial']) {
            const slot = redGPUContext.globalFragmentSSBO_PBR.allocateSlot();
            this.#globalFragmentSlotIndex = slot.index;
        } else if (this['isBuiltInMaterial']) {
            const slot = redGPUContext.globalFragmentSSBO_BuiltIn.allocateSlot();
            this.#globalFragmentSlotIndex = slot.index;
        }
        let uniformData, uniformBuffer
        if (this.#UNIFORM_STRUCT) {
            uniformData = new ArrayBuffer(
                Math.max(this.#UNIFORM_STRUCT.arrayBufferByteLength, 16)
            )
            uniformBuffer = new UniformBuffer(
                redGPUContext,
                uniformData,
                `UniformBuffer_${this.#MODULE_NAME}_${this.uuid}`
            )
        }

        this.gpuRenderInfo = new FragmentGPURenderInfo(
            shaderModule,
            this.#SHADER_INFO.shaderSourceVariant,
            this.#SHADER_INFO.conditionalBlocks,
            this.#UNIFORM_STRUCT,
            this.#bindGroupLayout,
            uniformBuffer,
            null,
            null,
        )
        this._updateBaseProperty()
        this._updateFragmentState()
    }

    /**
     * [KO] 셰이더 바리안트를 점검하고 프래그먼트 바인드 그룹 및 렌더 상태를 갱신합니다.
     * [EN] Checks shader variants and updates the fragment bind group and render state.
     */
    _updateFragmentState() {
        if (this.redGPUContext.destroyed) return;
        const {gpuDevice, resourceManager} = this.redGPUContext
        this.#checkVariant()
        const entries: GPUBindGroupEntry[] = []
        for (const k in this.#TEXTURE_STRUCT) {
            const info = this.#TEXTURE_STRUCT[k]
            const {binding, name, group, type} = info
            const {name: textureType} = type
            console.log(this, name, this[name])
            let resource
            if (textureType === 'texture_cube') resource = resourceManager.getGPUResourceCubeTextureView(this[name])
            else if (textureType === 'texture_2d_array') {
                resource = resourceManager.getGPUResourceBitmapTextureView(this[name], {dimension: '2d-array'})
            } else if (this[name] instanceof PackedTexture) {
                resource = resourceManager.getGPUResourceBitmapTextureView(this[name])
            } else {
                resource = resourceManager.getGPUResourceBitmapTextureView(this[name]) || this.#emptyBitmapGPUTextureView;
            }
            if (group === 2) {
                entries.push(
                    {
                        binding: binding,
                        resource
                    }
                )
            }
        }
        for (const k in this.#SAMPLER_STRUCT) {
            const info = this.#SAMPLER_STRUCT[k]
            const {binding, name, group} = info
            if (group === 2) {
                entries.push(
                    {
                        binding: binding,
                        resource: this.getGPUResourceSampler(this[name]),
                    }
                )
            }
        }
        if (this.#UNIFORM_STRUCT) {
            entries.push(
                {
                    binding: this.#UNIFORM_STRUCT.binding,
                    resource: {
                        buffer: this.gpuRenderInfo.fragmentUniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.gpuRenderInfo.fragmentUniformBuffer.size
                    },
                }
            )
        }
        const bindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: this.gpuRenderInfo.fragmentBindGroupLayout,
            label: this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
            entries
        }
        const fragmentUniformBindGroup: GPUBindGroup = gpuDevice.createBindGroup(bindGroupDescriptor)
        this.gpuRenderInfo.fragmentState = this.getFragmentRenderState()
        this.gpuRenderInfo.fragmentUniformBindGroup = fragmentUniformBindGroup
    }

    /**
     * [KO] GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.
     * [EN] Creates and returns a GPU fragment render state (GPUFragmentState) object.
     *
     * @param entryPoint -
     * [KO] 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`)
     * [EN] Fragment shader entry point function name (default: `'main'`)
     * @returns
     * [KO] 구성된 GPUFragmentState 객체
     * [EN] Configured GPUFragmentState object
     */
    getFragmentRenderState(entryPoint: string = 'main'): GPUFragmentState {
        return {
            module: this.gpuRenderInfo.fragmentShaderModule,
            entryPoint,
            targets: [
                {
                    format: 'rgba16float',
                    blend: {
                        color: this.blendColorState.state,
                        alpha: this.blendAlphaState.state
                    },
                    writeMask: this.writeMaskState,
                },
                {
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    blend: undefined,
                    writeMask: this.writeMaskState,
                },
                {
                    format: 'rg16float',
                    blend: undefined,
                    writeMask: this.writeMaskState,
                },
            ]
        }
    }

    /**
     * [KO] 머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.
     * [EN] Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.
     */
    _updateBaseProperty() {
        if (this.redGPUContext.destroyed) return;
        const {resourceManager} = this
        const {members} = this['isPBRMaterial'] ? resourceManager.GLOBAL_FRAGMENT_STRUCT_PBR : this['isBuiltInMaterial'] ? resourceManager.GLOBAL_FRAGMENT_STRUCT_BUILT_IN : this.gpuRenderInfo.fragmentUniformInfo
        for (const k in members) {
            const property = this[k]
            if (property instanceof ColorRGBA) {
                updateTargetUniform(this, k, property.rgbaNormalLinear);
            } else if (property instanceof ColorRGB) {
                updateTargetUniform(this, k, property.rgbNormalLinear);
            } else {
                if (!pattern.test(k)) this[k] = property
            }
        }

        const localMembers = this.gpuRenderInfo?.fragmentUniformInfo?.members;
        if (localMembers) {
            for (const k in localMembers) {
                const property = this[k];
                if (property instanceof ColorRGBA) {
                    updateTargetUniform(this, k, property.rgbaNormalLinear);
                } else if (property instanceof ColorRGB) {
                    updateTargetUniform(this, k, property.rgbNormalLinear);
                } else {
                    if (!pattern.test(k)) this[k] = property;
                }
            }
        }
    }

    /**
     * [KO] Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.
     * [EN] Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.
     *
     * @param sampler -
     * [KO] Sampler 인스턴스
     * [EN] Sampler instance
     * @returns
     * [KO] GPUSampler 인스턴스
     * [EN] GPUSampler instance
     */
    getGPUResourceSampler(sampler: Sampler) {
        return sampler?.gpuSampler || this.#basicGPUSampler
    }

    /**
     * [KO] 머티리얼 인스턴스를 파기하고 할당된 유니폼 버퍼 및 글로벌 프래그먼트 슬롯을 해제합니다.
     * [EN] Destroys the material instance and releases allocated uniform buffers and global fragment slots.
     */
    destroy() {
        if (this.#globalFragmentSlotIndex !== -1) {
            if (this['isPBRMaterial']) {
                this.redGPUContext.globalFragmentSSBO_PBR.freeSlot(this.#globalFragmentSlotIndex);
            } else if (this['isBuiltInMaterial']) {
                this.redGPUContext.globalFragmentSSBO_BuiltIn.freeSlot(this.#globalFragmentSlotIndex);
            }
            this.#globalFragmentSlotIndex = -1;
        }

        if (this.gpuRenderInfo) {
            this.gpuRenderInfo.destroy();
            this.gpuRenderInfo = null;
        }
        this.#TEXTURE_STRUCT = null;
        this.#SAMPLER_STRUCT = null;
        console.log(`🧹 ABaseMaterial destroy 완료: ${this.MODULE_NAME}`);
    }

    #checkVariant() {
        const {resourceManager} = this.redGPUContext;
        const currentVariantKey = this.#findMatchingVariantKey();

        const variantShaderModuleName = `${this.#FRAGMENT_SHADER_MODULE_NAME}_${currentVariantKey}`;
        let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
        if (!targetShaderModule) {
            const variantSource = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariant(currentVariantKey);
            if (variantSource) {
                targetShaderModule = resourceManager.createGPUShaderModule(variantShaderModuleName, {code: variantSource});
            } else {
                targetShaderModule = this.gpuRenderInfo.fragmentShaderModule;
            }
        }
        this.gpuRenderInfo.fragmentShaderModule = targetShaderModule;

        this.#TEXTURE_STRUCT = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariantTextures(currentVariantKey);
        this.#SAMPLER_STRUCT = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariantSamplers(currentVariantKey);
        const variantLayoutName = `${this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME}_${currentVariantKey}`;
        let targetLayout = resourceManager.getGPUBindGroupLayout(variantLayoutName);
        if (!targetLayout) {
            const tempShaderInfo = {
                ...this.#SHADER_INFO,
                textures: this.#TEXTURE_STRUCT,
                samplers: this.#SAMPLER_STRUCT
            };
            targetLayout = resourceManager.createBindGroupLayout(
                variantLayoutName,
                getFragmentBindGroupLayoutDescriptorFromShaderInfo(tempShaderInfo, this.#targetGroupIndex)
            );
        }
        this.gpuRenderInfo.fragmentBindGroupLayout = targetLayout;
    }

    #findMatchingVariantKey(): string {
        const {fragmentShaderVariantConditionalBlocks} = this.gpuRenderInfo;
        const activeFeatures = new Set<string>();
        for (const uniformName of fragmentShaderVariantConditionalBlocks) {
            if (this[uniformName]) {
                activeFeatures.add(uniformName);
            }
        }
        console.log('fragmentShaderVariantConditionalBlocks', fragmentShaderVariantConditionalBlocks);
        console.log('activeFeatures', activeFeatures, this);
        const variantKey = activeFeatures.size > 0 ?
            Array.from(activeFeatures).sort().join('+') : 'none';
        if (activeFeatures.size) {
            console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
        }
        return variantKey;
    }
}

const pattern = /^use\w+Texture$/;
Object.defineProperty(ABaseMaterial.prototype, 'isInstanceofMaterial', {
    value: true,
    writable: false
});
definePositiveNumber(ABaseMaterial, [
    {key: 'opacity', value: 1, max: 1}
])
defineBoolean(ABaseMaterial, [
    {key: 'useTint', value: false}
])
defineColorRGBA(ABaseMaterial, [
    {key: 'tint', value: '#ffffff'}
])
Object.freeze(ABaseMaterial)
export default ABaseMaterial
