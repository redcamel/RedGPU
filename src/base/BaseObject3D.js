/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:43:39
 *
 */

"use strict";

import UniformBuffer from "../buffer/UniformBuffer.js";
import DisplayContainer from "./DisplayContainer.js";
import PipelineBasic from "./pipeline/PipelineBasic.js";
import UniformBufferDescriptor from "../buffer/UniformBufferDescriptor.js";
import TypeSize from "../resources/TypeSize.js";
import ShareGLSL from "./ShareGLSL.js";
import View from "../View.js";
import UTIL from "../util/UTIL.js";
import MouseEventChecker from "../renderer/system/MouseEventChecker.js";

const MESH_UNIFORM_TABLE = [];
let MESH_UNIFORM_POOL_index = 0;
let MESH_UNIFORM_POOL_tableIndex = 0;
const uniformBufferDescriptor_mesh = new UniformBufferDescriptor(
	[
		{size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'matrix'},
		{size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'normalMatrix'}
	]
);
let MOUSE_UUID = 0;
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
			{size: TypeSize.float, valueName: 'mouseColorID'}
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
	_blendColorSrc = 'src-alpha';
	_blendColorDst = 'one-minus-src-alpha';
	_blendAlphaSrc = 'one';
	_blendAlphaDst = 'one-minus-src-alpha';
	pipeline;
	#bindings;
	//FIXME - 유일키가 될수있도록 변경
	#mouseColorID =0;
	get blendColorSrc() {return this._blendColorSrc;}
	set blendColorSrc(value) {this._blendColorSrc = value;}
	get blendColorDst() {return this._blendColorDst;}
	set blendColorDst(value) {this._blendColorDst = value;}
	get blendAlphaDst() {return this._blendAlphaDst;}
	set blendAlphaDst(value) {this._blendAlphaDst = value;}
	get blendAlphaSrc() {return this._blendAlphaSrc;}
	set blendAlphaSrc(value) {this._blendAlphaSrc = value;}
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
	getPosition() {return [this._x, this._y, this._z]}
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
	getRotation() {return [this._rotationX, this._rotationY, this._rotationZ]}
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
	getScale() {return [this._scaleX, this._scaleY, this._scaleZ]}
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
	constructor(redGPUContext) {
		super();
		this.#redGPUContext = redGPUContext;
		let bufferData = getPool(redGPUContext, this);
		this.uniformBuffer_mesh = bufferData.uniformBuffer_mesh;
		this.uniformBuffer_mesh.meshFloat32Array = bufferData.float32Array;
		this.offsetMatrix = bufferData.offsetMatrix;
		this.offsetNormalMatrix = bufferData.offsetNormalMatrix;
		MOUSE_UUID++;
		this.#mouseColorID = MOUSE_UUID;
		this.uniformBuffer_meshIndex = new UniformBuffer(redGPUContext);
		this.uniformBuffer_meshIndex.setBuffer(BaseObject3D.uniformBufferDescriptor_meshIndex);
		this.uniformBuffer_meshIndex.GPUBuffer.setSubData(0, new Float32Array([bufferData.uniformIndex]));
		this.uniformBuffer_meshIndex.GPUBuffer.setSubData(TypeSize.float, new Float32Array([this.#mouseColorID]));
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


		this.pipeline = new PipelineBasic(redGPUContext, this);
		this.normalMatrix = mat4.create();
		this.matrix = mat4.create();
		this.localMatrix = mat4.create()

	}

	/////////////////////////////////////////////////////////
	addEventListener(type, handler) {
		if (!MouseEventChecker.mouseMAP[this.#mouseColorID]) {
			MouseEventChecker.mouseMAP[this.#mouseColorID] = {
				target: this
			}
		}
		MouseEventChecker.mouseMAP[this.#mouseColorID][type] = handler;
		// console.log(MouseEventChecker.mouseMAP)
	}
	removeEventListener(type) {
		if (MouseEventChecker.mouseMAP[this.#mouseColorID]) {
			MouseEventChecker.mouseMAP[this.#mouseColorID][type] = null;
		}
	}
	targetTo = (_ => {
		let up = new Float32Array([0, 1, 0]);
		let tPosition = [];
		let tRotation = [];
		let tMTX = mat4.create();
		return function (x, y, z) {
			tPosition[0] = x;
			tPosition[1] = y;
			tPosition[2] = z;
			//out, eye, center, up
			mat4.identity(tMTX);
			mat4.targetTo(tMTX, [this._x, this._y, this._z], tPosition, up);
			tRotation = UTIL.mat4ToEuler(tMTX, []);
			this._rotationX = -tRotation[0] * 180 / Math.PI;
			this._rotationY = -tRotation[1] * 180 / Math.PI;
			this._rotationZ = -tRotation[2] * 180 / Math.PI;
			this.dirtyTransform = true;

		}
	})();
	localToWorld = (_ => {
		//TODO - 값 확인해봐야함
		let tMTX;
		tMTX = mat4.create();
		return function (x = 0, y = 0, z = 0) {
			typeof x == 'number' || UTIL.throwFunc('RedBaseObject3D - localToWorld : x - number만 허용함', '입력값 : ', x);
			typeof y == 'number' || UTIL.throwFunc('RedBaseObject3D - localToWorld : y - number만 허용함', '입력값 : ', y);
			typeof z == 'number' || UTIL.throwFunc('RedBaseObject3D - localToWorld : z - number만 허용함', '입력값 : ', z);
			tMTX[0] = 1, tMTX[1] = 0, tMTX[2] = 0, tMTX[3] = 0;
			tMTX[4] = 0, tMTX[5] = 1, tMTX[6] = 0, tMTX[7] = 0;
			tMTX[8] = 0, tMTX[9] = 0, tMTX[10] = 1, tMTX[11] = 0;
			tMTX[12] = x, tMTX[13] = y, tMTX[14] = z, tMTX[15] = 1;
			mat4.multiply(tMTX, this.matrix, tMTX);
			return [tMTX[12], tMTX[13], tMTX[14]]
		}
	})();
	getScreenPoint = (_ => {
		//TODO - 값 확인해봐야함
		let tMTX = mat4.create();
		let tPositionMTX = mat4.create();
		let tCamera, tViewRect;
		let resultPosition;
		resultPosition = {x: 0, y: 0, z: 0, w: 0};
		return function (redView, localX = 0, localY = 0, localZ = 0) {
			let worldPosition = this.localToWorld(localX, localY, localZ);
			tPositionMTX[0] = 1, tPositionMTX[1] = 0, tPositionMTX[2] = 0, tPositionMTX[3] = 0;
			tPositionMTX[4] = 0, tPositionMTX[5] = 1, tPositionMTX[6] = 0, tPositionMTX[7] = 0;
			tPositionMTX[8] = 0, tPositionMTX[9] = 0, tPositionMTX[10] = 1, tPositionMTX[11] = 0;
			tPositionMTX[12] = worldPosition[0], tPositionMTX[13] = worldPosition[1], tPositionMTX[14] = worldPosition[2], tPositionMTX[15] = 1;
			redView instanceof View || UTIL.throwFunc('RedBaseObject3D - getScreenPoint : redView - RedView Instance 만 허용함', '입력값 : ', redView);
			tCamera = redView.camera;
			tViewRect = redView.viewRect;
			mat4.multiply(tMTX, redView.projectionMatrix, tCamera.matrix);
			mat4.multiply(tMTX, tMTX, tPositionMTX);
			resultPosition.x = tMTX[12];
			resultPosition.y = tMTX[13];
			resultPosition.z = tMTX[14];
			resultPosition.w = tMTX[15];
			resultPosition.x = resultPosition.x * 0.5 / resultPosition.w + 0.5;
			resultPosition.y = resultPosition.y * 0.5 / resultPosition.w + 0.5;
			return [
				(tViewRect[0] + resultPosition.x * tViewRect[2]) / window.devicePixelRatio,
				(tViewRect[1] + (1 - resultPosition.y) * tViewRect[3]) / window.devicePixelRatio
			]
		}
	})();
}