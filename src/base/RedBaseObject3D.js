"use strict";

import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedDisplayContainer from "./RedDisplayContainer.js";
import RedUUID from "./RedUUID.js";
import RedBindGroup from "../buffer/RedBindGroup.js";

export default class RedBaseObject3D extends RedDisplayContainer {
	#x = 0;
	#y = 0;
	#z = 0;
	#rotationX = 0;
	#rotationY = 0;
	#rotationZ = 0;
	#scaleX = 1;
	#scaleY = 1;
	#scaleZ = 1;
	_dirtyTransform = true;
	//
	_material;
	_geometry;
	#redGPU;
	uniformBuffer_vertex;
	uniformBuffer_fragment;
	uniformBindGroup;
	//
	#useDepthTest = true;
	#depthTestFunc = 'less';
	#cullMode = 'back';
	#primitiveTopology = "triangle-list";


	constructor(redGPU) {
		super();
		this.#redGPU = redGPU;
		this.uniformBuffer_vertex = new RedUniformBuffer(redGPU);
		this.uniformBuffer_fragment = new RedUniformBuffer(redGPU);
		this.uniformBindGroup = new RedBindGroup(redGPU);
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
			let dataVertex, dataFragment, tData;
			let tValue;
			dataVertex = this.material.uniformBufferDescriptor_vertex.redStruct;
			dataFragment = this.material.uniformBufferDescriptor_fragment.redStruct;
			i = Math.max(dataVertex.length, dataFragment.length);
			while (i--) {
				if (tData = dataVertex[i]) {
					tValue = tData.targetKey ? this[tData.targetKey][tData.valueName] : this[tData.valueName];
					if (typeof tValue == 'number') {
						tempFloat32[0] = tValue;
						tValue = tempFloat32[0]
					}
					this.uniformBuffer_vertex.GPUBuffer.setSubData(tData['offset'], tValue);
				}
				if (tData = dataFragment[i]) {
					tValue = tData.targetKey ? this[tData.targetKey][tData.valueName] : this[tData.valueName];
					if (typeof tValue == 'number') {
						tempFloat32[0] = tValue;
						tValue = tempFloat32[0]
					}
					this.uniformBuffer_fragment.GPUBuffer.setSubData(tData['offset'], tValue);
				}
			}
		}
	})();

	get dirtyTransform() {
		return this._dirtyTransform
	}

	set dirtyTransform(v) {
		this._dirtyTransform = v
	}

	get x() {
		return this.#x
	}

	set x(v) {
		this.#x = v;
		this._dirtyTransform = true;
	}

	get y() {
		return this.#y
	}

	set y(v) {
		this.#y = v;
		this._dirtyTransform = true;
	}

	get z() {
		return this.#z;
	}

	set z(v) {
		this.#z = v;
		this._dirtyTransform = true;
	}

	get rotationX() {
		return this.#rotationX;
	}

	set rotationX(v) {
		this.#rotationX = v;
		this._dirtyTransform = true;
	}

	get rotationY() {
		return this.#rotationY;
	}

	set rotationY(v) {
		this.#rotationY = v;
		this._dirtyTransform = true;
	}

	get rotationZ() {
		return this.#rotationZ;
	}

	set rotationZ(v) {
		this.#rotationZ = v;
		this._dirtyTransform = true;
	}

	get scaleX() {
		return this.#scaleX;
	}

	set scaleX(v) {
		this.#scaleX = v;
		this._dirtyTransform = true;
	}

	get scaleY() {
		return this.#scaleY;
	}

	set scaleY(v) {
		this.#scaleY = v;
		this._dirtyTransform = true;
	}

	get scaleZ() {
		return this.#scaleZ;
	}

	set scaleZ(v) {
		this.#scaleZ = v;
		this._dirtyTransform = true;
	}

	get geometry() {
		return this._geometry
	}

	set geometry(v) {
		this._geometry = v;
		this.pipeline = null;
		this.dirtyTransform = true
	}

	get material() {
		return this._material
	}

	set material(v) {
		this._material = v;
		this.uniformBuffer_vertex.setBuffer(v.uniformBufferDescriptor_vertex);
		this.uniformBuffer_fragment.setBuffer(v.uniformBufferDescriptor_fragment);
		this.updateUniformBuffer();
		this.pipeline = null;
		this.dirtyTransform = true
	}

	get useDepthTest() {
		return this.#useDepthTest;
	}

	set useDepthTest(value) {
		this.pipeline = null;
		this.#useDepthTest = value;
	}

	get depthTestFunc() {
		return this.#depthTestFunc;
	}

	set depthTestFunc(value) {
		this.pipeline = null;
		this.#depthTestFunc = value;
	}

	get cullMode() {
		return this.#cullMode;
	}

	set cullMode(value) {
		this.pipeline = null;
		this.#cullMode = value;
	}

	get primitiveTopology() {
		return this.#primitiveTopology;
	}

	set primitiveTopology(value) {
		this.pipeline = null;
		this.#primitiveTopology = value;
	}

	createPipeline(redGPU, redView) {
		this.uniformBindGroup.clear();
		const device = redGPU.device;
		const descriptor = {
			// 레이아웃은 재질이 알고있으니 들고옴
			layout: device.createPipelineLayout(
				{
					bindGroupLayouts: [
						redView.systemUniformInfo_vertex.GPUBindGroupLayout,
						redView.systemUniformInfo_fragment.GPUBindGroupLayout,
						this._material.GPUBindGroupLayout
					]
				}
			),
			// 버텍스와 프레그먼트는 재질에서 들고온다.
			vertexStage: {
				module: this._material.vShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			fragmentStage: {
				module: this._material.fShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			// 버텍스 상태는 지오메트리가 알고있음으로 들고옴
			vertexState: this._geometry.vertexState,
			// 컬러모드 지정하고
			colorStates: [
				{
					format: redGPU.swapChainFormat,
					alphaBlend: {
						srcFactor: "src-alpha",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					},
					colorBlend: {
						srcFactor: "src-alpha",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					}
				}
			],
			rasterizationState: {
				frontFace: 'ccw',
				cullMode: this.#cullMode
			},
			primitiveTopology: this.#primitiveTopology,
			depthStencilState: {
				format: "depth24plus-stencil8",
				depthWriteEnabled: this.#useDepthTest,
				depthCompare: this.#useDepthTest ? this.#depthTestFunc : 'always',
			},
			sampleCount : 4,
			//alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
		};

		this.pipeline = device.createRenderPipeline(descriptor);
		this.pipeline._UUID = RedUUID.makeUUID();
		return this.pipeline
	}

	calcNormalTransform() {
		let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33,
			b0, b1, b2, b3,
			b00, b01, b02, b10, b11, b12, b20, b21, b22;
		let tMVMatrix = this.matrix;
		let tNMatrix = this.normalMatrix;
		a00 = tMVMatrix[0], a01 = tMVMatrix[1], a02 = tMVMatrix[2], a03 = tMVMatrix[3],
			a10 = tMVMatrix[4], a11 = tMVMatrix[5], a12 = tMVMatrix[6], a13 = tMVMatrix[7],
			a20 = tMVMatrix[8], a21 = tMVMatrix[9], a22 = tMVMatrix[10], a23 = tMVMatrix[11],
			a31 = tMVMatrix[12], a32 = tMVMatrix[13], a33 = tMVMatrix[14], b0 = tMVMatrix[15],
			a30 = a00 * a11 - a01 * a10,
			b1 = a00 * a12 - a02 * a10, b2 = a00 * a13 - a03 * a10, b3 = a01 * a12 - a02 * a11,
			b00 = a01 * a13 - a03 * a11, b01 = a02 * a13 - a03 * a12, b02 = a20 * a32 - a21 * a31,
			b10 = a20 * a33 - a22 * a31, b11 = a20 * b0 - a23 * a31, b12 = a21 * a33 - a22 * a32,
			b20 = a21 * b0 - a23 * a32, b12 = a22 * b0 - a23 * a33, b22 = a30 * b12 - b1 * b20 + b2 * b12 + b3 * b11 - b00 * b10 + b01 * b02,
			b22 = 1 / b22,

			tNMatrix[0] = (a11 * b12 - a12 * b20 + a13 * b12) * b22,
			tNMatrix[4] = (-a01 * b12 + a02 * b20 - a03 * b12) * b22,
			tNMatrix[8] = (a32 * b01 - a33 * b00 + b0 * b3) * b22,
			tNMatrix[12] = (-a21 * b01 + a22 * b00 - a23 * b3) * b22,
			tNMatrix[1] = (-a10 * b12 + a12 * b11 - a13 * b10) * b22,
			tNMatrix[5] = (a00 * b12 - a02 * b11 + a03 * b10) * b22,
			tNMatrix[9] = (-a31 * b01 + a33 * b2 - b0 * b1) * b22,
			tNMatrix[13] = (a20 * b01 - a22 * b2 + a23 * b1) * b22,
			tNMatrix[2] = (a10 * b20 - a11 * b11 + a13 * b02) * b22,
			tNMatrix[6] = (-a00 * b20 + a01 * b11 - a03 * b02) * b22,
			tNMatrix[10] = (a31 * b00 - a32 * b2 + b0 * a30) * b22,
			tNMatrix[14] = (-a20 * b00 + a21 * b2 - a23 * a30) * b22,
			tNMatrix[3] = (-a10 * b12 + a11 * b10 - a12 * b02) * b22,
			tNMatrix[7] = (a00 * b12 - a01 * b10 + a02 * b02) * b22,
			tNMatrix[11] = (-a31 * b3 + a32 * b1 - a33 * a30) * b22,
			tNMatrix[15] = (a20 * b3 - a21 * b1 + a22 * a30) * b22;
	}


	calcTransform(parent) {
		// 일단 로컬을 구함
		let tMatrix = this.matrix;
		let tLocalMatrix = this.localMatrix;
		let parentMTX = parent ? parent.matrix : null;
		let aSx, aSy, aSz, aCx, aCy, aCz, aX, aY, aZ,
			a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33,
			b0, b1, b2, b3,
			b00, b01, b02, b10, b11, b12, b20, b21, b22;
		// sin,cos 관련
		let tRadian, CPI, CPI2, C225, C127, C045, C157;
		let CONVERT_RADIAN = Math.PI / 180;
		CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735, C157 = 1.5707963267948966;
		/////////////////////////////////////
		a00 = 1, a01 = 0, a02 = 0,
			a10 = 0, a11 = 1, a12 = 0,
			a20 = 0, a21 = 0, a22 = 1,
			// tLocalMatrix translate
			tLocalMatrix[12] = this.#x ,
			tLocalMatrix[13] = this.#y,
			tLocalMatrix[14] = this.#z,
			tLocalMatrix[15] = 1,
			// tLocalMatrix rotate
			aX = this.#rotationX * CONVERT_RADIAN, aY = this.#rotationY * CONVERT_RADIAN, aZ = this.#rotationZ * CONVERT_RADIAN;
		/////////////////////////
		tRadian = aX % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			tRadian = (aX + C157) % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			tRadian = aY % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			tRadian = (aY + C157) % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			tRadian = aZ % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			tRadian = (aZ + C157) % CPI2,
			tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
			tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
			aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
			/////////////////////////
			b00 = aCy * aCz, b01 = aSx * aSy * aCz - aCx * aSz, b02 = aCx * aSy * aCz + aSx * aSz,
			b10 = aCy * aSz, b11 = aSx * aSy * aSz + aCx * aCz, b12 = aCx * aSy * aSz - aSx * aCz,
			b20 = -aSy, b21 = aSx * aCy, b22 = aCx * aCy,
			// tLocalMatrix scale
			aX = this.#scaleX, aY = this.#scaleY , aZ = this.#scaleZ,
			tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX,
			tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX,
			tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX,
			tLocalMatrix[3] = tLocalMatrix[3] * aX,
			tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY,
			tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY,
			tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY,
			tLocalMatrix[7] = tLocalMatrix[7] * aY,
			tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ,
			tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ,
			tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ,
			tLocalMatrix[11] = tLocalMatrix[11] * aZ;

		// 부모가 있으면 곱처리함

		parentMTX ?
			(
				// 부모매트릭스 복사
				// 매트립스 곱
				a00 = parentMTX[0], a01 = parentMTX[1], a02 = parentMTX[2], a03 = parentMTX[3],
					a10 = parentMTX[4], a11 = parentMTX[5], a12 = parentMTX[6], a13 = parentMTX[7],
					a20 = parentMTX[8], a21 = parentMTX[9], a22 = parentMTX[10], a23 = parentMTX[11],
					a30 = parentMTX[12], a31 = parentMTX[13], a32 = parentMTX[14], a33 = parentMTX[15],
					b0 = tLocalMatrix[0], b1 = tLocalMatrix[1], b2 = tLocalMatrix[2], b3 = tLocalMatrix[3],
					tMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
					tMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
					tMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
					tMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
					b0 = tLocalMatrix[4], b1 = tLocalMatrix[5], b2 = tLocalMatrix[6], b3 = tLocalMatrix[7],
					tMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
					tMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
					tMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
					tMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
					b0 = tLocalMatrix[8], b1 = tLocalMatrix[9], b2 = tLocalMatrix[10], b3 = tLocalMatrix[11],
					tMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
					tMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
					tMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
					tMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
					b0 = tLocalMatrix[12], b1 = tLocalMatrix[13], b2 = tLocalMatrix[14], b3 = tLocalMatrix[15],
					tMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
					tMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
					tMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
					tMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
			)
			: (
				tMatrix[0] = tLocalMatrix[0], tMatrix[1] = tLocalMatrix[1], tMatrix[2] = tLocalMatrix[2], tMatrix[3] = tLocalMatrix[3],
					tMatrix[4] = tLocalMatrix[4], tMatrix[5] = tLocalMatrix[5], tMatrix[6] = tLocalMatrix[6], tMatrix[7] = tLocalMatrix[7],
					tMatrix[8] = tLocalMatrix[8], tMatrix[9] = tLocalMatrix[9] , tMatrix[10] = tLocalMatrix[10], tMatrix[11] = tLocalMatrix[11],
					tMatrix[12] = tLocalMatrix[12], tMatrix[13] = tLocalMatrix[13], tMatrix[14] = tLocalMatrix[14], tMatrix[15] = tLocalMatrix[15]
			);

		this.calcNormalTransform(parent)
	}

}