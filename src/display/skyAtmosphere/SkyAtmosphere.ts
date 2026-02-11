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
 */
class SkyAtmosphere {
	modelMatrix: mat4 = mat4.create()
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

	#sunDirection: Float32Array = new Float32Array([0, 1, 0])
	#prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup

	// Physics Parameters
	#earthRadius: number = 6360.0;
	#atmosphereHeight: number = 60.0;
	#mieScattering: number = 0.00399;
	#mieExtinction: number = 0.00444;
	#rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	
	// Advanced Parameters
	#rayleighScaleHeight: number = 8.0;
	#mieScaleHeight: number = 1.2;
	#mieAnisotropy: number = 0.8;
	#ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];
	
	#sunSize: number = 0.5;
	#sunIntensity: number = 100.0;
	#exposure: number = 1.0;
	
	#sunElevation: number = 45;
	#sunAzimuth: number = 0;
	
	#dirtyLUT: boolean = true;
	#dirtySkyView: boolean = true;
	#prevCameraHeight: number = -1;

	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
		this.#geometry = new Sphere(redGPUContext, 1, 32, 32)
		this.#material = new SkyAtmosphereMaterial(redGPUContext)
		this.#primitiveState = new PrimitiveState(this)
		this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
		this.#depthStencilState = new DepthStencilState(this)

		this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext)
		this.#multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext)
		this.#skyViewGenerator = new SkyViewGenerator(redGPUContext)
		
		this.#material.transmittanceTexture = this.#transmittanceGenerator.lutTexture
		this.#material.multiScatteringTexture = this.#multiScatteringGenerator.lutTexture
		this.#material.skyViewTexture = this.#skyViewGenerator.lutTexture
		
		this.#updateSunDirection();
	}

	get earthRadius(): number { return this.#earthRadius; }
	set earthRadius(v: number) { validatePositiveNumberRange(v, 1); this.#earthRadius = v; this.#dirtyLUT = true; }

	get atmosphereHeight(): number { return this.#atmosphereHeight; }
	set atmosphereHeight(v: number) { validatePositiveNumberRange(v, 1); this.#atmosphereHeight = v; this.#dirtyLUT = true; }

	get mieScattering(): number { return this.#mieScattering; }
	set mieScattering(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#mieScattering = v; this.#dirtyLUT = true; }

	get mieExtinction(): number { return this.#mieExtinction; }
	set mieExtinction(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#mieExtinction = v; this.#dirtyLUT = true; }

	get rayleighScattering(): [number, number, number] { return this.#rayleighScattering; }
	set rayleighScattering(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0, 1.0));
		this.#rayleighScattering = v;
		this.#dirtyLUT = true;
	}

	get rayleighScaleHeight(): number { return this.#rayleighScaleHeight; }
	set rayleighScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#rayleighScaleHeight = v; this.#dirtyLUT = true; }

	get mieScaleHeight(): number { return this.#mieScaleHeight; }
	set mieScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#mieScaleHeight = v; this.#dirtyLUT = true; }

	get mieAnisotropy(): number { return this.#mieAnisotropy; }
	set mieAnisotropy(v: number) { validateNumberRange(v, 0, 0.999); this.#mieAnisotropy = v; this.#dirtySkyView = true; }

	get ozoneAbsorption(): [number, number, number] { return this.#ozoneAbsorption; }
	set ozoneAbsorption(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0, 1.0));
		this.#ozoneAbsorption = v;
		this.#dirtyLUT = true;
	}

	get sunSize(): number { return this.#sunSize; }
	set sunSize(v: number) {
		validatePositiveNumberRange(v, 0.01, 10.0);
		this.#sunSize = v;
		this.#material.sunSize = v;
	}

	get sunIntensity(): number { return this.#sunIntensity; }
	set sunIntensity(v: number) { validatePositiveNumberRange(v, 0, 10000); this.#sunIntensity = v; }

	get exposure(): number { return this.#exposure; }
	set exposure(v: number) { validatePositiveNumberRange(v, 0, 100); this.#exposure = v; }

	get sunElevation(): number { return this.#sunElevation; }
	set sunElevation(v: number) { validateNumberRange(v, -90, 90); this.#sunElevation = v; this.#updateSunDirection(); }

	get sunAzimuth(): number { return this.#sunAzimuth; }
	set sunAzimuth(v: number) { validateNumberRange(v, -360, 360); this.#sunAzimuth = v; this.#updateSunDirection(); }

	get sunDirection(): Float32Array { return this.#sunDirection; }

	#updateSunDirection(): void {
		const phi = (90 - this.#sunElevation) * (Math.PI / 180);
		const theta = (this.#sunAzimuth) * (Math.PI / 180);
		this.#sunDirection[0] = Math.sin(phi) * Math.cos(theta);
		this.#sunDirection[1] = Math.cos(phi);
		this.#sunDirection[2] = Math.sin(phi) * Math.sin(theta);
		this.#material.sunDirection = this.#sunDirection;
		this.#dirtySkyView = true;
	}

	render(renderViewStateData: RenderViewStateData): void {
		const {currentRenderPassEncoder, view} = renderViewStateData
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexCount, format} = indexBuffer
		const {gpuDevice, antialiasingManager} = this.#redGPUContext

		const physicsParams = {
			earthRadius: this.#earthRadius,
			atmosphereHeight: this.#atmosphereHeight,
			mieScattering: this.#mieScattering,
			mieExtinction: this.#mieExtinction,
			rayleighScattering: this.#rayleighScattering,
			sunDirection: this.#sunDirection,
			mieAnisotropy: this.#mieAnisotropy,
			rayleighScaleHeight: this.#rayleighScaleHeight,
			mieScaleHeight: this.#mieScaleHeight,
			cameraHeight: 0.2, // 임시 고정
			ozoneAbsorption: this.#ozoneAbsorption
		};

		if (this.#dirtyLUT) {
			this.#transmittanceGenerator.render(physicsParams);
			this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture, physicsParams);
			this.#dirtyLUT = false;
			this.#dirtySkyView = true;
		}

		if (this.#dirtySkyView) {
			this.#skyViewGenerator.render(
				this.#transmittanceGenerator.lutTexture,
				this.#multiScatteringGenerator.lutTexture,
				physicsParams
			);
			this.#dirtySkyView = false;
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
