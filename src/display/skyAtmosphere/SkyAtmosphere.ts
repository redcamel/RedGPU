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
import {PerspectiveCamera} from "../../camera";

const SHADER_INFO = parseWGSL(vertexModuleSource)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKY_ATMOSPHERE'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKY_ATMOSPHERE'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKY_ATMOSPHERE'

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

	#earthRadius: number = 6360.0;
	#atmosphereHeight: number = 60.0;
	#mieScattering: number = 0.021;
	#mieExtinction: number = 0.021;
	#rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];

	#rayleighScaleHeight: number = 8.0;
	#mieScaleHeight: number = 1.2;
	#mieAnisotropy: number = 0.9;
	#ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];
	#ozoneLayerCenter: number = 25.0;
	#ozoneLayerWidth: number = 15.0;
	#multiScatteringAmbient: number = 0.05;

	#sunSize: number = 0.5;
	#sunIntensity: number = 22.0;
	#exposure: number = 1.0;

	#heightFogDensity: number = 0.0;
	#heightFogFalloff: number = 0.1;

	#sunElevation: number = 45;
	#sunAzimuth: number = 0;

	#dirtyLUT: boolean = true;
	#dirtySkyView: boolean = true;

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

		this.#material.transmittanceTexture = this.#transmittanceGenerator.lutTexture
		this.#material.multiScatteringTexture = this.#multiScatteringGenerator.lutTexture
		this.#material.skyViewTexture = this.#skyViewGenerator.lutTexture

		this.#syncInitialParams();
		this.#updateSunDirection();
	}

	#syncInitialParams(): void {
		// 모든 자식 인스턴스의 파라미터를 현재 필드값으로 초기화
		this.earthRadius = this.#earthRadius;
		this.atmosphereHeight = this.#atmosphereHeight;
		this.mieScattering = this.#mieScattering;
		this.mieExtinction = this.#mieExtinction;
		this.rayleighScattering = this.#rayleighScattering;
		this.rayleighScaleHeight = this.#rayleighScaleHeight;
		this.mieScaleHeight = this.#mieScaleHeight;
		this.mieAnisotropy = this.#mieAnisotropy;
		this.ozoneAbsorption = this.#ozoneAbsorption;
		this.ozoneLayerCenter = this.#ozoneLayerCenter;
		this.ozoneLayerWidth = this.#ozoneLayerWidth;
		this.multiScatteringAmbient = this.#multiScatteringAmbient;
		this.sunSize = this.#sunSize;
		this.sunIntensity = this.#sunIntensity;
		this.exposure = this.#exposure;
		this.heightFogDensity = this.#heightFogDensity;
		this.heightFogFalloff = this.#heightFogFalloff;
	}

	get heightFogDensity(): number { return this.#heightFogDensity; }
	set heightFogDensity(v: number) {
		validatePositiveNumberRange(v, 0, 10);
		this.#heightFogDensity = v;
		this.#material.heightFogDensity = v;
	}

	get heightFogFalloff(): number { return this.#heightFogFalloff; }
	set heightFogFalloff(v: number) {
		validatePositiveNumberRange(v, 0.001, 10);
		this.#heightFogFalloff = v;
		this.#material.heightFogFalloff = v;
	}

	get earthRadius(): number { return this.#earthRadius; }
	set earthRadius(v: number) {
		validatePositiveNumberRange(v, 1);
		this.#earthRadius = v;
		this.#material.earthRadius = v;
		this.#transmittanceGenerator.earthRadius = v;
		this.#multiScatteringGenerator.earthRadius = v;
		this.#skyViewGenerator.earthRadius = v;
		this.#dirtyLUT = true;
		this.#dirtySkyView = true;
	}

	get atmosphereHeight(): number { return this.#atmosphereHeight; }
	set atmosphereHeight(v: number) {
		validatePositiveNumberRange(v, 1);
		this.#atmosphereHeight = v;
		this.#material.atmosphereHeight = v;
		this.#transmittanceGenerator.atmosphereHeight = v;
		this.#multiScatteringGenerator.atmosphereHeight = v;
		this.#skyViewGenerator.atmosphereHeight = v;
		this.#dirtyLUT = true;
	}

	get mieScattering(): number { return this.#mieScattering; }
	set mieScattering(v: number) {
		validatePositiveNumberRange(v, 0, 1.0);
		this.#mieScattering = v;
		this.#material.mieScattering = v;
		this.#multiScatteringGenerator.mieScattering = v;
		this.#skyViewGenerator.mieScattering = v;
		this.#dirtyLUT = true;
	}

	get mieExtinction(): number { return this.#mieExtinction; }
	set mieExtinction(v: number) {
		validatePositiveNumberRange(v, 0, 1.0);
		this.#mieExtinction = v;
		this.#transmittanceGenerator.mieExtinction = v;
		this.#multiScatteringGenerator.mieExtinction = v;
		this.#skyViewGenerator.mieExtinction = v;
		this.#dirtyLUT = true;
	}

	get rayleighScattering(): [number, number, number] { return this.#rayleighScattering; }
	set rayleighScattering(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0, 1.0));
		this.#rayleighScattering = v;
		const vCopy = [...v] as [number, number, number];
		this.#transmittanceGenerator.rayleighScattering = vCopy;
		this.#multiScatteringGenerator.rayleighScattering = vCopy;
		this.#skyViewGenerator.rayleighScattering = vCopy;
		this.#dirtyLUT = true;
	}

	get rayleighScaleHeight(): number { return this.#rayleighScaleHeight; }
	set rayleighScaleHeight(v: number) {
		validatePositiveNumberRange(v, 0.1, 100);
		this.#rayleighScaleHeight = v;
		this.#transmittanceGenerator.rayleighScaleHeight = v;
		this.#multiScatteringGenerator.rayleighScaleHeight = v;
		this.#skyViewGenerator.rayleighScaleHeight = v;
		this.#dirtyLUT = true;
	}

	get mieScaleHeight(): number { return this.#mieScaleHeight; }
	set mieScaleHeight(v: number) {
		validatePositiveNumberRange(v, 0.1, 100);
		this.#mieScaleHeight = v;
		this.#transmittanceGenerator.mieScaleHeight = v;
		this.#multiScatteringGenerator.mieScaleHeight = v;
		this.#skyViewGenerator.mieScaleHeight = v;
		this.#dirtyLUT = true;
	}

	get mieAnisotropy(): number { return this.#mieAnisotropy; }
	set mieAnisotropy(v: number) {
		validateNumberRange(v, 0, 0.999);
		this.#mieAnisotropy = v;
		this.#multiScatteringGenerator.mieAnisotropy = v;
		this.#skyViewGenerator.mieAnisotropy = v;
		this.#dirtyLUT = true;
	}

	get ozoneAbsorption(): [number, number, number] { return this.#ozoneAbsorption; }
	set ozoneAbsorption(v: [number, number, number]) {
		v.forEach(val => validatePositiveNumberRange(val, 0, 1.0));
		this.#ozoneAbsorption = v;
		const vCopy = [...v] as [number, number, number];
		this.#transmittanceGenerator.ozoneAbsorption = vCopy;
		this.#skyViewGenerator.ozoneAbsorption = vCopy;
		this.#dirtyLUT = true;
	}

	get ozoneLayerCenter(): number { return this.#ozoneLayerCenter; }
	set ozoneLayerCenter(v: number) {
		validatePositiveNumberRange(v, 0, 100);
		this.#ozoneLayerCenter = v;
		this.#transmittanceGenerator.ozoneLayerCenter = v;
		this.#skyViewGenerator.ozoneLayerCenter = v;
		this.#dirtyLUT = true;
	}

	get ozoneLayerWidth(): number { return this.#ozoneLayerWidth; }
	set ozoneLayerWidth(v: number) {
		validatePositiveNumberRange(v, 1, 50);
		this.#ozoneLayerWidth = v;
		this.#transmittanceGenerator.ozoneLayerWidth = v;
		this.#skyViewGenerator.ozoneLayerWidth = v;
		this.#dirtyLUT = true;
	}

	get multiScatteringAmbient(): number { return this.#multiScatteringAmbient; }
	set multiScatteringAmbient(v: number) {
		validatePositiveNumberRange(v, 0, 1.0);
		this.#multiScatteringAmbient = v;
		this.#skyViewGenerator.multiScatteringAmbient = v;
		this.#dirtySkyView = true;
	}

	get sunSize(): number { return this.#sunSize; }
	set sunSize(v: number) { 
		validatePositiveNumberRange(v, 0.01, 10.0); 
		this.#sunSize = v; 
		this.#material.sunSize = v; 
	}

	get sunIntensity(): number { return this.#sunIntensity; }
	set sunIntensity(v: number) { 
		validatePositiveNumberRange(v, 0, 10000); 
		this.#sunIntensity = v; 
		this.#material.sunIntensity = v; 
	}

	get exposure(): number { return this.#exposure; }
	set exposure(v: number) { 
		validatePositiveNumberRange(v, 0, 100); 
		this.#exposure = v; 
		this.#material.exposure = v; 
	}

	get sunElevation(): number { return this.#sunElevation; }
	set sunElevation(v: number) { validateNumberRange(v, -90, 90); this.#sunElevation = v; this.#updateSunDirection(); }

	get sunAzimuth(): number { return this.#sunAzimuth; }
	set sunAzimuth(v: number) { validateNumberRange(v, -360, 360); this.#sunAzimuth = v; this.#updateSunDirection(); }

	get sunDirection(): Float32Array { return this.#sunDirection; }

	#updateSunDirection(): void {
		const phi = (90 - this.#sunElevation) * (Math.PI / 180);
		const theta = (this.#sunAzimuth) * (Math.PI / 180);
		const dx = Math.sin(phi) * Math.cos(theta);
		const dy = Math.cos(phi);
		const dz = Math.sin(phi) * Math.sin(theta);
		
		this.#sunDirection[0] = dx;
		this.#sunDirection[1] = dy;
		this.#sunDirection[2] = dz;
		
		this.#material.sunDirection = this.#sunDirection;
		this.#skyViewGenerator.sunDirection = [dx, dy, dz];
		this.#dirtySkyView = true;
	}

	render(renderViewStateData: RenderViewStateData): void {
		const {currentRenderPassEncoder, view} = renderViewStateData
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexCount, format} = indexBuffer
		const {gpuDevice} = this.#redGPUContext

		const rawCamera = view.rawCamera as PerspectiveCamera;
		const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
		const currentHeightKm = Math.max(0.001, cameraPos[1] / 1000.0);

		// 카메라 높이가 변하면 스카이뷰 제너레이터 속성도 갱신
		if (Math.abs(this.#material.cameraHeight - currentHeightKm) > 0.001) {
			this.#material.cameraHeight = currentHeightKm;
			this.#skyViewGenerator.cameraHeight = currentHeightKm;
			this.#dirtySkyView = true;
		}

		if (this.#dirtyLUT) {
			this.#transmittanceGenerator.render();
			this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture);
			this.#dirtyLUT = false;
			this.#dirtySkyView = true;
		}

		if (this.#dirtySkyView) {
			this.#skyViewGenerator.render(
				this.#transmittanceGenerator.lutTexture,
				this.#multiScatteringGenerator.lutTexture
			);
			this.#dirtySkyView = false;
		}

		this.#updateMSAAStatus();
		if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, cameraPos);
		mat4.scale(this.modelMatrix, this.modelMatrix, [1000000, 1000000, 1000000]);

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

	get transmittanceTexture() { return this.#transmittanceGenerator.lutTexture; }
	get multiScatteringTexture() { return this.#multiScatteringGenerator.lutTexture; }
	get skyViewTexture() { return this.#skyViewGenerator.lutTexture; }
}

Object.freeze(SkyAtmosphere)
export default SkyAtmosphere
