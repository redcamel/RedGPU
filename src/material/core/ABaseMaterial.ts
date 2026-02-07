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
import {keepLog} from "../../utils";

interface ABaseMaterial {
    /**
     * [KO] 머티리얼의 불투명도(0~1)
     * [EN] Material opacity (0~1)
     */
    opacity: number;
    /**
     * [KO] 머티리얼의 틴트 컬러(RGBA)
     * [EN] Material tint color (RGBA)
     */
    tint: ColorRGBA;
    /**
     * [KO] 틴트 컬러 사용 여부
     * [EN] Whether to use tint color
     */
    useTint: boolean;
}

/**
 * [KO] 다양한 머티리얼의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract class serving as a common base for various materials.
 *
 * [KO] 셰이더 정보, 유니폼/텍스처/샘플러 구조, 블렌드 상태 등 렌더 파이프라인의 핵심 속성을 관리합니다.
 * [EN] It manages core attributes of the render pipeline such as shader information, uniform/texture/sampler structures, and blend states.
 *
 * [KO] 머티리얼별로 GPU 파이프라인의 셰이더, 바인드 그룹, 블렌딩, 컬러/알파, 틴트, 투명도 등 다양한 렌더링 속성을 일관성 있게 제어할 수 있습니다.
 * [EN] It allows consistent control of various rendering attributes such as shader, bind group, blending, color/alpha, tint, and transparency of the GPU pipeline for each material.
 * @category Material
 */
abstract class ABaseMaterial extends ResourceBase {
    /**
     * [KO] 2패스 렌더링 사용 여부
     * [EN] Whether to use 2-pass rendering
     */
    use2PathRender: boolean
    /**
     * [KO] 프래그먼트 GPU 렌더 정보 객체
     * [EN] Fragment GPU render info object
     */
    gpuRenderInfo: FragmentGPURenderInfo
    /**
     * [KO] 파이프라인 dirty 상태 플래그
     * [EN] Pipeline dirty status flag
     */
    dirtyPipeline: boolean = false
    /**
     * [KO] 머티리얼 투명도 여부
     * [EN] Whether the material is transparent
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
    #TEXTURE_STRUCT: any
    /**
     * 셰이더 samplers 구조 정보
     */
    #SAMPLER_STRUCT: any
    /**
     * 머티리얼 모듈명
     */
    readonly #MODULE_NAME: string
    /**
     * 바인드 그룹 레이아웃 객체
     */
    readonly #bindGroupLayout: GPUBindGroupLayout
    /**
     * [KO] 바인드 그룹 인덱스
     * [EN] Bind group index
     */
    readonly #targetGroupIndex: number;
    /**
     * [KO] 틴트 블렌드 모드 값
     * [EN] Tint blend mode value
     */
    #tintBlendMode: number = TINT_BLEND_MODE.MULTIPLY;

