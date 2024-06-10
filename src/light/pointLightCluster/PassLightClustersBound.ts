import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import View from "../../main/view/View";
import shaderDefineReplace from "../../systemShaderDefine/shaderDefineReplace";
import PassLightClustersBoundSource from "./PassLightClustersBound.wgsl";
import PassLightClustersHelper from "./PassLightClustersHelper";

class PassLightClustersBound extends RedGPUContextBase {
	#targetView: View
	#clusterBoundBuffer: GPUBuffer
	#clusterBoundBindGroupLayout: GPUBindGroupLayout
	#clusterBoundBindGroup: GPUBindGroup
	#clusterBoundPipeline: GPUComputePipeline

	constructor(redGPUContext: RedGPUContext, targetView: View) {
		super(redGPUContext);
		this.#targetView = targetView;
		this.#initPipeLine();
	}

	// Getter for clusterBoundBuffer
	get clusterBoundBuffer(): GPUBuffer {
		return this.#clusterBoundBuffer;
	}

	render(commandEncoder: GPUCommandEncoder, passEncoder: GPUComputePassEncoder) {
		const sysUniformBindGroup = this.#targetView.renderInfo_SystemUniformBindGroup;
		if (sysUniformBindGroup) {
			const DISPATCH_SIZE = PassLightClustersHelper.getDispatchSize();
			passEncoder.setPipeline(this.#clusterBoundPipeline);
			passEncoder.setBindGroup(0, sysUniformBindGroup);
			passEncoder.setBindGroup(1, this.#clusterBoundBindGroup);
			passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
		}
	}

	#initPipeLine() {
		const {gpuDevice} = this.redGPUContext;
		const source = shaderDefineReplace(PassLightClustersBoundSource);
		this.#clusterBoundBuffer = gpuDevice.createBuffer({
			size: PassLightClustersHelper.getTotalTileSize() * 32, // Cluster x, y, z size * 32 bytes per cluster. Why? It's to be verified.
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
					this.#targetView.systemUniformsBindGroupLayout,
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

export default PassLightClustersBound;
