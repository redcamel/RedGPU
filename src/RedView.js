"use strict";
import RedUtil from "./util/RedUtil.js"
import RedTypeSize from "./resources/RedTypeSize.js";

export default class RedView {
	#scene;
	#camera;
	#x = 0;
	#y = 0;
	#width = '100%';
	#height = '100%';
	systemUniformInfo_vertex;
	systemUniformInfo_fragment;
	projectionMatrix;

	constructor(redGPU, scene, camera) {
		this.camera = camera;
		this.scene = scene;
		this.systemUniformInfo_vertex = this.#makeSystemUniformInfo_vertex(redGPU.device);
		this.systemUniformInfo_fragment = this.#makeSystemUniformInfo_fragment(redGPU.device);
		this.projectionMatrix = mat4.create();
	}

	#makeSystemUniformInfo_vertex = function (device) {
		let uniformBufferSize =
			RedTypeSize.mat4 + // projectionMatrix
			RedTypeSize.mat4  // camera
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
			RedTypeSize.float4 +
			RedTypeSize.float4 * 2 * 3
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

	updateSystemUniform(passEncoder, redGPU) {
		let systemUniformInfo_vertex = this.systemUniformInfo_vertex;
		let tView_viewRect = this.getViewRect(redGPU);
		// passEncoder.setViewport(tX, tY, this.canvas.width, this.canvas.height, 0, 1);
		passEncoder.setViewport(...tView_viewRect, 0, 1);
		passEncoder.setScissorRect(...tView_viewRect);
		passEncoder.setBindGroup(0, systemUniformInfo_vertex.GPUBindGroup);


		let aspect = Math.abs(tView_viewRect[2] / tView_viewRect[3]);
		mat4.perspective(this.projectionMatrix, (Math.PI / 180) * 60, aspect, 0.01, 10000.0);
		let offset = 0;
		systemUniformInfo_vertex.GPUBuffer.setSubData(offset, this.projectionMatrix);
		offset += RedTypeSize.mat4;
		systemUniformInfo_vertex.GPUBuffer.setSubData(offset, this.camera.matrix);
		offset += RedTypeSize.mat4;

		///////////////////////////////////////////////////////////////////////////////////////////////////
		let systemUniformInfo_fragment = this.systemUniformInfo_fragment;
		passEncoder.setBindGroup(1, systemUniformInfo_fragment.GPUBindGroup);
		offset = 0;
		let count = this.scene.directionalLightList.length;
		systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([count]));
		offset += RedTypeSize.float4; // TODO : 이걸와 4로 해야되는거지 -_-

		let i = 0, len = this.scene.directionalLightList.length;
		for (i; i < len; i++) {
			let tLight = this.scene.directionalLightList[i];
			if (tLight) {
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, tLight.colorRGBA);
				offset += RedTypeSize.float4;
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([tLight.x, tLight.y, tLight.z]));
				offset += RedTypeSize.float3;
				systemUniformInfo_fragment.GPUBuffer.setSubData(offset, new Float32Array([tLight.intensity]));
				offset += RedTypeSize.float
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
		return this.#y;
	}

	get x() {
		return this.#x;
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
	}

	setLocation(x = this.#x, y = this.#y) {
		if (typeof x == 'number') this.#x = x < 0 ? 0 : parseInt(x);
		else {
			if (x.includes('%') && (+x.replace('%', '') >= 0)) this.#x = x;
			else RedUtil.throwFunc('RedView setLocation : x는 0이상의 숫자나 %만 허용.', x);
		}
		if (typeof y == 'number') this.#y = y < 0 ? 0 : parseInt(y);
		else {
			if (y.includes('%') && (+y.replace('%', '') >= 0)) this.#y = y;
			else RedUtil.throwFunc('RedView setLocation : y는 0이상의 숫자나 %만 허용.', y);
		}
		console.log('setLocation', this.#x, this.#y)
	}

}