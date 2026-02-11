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
 * [KO] 태양의 위치는 업계 표준인 고도(Elevation)와 방위각(Azimuth) 체계를 사용하여 제어하며, 이를 통해 시간대별 대기 변화를 직관적으로 연출할 수 있습니다.
 * [EN] The sun's position is controlled using the industry-standard Elevation and Azimuth system, allowing for intuitive art direction of atmospheric changes over time.
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 *
 * // 태양 위치 설정 (일몰 연출: 고도 5도)
 * // Sun orientation (Sunset: elevation 5 degrees)
 * skyAtmosphere.sunElevation = 5;
 * skyAtmosphere.sunAzimuth = 180;
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
	 * [KO] 계산된 태양 방향 벡터 (정규화됨)
	 * [EN] Calculated sun direction vector (normalized)
	 */
	#sunDirection: Float32Array = new Float32Array([0, 1, 0])
	/**
	 * [KO] 이전 프레임의 시스템 유니폼 바인드 그룹
	 * [EN] System uniform bind group of the previous frame
	 */
	#prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup

	// Physics Parameters
	#earthRadius: number = 6360.0;
	#atmosphereHeight: number = 60.0;
	#mieScattering: number = 0.00399;
	#mieExtinction: number = 0.00444;
	#rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	#dirtyLUT: boolean = true;

	// Sun Orientation (Industry standard coordinates)
	#sunElevation: number = 45;
	#sunAzimuth: number = 0;

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
		
		this.#updateSunDirection();
	}

	/** [KO] 지구 반지름(km)을 반환합니다. [EN] Returns the earth radius(km). */
	get earthRadius(): number { return this.#earthRadius; }
	/** [KO] 지구 반지름(km)을 설정합니다. [EN] Sets the earth radius(km). */
	set earthRadius(v: number) { validatePositiveNumberRange(v, 1); this.#earthRadius = v; this.#dirtyLUT = true; }

	/** [KO] 대기층 두께(km)를 반환합니다. [EN] Returns the atmosphere height(km). */
	get atmosphereHeight(): number { return this.#atmosphereHeight; }
	/** [KO] 대기층 두께(km)를 설정합니다. [EN] Sets the atmosphere height(km). */
	set atmosphereHeight(v: number) { validatePositiveNumberRange(v, 1); this.#atmosphereHeight = v; this.#dirtyLUT = true; }

	/** [KO] 미(Mie) 산란 계수를 반환합니다. [EN] Returns the Mie scattering coefficient. */
	get mieScattering(): number { return this.#mieScattering; }
	/**
	 * [KO] 미(Mie) 산란 계수를 설정합니다. 이 값이 높을수록 태양 주변 광륜이 커지고 대기가 뿌옇게 보입니다.
	 * [EN] Sets the Mie scattering coefficient. Higher values result in larger sun halos and a hazier atmosphere.
	 */
	set mieScattering(v: number) { validatePositiveNumberRange(v, 0); this.#mieScattering = v; this.#dirtyLUT = true; }

	/** [KO] 미(Mie) 소멸 계수를 반환합니다. [EN] Returns the Mie extinction coefficient. */
	get mieExtinction(): number { return this.#mieExtinction; }
	/**
	 * [KO] 미(Mie) 소멸 계수를 설정합니다. 값이 높을수록 시야가 탁해지고 대기가 불투명해집니다.
	 * [EN] Sets the Mie extinction coefficient. Higher values make the view murkier and the atmosphere more opaque.
	 */
	set mieExtinction(v: number) { validatePositiveNumberRange(v, 0); this.#mieExtinction = v; this.#dirtyLUT = true; }

	/** [KO] 레일리(Rayleigh) 산란 계수를 반환합니다. [EN] Returns the Rayleigh scattering coefficient. */
	get rayleighScattering(): [number, number, number] { return this.#rayleighScattering; }
	/**
	 * [KO] 레일리(Rayleigh) 산란 계수를 설정합니다. 하늘의 기본 색상과 노을의 붉은 색감에 영향을 미칩니다.
	 * [EN] Sets the Rayleigh scattering coefficient. Affects the primary sky color and sunset hues.
	 */
	set rayleighScattering(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0));
		this.#rayleighScattering = v;
		this.#dirtyLUT = true;
	}

	/**
	 * [KO] 태양의 고도(Elevation, -90~90도)를 반환합니다.
	 * [EN] Returns the sun elevation (Elevation, -90 to 90 degrees).
	 */
	get sunElevation(): number { return this.#sunElevation; }
	/**
	 * [KO] 태양의 고도(Elevation, -90~90도)를 설정합니다. 0도는 지평선, 90도는 정오를 의미합니다.
	 * [EN] Sets the sun elevation (Elevation, -90 to 90 degrees). 0 means horizon, 90 means zenith.
	 */
	set sunElevation(v: number) {
		validateNumberRange(v, -90, 90);
		this.#sunElevation = v;
		this.#updateSunDirection();
	}

	/**
	 * [KO] 태양의 방위각(Azimuth, -360~360도)을 반환합니다.
	 * [EN] Returns the sun azimuth (Azimuth, -360 to 360 degrees).
	 */
	get sunAzimuth(): number { return this.#sunAzimuth; }
	/**
	 * [KO] 태양의 방위각(Azimuth, -360~360도)을 설정합니다.
	 * [EN] Sets the sun azimuth (Azimuth, -360 to 360 degrees).
	 */
	set sunAzimuth(v: number) {
		validateNumberRange(v, -360, 360);
		this.#sunAzimuth = v;
		this.#updateSunDirection();
	}

	/**
	 * [KO] 계산된 태양 방향 벡터를 반환합니다. (정규화됨)
	 * [EN] Returns the calculated sun direction vector. (Normalized)
	 */
	get sunDirection(): Float32Array { return this.#sunDirection; }

	/**
	 * 고도와 방위각을 기반으로 구면 좌표계 연산을 통해 방향 벡터를 갱신합니다.
	 * @private
	 */
	#updateSunDirection(): void {
		const phi = (90 - this.#sunElevation) * (Math.PI / 180);
		const theta = (this.#sunAzimuth) * (Math.PI / 180);

		this.#sunDirection[0] = Math.sin(phi) * Math.cos(theta);
		this.#sunDirection[1] = Math.cos(phi);
		this.#sunDirection[2] = Math.sin(phi) * Math.sin(theta);
		
		this.#material.sunDirection = this.#sunDirection;
	}

	/**
	 * [KO] SkyAtmosphere를 렌더링합니다.
	 * [EN] Renders the SkyAtmosphere.
	 *
	 * @param renderViewStateData - 렌더링 상태 정보
	 */
	render(renderViewStateData: RenderViewStateData): void {
		const {currentRenderPassEncoder, view} = renderViewStateData
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexCount, format} = indexBuffer
		const {gpuDevice, antialiasingManager} = this.#redGPUContext

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

		const {camera} = view;
		const cameraPos = (camera as any).position || [0, 0, 0];
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, cameraPos);
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
			bundleEncoder.setPipeline(this.gpuRenderInfo.pipeline)
			bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
			bundleEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
			bundleEncoder.setBindGroup(1, this.gpuRenderInfo.vertexUniformBindGroup);
			bundleEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
			bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
			bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
			this.#renderBundle = bundleEncoder.finish({ label: 'renderBundle skyAtmosphere' })
		}

		currentRenderPassEncoder.executeBundles([this.#renderBundle])

		renderViewStateData.num3DObjects++
		renderViewStateData.numDrawCalls++
		renderViewStateData.numTriangles += triangleCount
		renderViewStateData.numPoints += indexCount
	}

	#updateMSAAStatus(): void {
		const {changedMSAA} = this.#redGPUContext.antialiasingManager
		if (changedMSAA) this.#dirtyPipeline = true
	}

	#initGPURenderInfos(redGPUContext: RedGPUContext): void {
		const {resourceManager} = this.#redGPUContext
		const vertex_BindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
			'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
		const vertexUniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData, 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER', 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER')
		
		const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: vertex_BindGroupLayout,
			label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
			entries: [{
				binding: 0,
				resource: { buffer: vertexUniformBuffer.gpuBuffer, offset: 0, size: vertexUniformBuffer.size },
			}]
		}
		const vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.gpuRenderInfo = new VertexGPURenderInfo(
			null, SHADER_INFO.shaderSourceVariant, SHADER_INFO.conditionalBlocks, UNIFORM_STRUCT,
			vertex_BindGroupLayout, vertexUniformBuffer, vertexUniformBindGroup, this.#updatePipeline(),
		)
	}

	#updatePipeline(): GPURenderPipeline {
		const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
		const vertexShaderModule = resourceManager.createGPUShaderModule(VERTEX_SHADER_MODULE_NAME, {code: vertexModuleSource})
		const vertexState: GPUVertexState = {
			module: vertexShaderModule,
			entryPoint: 'main',
			buffers: this.#geometry.gpuRenderInfo.buffers
		}

		const vertex_BindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
			'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)
		const bindGroupLayouts = [
			resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
			vertex_BindGroupLayout,
			this.#material.gpuRenderInfo.fragmentBindGroupLayout
		]
		const pipelineLayout = resourceManager.createGPUPipelineLayout('SKY_ATMOSPHERE_PIPELINE_LAYOUT', {bindGroupLayouts});
		const pipelineDescriptor: GPURenderPipelineDescriptor = {
			label: PIPELINE_DESCRIPTOR_LABEL,
			layout: pipelineLayout,
			vertex: vertexState,
			fragment: this.#material.gpuRenderInfo.fragmentState,
			primitive: this.#primitiveState.state,
			depthStencil: this.#depthStencilState.state,
			multisample: { count: antialiasingManager.useMSAA ? 4 : 1 },
		}
		return gpuDevice.createRenderPipeline(pipelineDescriptor)
	}
}

Object.freeze(SkyAtmosphere)
export default SkyAtmosphere
