/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.19 18:10:39
 *
 */

"use strict";
import RedUTIL from "./util/RedUTIL.js"
import RedTypeSize from "./resources/RedTypeSize.js";
import RedShareGLSL from "./base/RedShareGLSL.js"
import RedPostEffect from "./postEffect/RedPostEffect.js";
import RedGPUContext from "./RedGPUContext.js";
import RedUUID from "./base/RedUUID.js";

export default class RedView extends RedUUID{
	get viewRect() {
		return this.#viewRect;
	}
	#redGPUContext;
	#scene;
	#camera;
	_x = 0;
	_y = 0;
	#width = '100%';
	#height = '100%';
	#viewRect = [];
	systemUniformInfo_vertex;
	systemUniformInfo_fragment;
	projectionMatrix;
	//
	baseAttachment;
	baseAttachmentView;
	baseResolveTarget;
	baseResolveTargetView;
	baseAttachment_mouseColorID
	baseAttachment_mouseColorIDView
	baseAttachment_mouseColorID_ResolveTarget
	baseAttachment_mouseColorID_ResolveTargetView
	baseDepthStencilAttachment;
	baseDepthStencilAttachmentView;
	//
	#systemUniformInfo_vertex_data;
	#systemUniformInfo_fragment_data;
	#postEffect;
	//
	mouseX = 0;
	mouseY = 0;

	constructor(redGPUContext, scene, camera) {
		super()
		this.#redGPUContext = redGPUContext;
		this.camera = camera;
		this.scene = scene;
		this.systemUniformInfo_vertex = this.#makeSystemUniformInfo_vertex(redGPUContext.device);
		this.systemUniformInfo_fragment = this.#makeSystemUniformInfo_fragment(redGPUContext.device);
		this.projectionMatrix = mat4.create();
		this.#postEffect = new RedPostEffect(redGPUContext);

	}

