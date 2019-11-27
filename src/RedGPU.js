/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";
import RedDetectorGPU from "./base/detect/RedDetectorGPU.js";

let redGPUList = new Set();
let setGlobalResizeEvent = function () {
	window.addEventListener('resize', _ => {
		for (const redGPU of redGPUList) redGPU.setSize()
	})
};
export default class RedGPU {
	#width = 0;
	#height = 0;
	#detector;
	view;

	constructor(canvas, glslang, initFunc) {
		this.#detector = new RedDetectorGPU(this)
		navigator.gpu.requestAdapter().then(adapter => {
			adapter.requestDevice().then(device => {
				this.glslang = glslang;
				this.canvas = canvas;
				this.context = canvas.getContext('gpupresent');
				this.device = device;
				this.swapChainFormat = "bgra8unorm";
				this.swapChain = configureSwapChain(this.device, this.swapChainFormat, this.context);
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
						format: "bgra8unorm",
						usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
					}).createView()
				};
				/////
				this.#detector.detectGPU()
				///////
				this.setSize('100%', '100%');
				if (!redGPUList.size) setGlobalResizeEvent();
				redGPUList.add(this);
				console.log(redGPUList);
				initFunc.call(this)
			});
		}).catch(error => {
			alert(`WebGPU is unsupported, or no adapters or devices are available.`)
		});

	}
	get detector() {return this.#detector};
	setSize(w = this.#width, h = this.#height) {
		this.#width = w;
		this.#height = h;
		console.log('setSize!!!!!!!!!!!!!!!!!!!!!!');
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
			sampleCount: 4,
			format: "depth24plus-stencil8",
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT
		});
		this.depthTextureView = this.depthTexture.createView();
		this.baseTexture = this.device.createTexture({
			size: {
				width: tW,
				height: tH,
				depth: 1
			},
			sampleCount: 4,
			format: this.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT
		});
		this.baseTextureView = this.baseTexture.createView();
		console.log(this.baseTexture);

		if (this.view) {
			this.view.setSize();
			this.view.setLocation()
		}

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