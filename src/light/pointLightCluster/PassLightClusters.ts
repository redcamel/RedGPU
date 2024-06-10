// Import necessary modules and classes
import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import View from "../../main/view/View";
import shaderDefineReplace from "../../systemShaderDefine/shaderDefineReplace";
import PassLightClustersSource from "./PassLightClusters.wgsl";
import PassLightClustersBound from "./PassLightClustersBound";
import PassLightClustersHelper from "./PassLightClustersHelper";
// Initialize empty array with 4 zeros
const emptyArray = new Uint32Array([0, 0, 0, 0]);

// Class for creating 3D clusters
class PassLightClusters extends RedGPUContextBase {
	#targetView: View
	#clusterLightBindGroup: GPUBindGroup
	#clusterLightPipeline: GPUComputePipeline
	#clusterLightsBuffer: GPUBuffer
	#passLightClustersBound: PassLightClustersBound

	// Constructor for initializing class instances
	constructor(redGPUContext: RedGPUContext, targetView: View) {
		super(redGPUContext);
		this.#targetView = targetView;
		this.#passLightClustersBound = targetView.passLightClustersBound;
		this.#initPipeLine();
		console.log('PassLightClusters', this);
	}

	// Getter method for clusterLightsBuffer
	get clusterLightsBuffer(): GPUBuffer {
		return this.#clusterLightsBuffer;
	}

	// Render method for computing pass encoder and command encoder
	render(
		commandEncoder: GPUCommandEncoder,
		passEncoder: GPUComputePassEncoder
	) {
		const systemUniformBindGroup: GPUBindGroup = this.#targetView.renderInfo_SystemUniformBindGroup;
		if (systemUniformBindGroup) {
			const DISPATCH_SIZE = PassLightClustersHelper.getDispatchSize();
			this.redGPUContext.gpuDevice.queue.writeBuffer(this.clusterLightsBuffer, 0, emptyArray);
			passEncoder.setPipeline(this.#clusterLightPipeline);
			passEncoder.setBindGroup(0, systemUniformBindGroup);
			passEncoder.setBindGroup(1, this.#clusterLightBindGroup);
			passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
		}
	}

	// Method for initializing pipeline
	#initPipeLine() {
		const {gpuDevice} = this.redGPUContext;
		const source = shaderDefineReplace(PassLightClustersSource);
		this.#clusterLightsBuffer = gpuDevice.createBuffer({
			size: PassLightClustersHelper.getClusterLightBufferSize(),
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		var clusterLightBindGroupLayout = gpuDevice.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {type: 'read-only-storage'}
				}
			]
		});
		this.#clusterLightBindGroup = gpuDevice.createBindGroup({
			label: 'clusterLightBindGroup',
			layout: clusterLightBindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#passLightClustersBound.clusterBoundBuffer
					}
				}
			]
		});
		this.#clusterLightPipeline = gpuDevice.createComputePipeline({
			label: 'clusterLightPipeline',
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [
					this.#targetView.systemUniformsBindGroupLayout,
					clusterLightBindGroupLayout
				]
			}),
			compute: {
				module: gpuDevice.createShaderModule({
					code: source,
					label: "Cluster Light"
				}),
				entryPoint: 'main'
			}
		});
	}
}

// Export the class as a default module
export default PassLightClusters;
