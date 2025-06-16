import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ResourceManager from "../../resources/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import PassLightClustersBoundSource from "./PassClusterLightBound.wgsl";
import PassClustersLightHelper from "./PassClustersLightHelper";

class PassClusterLightBound {
	#view: View3D
	#clusterBoundBuffer: GPUBuffer
	#clusterBoundBindGroupLayout: GPUBindGroupLayout
	#clusterBoundBindGroup: GPUBindGroup
	#clusterBoundPipeline: GPUComputePipeline
	readonly #redGPUContext: RedGPUContext

	constructor(redGPUContext: RedGPUContext, view: View3D) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
		this.#view = view;
		this.#initPipeLine();
	}

	get clusterBoundBuffer(): GPUBuffer {
		return this.#clusterBoundBuffer;
	}

	render() {
		const sysUniformBindGroup = this.#view.systemUniform_Vertex_UniformBindGroup;
		if (sysUniformBindGroup) {
			const {gpuDevice} = this.#redGPUContext
			const commandEncoder = gpuDevice.createCommandEncoder();
			const passEncoder = commandEncoder.beginComputePass({
				label: 'Bound cluster'
			});
			const DISPATCH_SIZE = PassClustersLightHelper.getDispatchSize();
			passEncoder.setPipeline(this.#clusterBoundPipeline);
			passEncoder.setBindGroup(0, sysUniformBindGroup);
			passEncoder.setBindGroup(1, this.#clusterBoundBindGroup);
			passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
			passEncoder.end();
			gpuDevice.queue.submit([commandEncoder.finish()]);
		}
	}

	#initPipeLine() {
		const {gpuDevice, resourceManager} = this.#redGPUContext;
		const source = parseWGSL(PassLightClustersBoundSource).shaderSource;
		this.#clusterBoundBuffer = gpuDevice.createBuffer({
			size: PassClustersLightHelper.getTotalTileSize() * 32, // Cluster x, y, z size * 32 bytes per cluster. Why? It's to be verified.
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		this.#clusterBoundBindGroupLayout = gpuDevice.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {type: 'storage'}
				}
			]
		});
		this.#clusterBoundBindGroup = gpuDevice.createBindGroup({
			label: 'clusterBoundBindGroup',
			layout: this.#clusterBoundBindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#clusterBoundBuffer,
					}
				}
			],
		});
		this.#clusterBoundPipeline = gpuDevice.createComputePipeline({
			label: 'clusterBoundPipeline',
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [
					resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
					this.#clusterBoundBindGroupLayout,
				]
			}),
			compute: {
				module: gpuDevice.createShaderModule({
					code: source,
					label: "Cluster Bounds"
				}),
				entryPoint: 'main',
			}
		});
	}
}

export default PassClusterLightBound;
