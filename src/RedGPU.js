"use strict";
let redGPUList = new Set();
let setGlobalResizeEvent = function () {
	window.addEventListener('resize', _ => {
		for (const redGPU of redGPUList) redGPU.setSize()
	})
};
export default class RedGPU {
	#width = 0;
	#height = 0;
	scene;
	#makeSystemUniformInfo = function (device) {
		let uniformBufferSize = 4 * 4 * Float32Array.BYTES_PER_ELEMENT * 2;
		const uniformBufferDescriptor = {
			size: uniformBufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			redStruct: [
				{offset: 0, valueName: 'projectionMatrix'}
			]
		};
		const bindGroupLayoutDescriptor = {
			bindings: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX,
					type: "uniform-buffer"
				}
			]
		};
		let uniformBuffer, uniformBindGroupLayout;
		const bindGroupDescriptor = {
			layout: uniformBindGroupLayout = device.createBindGroupLayout(bindGroupLayoutDescriptor),
			bindings: [
				{
					binding: 0,
					resource: {
						buffer: uniformBuffer = device.createBuffer(uniformBufferDescriptor),
						offset: 0,
						size: uniformBufferSize
					}
				}
			]
		};
		let uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
		let projectionMatrix = mat4.create();
		return {
			GPUBuffer: uniformBuffer,
			GPUBindGroupLayout: uniformBindGroupLayout,
			GPUBindGroup: uniformBindGroup,
			data: {
				projectionMatrix: projectionMatrix
			}
		}

	};

	updateSystemUniform(passEncoder) {
		passEncoder.setBindGroup(0, this.systemUniformInfo.GPUBindGroup);
		this.systemUniformInfo.GPUBuffer.setSubData(0, this.systemUniformInfo.data.projectionMatrix);
		this.systemUniformInfo.GPUBuffer.setSubData(4 * 4 * Float32Array.BYTES_PER_ELEMENT, this.camera ? this.camera.matrix : mat4.create());
	}

	constructor(canvas, glslang) {
		navigator.gpu.requestAdapter().then(adapter => {
			adapter.requestDevice().then(device => {
				this.glslang = glslang;
				this.canvas = canvas;
				this.context = canvas.getContext('gpupresent');
				this.device = device;
				this.swapChainFormat = "bgra8unorm";
				this.swapChain = configureSwapChain(this.device, this.swapChainFormat, this.context);
				this.systemUniformInfo = this.#makeSystemUniformInfo(device);
				this.state = {
					RedGeometry: new Map(),
					RedBuffer: {
						vertexBuffer: new Map(),
						indexBuffer: new Map()
					},
					emptyTextureView: device.createTexture({
						size: {
							width: 1,
							height: 1,
							depth: 1,
						},
						format: "rgba8unorm",
						usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
					}).createView()
				};
				/////
				this.depthTexture = device.createTexture({
					size: {
						width: canvas.width,
						height: canvas.height,
						depth: 1
					},
					format: "depth24plus-stencil8",
					usage: GPUTextureUsage.OUTPUT_ATTACHMENT
				});
				this.depthTextureView = this.depthTexture.createView();
				///////
				this.setSize('100%', '100%');
				if (!redGPUList.size) setGlobalResizeEvent();
				redGPUList.add(this);
				console.log(redGPUList)
			});
		}).catch(error => {
			alert(`WebGPU is unsupported, or no adapters or devices are available.`)
		});

	}

	setSize(w = this.#width, h = this.#height) {
		console.log('setSize!!!!!!!!!!!!!!!!!!!!!!');
		this.#width = w;
		this.#height = h;
		console.log(w, h);
		let tW, tH;
		let rect = document.body.getBoundingClientRect();
		if (typeof w != 'number' && w.includes('%')) tW = parseInt(+rect.width * w.replace('%', '') / 100);
		else tW = w;
		if (typeof h != 'number' && h.includes('%')) tH = parseInt(+rect.height * h.replace('%', '') / 100);
		else tH = h;
		this.canvas.width = tW;
		this.canvas.height = tH;
		this.canvas.style.width = tW + 'px';
		this.canvas.style.height = tH + 'px';

		this.depthTexture = this.device.createTexture({
			size: {
				width: tW,
				height: tH,
				depth: 1
			},
			format: "depth24plus-stencil8",
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT
		});
		this.depthTextureView = this.depthTexture.createView();

		let aspect = Math.abs(this.canvas.width / this.canvas.height);
		mat4.perspective(this.systemUniformInfo.data.projectionMatrix, (Math.PI / 180) * 60, aspect, 0.01, 10000.0);
		requestAnimationFrame(_ => {
			const swapChainTexture = this.swapChain.getCurrentTexture();
			const commandEncoder = this.device.createCommandEncoder();
			const textureView = swapChainTexture.createView();
			console.log('textureView', textureView);
			const passEncoder = commandEncoder.beginRenderPass({
				colorAttachments: [{
					attachment: textureView,
					loadValue: {r: 0, g: 0, b: 0.0, a: 0.0}
				}]
			});
			console.log(`setSize - input : ${w},${h} / result : ${tW}, ${tH}`);
			passEncoder.setViewport(0, 0, tW, tH, 0, 1);
			passEncoder.setScissorRect(0, 0, tW, tH);
			passEncoder.endPass();
			const test = commandEncoder.finish();
			this.device.defaultQueue.submit([test]);
		});
	}

}

function configureSwapChain(device, swapChainFormat, context) {
	const swapChainDescriptor = {
		device: device,
		format: swapChainFormat,
	};
	console.log('swapChainDescriptor', swapChainDescriptor);
	return context.configureSwapChain(swapChainDescriptor);
}