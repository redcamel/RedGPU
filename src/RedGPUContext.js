/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 20:37:20
 *
 */
"use strict";
import DetectorGPU from "./base/detect/DetectorGPU.js";
import Render from "./renderer/Render.js";
import ShareGLSL from "./base/ShareGLSL.js";
import StandardMaterial from "./material/StandardMaterial.js";
import ColorMaterial from "./material/ColorMaterial.js";
import ColorPhongMaterial from "./material/ColorPhongMaterial.js";
import ColorPhongTextureMaterial from "./material/ColorPhongTextureMaterial.js";
import EnvironmentMaterial from "./material/EnvironmentMaterial.js";
import BitmapMaterial from "./material/BitmapMaterial.js";
import GridMaterial from "./material/system/GridMaterial.js";
import SkyBoxMaterial from "./material/system/SkyBoxMaterial.js";
import PBRMaterial_System from "./material/system/PBRMaterial_System.js";
import Sphere from "./primitives/Sphere.js";
import Box from "./primitives/Box.js";
import Plane from "./primitives/Plane.js";


let redGPUContextList = new Set();
let setGlobalResizeEvent = function () {
	window.addEventListener('resize', _ => {
		for (const redGPUContext of redGPUContextList) redGPUContext.setSize()
	})
};
let glslangModule;
let glslang;
let checkGlslang = function () {
	let promise = new Promise(async (resolve) => {
		if (!glslang) {
			glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
			glslang = await glslangModule.default();
			glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex')
			glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment')
			resolve()
		} else {
			glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex')
			glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment')
			resolve()
		}
	});
	return promise
};
export default class RedGPUContext {
	static useDebugConsole = false;
	#width = 0;
	#height = 0;
	#detector;
	viewList = [];

	constructor(canvas, initFunc) {
		checkGlslang().then(_ => {
			console.log('glslang', glslang);
			console.log(this);
			this.#detector = new DetectorGPU(this);
			let state = true;
			if (navigator.gpu) {
				navigator.gpu.requestAdapter({powerPreference: "high-performance"})
					.then(adapter => {
						adapter.requestDevice({
							extensions: ["anisotropic-filtering"]
						})
							.then(device => {
								this.glslang = glslang;
								this.canvas = canvas;
								this.context = canvas.getContext('gpupresent');
								this.device = device;
								this.swapChainFormat = "rgba8unorm";
								this.swapChain = configureSwapChain(this.device, this.swapChainFormat, this.context);
								this.state = {
									Geometry: new Map(),
									Buffer: {
										vertexBuffer: new Map(),
										indexBuffer: new Map()
									},
									emptyTextureView: device.createTexture({
										size: {
											width: 1,
											height: 1,
											depth: 1,
										},
										format: this.swapChainFormat,
										usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
									}).createView(),
									emptyCubeTextureView: device.createTexture({
										size: {
											width: 1,
											height: 1,
											depth: 1,
										},
										dimension: '2d',
										arrayLayerCount: 6,
										mipLevelCount: 1,
										sampleCount: 1,
										format: this.swapChainFormat,
										usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
									}).createView({
										format: 'rgba8unorm',
										dimension: 'cube',
										aspect: 'all',
										baseMipLevel: 0,
										mipLevelCount: 1,
										baseArrayLayer: 0,
										arrayLayerCount: 6
									})
								};
								/////
								this['_mouseEventInfo'] = [];
								[this.#detector.click, this.#detector.move, this.#detector.down, this.#detector.up].forEach(v => {
									let tXkey, tYkey;
									tXkey = 'offsetX';
									tYkey = 'offsetY';
									let mouseX, mouseY;
									this.canvas.addEventListener(v, e => {
										e.preventDefault();
										if (this.#detector.isMobile) {
											if (e.changedTouches[0]) {
												Render.mouseEventInfo.push(
													{
														type: e.type,
														x: e.changedTouches[0].clientX,
														y: e.changedTouches[0].clientY,
														nativeEvent: e
													}
												);
												mouseX = e.changedTouches[0].clientX;
												mouseY = e.changedTouches[0].clientY
											}
										} else {
											Render.mouseEventInfo.push(
												{
													type: e.type,
													x: e[tXkey],
													y: e[tYkey],
													nativeEvent: e
												}
											);
											mouseX = e[tXkey];
											mouseY = e[tYkey];
										}
										this.viewList.forEach(redView => {
											redView.mouseX = mouseX - redView.viewRect[0];
											redView.mouseY = mouseY - redView.viewRect[1]
										});
									}, false)
								});
								/////
								this.#detector.detectGPU();
								///////
								this.setSize('100%', '100%');
								if (!redGPUContextList.size) setGlobalResizeEvent();
								////////////////////////////////////////////////////////
								new ColorPhongMaterial(this)
								new ColorMaterial(this)
								new GridMaterial(this)
								new SkyBoxMaterial(this)
								new StandardMaterial(this)
								new BitmapMaterial(this)
								new EnvironmentMaterial(this)
								new ColorPhongTextureMaterial(this)
								new Box(this)
								new Sphere(this)
								new Plane(this)
								// new PBRMaterial_System(this)
								////////////////////////////////////////////////////////
								redGPUContextList.add(this);
								initFunc.call(this, true)

							});
					}).catch(error => {
					state = false;
					initFunc(false, error)
				});
			} else {
				initFunc(state = false, 'navigate.gpu is null')
			}
		})
	}

	addView(redView) {
		this.viewList.push(redView)
	}

	removeView(redView) {
		if (this.viewList.includes(redView)) this.viewList.splice(redView, 1)
	}

	get detector() {
		return this.#detector
	};

	setSize(w = this.#width, h = this.#height) {
		this.#width = w;
		this.#height = h;
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
		this.viewList.forEach(redView => {
			redView.setSize();
			redView.setLocation()
		});
		requestAnimationFrame(_ => {
			const swapChainTexture = this.swapChain.getCurrentTexture();
			const commandEncoder = this.device.createCommandEncoder();
			const textureView = swapChainTexture.createView();
			const passEncoder = commandEncoder.beginRenderPass({
				colorAttachments: [
					{
						attachment: textureView,
						loadValue: {r: 0, g: 0, b: 0.0, a: 0.0}
					}
				]
			});
			if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${w},${h} / result : ${tW}, ${tH}`);
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
		usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC
	};
	if (RedGPUContext.useDebugConsole) console.log('swapChainDescriptor', swapChainDescriptor);
	return context.configureSwapChain(swapChainDescriptor);
}