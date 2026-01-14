import ColorRGB from "../../color/ColorRGB";
import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import GPU_BLEND_FACTOR from "../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../gpuConst/GPU_BLEND_OPERATION";
import BlendState from "../../renderState/BlendState";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceBase from "../../resources/core/ResourceBase";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "./getBindGroupLayoutDescriptorFromShaderInfo";

interface ABaseMaterial {
    /**
     * 머티리얼의 불투명도(0~1)
     */
    opacity: number;
    /**
     * 머티리얼의 틴트 컬러(RGBA)
     */
    tint: ColorRGBA;
    /**
     * 틴트 컬러 사용 여부
     */
    useTint: boolean;
}

/**
 *
 * 다양한 머티리얼의 공통 기반이 되는 추상 클래스입니다. 셰이더 정보, 유니폼/텍스처/샘플러 구조, 블렌드 상태 등 렌더 파이프라인의 핵심 속성을 관리합니다.
 *
 * 머티리얼별로 GPU 파이프라인의 셰이더, 바인드 그룹, 블렌딩, 컬러/알파, 틴트, 투명도 등 다양한 렌더링 속성을 일관성 있게 제어할 수 있습니다.
 *
 * @extends ResourceBase
 */
abstract class ABaseMaterial extends ResourceBase {
    /**
     * 2패스 렌더링 사용 여부
     */
    use2PathRender: boolean
    /**
     * 프래그먼트 GPU 렌더 정보 객체
     */
    gpuRenderInfo: FragmentGPURenderInfo
    /**
     * 파이프라인 dirty 상태 플래그
     */
    dirtyPipeline: boolean = false
    /**
     * 머티리얼 투명도 여부
     */
    transparent: boolean = false
    /**
     * 컬러 블렌드 상태 객체
     */
    readonly #blendColorState: BlendState
    /**
     * 알파 블렌드 상태 객체
     */
    readonly #blendAlphaState: BlendState
    /**
     * 컬러 writeMask 상태
     */
    #writeMaskState: GPUFlagsConstant = GPUColorWrite.ALL
    /**
     * 리소스 매니저 객체
     */
    #resourceManager: ResourceManager
    /**
     * 기본 GPU 샘플러
     */
    readonly #basicGPUSampler: GPUSampler
    /**
     * 비트맵 텍스처가 없을 때 사용할 기본 GPUTextureView
     */
    readonly #emptyBitmapGPUTextureView: GPUTextureView
    /**
     * 큐브 텍스처가 없을 때 사용할 기본 GPUTextureView
     */
    readonly #emptyCubeTextureView: GPUTextureView
    /**
     * 프래그먼트 셰이더 모듈명
     */
    readonly #FRAGMENT_SHADER_MODULE_NAME: string
    /**
     * 프래그먼트 바인드 그룹 디스크립터명
     */
    readonly #FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME: string
    /**
     * 프래그먼트 바인드 그룹 레이아웃명
     */
    readonly #FRAGMENT_BIND_GROUP_LAYOUT_NAME: string
    /**
     * 파싱된 WGSL 셰이더 정보
     */
    readonly #SHADER_INFO: any
    /**
     * 셰이더 storage 구조 정보
     */
    readonly #STORAGE_STRUCT: any
    /**
     * 셰이더 uniforms 구조 정보
     */
    readonly #UNIFORM_STRUCT: any
    /**
     * 셰이더 textures 구조 정보
     */
    readonly #TEXTURE_STRUCT: any
    /**
     * 셰이더 samplers 구조 정보
     */
    readonly #SAMPLER_STRUCT: any
    /**
     * 머티리얼 모듈명
     */
    readonly #MODULE_NAME: string
    /**
     * 바인드 그룹 레이아웃 객체
     */
    readonly #bindGroupLayout: GPUBindGroupLayout
    /**
     * 틴트 블렌드 모드 값
     */
    #tintBlendMode: number = TINT_BLEND_MODE.MULTIPLY;

