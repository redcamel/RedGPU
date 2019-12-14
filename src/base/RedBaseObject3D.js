/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:10:39
 *
 */

"use strict";

import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedDisplayContainer from "./RedDisplayContainer.js";
import RedPipeline from "./RedPipeline.js";
import RedUniformBufferDescriptor from "../buffer/RedUniformBufferDescriptor.js";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedShareGLSL from "./RedShareGLSL.js";

const MESH_UNIFORM_TABLE = [];
let MESH_UNIFORM_POOL_index = 0;
let MESH_UNIFORM_POOL_tableIndex = 0;
const uniformBufferDescriptor_mesh = new RedUniformBufferDescriptor(
	[
		{size: RedTypeSize.mat4 * RedShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'matrix'},
		{size: RedTypeSize.mat4 * RedShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'normalMatrix'}
	]
);
const getPool = function (redGPUContext, targetMesh) {
	let uniformBuffer_mesh;
	if (!MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex]) {
		uniformBuffer_mesh = new RedUniformBuffer(redGPUContext);
		uniformBuffer_mesh.setBuffer(uniformBufferDescriptor_mesh);
		MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex] = uniformBuffer_mesh
	}
	uniformBuffer_mesh = MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex];
	let result = {
		float32Array: uniformBuffer_mesh.float32Array,
		uniformBuffer_mesh: uniformBuffer_mesh,
		offsetMatrix: RedTypeSize.mat4 * MESH_UNIFORM_POOL_index,
		offsetNormalMatrix: RedTypeSize.mat4 * RedShareGLSL.MESH_UNIFORM_POOL_NUM + (RedTypeSize.mat4 * MESH_UNIFORM_POOL_index),
		uniformIndex: MESH_UNIFORM_POOL_index
	};
	MESH_UNIFORM_POOL_index++;
	if (MESH_UNIFORM_POOL_index == RedShareGLSL.MESH_UNIFORM_POOL_NUM) {
		MESH_UNIFORM_POOL_tableIndex++;
		MESH_UNIFORM_POOL_index = 0
	}
	// console.log('MESH_UNIFORM_TABLE',MESH_UNIFORM_TABLE)
	return result
};


export default class RedBaseObject3D extends RedDisplayContainer {
	static uniformsBindGroupLayoutDescriptor_mesh = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"}
		]
	};
	static uniformBufferDescriptor_meshIndex = new RedUniformBufferDescriptor(
		[
			{size: RedTypeSize.float, valueName: 'meshUniformIndex'}
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
	#redGPUContext;
	//
	_useDepthTest = true;
	_depthTestFunc = 'less-equal';
	_cullMode = 'back';
	_primitiveTopology = "triangle-list";
	pipeline;
	#bindings;

	constructor(redGPUContext) {
		super();
		this.#redGPUContext = redGPUContext;
		let bufferData = getPool(redGPUContext, this);
		this.uniformBuffer_mesh = bufferData.uniformBuffer_mesh;
		this.uniformBuffer_mesh.meshFloat32Array = bufferData.float32Array;
		this.offsetMatrix = bufferData.offsetMatrix;
		this.offsetNormalMatrix = bufferData.offsetNormalMatrix;

		this.uniformBuffer_meshIndex = new RedUniformBuffer(redGPUContext);
		this.uniformBuffer_meshIndex.setBuffer(RedBaseObject3D.uniformBufferDescriptor_meshIndex);
		this.uniformBuffer_meshIndex.GPUBuffer.setSubData(0, new Float32Array([bufferData.uniformIndex]));
		this.#bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_mesh.GPUBuffer,
					offset: 0,
					size: RedTypeSize.mat4 * 2 * RedShareGLSL.MESH_UNIFORM_POOL_NUM
				}
			},
			{
				binding: 1,
				resource: {
					buffer: this.uniformBuffer_meshIndex.GPUBuffer,
					offset: 0,
					size: RedTypeSize.float
				}
			}
		];
		this.GPUBindGroupLayout = redGPUContext.device.createBindGroupLayout(RedBaseObject3D.uniformsBindGroupLayoutDescriptor_mesh);
		this.GPUBindGroup = this.#redGPUContext.device.createBindGroup({
			layout: this.GPUBindGroupLayout,
			bindings: this.#bindings
		});


		this.pipeline = new RedPipeline(redGPUContext, this);
		this.normalMatrix = mat4.create();
		this.matrix = mat4.create();
		this.localMatrix = mat4.create()

	}


	get x() {return this._x}
	set x(v) {
		this._x = v;
		this.dirtyTransform = true;
	}

	get y() {return this._y}
	set y(v) {
		this._y = v;
		this.dirtyTransform = true;
	}

	get z() {return this._z;}
	set z(v) {
		this._z = v;
		this.dirtyTransform = true;
	}

	get rotationX() {return this._rotationX;}
	set rotationX(v) {
		this._rotationX = v;
		this.dirtyTransform = true;
	}

	get rotationY() {return this._rotationY;}
	set rotationY(v) {
		this._rotationY = v;
		this.dirtyTransform = true;
	}

	get rotationZ() {return this._rotationZ;}
	set rotationZ(v) {
		this._rotationZ = v;
		this.dirtyTransform = true;
	}

	get scaleX() {return this._scaleX;}
	set scaleX(v) {
		this._scaleX = v;
		this.dirtyTransform = true;
	}

	get scaleY() {return this._scaleY;}
	set scaleY(v) {
		this._scaleY = v;
		this.dirtyTransform = true;
	}

	get scaleZ() {return this._scaleZ;}
	set scaleZ(v) {
		this._scaleZ = v;
		this.dirtyTransform = true;
	}

	get geometry() {return this._geometry}
	set geometry(v) {
		this._geometry = v;
		this.dirtyPipeline = true;/* this.dirtyTransform = true*/
	}

	get material() {return this._material}
	set material(v) {
		this._material = v;
		this.dirtyPipeline = true;/* this.dirtyTransform = true*/
	}

	get useDepthTest() {return this._useDepthTest;}
	set useDepthTest(value) {
		this.dirtyPipeline = true;
		this._useDepthTest = value;
	}

	get depthTestFunc() {return this._depthTestFunc;}
	set depthTestFunc(value) {
		this.dirtyPipeline = true;
		this._depthTestFunc = value;
	}

	get cullMode() {return this._cullMode;}
	set cullMode(value) {
		this.dirtyPipeline = true;
		this._cullMode = value;
	}

	get primitiveTopology() {return this._primitiveTopology;}
	set primitiveTopology(value) {
		this.dirtyPipeline = true;
		this._primitiveTopology = value;
	}


}