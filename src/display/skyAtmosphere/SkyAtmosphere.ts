import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import Primitive from "../../primitive/core/Primitive";
import Sphere from "../../primitive/Sphere";
import DepthStencilState from "../../renderState/DepthStencilState";
import PrimitiveState from "../../renderState/PrimitiveState";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import VertexGPURenderInfo from "../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../view/core/RenderViewStateData";
import SkyAtmosphereMaterial from "./core/SkyAtmosphereMaterial";
import TransmittanceGenerator from "./core/generator/TransmittanceGenerator";
import vertexModuleSource from './shader/vertex.wgsl';

/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource)
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/** 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKY_ATMOSPHERE'
/** 버텍스 바인드 그룹 디스크립터 이름 */
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKY_ATMOSPHERE'
/** 파이프라인 디스크립터 레이블 */
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKY_ATMOSPHERE'

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering)을 구현하는 클래스입니다.
 * [EN] Class that implements physics-based atmospheric scattering.
 *
 * [KO] 이 클래스는 거대 구체 지오메트리를 사용하여 카메라를 추적하며, 레일리(Rayleigh) 및 미(Mie) 산란 연산을 통해 사실적인 하늘, 노을, 대기 효과를 렌더링합니다.
 * [EN] This class uses large sphere geometry to track the camera and renders realistic sky, sunset, and atmospheric effects through Rayleigh and Mie scattering calculations.
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 *
 * // 파라미터 조절 (Adjust parameters)
 * skyAtmosphere.atmosphereHeight = 60;
 * skyAtmosphere.sunDirection = new Float32Array([1, 0.2, 0]);
 *
 * view.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphere {
	/**
	 * [KO] 모델 변환 행렬 (4x4 매트릭스)
	 * [EN] Model transformation matrix (4x4 matrix)
	 */
	modelMatrix: mat4 = mat4.create()
	/**
	 * [KO] GPU 렌더링 정보 객체
	 * [EN] GPU rendering information object
	 */
	gpuRenderInfo: VertexGPURenderInfo
	/**
	 * [KO] 파이프라인 재생성이 필요한지 나타내는 플래그
	 * [EN] Flag indicating if pipeline regeneration is needed
	 */
	#dirtyPipeline: boolean = true
	/**
	 * [KO] 렌더 번들 객체
	 * [EN] Render bundle object
	 */
	#renderBundle: GPURenderBundle
	/**
	 * [KO] SkyAtmosphere의 기하학적 형태 (구체)
	 * [EN] Geometric shape of the SkyAtmosphere (sphere)
	 */
	#geometry: Primitive
	/**
	 * [KO] SkyAtmosphere 머티리얼
	 * [EN] SkyAtmosphere material
	 */
	#material: SkyAtmosphereMaterial
	/**
	 * [KO] RedGPU 컨텍스트 참조
	 * [EN] Reference to RedGPU context
	 */
	#redGPUContext: RedGPUContext
	/**
	 * [KO] 프리미티브 렌더링 상태
	 * [EN] Primitive rendering state
	 */
	#primitiveState: PrimitiveState
	/**
	 * [KO] 깊이 스텐실 상태
	 * [EN] Depth stencil state
	 */
	#depthStencilState: DepthStencilState
	/**
	 * [KO] 투과율 LUT 생성기
	 * [EN] Transmittance LUT generator
	 */
	#transmittanceGenerator: TransmittanceGenerator
	/**
	 * [KO] 태양 방향 벡터
	 * [EN] Sun direction vector
	 */
	#sunDirection: Float32Array = new Float32Array([0, 1, 0])
	/**
	 * [KO] 이전 프레임의 시스템 유니폼 바인드 그룹
	 * [EN] System uniform bind group of the previous frame
	 */
	#prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup

	/** [KO] 지구 반지름 (km) [EN] Earth radius (km) */
	#earthRadius: number = 6360.0;
	/** [KO] 대기층 두께 (km) [EN] Atmosphere thickness (km) */
	#atmosphereHeight: number = 60.0;
	/** [KO] 미(Mie) 산란 계수 [EN] Mie scattering coefficient */
	#mieScattering: number = 0.00399;
	/** [KO] 미(Mie) 소멸 계수 [EN] Mie extinction coefficient */
	#mieExtinction: number = 0.00444;
	/** [KO] 레일리(Rayleigh) 산란 계수 [EN] Rayleigh scattering coefficient */
	#rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	/** [KO] LUT 갱신 필요 여부 [EN] Whether LUT needs updating */
	#dirtyLUT: boolean = true;

	/**
	 * [KO] SkyAtmosphere 인스턴스를 생성합니다.
	 * [EN] Creates a new SkyAtmosphere instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 렌더링 컨텍스트
	 * [EN] RedGPU rendering context
	 */
	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
		// 대기를 표현할 거대 구체 생성
		this.#geometry = new Sphere(redGPUContext, 1, 32, 32)
		this.#material = new SkyAtmosphereMaterial(redGPUContext)
		this.#primitiveState = new PrimitiveState(this)
		this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
		this.#depthStencilState = new DepthStencilState(this)

		// LUT Generator 초기화
		this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext)
		this.#material.transmittanceTexture = this.#transmittanceGenerator.lutTexture
	}

	/** [KO] 지구 반지름을 반환합니다. [EN] Returns the earth radius. */
	get earthRadius(): number { return this.#earthRadius; }
	/** [KO] 지구 반지름을 설정합니다. [EN] Sets the earth radius. */
	set earthRadius(v: number) {
		validatePositiveNumberRange(v, 1);
		this.#earthRadius = v;
		this.#dirtyLUT = true;
	}

	/** [KO] 대기층 두께를 반환합니다. [EN] Returns the atmosphere height. */
	get atmosphereHeight(): number { return this.#atmosphereHeight; }
	/** [KO] 대기층 두께를 설정합니다. [EN] Sets the atmosphere height. */
	set atmosphereHeight(v: number) {
		validatePositiveNumberRange(v, 1);
		this.#atmosphereHeight = v;
		this.#dirtyLUT = true;
	}

	/** [KO] 미(Mie) 산란 계수를 반환합니다. [EN] Returns the Mie scattering coefficient. */
	get mieScattering(): number { return this.#mieScattering; }
	/**
	 * [KO] 미(Mie) 산란 계수를 설정합니다.
	 * [EN] Sets the Mie scattering coefficient.
	 *
	 * [KO] 이 값이 높을수록 태양 주변의 광륜(Halo)이 커지고 대기가 뿌옇게(Haze) 보입니다.
	 * [EN] Higher values result in a larger halo around the sun and a hazier atmosphere.
	 *
	 * @param v - [KO] 산란 계수 [EN] Scattering coefficient
	 */
	set mieScattering(v: number) {
		validatePositiveNumberRange(v, 0);
		this.#mieScattering = v;
		this.#dirtyLUT = true;
	}

	/** [KO] 미(Mie) 소멸 계수를 반환합니다. [EN] Returns the Mie extinction coefficient. */
	get mieExtinction(): number { return this.#mieExtinction; }
	/**
	 * [KO] 미(Mie) 소멸 계수를 설정합니다.
	 * [EN] Sets the Mie extinction coefficient.
	 *
	 * [KO] 대기 중 먼지나 수증기에 의한 빛의 흡수 및 산란 소멸 정도를 결정하며, 값이 높을수록 시야가 탁해지고 불투명해집니다.
	 * [EN] Determines the degree of light absorption and scattering extinction by dust or water vapor; higher values make the view murkier and more opaque.
	 *
	 * @param v - [KO] 소멸 계수 [EN] Extinction coefficient
	 */
	set mieExtinction(v: number) {
		validatePositiveNumberRange(v, 0);
		this.#mieExtinction = v;
		this.#dirtyLUT = true;
	}

	/** [KO] 레일리(Rayleigh) 산란 계수를 반환합니다. [EN] Returns the Rayleigh scattering coefficient. */
	get rayleighScattering(): [number, number, number] { return this.#rayleighScattering; }
	/**
	 * [KO] 레일리(Rayleigh) 산란 계수를 설정합니다.
	 * [EN] Sets the Rayleigh scattering coefficient.
	 *
	 * [KO] 대기 분자에 의한 산란을 결정하며, 하늘의 기본 색상(파란색)과 노을의 붉은 색감에 직접적인 영향을 미칩니다.
	 * [EN] Determines scattering by atmospheric molecules, directly affecting the primary sky color (blue) and the reddish tones of sunsets.
	 *
	 * @param v - [KO] [R, G, B] 산란 계수 [EN] [R, G, B] Scattering coefficients
	 */
	set rayleighScattering(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0));
		this.#rayleighScattering = v;
		this.#dirtyLUT = true;
	}

	/**
	 * [KO] 태양 방향을 반환합니다.
	 * [EN] Returns the sun direction.
	 *
	 * @returns
	 * [KO] 태양 방향 벡터
	 * [EN] Sun direction vector
	 */
	get sunDirection(): Float32Array {
		return this.#sunDirection;
	}

	/**
	 * [KO] 태양 방향을 설정합니다.
	 * [EN] Sets the sun direction.
	 *
	 * @param value -
	 * [KO] 태양 방향 벡터
	 * [EN] Sun direction vector
	 */
	set sunDirection(value: Float32Array) {
		value.forEach(val => validateNumberRange(val, -1, 1));
		this.#sunDirection = value;
		this.#material.sunDirection = value;
	}

	/**
	 * [KO] SkyAtmosphere를 렌더링합니다.
	 * [EN] Renders the SkyAtmosphere.
	 *
	 * [KO] 매 프레임 호출되어 카메라를 추적하고, 필요한 경우 LUT를 갱신하며 GPU 렌더링 명령을 실행합니다.
	 * [EN] Called every frame to track the camera, update the LUT if necessary, and execute GPU rendering commands.
	 *
	 * @param renderViewStateData -
	 * [KO] 렌더링 상태 및 디버그 정보
	 * [EN] Rendering state and debug info
	 */
	render(renderViewStateData: RenderViewStateData): void {
		const {currentRenderPassEncoder, view} = renderViewStateData
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexCount, format} = indexBuffer
		const {gpuDevice, antialiasingManager} = this.#redGPUContext

		// LUT 갱신 체크
		if (this.#dirtyLUT) {
			this.#transmittanceGenerator.render({
				earthRadius: this.#earthRadius,
				atmosphereHeight: this.#atmosphereHeight,
				mieScattering: this.#mieScattering,
				mieExtinction: this.#mieExtinction,
				rayleighScattering: this.#rayleighScattering
			});
			this.#dirtyLUT = false;
		}

		this.#updateMSAAStatus();

		if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)

		// 카메라 위치에 맞춰 구체 이동 (카메라 팔로잉)
		const {camera} = view;
		const cameraPos = (camera as any).position || [0, 0, 0];
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, cameraPos);
		// 매우 크게 확장
		mat4.scale(this.modelMatrix, this.modelMatrix, [5000, 5000, 5000]);

		this.gpuRenderInfo.vertexUniformBuffer.writeOnlyBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)

		if (this.#dirtyPipeline || this.#material.dirtyPipeline || this.#prevSystemUniform_Vertex_UniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
			this.gpuRenderInfo.pipeline = this.#updatePipeline()
			this.#dirtyPipeline = false
			renderViewStateData.numDirtyPipelines++
			this.#prevSystemUniform_Vertex_UniformBindGroup = view.systemUniform_Vertex_UniformBindGroup

			this.#material.dirtyPipeline = false
			const bundleEncoder = gpuDevice.createRenderBundleEncoder({
				...view.basicRenderBundleEncoderDescriptor,
				label: 'skyAtmosphere'
			})
			const {gpuRenderInfo} = this
			const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
			bundleEncoder.setPipeline(pipeline)
			bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
			bundleEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
			bundleEncoder.setBindGroup(1, vertexUniformBindGroup);
			bundleEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
			bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
			bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
			this.#renderBundle = bundleEncoder.finish({
				label: 'renderBundle skyAtmosphere',
			})
		}

		currentRenderPassEncoder.executeBundles([this.#renderBundle])

		renderViewStateData.num3DObjects++
		renderViewStateData.numDrawCalls++
		renderViewStateData.numTriangles += triangleCount
		renderViewStateData.numPoints += indexCount
	}

	/**
	 * MSAA (Multi-Sample Anti-Aliasing) 상태 변경을 확인하고 파이프라인을 갱신합니다.
	 * @private
	 */
	#updateMSAAStatus(): void {
		const {changedMSAA} = this.#redGPUContext.antialiasingManager
		if (changedMSAA) {
			this.#dirtyPipeline = true
		}
	}

	/**
	 * GPU 렌더링 정보를 초기화합니다.
	 * @private
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 */
	#initGPURenderInfos(redGPUContext: RedGPUContext): void {
		const {resourceManager} = this.#redGPUContext
		const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
			'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
		const vertexUniformBuffer: UniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData, 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER', 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER')

		const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: vertex_BindGroupLayout,
			label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
			entries: [{
				binding: 0,
				resource: {
					buffer: vertexUniformBuffer.gpuBuffer,
					offset: 0,
					size: vertexUniformBuffer.size
				},
			}]
		}
		const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.gpuRenderInfo = new VertexGPURenderInfo(
			null,
			SHADER_INFO.shaderSourceVariant,
			SHADER_INFO.conditionalBlocks,
			UNIFORM_STRUCT,
			vertex_BindGroupLayout,
			vertexUniformBuffer,
			vertexUniformBindGroup,
			this.#updatePipeline(),
		)
	}

	/**
	 * 렌더링 파이프라인을 업데이트합니다.
	 * @private
	 * @returns 새로 생성된 GPU 렌더 파이프라인
	 */
	#updatePipeline(): GPURenderPipeline {
		const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
		const vModuleDescriptor: GPUShaderModuleDescriptor = {code: vertexModuleSource}
		const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
			VERTEX_SHADER_MODULE_NAME,
			vModuleDescriptor
		)
		const vertexState: GPUVertexState = {
			module: vertexShaderModule,
			entryPoint: 'main',
			buffers: this.#geometry.gpuRenderInfo.buffers
		}

		const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
			'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)
		const bindGroupLayouts: GPUBindGroupLayout[] = [
			resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
			vertex_BindGroupLayout,
			this.#material.gpuRenderInfo.fragmentBindGroupLayout
		]
		const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts: bindGroupLayouts}
		const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout('SKY_ATMOSPHERE_PIPELINE_LAYOUT', pipelineLayoutDescriptor);
		const pipelineDescriptor: GPURenderPipelineDescriptor = {
			label: PIPELINE_DESCRIPTOR_LABEL,
			layout: pipelineLayout,
			vertex: vertexState,
			fragment: this.#material.gpuRenderInfo.fragmentState,
			primitive: this.#primitiveState.state,
			depthStencil: this.#depthStencilState.state,
			multisample: {
				count: antialiasingManager.useMSAA ? 4 : 1,
			},
		}
		return gpuDevice.createRenderPipeline(pipelineDescriptor)
	}
}

Object.freeze(SkyAtmosphere)
export default SkyAtmosphere
