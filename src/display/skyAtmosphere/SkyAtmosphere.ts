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
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import CameraVolumeGenerator from "./core/generator/cameraVolume/CameraVolumeGenerator";
import vertexModuleSource from './shader/vertex.wgsl';
import {PerspectiveCamera} from "../../camera";

const SHADER_INFO = parseWGSL(vertexModuleSource)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKY_ATMOSPHERE'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKY_ATMOSPHERE'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKY_ATMOSPHERE'

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 시스템 클래스입니다.
 * [EN] Physics-based Atmospheric Scattering system class.
 *
 * [KO] 이 클래스는 투과율(Transmittance), 다중 산란(Multi-Scattering), Sky-View LUT를 실시간으로 생성하여 사실적인 하늘과 대기 효과를 렌더링합니다.
 * [EN] This class renders realistic sky and atmospheric effects by generating Transmittance, Multi-Scattering, and Sky-View LUTs in real-time.
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.SkyAtmosphere(redGPUContext);
 * scene.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * @category Display
 */
class SkyAtmosphere {
	/**
	 * [KO] 모델 행렬
	 * [EN] Model matrix
	 */
	modelMatrix: mat4 = mat4.create()
	/**
	 * [KO] GPU 렌더링 정보
	 * [EN] GPU render information
	 */
	gpuRenderInfo: VertexGPURenderInfo
	#dirtyPipeline: boolean = true
	#renderBundle: GPURenderBundle
	#geometry: Primitive
	#material: SkyAtmosphereMaterial
	#redGPUContext: RedGPUContext
	#primitiveState: PrimitiveState
	#depthStencilState: DepthStencilState

	#transmittanceGenerator: TransmittanceGenerator
	#multiScatteringGenerator: MultiScatteringGenerator
	#skyViewGenerator: SkyViewGenerator
	#cameraVolumeGenerator: CameraVolumeGenerator