	#makeSystemUniformInfo_vertex = function (device) {
		let uniformBufferSize =
			RedTypeSize.mat4 + // projectionMatrix
			RedTypeSize.mat4 +  // camera
			RedTypeSize.float // time
		;
		const uniformBufferDescriptor = {
			size: uniformBufferSize,
			usage: globalThis.GPUBufferUsage.UNIFORM | globalThis.GPUBufferUsage.COPY_DST,
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
		let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
		this.#systemUniformInfo_vertex_data = new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT);
		bindGroupDescriptor = {
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
		uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
		return {
			GPUBuffer: uniformBuffer,
			GPUBindGroupLayout: uniformBindGroupLayout,
			GPUBindGroup: uniformBindGroup
		}
	};
	#makeSystemUniformInfo_fragment = function (device) {
		let uniformBufferSize =
			RedTypeSize.float4 + // directionalLightCount,pointLightCount, spotLightCount
			RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT + // directionalLight
			RedTypeSize.float4 * 3 * RedShareGLSL.MAX_POINT_LIGHT + // pointLight
			RedTypeSize.float4 * RedTypeSize.float4 + // ambientLight
			RedTypeSize.float4 * 3 * RedShareGLSL.MAX_SPOT_LIGHT + // spotLight


			RedTypeSize.float4 +  // cameraPosition
			RedTypeSize.float2 // resolution
		;
		const uniformBufferDescriptor = {
			size: uniformBufferSize,
			usage: globalThis.GPUBufferUsage.UNIFORM | globalThis.GPUBufferUsage.COPY_DST,

		};
		const bindGroupLayoutDescriptor = {
			bindings: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					type: "uniform-buffer"
				}
			]
		};
		let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
		this.#systemUniformInfo_fragment_data = new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT);
		bindGroupDescriptor = {
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
		uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
		return {
			GPUBuffer: uniformBuffer,
			GPUBindGroupLayout: uniformBindGroupLayout,
			GPUBindGroup: uniformBindGroup
		}
	};
	resetTexture(redGPUContext) {
		this.#viewRect = this.getViewRect(redGPUContext);
		if (this.baseAttachment) {
			this.baseAttachment.destroy();
			this.baseAttachment_depthColor.destroy();
			this.baseResolveTarget.destroy();
			this.baseAttachment_depthColor_ResolveTarget.destroy();
			this.baseDepthStencilAttachment.destroy();
		}
		this.baseAttachment = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 4,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachmentView = this.baseAttachment.createView();
		this.baseResolveTarget = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 1,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseResolveTargetView = this.baseResolveTarget.createView();

		this.baseAttachment_depthColor = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 4,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_depthColorView = this.baseAttachment_depthColor.createView();
		this.baseAttachment_depthColor_ResolveTarget = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 1,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_depthColor_ResolveTargetView = this.baseAttachment_depthColor_ResolveTarget.createView();


		this.baseAttachment_mouseColorID = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 4,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_mouseColorIDView = this.baseAttachment_mouseColorID.createView();
		this.baseAttachment_mouseColorID_ResolveTarget = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 1,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_mouseColorID_ResolveTargetView = this.baseAttachment_mouseColorID_ResolveTarget.createView();

		this.baseAttachment_normal = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 4,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_normalView = this.baseAttachment_normal.createView();
		this.baseAttachment_normal_ResolveTarget = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 1,
			format: redGPUContext.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseAttachment_normal_ResolveTargetView = this.baseAttachment_normal_ResolveTarget.createView();



		this.baseDepthStencilAttachment = redGPUContext.device.createTexture({
			size: {width: this.#viewRect[2], height: this.#viewRect[3], depth: 1},
			sampleCount: 4,
			format: "depth24plus-stencil8",
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
		});
		this.baseDepthStencilAttachmentView = this.baseDepthStencilAttachment.createView();

	}
	updateSystemUniform(passEncoder, redGPUContext) {
		//TODO 여기도 오프셋 자동으로 계산하게 변경해야함
		let systemUniformInfo_vertex, systemUniformInfo_fragment, aspect, offset;
		let i, len;
		systemUniformInfo_vertex = this.systemUniformInfo_vertex;
		systemUniformInfo_fragment = this.systemUniformInfo_fragment;
		this.#viewRect = this.getViewRect(redGPUContext);
		passEncoder.setViewport(0, 0, this.#viewRect[2], this.#viewRect[3], 0, 1);
		passEncoder.setScissorRect(0, 0, this.#viewRect[2], this.#viewRect[3]);
		passEncoder.setBindGroup(0, systemUniformInfo_vertex.GPUBindGroup);
		passEncoder.setBindGroup(1, systemUniformInfo_fragment.GPUBindGroup);
		// update systemUniformInfo_vertex /////////////////////////////////////////////////////////////////////////////////////////////////
		offset = 0;
		aspect = Math.abs(this.#viewRect[2] / this.#viewRect[3]);
		mat4.perspective(this.projectionMatrix, (Math.PI / 180) * this.camera.fov, aspect, this.camera.nearClipping, this.camera.farClipping);
		this.#systemUniformInfo_vertex_data.set(this.projectionMatrix, offset);
		offset += RedTypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
		this.#systemUniformInfo_vertex_data.set(this.camera.matrix, offset);
		offset += RedTypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
		this.#systemUniformInfo_vertex_data.set([performance.now()], offset);
		offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
		// update GPUBuffer
		systemUniformInfo_vertex.GPUBuffer.setSubData(0, this.#systemUniformInfo_vertex_data);
		// update systemUniformInfo_fragment /////////////////////////////////////////////////////////////////////////////////////////////////
		offset = 0;
		// update light count
		this.#systemUniformInfo_fragment_data.set([this.scene.directionalLightList.length, this.scene.pointLightList.length, this.scene.spotLightList.length], offset);
		i = 0;
		// update directionalLightList
		offset = RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
		len = this.scene.directionalLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.directionalLightList[i];
			if (tLight) {
				this.#systemUniformInfo_fragment_data.set(tLight.colorRGBA, offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
				this.#systemUniformInfo_fragment_data.set([tLight.x, tLight.y, tLight.z, tLight.intensity], offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
			}
		}
		// update pointLightList
		offset = (RedTypeSize.float4 + RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
		i = 0;
		len = this.scene.pointLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.pointLightList[i];
			if (tLight) {
				this.#systemUniformInfo_fragment_data.set(tLight.colorRGBA, offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
				this.#systemUniformInfo_fragment_data.set([tLight.x, tLight.y, tLight.z, tLight.intensity], offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
				this.#systemUniformInfo_fragment_data.set([tLight.radius], offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
			}
		}
		offset = (RedTypeSize.float4 + RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT + RedTypeSize.float4 * 3 * RedShareGLSL.MAX_POINT_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
		// update ambientLight
		let tLight = this.scene.ambientLight;
		this.#systemUniformInfo_fragment_data.set(tLight ? tLight.colorRGBA : [0, 0, 0, 0], offset);
		offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
		this.#systemUniformInfo_fragment_data.set([tLight ? tLight.intensity : 1], offset);
		offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
		// update spotLightList
		i = 0;
		len = this.scene.spotLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.spotLightList[i];
			if (tLight) {
				this.#systemUniformInfo_fragment_data.set(tLight.colorRGBA, offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
				this.#systemUniformInfo_fragment_data.set([tLight.x, tLight.y, tLight.z, tLight.intensity], offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
				this.#systemUniformInfo_fragment_data.set([tLight.cutoff, tLight.exponent], offset);
				offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
			}
		}
		offset = (RedTypeSize.float4 + RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT + RedTypeSize.float4 * 3 * RedShareGLSL.MAX_POINT_LIGHT + RedTypeSize.float4 * 3 * RedShareGLSL.MAX_SPOT_LIGHT + RedTypeSize.float4 * 2) / Float32Array.BYTES_PER_ELEMENT;
		// update camera position
		this.#systemUniformInfo_fragment_data.set([this.camera.x, this.camera.y, this.camera.z], offset);
		offset += RedTypeSize.float4 / Float32Array.BYTES_PER_ELEMENT;
		// update resolution
		this.#systemUniformInfo_fragment_data.set([this.#viewRect[2], this.#viewRect[3]], offset);
		// update GPUBuffer
		// console.log(this.#systemUniformInfo_fragment_data)
		systemUniformInfo_fragment.GPUBuffer.setSubData(0, this.#systemUniformInfo_fragment_data);
	}
	get postEffect() {
		return this.#postEffect;
	}
	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
	}

	get camera() {
		return this.#camera;
	}

	set camera(value) {
		this.#camera = value;
	}

	get y() {
		return this._y;
	}

	get x() {
		return this._x;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	getViewRect(redGPUContext) {
		return [
			typeof this.x == 'number' ? this.x : parseInt(this.x) / 100 * redGPUContext.canvas.width,
			typeof this.y == 'number' ? this.y : parseInt(this.y) / 100 * redGPUContext.canvas.height,
			typeof this.width == 'number' ? this.width : parseInt(parseInt(this.width) / 100 * redGPUContext.canvas.width),
			typeof this.height == 'number' ? this.height : parseInt(parseInt(this.height) / 100 * redGPUContext.canvas.height)
		]
	}

	setSize(width = this.#width, height = this.#height) {
		if (typeof width == 'number') this.#width = width < 0 ? 0 : parseInt(width);
		else {
			if (width.includes('%') && (+width.replace('%', '') >= 0)) this.#width = width;
			else RedUTIL.throwFunc('RedView setSize : width는 0이상의 숫자나 %만 허용.', width);
		}
		if (typeof height == 'number') this.#height = height < 0 ? 0 : parseInt(height);
		else {
			if (height.includes('%') && (+height.replace('%', '') >= 0)) this.#height = height;
			else RedUTIL.throwFunc('RedView setSize : height는 0이상의 숫자나 %만 허용.', height);
		}
		if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${width},${height} / result : ${this.#width}, ${this.#height}`);
		this.getViewRect(this.#redGPUContext);
		this.resetTexture(this.#redGPUContext)
	}

	setLocation(x = this._x, y = this._y) {
		if (typeof x == 'number') this._x = x < 0 ? 0 : parseInt(x);
		else {
			if (x.includes('%') && (+x.replace('%', '') >= 0)) this._x = x;
			else RedUTIL.throwFunc('RedView setLocation : x는 0이상의 숫자나 %만 허용.', x);
		}
		if (typeof y == 'number') this._y = y < 0 ? 0 : parseInt(y);
		else {
			if (y.includes('%') && (+y.replace('%', '') >= 0)) this._y = y;
			else RedUTIL.throwFunc('RedView setLocation : y는 0이상의 숫자나 %만 허용.', y);
		}
		if (RedGPUContext.useDebugConsole) console.log(`setLocation - input : ${x},${y} / result : ${this._x}, ${this._y}`);
		this.getViewRect(this.#redGPUContext)
	}

}