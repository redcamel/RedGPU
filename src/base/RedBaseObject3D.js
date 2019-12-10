/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 9:20:28
 *
 */

"use strict";

import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedDisplayContainer from "./RedDisplayContainer.js";
import RedPipeline from "./RedPipeline.js";
import RedUniformBufferDescriptor from "../buffer/RedUniformBufferDescriptor.js";
import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedBaseObject3D extends RedDisplayContainer {
	static uniformsBindGroupLayoutDescriptor_mesh = {
		bindings: [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX,
				type: "uniform-buffer"
			}
		]
	};
	static uniformBufferDescriptor_mesh = new RedUniformBufferDescriptor(
		[
			{size: RedTypeSize.mat4, valueName: 'matrix'},
			{size: RedTypeSize.mat4, valueName: 'normalMatrix'}
		]
	);
	_x = 0;
	_y = 0;
	_z = 0;
	_rotationX = 0;
	_rotationY = 0;
	_rotationZ = 0;
	_scaleX = 1;
	_scaleY = 1;
	_scaleZ = 1;
	dirtyTransform = true;
	dirtyPipeline = true;
	//
	_material;
	_geometry;
	#redGPU;
	//
	_useDepthTest = true;
	_depthTestFunc = 'less';
	_cullMode = 'back';
	_primitiveTopology = "triangle-list";
	pipeline;
	#bindings;

	constructor(redGPU) {
		super();
		this.#redGPU = redGPU;
		this.uniformBuffer_mesh = new RedUniformBuffer(redGPU);
		this.uniformBuffer_mesh.setBuffer(RedBaseObject3D.uniformBufferDescriptor_mesh);
		this.#bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_mesh.GPUBuffer,
					offset: 0,
					size: RedTypeSize.mat4 * 2
				}
			}
		];
		this.GPUBindGroupLayout = redGPU.device.createBindGroupLayout(RedBaseObject3D.uniformsBindGroupLayoutDescriptor_mesh);
		this.GPUBindGroup = this.#redGPU.device.createBindGroup({
			layout: this.GPUBindGroupLayout,
			bindings: this.#bindings
		});


		this.pipeline = new RedPipeline(redGPU, this);
		this.normalMatrix = mat4.create();
		this.matrix = mat4.create();
		this.localMatrix = mat4.create()

	}

	updateUniformBuffer = (_ => {
		let tempFloat32 = new Float32Array(1);
		return function () {
			//음 전체 속성 업데이트라고 봐야할까나..
			//TODO : 최적화...필요..
			let i;
			let dataMesh, tData;
			let tValue;
			dataMesh = RedBaseObject3D.uniformBufferDescriptor_mesh.redStruct;

			i = dataMesh.length;
			while (i--) {
				tData = dataMesh[i];
				if (tData) {
					tValue = this[tData.valueName];
					if (typeof tValue == 'number') {
						tempFloat32[0] = tValue;
						tValue = tempFloat32
					}
					// this.uniformBuffer_mesh.GPUBuffer.setSubData(tData['offset'], tValue);
				}
			}
			// this.uniformBuffer_mesh.GPUBuffer.setSubData(0, this.uniformBuffer_mesh.GPUBuffer);
		}
	})();


	get x() {
		return this._x
	}

	set x(v) {
		this._x = v;
		this.dirtyTransform = true;
	}

	get y() {
		return this._y
	}

	set y(v) {
		this._y = v;
		this.dirtyTransform = true;
	}

	get z() {
		return this._z;
	}

	set z(v) {
		this._z = v;
		this.dirtyTransform = true;
	}

	get rotationX() {
		return this._rotationX;
	}

	set rotationX(v) {
		this._rotationX = v;
		this.dirtyTransform = true;
	}

	get rotationY() {
		return this._rotationY;
	}

	set rotationY(v) {
		this._rotationY = v;
		this.dirtyTransform = true;
	}

	get rotationZ() {
		return this._rotationZ;
	}

	set rotationZ(v) {
		this._rotationZ = v;
		this.dirtyTransform = true;
	}

	get scaleX() {
		return this._scaleX;
	}

	set scaleX(v) {
		this._scaleX = v;
		this.dirtyTransform = true;
	}

	get scaleY() {
		return this._scaleY;
	}

	set scaleY(v) {
		this._scaleY = v;
		this.dirtyTransform = true;
	}

	get scaleZ() {
		return this._scaleZ;
	}

	set scaleZ(v) {
		this._scaleZ = v;
		this.dirtyTransform = true;
	}

	get geometry() {
		return this._geometry
	}

	set geometry(v) {
		this._geometry = v;
		this.dirtyPipeline = true;
		this.dirtyTransform = true
	}

	get material() {
		return this._material
	}

	set material(v) {
		this._material = v;
		this.dirtyPipeline = true;
		this.dirtyTransform = true
	}

	get useDepthTest() {
		return this._useDepthTest;
	}

	set useDepthTest(value) {
		this.dirtyPipeline = true;
		this._useDepthTest = value;
	}

	get depthTestFunc() {
		return this._depthTestFunc;
	}

	set depthTestFunc(value) {
		this.dirtyPipeline = true;
		this._depthTestFunc = value;
	}

	get cullMode() {
		return this._cullMode;
	}

	set cullMode(value) {
		this.dirtyPipeline = true;
		this._cullMode = value;
	}

	get primitiveTopology() {
		return this._primitiveTopology;
	}

	set primitiveTopology(value) {
		this.dirtyPipeline = true;
		this._primitiveTopology = value;
	}


}