    /**
     * [KO] ABaseMaterial 생성자
     * [EN] ABaseMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈명
     * [EN] Material module name
     * @param SHADER_INFO -
     * [KO] 파싱된 WGSL 셰이더 정보
     * [EN] Parsed WGSL shader info
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 인덱스
     * [EN] Bind group index
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
        this.#targetGroupIndex = targetGroupIndex;
        // [KO] 초기 텍스처/샘플러 구조는 전체(Union) 정보를 사용합니다.
        // [EN] The initial texture/sampler structure uses the union information.
        this.#TEXTURE_STRUCT = SHADER_INFO.shaderSourceVariant.getUnionTextures();
        this.#SAMPLER_STRUCT = SHADER_INFO.shaderSourceVariant.getUnionSamplers();

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

	/**
	 * [KO] 틴트 블렌드 모드 이름을 반환합니다.
	 * [EN] Returns the tint blend mode name.
	 * @returns
	 * [KO] 틴트 블렌드 모드 이름
	 * [EN] Tint blend mode name
	 */
	get tintBlendMode(): string {
		const entry = Object.entries(TINT_BLEND_MODE).find(([, value]) => value === this.#tintBlendMode);
		if (!entry) {
			throw new Error(`Invalid tint mode value: ${this.#tintBlendMode}`);
		}
		return entry[0]; // Return the key (e.g., "MULTIPLY")
	}

	/**
	 * [KO] 틴트 블렌드 모드를 설정합니다.
	 * [EN] Sets the tint blend mode.
	 * @param value -
	 * [KO] 틴트 블렌드 모드 값 또는 키
	 * [EN] Tint blend mode value or key
	 */
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

	/**
	 * [KO] 머티리얼 모듈명을 반환합니다.
	 * [EN] Returns the material module name.
	 */
	get MODULE_NAME(): string {
		return this.#MODULE_NAME;
	}

	/**
	 * [KO] 프래그먼트 셰이더 모듈명을 반환합니다.
	 * [EN] Returns the fragment shader module name.
	 */
	get FRAGMENT_SHADER_MODULE_NAME(): string {
		return this.#FRAGMENT_SHADER_MODULE_NAME;
	}

	/**
	 * [KO] 프래그먼트 바인드 그룹 디스크립터명을 반환합니다.
	 * [EN] Returns the fragment bind group descriptor name.
	 */
	get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string {
		return this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME;
	}

	/**
	 * [KO] 셰이더 storage 구조 정보를 반환합니다.
	 * [EN] Returns the shader storage structure information.
	 */
	get STORAGE_STRUCT(): any {
		return this.#STORAGE_STRUCT;
	}

	/**
	 * [KO] 셰이더 uniforms 구조 정보를 반환합니다.
	 * [EN] Returns the shader uniforms structure information.
	 */
	get UNIFORM_STRUCT(): any {
		return this.#UNIFORM_STRUCT;
	}

    /**
     * [KO] 머티리얼의 컬러 블렌드 상태 객체 반환
     * [EN] Returns the material's color blend state object
     */
    get blendColorState(): BlendState {
        return this.#blendColorState;
    }

    /**
     * [KO] 머티리얼의 알파 블렌드 상태 객체 반환
     * [EN] Returns the material's alpha blend state object
     */
    get blendAlphaState(): BlendState {
        return this.#blendAlphaState;
    }

    /**
     * [KO] 머티리얼의 writeMask 상태 반환
     * [EN] Returns the material's writeMask state
     */
    get writeMaskState(): GPUFlagsConstant {
        return this.#writeMaskState;
    }

    /**
     * [KO] 머티리얼의 writeMask 상태 설정
     * [EN] Sets the material's writeMask state
     * @param value -
     * [KO] GPUFlagsConstant 값
     * [EN] GPUFlagsConstant value
     */
    set writeMaskState(value: GPUFlagsConstant) {
        this.#writeMaskState = value;
    }

	/**
	 * [KO] GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.
	 * [EN] Initializes GPU render pipeline info and uniform buffer.
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
	 * [KO] 프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.
	 * [EN] Updates fragment shader bind group/uniform/texture/sampler states.
	 * @protected
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
	 * [KO] GPU 프래그먼트 렌더 상태 객체를 반환합니다.
	 * [EN] Returns the GPU fragment render state object.
	 * @param entryPoint -
	 * [KO] 셰이더 엔트리포인트 (기본값: 'main')
	 * [EN] Shader entry point (default: 'main')
	 * @returns
	 * [KO] GPU 프래그먼트 상태
	 * [EN] GPU fragment state
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
	 * [KO] 머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.
	 * [EN] Reflects basic material properties such as uniforms/color/tint to the uniform buffer.
	 * @protected
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
	 * [KO] 샘플러 객체에서 GPU 샘플러를 반환합니다.
	 * [EN] Returns the GPU sampler from the Sampler object.
	 * @param sampler -
	 * [KO] Sampler 객체
	 * [EN] Sampler object
	 * @returns
	 * [KO] GPUSampler 인스턴스
	 * [EN] GPUSampler instance
	 */
	getGPUResourceSampler(sampler: Sampler) {
		return sampler?.gpuSampler || this.#basicGPUSampler
	}

    /**
     * [KO] 셰이더 바리안트(조건부 분기) 상태 체크 및 셰이더 모듈 갱신
     * [EN] Check shader variant (conditional branch) state and update shader module
     */
    #checkVariant() {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        // 현재 머티리얼 상태에 맞는 바리안트 키 찾기
        const currentVariantKey = this.#findMatchingVariantKey();

        // 1. 바리안트별 셰이더 모듈 확인/생성
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

        // 2. 바리안트별 텍스처/샘플러 구조 업데이트
        this.#TEXTURE_STRUCT = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariantTextures(currentVariantKey);
        this.#SAMPLER_STRUCT = this.gpuRenderInfo.fragmentShaderSourceVariant.getVariantSamplers(currentVariantKey);
        keepLog(this.#TEXTURE_STRUCT)
        // 3. 바리안트별 바인드 그룹 레이아웃 확인/생성
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

    /**
     * [KO] 현재 머티리얼 상태에 맞는 셰이더 바리안트 키 반환
     * [EN] Returns the shader variant key matching the current material state
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