    /**
     * ABaseMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param moduleName - 머티리얼 모듈명
     * @param SHADER_INFO - 파싱된 WGSL 셰이더 정보
     * @param targetGroupIndex - 바인드 그룹 인덱스

     */
    constructor(
        redGPUContext: RedGPUContext,
        moduleName: string,
        SHADER_INFO: any,
        targetGroupIndex: number
    ) {
        super(redGPUContext)
        // console.log('SHADER_INFO', moduleName, SHADER_INFO)
        this.#MODULE_NAME = moduleName
        this.#FRAGMENT_SHADER_MODULE_NAME = `FRAGMENT_MODULE_${this.#MODULE_NAME}`
        this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = `FRAGMENT_BIND_GROUP_DESCRIPTOR_${moduleName}`
        this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME = `FRAGMENT_BIND_GROUP_LAYOUT_${moduleName}`
        this.#SHADER_INFO = SHADER_INFO
        this.#STORAGE_STRUCT = SHADER_INFO?.storage;
        this.#UNIFORM_STRUCT = SHADER_INFO?.uniforms.uniforms;
        this.#TEXTURE_STRUCT = SHADER_INFO?.textures;
        this.#SAMPLER_STRUCT = SHADER_INFO?.samplers;
        this.#bindGroupLayout = redGPUContext.resourceManager.getGPUBindGroupLayout(this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME) || redGPUContext.resourceManager.createBindGroupLayout(
            this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME,
            getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex)
        )
        // this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.ONE, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
        // this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.ONE, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
        this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
        this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
        this.#resourceManager = redGPUContext.resourceManager
        this.#basicGPUSampler = this.#resourceManager.basicSampler.gpuSampler
        this.#emptyBitmapGPUTextureView = this.#resourceManager.emptyBitmapTextureView
        this.#emptyCubeTextureView = this.#resourceManager.emptyCubeTextureView
    }

    get tintBlendMode(): string {
        const entry = Object.entries(TINT_BLEND_MODE).find(([, value]) => value === this.#tintBlendMode);
        if (!entry) {
            throw new Error(`Invalid tint mode value: ${this.#tintBlendMode}`);
        }
        return entry[0]; // Return the key (e.g., "MULTIPLY")
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
        fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members.tintBlendMode, valueIdx);
        this.#tintBlendMode = valueIdx;
    }

    get MODULE_NAME(): string {
        return this.#MODULE_NAME;
    }

    get FRAGMENT_SHADER_MODULE_NAME(): string {
        return this.#FRAGMENT_SHADER_MODULE_NAME;
    }

    get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string {
        return this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME;
    }

    get STORAGE_STRUCT(): any {
        return this.#STORAGE_STRUCT;
    }

    get UNIFORM_STRUCT(): any {
        return this.#UNIFORM_STRUCT;
    }

    /**
     * 머티리얼의 컬러 블렌드 상태 객체 반환

     */
    get blendColorState(): BlendState {
        return this.#blendColorState;
    }

    /**
     * 머티리얼의 알파 블렌드 상태 객체 반환

     */
    get blendAlphaState(): BlendState {
        return this.#blendAlphaState;
    }

    /**
     * 머티리얼의 writeMask 상태 반환

     */
    get writeMaskState(): GPUFlagsConstant {
        return this.#writeMaskState;
    }

    /**
     * 머티리얼의 writeMask 상태 설정
     * @param value - GPUFlagsConstant 값

     */
    set writeMaskState(value: GPUFlagsConstant) {
        this.#writeMaskState = value;
    }

    /**
     * GPU 렌더 파이프라인 정보 및 유니폼 버퍼 초기화

     */
    initGPURenderInfos() {
        const {redGPUContext} = this
        const {resourceManager} = redGPUContext
        const shaderModule = resourceManager.createGPUShaderModule(
            this.#FRAGMENT_SHADER_MODULE_NAME,
            {code: this.#SHADER_INFO.defaultSource}
        )
        // 데이터 작성
        const uniformData = new ArrayBuffer(
            Math.max(this.#UNIFORM_STRUCT.arrayBufferByteLength, 16)
        )
        const uniformBuffer = new UniformBuffer(
            redGPUContext,
            uniformData,
            `UniformBuffer_${this.#MODULE_NAME}_${this.uuid}`
        )
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
     * 프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등 상태 갱신

     */
    _updateFragmentState() {
        const {gpuDevice, resourceManager} = this.redGPUContext
        this.#checkVariant()
        const entries: GPUBindGroupEntry[] = []
        // for (const k in this.#storageInfo) {
        // 	const info = this.#storageInfo[k]
        // 	const {binding, name} = info
        // 	entries.push(
        // 		{
        // 			binding: binding,
        // 			resource: name === 'outputTexture' ? targetOutputView : sourceTextureView[binding],
        // 		}
        // 	)
        // }
        for (const k in this.#TEXTURE_STRUCT) {
            const info = this.#TEXTURE_STRUCT[k]
            const {binding, name, group, type} = info
            const {name: textureType} = type
            console.log(this, name, this[name])
            let resource
            if (textureType === 'texture_cube') resource = resourceManager.getGPUResourceCubeTextureView(this[name])
            else if (this[name] instanceof PackedTexture) {
                resource = resourceManager.getGPUResourceBitmapTextureView(this[name])
            } else {
                resource = resourceManager.getGPUResourceBitmapTextureView(this[name]) || this.#emptyBitmapGPUTextureView
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
        // keepLog(this.gpuRenderInfo)
    }

    /**
     * GPU 프래그먼트 렌더 상태 객체 반환
     * @param entryPoint - 셰이더 엔트리포인트(기본값: 'main')

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
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask: this.writeMaskState,
                },
            ]
        }
    }

    /**
     * 머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영

     */
    _updateBaseProperty() {
        const {fragmentUniformInfo, fragmentUniformBuffer} = this.gpuRenderInfo
        const {members} = fragmentUniformInfo
        for (const k in members) {
            const property = this[k]
            if (property instanceof ColorRGBA) {
                fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[k], property.rgbaNormalLinear)
            } else if (property instanceof ColorRGB) {
                fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[k], property.rgbNormalLinear)
            } else {
                if (!pattern.test(k)) this[k] = property
            }
        }
    }

    /**
     * 샘플러 객체에서 GPU 샘플러 반환
     * @param sampler - Sampler 객체

     */
    getGPUResourceSampler(sampler: Sampler) {
        return sampler?.gpuSampler || this.#basicGPUSampler
    }

    /**
     * 셰이더 바리안트(조건부 분기) 상태 체크 및 셰이더 모듈 갱신


     */
    #checkVariant() {
        const {gpuDevice, resourceManager} = this.redGPUContext
        // 현재 머티리얼 상태에 맞는 바리안트 키 찾기
        const currentVariantKey = this.#findMatchingVariantKey();
        // 바리안트별 셰이더 모듈 확인/생성
        const variantShaderModuleName = `${this.#FRAGMENT_SHADER_MODULE_NAME}_${currentVariantKey}`;
        // keepLog('f_variantShaderModuleName',variantShaderModuleName)
        let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
        if (!targetShaderModule) {
            // 레이지 바리안트 생성기에서 바리안트 소스 코드 가져오기
            const variantSource = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariant(currentVariantKey);
            if (variantSource) {
                // keepLog('프레그먼트 바리안트 셰이더 모듈 생성:', currentVariantKey, variantShaderModuleName);
                targetShaderModule = resourceManager.createGPUShaderModule(
                    variantShaderModuleName,
                    {code: variantSource}
                );
            } else {
                console.warn('⚠️ 바리안트 소스를 찾을 수 없음:', currentVariantKey);
                targetShaderModule = this.gpuRenderInfo.fragmentShaderModule; // 기본값 사용
            }
        } else {
            console.log('🚀 바리안트 셰이더 모듈 캐시 히트:', currentVariantKey);
        }
        // 셰이더 모듈 업데이트
        this.gpuRenderInfo.fragmentShaderModule = targetShaderModule;
    }

    /**
     * 현재 머티리얼 상태에 맞는 셰이더 바리안트 키 반환


     */
    #findMatchingVariantKey(): string {
        const {fragmentShaderVariantConditionalBlocks} = this.gpuRenderInfo;
        // 현재 활성화된 기능들 확인 (fragmentShaderVariantConditionalBlocks 기반)
        const activeFeatures = new Set<string>();
        // 실제 셰이더에서 발견된 조건부 블록들만 체크
        for (const uniformName of fragmentShaderVariantConditionalBlocks) {
            if (this[uniformName]) {
                activeFeatures.add(uniformName);
            }
        }
        console.log('fragmentShaderVariantConditionalBlocks', fragmentShaderVariantConditionalBlocks);
        console.log('activeFeatures', activeFeatures, this);
        // 활성화된 기능들로부터 바리안트 키 생성
        const variantKey = activeFeatures.size > 0 ?
            Array.from(activeFeatures).sort().join('+') : 'none';
        if (activeFeatures.size) {
            console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
        }
        return variantKey;
    }
}

const pattern = /^use\w+Texture$/;
DefineForFragment.defineByPreset(ABaseMaterial, [
    DefineForFragment.PRESET_POSITIVE_NUMBER.OPACITY,
])
DefineForFragment.defineBoolean(ABaseMaterial, [
    ['useTint', false]
])
DefineForFragment.defineColorRGBA(ABaseMaterial, [
    'tint', '#ff0000'
])
Object.freeze(ABaseMaterial)
export default ABaseMaterial
