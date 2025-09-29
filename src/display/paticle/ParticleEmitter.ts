import RedGPUContext from "../../context/RedGPUContext";
import BitmapMaterial from "../../material/bitmapMaterial/BitmapMaterial";
import Plane from "../../primitive/Plane";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import DefineForVertex from "../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import Mesh from "../mesh/Mesh";
import PARTICLE_EASE from "./PARTICLE_EASE";
import computeModuleSource from "./shader/compute.wgsl";
import vertexModuleSource from "./shader/particleVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_PARTICLE_EMITTER'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

interface ParticleEmitter {
	useBillboard: boolean;
}
/**
 * @category Particle
 */
class ParticleEmitter extends Mesh {
	#minLife: number = 1000
	#maxLife: number = 5000
	//
	#minStartX: number = 0
	#minStartY: number = 0
	#minStartZ: number = 0
	//
	#maxStartX: number = 0
	#maxStartY: number = 0
	#maxStartZ: number = 0
	//
	#minEndX: number = -5
	#minEndY: number = -5
	#minEndZ: number = -5
	//
	#maxEndX: number = 5
	#maxEndY: number = 5
	#maxEndZ: number = 5
	//
	#minStartAlpha: number = 1
	#maxStartAlpha: number = 1
	#minEndAlpha: number = 1
	#maxEndAlpha: number = 1
	//
	#minStartScale: number = 0
	#maxStartScale: number = 1
	#minEndScale: number = 0
	#maxEndScale: number = 0
	//
	#minStartRotationX: number = -360
	#minStartRotationY: number = -360
	#minStartRotationZ: number = -360
	#maxStartRotationX: number = 360
	#maxStartRotationY: number = 360
	#maxStartRotationZ: number = 360
	#minEndRotationX: number = -360
	#minEndRotationY: number = -360
	#minEndRotationZ: number = -360
	#maxEndRotationX: number = 360
	#maxEndRotationY: number = 360
	#maxEndRotationZ: number = 360
	//
	#easeX: number = PARTICLE_EASE.CubicOut
	#easeY: number = PARTICLE_EASE.CubicOut
	#easeZ: number = PARTICLE_EASE.CubicOut
	#easeAlpha: number = PARTICLE_EASE.Linear
	#easeScale: number = PARTICLE_EASE.Linear
	#easeRotationX: number = PARTICLE_EASE.CubicOut
	#easeRotationY: number = PARTICLE_EASE.CubicOut
	#easeRotationZ: number = PARTICLE_EASE.CubicOut
	//
	#simParamBuffer: GPUBuffer
	#particleBuffers: GPUBuffer[]
	#simParamData: Float32Array
	#computePipeline: GPUComputePipeline
	#computeBindGroup: GPUBindGroup
	#particleNum: number = 2000

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		// this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		// this.geometry = new Box(redGPUContext)
		// this.geometry = new Sphere(redGPUContext,)
		this.geometry = new Plane(redGPUContext)
		// this.primitiveState.cullMode = GPU_CULL_MODE.NONE
		// this.geometry = new TorusKnot(redGPUContext)
		// this.material = new PhongMaterial(redGPUContext,)
		this.material = new BitmapMaterial(redGPUContext)
		// this.material = new ColorMaterial(redGPUContext,)
		this.ignoreFrustumCulling = true
		// this.material.transparent = true
		this.useBillboard = true
	}

	get vertexStateBuffers(): GPUVertexBufferLayout[] {
		{
			return [
				{
					// vertex buffer
					arrayStride: 8 * 4,
					stepMode: "vertex",
					attributes: [
						{
							// vertex positions
							shaderLocation: 0,
							offset: 0,
							format: 'float32x3',
						},
						{
							// vertex normal
							shaderLocation: 1,
							offset: 3 * 4,
							format: 'float32x3',
						},
						{
							// vertex uv
							shaderLocation: 2,
							offset: 6 * 4,
							format: 'float32x2'
						}
					],
				},
				{
					arrayStride: 12 * 4,
					stepMode: "instance",
					attributes: [
						{
							/* position*/
							shaderLocation: 3, offset: 4 * 4, format: 'float32x3'
						},
						{
							/* alpha*/
							shaderLocation: 4, offset: 7 * 4, format: 'float32'
						},
						{
							/* rotation*/
							shaderLocation: 5, offset: 8 * 4, format: 'float32x3'
						},
						{
							/* scale*/
							shaderLocation: 6, offset: 11 * 4, format: 'float32'
						},
					]
				},
			]
		}
	}

	get particleBuffers(): GPUBuffer[] {
		return this.#particleBuffers;
	}

	get particleNum(): number {
		return this.#particleNum;
	}

	set particleNum(value: number) {
		this.#particleNum = Math.max(Math.min(value, 500000), 1);
		if (!this.#simParamBuffer) this.#init()
		this.#setParticleData()
	}

	get minLife(): number {
		return this.#minLife;
	}

	set minLife(value: number) {
		this.#minLife = value;
	}

	get maxLife(): number {
		return this.#maxLife;
	}

	set maxLife(value: number) {
		this.#maxLife = value;
	}

	get minStartX(): number {
		return this.#minStartX;
	}

	set minStartX(value: number) {
		this.#minStartX = value;
	}

	get minStartY(): number {
		return this.#minStartY;
	}

	set minStartY(value: number) {
		this.#minStartY = value;
	}

	get minStartZ(): number {
		return this.#minStartZ;
	}

	set minStartZ(value: number) {
		this.#minStartZ = value;
	}

	get maxStartX(): number {
		return this.#maxStartX;
	}

	set maxStartX(value: number) {
		this.#maxStartX = value;
	}

	get maxStartY(): number {
		return this.#maxStartY;
	}

	set maxStartY(value: number) {
		this.#maxStartY = value;
	}

	get maxStartZ(): number {
		return this.#maxStartZ;
	}

	set maxStartZ(value: number) {
		this.#maxStartZ = value;
	}

	get minEndX(): number {
		return this.#minEndX;
	}

	set minEndX(value: number) {
		this.#minEndX = value;
	}

	get minEndY(): number {
		return this.#minEndY;
	}

	set minEndY(value: number) {
		this.#minEndY = value;
	}

	get minEndZ(): number {
		return this.#minEndZ;
	}

	set minEndZ(value: number) {
		this.#minEndZ = value;
	}

	get maxEndX(): number {
		return this.#maxEndX;
	}

	set maxEndX(value: number) {
		this.#maxEndX = value;
	}

	get maxEndY(): number {
		return this.#maxEndY;
	}

	set maxEndY(value: number) {
		this.#maxEndY = value;
	}

	get maxEndZ(): number {
		return this.#maxEndZ;
	}

	set maxEndZ(value: number) {
		this.#maxEndZ = value;
	}

	get minStartAlpha(): number {
		return this.#minStartAlpha;
	}

	set minStartAlpha(value: number) {
		this.#minStartAlpha = value;
	}

	get maxStartAlpha(): number {
		return this.#maxStartAlpha;
	}

	set maxStartAlpha(value: number) {
		this.#maxStartAlpha = value;
	}

	get minEndAlpha(): number {
		return this.#minEndAlpha;
	}

	set minEndAlpha(value: number) {
		this.#minEndAlpha = value;
	}

	get maxEndAlpha(): number {
		return this.#maxEndAlpha;
	}

	set maxEndAlpha(value: number) {
		this.#maxEndAlpha = value;
	}

	get minStartScale(): number {
		return this.#minStartScale;
	}

	set minStartScale(value: number) {
		this.#minStartScale = value;
	}

	get maxStartScale(): number {
		return this.#maxStartScale;
	}

	set maxStartScale(value: number) {
		this.#maxStartScale = value;
	}

	get minEndScale(): number {
		return this.#minEndScale;
	}

	set minEndScale(value: number) {
		this.#minEndScale = value;
	}

	get maxEndScale(): number {
		return this.#maxEndScale;
	}

	set maxEndScale(value: number) {
		this.#maxEndScale = value;
	}

	get minStartRotationX(): number {
		return this.#minStartRotationX;
	}

	set minStartRotationX(value: number) {
		this.#minStartRotationX = value;
	}

	get minStartRotationY(): number {
		return this.#minStartRotationY;
	}

	set minStartRotationY(value: number) {
		this.#minStartRotationY = value;
	}

	get minStartRotationZ(): number {
		return this.#minStartRotationZ;
	}

	set minStartRotationZ(value: number) {
		this.#minStartRotationZ = value;
	}

	get maxStartRotationX(): number {
		return this.#maxStartRotationX;
	}

	set maxStartRotationX(value: number) {
		this.#maxStartRotationX = value;
	}

	get maxStartRotationY(): number {
		return this.#maxStartRotationY;
	}

	set maxStartRotationY(value: number) {
		this.#maxStartRotationY = value;
	}

	get maxStartRotationZ(): number {
		return this.#maxStartRotationZ;
	}

	set maxStartRotationZ(value: number) {
		this.#maxStartRotationZ = value;
	}

	get minEndRotationX(): number {
		return this.#minEndRotationX;
	}

	set minEndRotationX(value: number) {
		this.#minEndRotationX = value;
	}

	get minEndRotationY(): number {
		return this.#minEndRotationY;
	}

	set minEndRotationY(value: number) {
		this.#minEndRotationY = value;
	}

	get minEndRotationZ(): number {
		return this.#minEndRotationZ;
	}

	set minEndRotationZ(value: number) {
		this.#minEndRotationZ = value;
	}

	get maxEndRotationX(): number {
		return this.#maxEndRotationX;
	}

	set maxEndRotationX(value: number) {
		this.#maxEndRotationX = value;
	}

	get maxEndRotationY(): number {
		return this.#maxEndRotationY;
	}

	set maxEndRotationY(value: number) {
		this.#maxEndRotationY = value;
	}

	get maxEndRotationZ(): number {
		return this.#maxEndRotationZ;
	}

	set maxEndRotationZ(value: number) {
		this.#maxEndRotationZ = value;
	}

	get easeX(): number {
		return this.#easeX;
	}

	set easeX(value: number) {
		this.#easeX = value;
	}

	get easeY(): number {
		return this.#easeY;
	}

	set easeY(value: number) {
		this.#easeY = value;
	}

	get easeZ(): number {
		return this.#easeZ;
	}

	set easeZ(value: number) {
		this.#easeZ = value;
	}

	get easeAlpha(): number {
		return this.#easeAlpha;
	}

	set easeAlpha(value: number) {
		this.#easeAlpha = value;
	}

	get easeScale(): number {
		return this.#easeScale;
	}

	set easeScale(value: number) {
		this.#easeScale = value;
	}

	get easeRotationX(): number {
		return this.#easeRotationX;
	}

	set easeRotationX(value: number) {
		this.#easeRotationX = value;
	}

	get easeRotationY(): number {
		return this.#easeRotationY;
	}

	set easeRotationY(value: number) {
		this.#easeRotationY = value;
	}

	get easeRotationZ(): number {
		return this.#easeRotationZ;
	}

	set easeRotationZ(value: number) {
		this.#easeRotationZ = value;
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}

	render(debugViewRenderState: RenderViewStateData) {
		if (!this.#simParamBuffer) this.#init()
		this.#renderComputePass(debugViewRenderState.timestamp)
		super.render(debugViewRenderState)
	}

	#setParticleData() {
		this.dirtyPipeline = true
		let redGPUContext = this.redGPUContext;
		const initialParticleData = new Float32Array(this.#particleNum * 12);
		const initialParticleInfoPosition = new Float32Array(this.#particleNum * 12);
		const initialParticleInfoRotation = new Float32Array(this.#particleNum * 12);
		const initialParticleInfoScale = new Float32Array(this.#particleNum * 4);
		const initialParticleInfoAlpha = new Float32Array(this.#particleNum * 4);
		const currentTime = performance.now();
		const worldPosition = this.localToWorld(this.x, this.y, this.z)
		for (let i = 0; i < this.#particleNum; ++i) {
			let life = Math.random() * this.#maxLife;
			let age = Math.random() * life;
			const startX = worldPosition[0] + Math.random() * (this.#maxStartX - this.#minStartX) + this.#minStartX
			const startY = worldPosition[1] + Math.random() * (this.#maxStartY - this.#minStartY) + this.#minStartY
			const startZ = worldPosition[2] + Math.random() * (this.#maxStartZ - this.#minStartZ) + this.#minStartZ
			const startRX = Math.random() * (this.#maxStartRotationX - this.#minStartRotationX) + this.#minStartRotationX
			const startRY = Math.random() * (this.#maxStartRotationY - this.#minStartRotationY) + this.#minStartRotationY
			const startRZ = Math.random() * (this.#maxStartRotationZ - this.#minStartRotationZ) + this.#minStartRotationZ
			const startScale = Math.random() * (this.#maxStartScale - this.#minStartScale) + this.#minStartScale
			const startAlpha = Math.random() * (this.#maxStartAlpha - this.#minStartAlpha) + this.#minStartAlpha
			initialParticleData[12 * i] = currentTime - age; // start time
			initialParticleData[12 * i + 1] = life; // life
			// position
			initialParticleData[12 * i + 4] = startX; // x
			initialParticleData[12 * i + 5] = startY; // y
			initialParticleData[12 * i + 6] = startZ; // z
			initialParticleData[12 * i + 7] = 0// alpha;
			// rotation
			initialParticleData[12 * i + 8] = startRX; // rotationX
			initialParticleData[12 * i + 9] = startRY;  // rotationY
			initialParticleData[12 * i + 10] = startRZ; // rotationZ
			initialParticleData[12 * i + 11] = 0 // scale
			// x
			initialParticleInfoPosition[4 * i] = startX; // startValue
			initialParticleInfoPosition[4 * i + 1] = Math.random() * (this.#maxEndX - this.#minEndX) + this.#minEndX; // endValue
			initialParticleInfoPosition[4 * i + 2] = this.#easeX; // #ease
			initialParticleInfoPosition[4 * i + 3] = worldPosition[0]; // startPosition
			// y
			initialParticleInfoPosition[4 * i + 4] = startY; // startValue
			initialParticleInfoPosition[4 * i + 5] = Math.random() * (this.#maxEndY - this.#minEndY) + this.#minEndY; // endValue
			initialParticleInfoPosition[4 * i + 6] = this.#easeY; // #ease
			initialParticleInfoPosition[4 * i + 7] = worldPosition[1]; // startPosition
			// z
			initialParticleInfoPosition[4 * i + 8] = startZ; // startValue
			initialParticleInfoPosition[4 * i + 9] = Math.random() * (this.#maxEndZ - this.#minEndZ) + this.#minEndZ; // endValue
			initialParticleInfoPosition[4 * i + 10] = this.#easeZ; // #ease
			initialParticleInfoPosition[4 * i + 11] = worldPosition[2]; // startPosition
			// rotationX
			initialParticleInfoRotation[4 * i] = startRX; // startValue
			initialParticleInfoRotation[4 * i + 1] = Math.random() * (this.#maxEndRotationX - this.#minEndRotationX) + this.#minEndRotationX; // endValue
			initialParticleInfoRotation[4 * i + 2] = this.#easeRotationX; // #ease
			initialParticleInfoRotation[4 * i + 3] = 0; //
			// rotationY
			initialParticleInfoRotation[4 * i + 4] = startRY; // startValue
			initialParticleInfoRotation[4 * i + 5] = Math.random() * (this.#maxEndRotationY - this.#minEndRotationY) + this.#minEndRotationY; // endValue
			initialParticleInfoRotation[4 * i + 6] = this.#easeRotationY; // #ease
			initialParticleInfoRotation[4 * i + 7] = 0; //
			// rotationZ
			initialParticleInfoRotation[4 * i + 8] = startRZ; // startValue
			initialParticleInfoRotation[4 * i + 9] = Math.random() * (this.#maxEndRotationZ - this.#minEndRotationZ) + this.#minEndRotationZ; // endValue
			initialParticleInfoRotation[4 * i + 10] = this.#easeRotationZ; // #ease
			initialParticleInfoRotation[4 * i + 11] = 0; //
			// scale
			initialParticleInfoScale[4 * i] = 0; // startValue
			initialParticleInfoScale[4 * i + 1] = Math.random() * (this.#maxEndScale - this.#minEndScale) + this.#minEndScale; // endValue
			initialParticleInfoScale[4 * i + 2] = this.#easeScale; // #ease
			initialParticleInfoScale[4 * i + 3] = 0; //
			// alpha
			initialParticleInfoAlpha[4 * i] = 0;
			initialParticleInfoAlpha[4 * i + 1] = Math.random() * (this.#maxEndAlpha - this.#minEndAlpha) + this.#minEndAlpha; // endValue
			initialParticleInfoAlpha[4 * i + 2] = this.#easeAlpha; // #ease
			initialParticleInfoAlpha[4 * i + 3] = 0; //
		}
		// console.log('initialParticleData', initialParticleData)
		const prevBuffer = this.#particleBuffers
		this.#particleBuffers = [];
		const dataList = [
			initialParticleData,
			initialParticleInfoPosition,
			initialParticleInfoRotation,
			initialParticleInfoScale,
			initialParticleInfoAlpha,
		]
		dataList.forEach((v, index) => {
			const t0 = redGPUContext.gpuDevice.createBuffer({
				size: v.byteLength,
				usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
			});
			redGPUContext.gpuDevice.queue.writeBuffer(t0, 0, v);
			this.#particleBuffers.push(t0)
			if (prevBuffer?.length) {
				copyGPUBuffer(redGPUContext.gpuDevice, prevBuffer[index], t0)
			}
		})
		if (prevBuffer) {
			prevBuffer.forEach(v => v.destroy())
		}
		//
		let computeSource = computeModuleSource;
		let shaderModuleDescriptor = {
			code: computeSource,
		};
		console.log('shaderModuleDescriptor', shaderModuleDescriptor);
		let computeModule = redGPUContext.resourceManager.createGPUShaderModule('PARTICLE_EMITTER_MODULE', shaderModuleDescriptor);
		const computeBindGroupLayoutEntries: any = [
			{
				binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {
					type: 'uniform',
				},
			},
		]
		const computeBindGroupEntries = [
			{
				binding: 0,
				resource: {
					buffer: this.#simParamBuffer,
					offset: 0,
					size: this.#simParamData.byteLength
				},
			},
		]
		dataList.forEach((v, index) => {
			computeBindGroupLayoutEntries.push({
				binding: index + 1, visibility: GPUShaderStage.COMPUTE, buffer: {
					type: 'storage',
				}
			})
			computeBindGroupEntries.push({
				binding: index + 1,
				resource: {
					buffer: this.#particleBuffers[index],
					offset: 0,
					size: v.byteLength,
				},
			})
		})
		const computeBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
			entries: computeBindGroupLayoutEntries
		});
		const computePipelineLayout = redGPUContext.gpuDevice.createPipelineLayout({
			bindGroupLayouts: [computeBindGroupLayout],
		});
		this.#computeBindGroup = redGPUContext.gpuDevice.createBindGroup({
			layout: computeBindGroupLayout,
			entries: computeBindGroupEntries
		});
		this.#computePipeline = redGPUContext.gpuDevice.createComputePipeline({
			label: 'PARTICLE_EMITTER_PIPELINE',
			layout: computePipelineLayout,
			compute: {
				module: computeModule,
				entryPoint: "main"
			},
		});
	}

	#init() {
		this.#simParamData = new Float32Array(46);
		let bufferDescriptor = {
			size: this.#simParamData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		};
		const {gpuDevice} = this.redGPUContext
		this.#simParamBuffer = gpuDevice.createBuffer(bufferDescriptor);
		gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData);
		this.#setParticleData()
		console.log('\t\tthis.depthStencilState', this.depthStencilState)
		this.depthStencilState.depthWriteEnabled = false
	}

	#renderComputePass(time: number) {
		const worldPosition = this.localToWorld(this.x, this.y, this.z)
		this.#simParamData.set(
			[
				// startTime time
				time,
				// position
				...worldPosition,
				// lifeRange
				this.#minLife, this.#maxLife,
				// x,y,z Range
				this.#minStartX, this.#maxStartX, this.#minEndX, this.#maxEndX, this.#easeX,
				this.#minStartY, this.#maxStartY, this.#minEndY, this.#maxEndY, this.#easeY,
				this.#minStartZ, this.#maxStartZ, this.#minEndZ, this.#maxEndZ, this.#easeZ,
				// alphaRange
				this.#minStartAlpha, this.#maxStartAlpha, this.#minEndAlpha, this.#maxEndAlpha, this.#easeAlpha,
				// scaleRange
				this.#minStartScale, this.#maxStartScale, this.#minEndScale, this.#maxEndScale, this.#easeScale,
				// x,y,z Range
				this.#minStartRotationX, this.#maxStartRotationX, this.#minEndRotationX, this.#maxEndRotationX, this.#easeRotationX,
				this.#minStartRotationY, this.#maxStartRotationY, this.#minEndRotationY, this.#maxEndRotationY, this.#easeRotationY,
				this.#minStartRotationZ, this.#maxStartRotationZ, this.#minEndRotationZ, this.#maxEndRotationZ, this.#easeRotationZ
			],
			0
		);
		//
		const {gpuDevice} = this.redGPUContext
		gpuDevice.queue.writeBuffer(this.#simParamBuffer, 0, this.#simParamData);
		//
		const commandEncoder = gpuDevice.createCommandEncoder({});
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#computePipeline);
		passEncoder.setBindGroup(0, this.#computeBindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.#particleNum / 256));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		console.log('renderComputePass')
	}
}

Object.defineProperty(ParticleEmitter.prototype, 'meshType', {
	value: 'particle',
	writable: false
});
DefineForVertex.defineByPreset(ParticleEmitter, [
	DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
]);
DefineForVertex.definePositiveNumber(ParticleEmitter, [])
//
Object.freeze(ParticleEmitter)
export default ParticleEmitter
