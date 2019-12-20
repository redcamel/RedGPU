/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:27
 *
 */

"use strict";

import UniformBuffer from "../buffer/UniformBuffer.js";
import DisplayContainer from "./DisplayContainer.js";
import Pipeline from "./Pipeline.js";
import UniformBufferDescriptor from "../buffer/UniformBufferDescriptor.js";
import TypeSize from "../resources/TypeSize.js";
import ShareGLSL from "./ShareGLSL.js";
import Render from "../renderer/Render.js";

const MESH_UNIFORM_TABLE = [];
let MESH_UNIFORM_POOL_index = 0;
let MESH_UNIFORM_POOL_tableIndex = 0;
const uniformBufferDescriptor_mesh = new UniformBufferDescriptor(
	[
		{size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'matrix'},
		{size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'normalMatrix'}
	]
);
const getPool = function (redGPUContext, targetMesh) {
	let uniformBuffer_mesh;
	if (!MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex]) {
		uniformBuffer_mesh = new UniformBuffer(redGPUContext);
		uniformBuffer_mesh.setBuffer(uniformBufferDescriptor_mesh);
		MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex] = uniformBuffer_mesh
	}
	uniformBuffer_mesh = MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex];
	let result = {
		float32Array: uniformBuffer_mesh.float32Array,
		uniformBuffer_mesh: uniformBuffer_mesh,
		offsetMatrix: TypeSize.mat4 * MESH_UNIFORM_POOL_index,
		offsetNormalMatrix: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM + (TypeSize.mat4 * MESH_UNIFORM_POOL_index),
		uniformIndex: MESH_UNIFORM_POOL_index
	};
	MESH_UNIFORM_POOL_index++;
	if (MESH_UNIFORM_POOL_index == ShareGLSL.MESH_UNIFORM_POOL_NUM) {
		MESH_UNIFORM_POOL_tableIndex++;
		MESH_UNIFORM_POOL_index = 0
	}
	// console.log('MESH_UNIFORM_TABLE',MESH_UNIFORM_TABLE)
	return result
};


export default class BaseObject3D extends DisplayContainer {

	static uniformsBindGroupLayoutDescriptor_mesh = {
		bindings: [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX,
				type: "uniform-buffer"
			},
			{
				binding: 1,
				visibility: GPUShaderStage.VERTEX,
				type: "uniform-buffer"
			}
		]
	};
	static uniformBufferDescriptor_meshIndex = new UniformBufferDescriptor(
		[
			{size: TypeSize.float, valueName: 'meshUniformIndex'},
			{size: TypeSize.float4, valueName: 'mouseColorID'}
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
	_depthTestFunc = 'less';
	_cullMode = 'back';
	_primitiveTopology = "triangle-list";
	pipeline;
	#bindings;
	//FIXME - 유일키가 될수있도록 변경
	#mouseColorID = [
		parseInt(Math.random() * 255),
		parseInt(Math.random() * 255),
		parseInt(Math.random() * 255),
		255
	];
	addEventListener(type, handler) {
		if (!Render.mouseMAP[this.#mouseColorID.toString()]) {
			Render.mouseMAP[this.#mouseColorID.toString()] = {
				target: this
			}
		}
		Render.mouseMAP[this.#mouseColorID.toString()][type] = handler;
		// console.log(Render.mouseMAP)
	}
	removeEventListener(type) {
		if (Render.mouseMAP[this.#mouseColorID.toString()]) {
			Render.mouseMAP[this.#mouseColorID.toString()][type] = null;
		}
	}
	constructor(redGPUContext) {
		super();
		this.#redGPUContext = redGPUContext;
		let bufferData = getPool(redGPUContext, this);
		this.uniformBuffer_mesh = bufferData.uniformBuffer_mesh;
		this.uniformBuffer_mesh.meshFloat32Array = bufferData.float32Array;
		this.offsetMatrix = bufferData.offsetMatrix;
		this.offsetNormalMatrix = bufferData.offsetNormalMatrix;

		this.uniformBuffer_meshIndex = new UniformBuffer(redGPUContext);
		this.uniformBuffer_meshIndex.setBuffer(BaseObject3D.uniformBufferDescriptor_meshIndex);
		this.uniformBuffer_meshIndex.GPUBuffer.setSubData(0, new Float32Array([bufferData.uniformIndex]));
		this.uniformBuffer_meshIndex.GPUBuffer.setSubData(TypeSize.float4, new Float32Array([this.#mouseColorID[0] / 255, this.#mouseColorID[1] / 255, this.#mouseColorID[2] / 255, this.#mouseColorID[3] / 255]));
		this.#bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_mesh.GPUBuffer,
					offset: 0,
					size: TypeSize.mat4 * 2 * ShareGLSL.MESH_UNIFORM_POOL_NUM
				}
			},
			{
				binding: 1,
				resource: {
					buffer: this.uniformBuffer_meshIndex.GPUBuffer,
					offset: 0,
					size: TypeSize.float
				}
			}
		];
		this.GPUBindGroupLayout = redGPUContext.device.createBindGroupLayout(BaseObject3D.uniformsBindGroupLayoutDescriptor_mesh);
		this.GPUBindGroup = this.#redGPUContext.device.createBindGroup({
			layout: this.GPUBindGroupLayout,
			bindings: this.#bindings
		});


		this.pipeline = new Pipeline(redGPUContext, this);
		this.normalMatrix = mat4.create();
		this.matrix = mat4.create();
		this.localMatrix = mat4.create()

	}

	/////////////////////////////////////////////////////////
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
	getPosition() {
		return [this._x, this._y, this._z]
	}
	setPosition(x, y, z) {
		this._x = x;
		this._y = y;
		this._z = z;
		this.dirtyTransform = true;
	}
	/////////////////////////////////////////////////////////
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
	getRotation() {
		return [this._rotationX, this._rotationY, this._rotationZ]
	}
	setRotation(rX, rY, rZ) {
		this._rotationX = rX;
		this._rotationY = rY;
		this._rotationZ = rZ;
		this.dirtyTransform = true;
	}
	/////////////////////////////////////////////////////////
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
	getScale() {
		return [this._scaleX, this._scaleY, this._scaleZ]
	}
	setScale(sX, sY, sZ) {
		this._scaleX = sX;
		this._scaleY = sY;
		this._scaleZ = sZ;
		this.dirtyTransform = true;
	}
	/////////////////////////////////////////////////////////
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