	// [통합] 모든 대기 산란 파라미터를 하나의 객체로 관리
	#params = {
		earthRadius: 6360.0,
		atmosphereHeight: 60.0,
		mieScattering: 0.021,
		mieExtinction: 0.021,
		rayleighScattering: [0.0058, 0.0135, 0.0331],
		rayleighScaleHeight: 8.0,
		mieScaleHeight: 1.2,
		mieAnisotropy: 0.9,
		ozoneAbsorption: [0.00065, 0.00188, 0.00008],
		ozoneLayerCenter: 25.0,
		ozoneLayerWidth: 15.0,
		multiScatteringAmbient: 0.05,
		sunSize: 0.5,
		sunIntensity: 22.0,
		exposure: 1.0,
		heightFogDensity: 0.0,
		heightFogFalloff: 0.1,
		horizonHaze: 0.3,
		groundAmbient: 0.4,
		groundAlbedo: [0.15, 0.15, 0.15],
		mieGlow: 0.75,
		mieHalo: 0.99,
		groundShininess: 512.0,
		groundSpecular: 4.0,
		sunDirection: new Float32Array([0, 1, 0]),
		cameraHeight: 0.2,
		padding0: 0,
		padding1: 0
	};

	#sunElevation: number = 45;
	#sunAzimuth: number = 0;

	#dirtyLUT: boolean = true;
	#dirtySkyView: boolean = true;
	#prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup;

	/**
	 * [KO] SkyAtmosphere 인스턴스를 생성합니다.
	 * [EN] Creates a SkyAtmosphere instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 */
	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
		this.#geometry = new Sphere(redGPUContext, 1, 32, 32)
		this.#material = new SkyAtmosphereMaterial(redGPUContext)
		this.#primitiveState = new PrimitiveState(this)
		this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
		this.#depthStencilState = new DepthStencilState(this)
		this.#depthStencilState.depthCompare = 'less-equal'
		this.#depthStencilState.depthWriteEnabled = false

		this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext)
		this.#multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext)
		this.#skyViewGenerator = new SkyViewGenerator(redGPUContext)
		this.#cameraVolumeGenerator = new CameraVolumeGenerator(redGPUContext)

		this.#material.transmittanceTexture = this.#transmittanceGenerator.lutTexture
		this.#material.multiScatteringTexture = this.#multiScatteringGenerator.lutTexture
		this.#material.skyViewTexture = this.#skyViewGenerator.lutTexture
		this.#material.cameraVolumeTexture = this.#cameraVolumeGenerator.lutTexture

		this.#syncInitialParams();
		this.#updateSunDirection();
	}

	#syncInitialParams(): void {
		// 모든 자식 인스턴스의 파라미터를 현재 #params 값으로 초기화
		Object.keys(this.#params).forEach(key => {
			if (key !== 'sunDirection' && key !== 'cameraHeight' && !key.startsWith('padding')) {
				(this as any)[key] = (this.#params as any)[key];
			}
		});
	}

	#updateSunDirection(): void {
		const phi = (90 - this.#sunElevation) * (Math.PI / 180);
		const theta = (this.#sunAzimuth) * (Math.PI / 180);
		const dx = Math.sin(phi) * Math.cos(theta);
		const dy = Math.cos(phi);
		const dz = Math.sin(phi) * Math.sin(theta);

		this.#params.sunDirection[0] = dx;
		this.#params.sunDirection[1] = dy;
		this.#params.sunDirection[2] = dz;

		this.#material.sunDirection = this.#params.sunDirection;
		this.#dirtySkyView = true;
	}

	/**
	 * [KO] 태양의 고도 (도 단위, -90 ~ 90)
	 * [EN] Sun elevation (in degrees, -90 ~ 90)
	 */
	get sunElevation(): number { return this.#sunElevation; }
	set sunElevation(v: number) { validateNumberRange(v, -90, 90); this.#sunElevation = v; this.#updateSunDirection(); }

	/**
	 * [KO] 태양의 방위각 (도 단위, -360 ~ 360)
	 * [EN] Sun azimuth (in degrees, -360 ~ 360)
	 */
	get sunAzimuth(): number { return this.#sunAzimuth; }
	set sunAzimuth(v: number) { validateNumberRange(v, -360, 360); this.#sunAzimuth = v; this.#updateSunDirection(); }

	/**
	 * [KO] 지구의 반지름 (km)
	 * [EN] Earth radius (km)
	 */
	get earthRadius(): number { return this.#params.earthRadius; }
	set earthRadius(v: number) { validatePositiveNumberRange(v, 1); this.#params.earthRadius = v; this.#material.earthRadius = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 대기의 높이 (km)
	 * [EN] Atmosphere height (km)
	 */
	get atmosphereHeight(): number { return this.#params.atmosphereHeight; }
	set atmosphereHeight(v: number) { validatePositiveNumberRange(v, 1); this.#params.atmosphereHeight = v; this.#material.atmosphereHeight = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 미(Mie) 산란 계수
	 * [EN] Mie scattering coefficient
	 */
	get mieScattering(): number { return this.#params.mieScattering; }
	set mieScattering(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.mieScattering = v; this.#material.mieScattering = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 미(Mie) 소멸 계수
	 * [EN] Mie extinction coefficient
	 */
	get mieExtinction(): number { return this.#params.mieExtinction; }
	set mieExtinction(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.mieExtinction = v; this.#material.mieExtinction = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 레일리(Rayleigh) 산란 계수 (RGB)
	 * [EN] Rayleigh scattering coefficient (RGB)
	 */
	get rayleighScattering(): [number, number, number] { return this.#params.rayleighScattering as [number, number, number]; }
	set rayleighScattering(v: [number, number, number]) { this.#params.rayleighScattering = [...v]; this.#material.rayleighScattering = new Float32Array(v); this.#dirtyLUT = true; }

	/**
	 * [KO] 레일리(Rayleigh) 스케일 높이 (km)
	 * [EN] Rayleigh scale height (km)
	 */
	get rayleighScaleHeight(): number { return this.#params.rayleighScaleHeight; }
	set rayleighScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#params.rayleighScaleHeight = v; this.#material.rayleighScaleHeight = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 미(Mie) 스케일 높이 (km)
	 * [EN] Mie scale height (km)
	 */
	get mieScaleHeight(): number { return this.#params.mieScaleHeight; }
	set mieScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#params.mieScaleHeight = v; this.#material.mieScaleHeight = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 미(Mie) 비등방성 계수 (0 ~ 0.999)
	 * [EN] Mie anisotropy coefficient (0 ~ 0.999)
	 */
	get mieAnisotropy(): number { return this.#params.mieAnisotropy; }
	set mieAnisotropy(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieAnisotropy = v; this.#material.mieAnisotropy = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 오존 흡수 계수 (RGB)
	 * [EN] Ozone absorption coefficient (RGB)
	 */
	get ozoneAbsorption(): [number, number, number] { return this.#params.ozoneAbsorption as [number, number, number]; }
	set ozoneAbsorption(v: [number, number, number]) { this.#params.ozoneAbsorption = [...v]; this.#material.ozoneAbsorption = new Float32Array(v); this.#dirtyLUT = true; }

	/**
	 * [KO] 오존층 중심 고도 (km)
	 * [EN] Ozone layer center altitude (km)
	 */
	get ozoneLayerCenter(): number { return this.#params.ozoneLayerCenter; }
	set ozoneLayerCenter(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.ozoneLayerCenter = v; this.#material.ozoneLayerCenter = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 오존층 두께 (km)
	 * [EN] Ozone layer width (km)
	 */
	get ozoneLayerWidth(): number { return this.#params.ozoneLayerWidth; }
	set ozoneLayerWidth(v: number) { validatePositiveNumberRange(v, 1, 50); this.#params.ozoneLayerWidth = v; this.#material.ozoneLayerWidth = v; this.#dirtyLUT = true; }

	/**
	 * [KO] 다중 산란 환경광 계수
	 * [EN] Multi-scattering ambient coefficient
	 */
	get multiScatteringAmbient(): number { return this.#params.multiScatteringAmbient; }
	set multiScatteringAmbient(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.multiScatteringAmbient = v; this.#material.multiScatteringAmbient = v; this.#dirtySkyView = true; }

	/**
	 * [KO] 태양의 시직경 (도 단위)
	 * [EN] Sun angular size (in degrees)
	 */
	get sunSize(): number { return this.#params.sunSize; }
	set sunSize(v: number) { validatePositiveNumberRange(v, 0.01, 10.0); this.#params.sunSize = v; this.#material.sunSize = v; }

	/**
	 * [KO] 태양의 강도
	 * [EN] Sun intensity
	 */
	get sunIntensity(): number { return this.#params.sunIntensity; }
	set sunIntensity(v: number) { validatePositiveNumberRange(v, 0, 10000); this.#params.sunIntensity = v; this.#material.sunIntensity = v; }

	/**
	 * [KO] 노출값
	 * [EN] Exposure value
	 */
	get exposure(): number { return this.#params.exposure; }
	set exposure(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.exposure = v; this.#material.exposure = v; }

	/**
	 * [KO] 높이 안개 밀도
	 * [EN] Height fog density
	 */
	get heightFogDensity(): number { return this.#params.heightFogDensity; }
	set heightFogDensity(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.heightFogDensity = v; this.#material.heightFogDensity = v; }

	/**
	 * [KO] 높이 안개 감쇠 계수
	 * [EN] Height fog falloff coefficient
	 */
	get heightFogFalloff(): number { return this.#params.heightFogFalloff; }
	set heightFogFalloff(v: number) { validatePositiveNumberRange(v, 0.001, 10); this.#params.heightFogFalloff = v; this.#material.heightFogFalloff = v; }

	/**
	 * [KO] 지평선 연무 강도
	 * [EN] Horizon haze intensity
	 */
	get horizonHaze(): number { return this.#params.horizonHaze; }
	set horizonHaze(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.horizonHaze = v; this.#material.horizonHaze = v; }

	/**
	 * [KO] 지면 환경광 강도
	 * [EN] Ground ambient intensity
	 */
	get groundAmbient(): number { return this.#params.groundAmbient; }
	set groundAmbient(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.groundAmbient = v; this.#material.groundAmbient = v; }

	/**
	 * [KO] 지면 알베도 (RGB)
	 * [EN] Ground albedo (RGB)
	 */
	get groundAlbedo(): [number, number, number] { return this.#params.groundAlbedo as [number, number, number]; }
	set groundAlbedo(v: [number, number, number]) { this.#params.groundAlbedo = [...v]; this.#material.groundAlbedo = new Float32Array(v); this.#dirtySkyView = true; }

	/**
	 * [KO] 미(Mie) 글로우 계수
	 * [EN] Mie glow coefficient
	 */
	get mieGlow(): number { return this.#params.mieGlow; }
	set mieGlow(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieGlow = v; this.#material.mieGlow = v; }

	/**
	 * [KO] 미(Mie) 헤일로 계수
	 * [EN] Mie halo coefficient
	 */
	get mieHalo(): number { return this.#params.mieHalo; }
	set mieHalo(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieHalo = v; this.#material.mieHalo = v; }

	/**
	 * [KO] 지면 광택도
	 * [EN] Ground shininess
	 */
	get groundShininess(): number { return this.#params.groundShininess; }
	set groundShininess(v: number) { validatePositiveNumberRange(v, 1, 2048); this.#params.groundShininess = v; this.#material.groundShininess = v; }

	/**
	 * [KO] 지면 스펙큘러 강도
	 * [EN] Ground specular intensity
	 */
	get groundSpecular(): number { return this.#params.groundSpecular; }
	set groundSpecular(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.groundSpecular = v; this.#material.groundSpecular = v; }

	/**
	 * [KO] 대기를 렌더링합니다.
	 * [EN] Renders the atmosphere.
	 *
	 * @param renderViewStateData -
	 * [KO] 렌더 뷰 상태 데이터
	 * [EN] Render view state data
	 */
	render(renderViewStateData: RenderViewStateData): void {
		const {currentRenderPassEncoder, view} = renderViewStateData
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexCount, format} = indexBuffer
		const {gpuDevice} = this.#redGPUContext

		const rawCamera = view.rawCamera as PerspectiveCamera;
		const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
		const currentHeightKm = Math.max(0.001, cameraPos[1] / 1000.0);

		// [최적화] 카메라 고도 변화 임계값을 10m(0.01km)로 상향하여 불필요한 갱신 방지
		if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.01) {
			this.#params.cameraHeight = currentHeightKm;
			this.#material.cameraHeight = currentHeightKm;
			this.#dirtySkyView = true;
		}

		if (this.#dirtyLUT) {
			this.#transmittanceGenerator.render(this.#params);
			this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture, this.#params);
			this.#dirtyLUT = false;
			this.#dirtySkyView = true;
		}

		if (this.#dirtySkyView) {
			this.#skyViewGenerator.render(
				this.#transmittanceGenerator.lutTexture,
				this.#multiScatteringGenerator.lutTexture,
				this.#params
			);
			// [최적화] 3D LUT는 회전과 무관하므로 고도/태양 변화 시에만 갱신
			this.#cameraVolumeGenerator.render(
				this.#transmittanceGenerator.lutTexture,
				this.#multiScatteringGenerator.lutTexture,
				this.#params
			);
			this.#dirtySkyView = false;
		}

		this.#updateMSAAStatus();
		if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, cameraPos);
		mat4.scale(this.modelMatrix, this.modelMatrix, [1000000, 1000000, 1000000]);

		this.gpuRenderInfo.vertexUniformBuffer.writeOnlyBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)

		// [최적화] sceneDepthTexture는 뷰 리사이즈 시에만 변경되므로 체크 후 업데이트 (파이프라인 재생성 방지)
		// TODO: MSAA 사용 시 multisampled depth texture 대응 필요
		const currentDepthView = view.viewRenderTextureManager.depthTextureView;
		if (this.#material.sceneDepthTexture !== currentDepthView) {
			this.#material.sceneDepthTexture = currentDepthView;
		}

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

	get transmittanceTexture() { return this.#transmittanceGenerator.lutTexture; }
	get multiScatteringTexture() { return this.#multiScatteringGenerator.lutTexture; }
	get skyViewTexture() { return this.#skyViewGenerator.lutTexture; }
	get cameraVolumeTexture() { return this.#cameraVolumeGenerator.lutTexture; }
	get skyAtmosphereSampler() { return this.#material.transmittanceTextureSampler; }
}

Object.freeze(SkyAtmosphere)
export default SkyAtmosphere
