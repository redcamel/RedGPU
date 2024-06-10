import RedGPUContext from "../../context/RedGPUContext";
import fragmentSource from './fragment.wgsl'
import vertexSource from './vertex.wgsl'

class Quad {
	#pipeline: GPURenderPipeline

	constructor(redGPUContext: RedGPUContext) {
		const {gpuDevice} = redGPUContext
		this.#pipeline = gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: gpuDevice.createShaderModule({
					code: vertexSource,
				}),
				entryPoint: 'main',
			},
			fragment: {
				module: gpuDevice.createShaderModule({
					code: fragmentSource,
				}),
				entryPoint: 'main',
				targets: [
					{
						format: navigator.gpu.getPreferredCanvasFormat(),
						blend: {
							color: {
								srcFactor: "src-alpha",
								dstFactor: "one-minus-src-alpha",
								operation: "add"
							},
							alpha: {
								srcFactor: "one",
								dstFactor: "one-minus-src-alpha",
								operation: "add"
							}
						}
					},
				],
			},
			multisample: {
				count: redGPUContext.useMultiSample ? 4 : 1
			},
			depthStencil: {
				depthWriteEnabled: false,
				depthCompare: 'less-equal',
				format: "depth24plus-stencil8",
			},
			primitive: {
				topology: 'triangle-list',
				cullMode: 'none',
				frontFace: "ccw"
			},
		});
	}

	render(passEncoder: GPURenderPassEncoder, gpuBuffer: GPUBuffer) {
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.draw(6, 1, 0, 0);
	}
}

export default Quad
