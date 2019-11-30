/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 16:32:22
 *
 */

"use strict";
import RedUtil from "./util/RedUtil.js"
import RedTypeSize from "./resources/RedTypeSize.js";
import RedShareGLSL from "./base/RedShareGLSL.js"

export default class RedView {
	get viewRect() {
		return this.#viewRect;
	}
	#redGPU;
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
	baseDepthStencilAttachment;
	baseDepthStencilAttachmentView;

	constructor(redGPU, scene, camera) {
		this.#redGPU = redGPU;
		this.camera = camera;
		this.scene = scene;
		this.systemUniformInfo_vertex = this.#makeSystemUniformInfo_vertex(redGPU.device);
		this.systemUniformInfo_fragment = this.#makeSystemUniformInfo_fragment(redGPU.device);
		this.projectionMatrix = mat4.create();

	}

	#makeSystemUniformInfo_vertex = function (device) {
		let uniformBufferSize =
			RedTypeSize.mat4 + // projectionMatrix
			RedTypeSize.mat4 +  // camera
			RedTypeSize.float // time
		;
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
		return {
			GPUBuffer: uniformBuffer,
			GPUBindGroupLayout: uniformBindGroupLayout,
			GPUBindGroup: uniformBindGroup
		}
	};
	#makeSystemUniformInfo_fragment = function (device) {
		let uniformBufferSize =
			// directionalLight
			RedTypeSize.float4 +
			RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT +
			// pointLight
			RedTypeSize.float4 +
			RedTypeSize.float4 * 3 * RedShareGLSL.MAX_POINT_LIGHT
		;
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
					visibility: GPUShaderStage.FRAGMENT,
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
		return {
			GPUBuffer: uniformBuffer,
			GPUBindGroupLayout: uniformBindGroupLayout,
			GPUBindGroup: uniformBindGroup
		}
	};
	resetTexture(redGPU) {
		this.#viewRect = this.getViewRect(redGPU);
		if (this.baseAttachment) {
			this.baseAttachment.destroy();
			this.baseDepthStencilAttachment.destroy();
			this.baseResolveTarget.destroy();
		}
		console.log(this.#viewRect);
		this.baseAttachment = redGPU.device.createTexture({
			size: {
				width: this.#viewRect[2],
				height: this.#viewRect[3],
				depth: 1
			},
			sampleCount: 4,
			format: redGPU.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
		});
		this.baseAttachmentView = this.baseAttachment.createView();
		this.baseResolveTarget = redGPU.device.createTexture({
			size: {
				width: this.#viewRect[2],
				height: this.#viewRect[3],
				depth: 1
			},
			sampleCount: 1,
			format: redGPU.swapChainFormat,
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
		});
		this.baseResolveTargetView = this.baseResolveTarget.createView();
		this.baseDepthStencilAttachment = redGPU.device.createTexture({
			size: {
				width: this.#viewRect[2],
				height: this.#viewRect[3],
				depth: 1
			},
			sampleCount: 4,
			format: "depth24plus-stencil8",
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
		});
		this.baseDepthStencilAttachmentView = this.baseDepthStencilAttachment.createView();
		console.log('this.baseAttachment', this.baseAttachment)

	}
	updateSystemUniform(passEncoder, redGPU) {
		//TODO 여기도 오프셋 자동으로 계산하게 변경해야함
		let systemUniformInfo_vertex = this.systemUniformInfo_vertex;
		this.#viewRect = this.getViewRect(redGPU);
		// passEncoder.setViewport(tX, tY, this.canvas.width, this.canvas.height, 0, 1);
		passEncoder.setViewport(0, 0, this.#viewRect[2], this.#viewRect[3], 0, 1);
		passEncoder.setScissorRect(0, 0, this.#viewRect[2], this.#viewRect[3]);
		passEncoder.setBindGroup(0, systemUniformInfo_vertex.GPUBindGroup);


		let aspect = Math.abs(this.#viewRect[2] / this.#viewRect[3]);
		mat4.perspective(this.projectionMatrix, (Math.PI / 180) * this.camera.fov, aspect, this.camera.nearClipping, this.camera.farClipping);
		let offset = 0;
		systemUniformInfo_vertex.GPUBuffer.setSubData(offset, this.projectionMatrix);
		offset += RedTypeSize.mat4;
		systemUniformInfo_vertex.GPUBuffer.setSubData(offset, this.camera.matrix);
		offset += RedTypeSize.mat4;
		systemUniformInfo_vertex.GPUBuffer.setSubData(offset, new Float32Array([performance.now()]));
		offset += RedTypeSize.float;

		///////////////////////////////////////////////////////////////////////////////////////////////////
		let systemUniformInfo_fragment = this.systemUniformInfo_fragment;
		passEncoder.setBindGroup(1, systemUniformInfo_fragment.GPUBindGroup);
		offset = 0;
		systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([
			this.scene.directionalLightList.length,
			this.scene.pointLightList.length
		]));
		offset += RedTypeSize.float4; // TODO : 이걸와 4로 해야되는거지 -_-

		let i = 0, len = this.scene.directionalLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.directionalLightList[i];
			if (tLight) {
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, tLight.colorRGBA);
				offset += RedTypeSize.float4;
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([tLight.x, tLight.y, tLight.z, tLight.intensity]));
				offset += RedTypeSize.float4;
			}
		}
		offset = RedTypeSize.float4 + RedTypeSize.float4 * 2 * RedShareGLSL.MAX_DIRECTIONAL_LIGHT;
		i = 0, len = this.scene.pointLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.pointLightList[i];
			if (tLight) {
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, tLight.colorRGBA);
				offset += RedTypeSize.float4;
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([tLight.x, tLight.y, tLight.z, tLight.intensity]));
				offset += RedTypeSize.float4;
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([tLight.radius]));
				offset += RedTypeSize.float4
			}
		}


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

	getViewRect(redGPU) {
		return [
			typeof this.x == 'number' ? this.x : parseInt(this.x) / 100 * redGPU.canvas.width,
			typeof this.y == 'number' ? this.y : parseInt(this.y) / 100 * redGPU.canvas.height,
			typeof this.width == 'number' ? this.width : parseInt(this.width) / 100 * redGPU.canvas.width,
			typeof this.height == 'number' ? this.height : parseInt(this.height) / 100 * redGPU.canvas.height
		]
	}

	setSize(width = this.#width, height = this.#height) {
		if (typeof width == 'number') this.#width = width < 0 ? 0 : parseInt(width);
		else {
			if (width.includes('%') && (+width.replace('%', '') >= 0)) this.#width = width;
			else RedUtil.throwFunc('RedView setSize : width는 0이상의 숫자나 %만 허용.', width);
		}
		if (typeof height == 'number') this.#height = height < 0 ? 0 : parseInt(height);
		else {
			if (height.includes('%') && (+height.replace('%', '') >= 0)) this.#height = height;
			else RedUtil.throwFunc('RedView setSize : height는 0이상의 숫자나 %만 허용.', height);
		}
		this.getViewRect(this.#redGPU);
		this.resetTexture(this.#redGPU)
	}

	setLocation(x = this._x, y = this._y) {
		if (typeof x == 'number') this._x = x < 0 ? 0 : parseInt(x);
		else {
			if (x.includes('%') && (+x.replace('%', '') >= 0)) this._x = x;
			else RedUtil.throwFunc('RedView setLocation : x는 0이상의 숫자나 %만 허용.', x);
		}
		if (typeof y == 'number') this._y = y < 0 ? 0 : parseInt(y);
		else {
			if (y.includes('%') && (+y.replace('%', '') >= 0)) this._y = y;
			else RedUtil.throwFunc('RedView setLocation : y는 0이상의 숫자나 %만 허용.', y);
		}
		console.log('setLocation', this._x, this._y);
		this.getViewRect(this.#redGPU)
	}

}