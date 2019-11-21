"use strict";

import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedDisplayContainer from "./RedDisplayContainer.js";

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
	#dirtyTransform = true;
	//
	#material;
	#geometry;
	#redGPU;
	uniformBuffer;
	//
	#useDepthTest = true;
	#depthTestFunc = 'less-equal';
	#cullMode = 'back';
	#primitiveTopology = "triangle-list";

	constructor(redGPU) {
		super();
		this.#redGPU = redGPU;
		this.uniformBuffer = new RedUniformBuffer(redGPU);
		this.normalMatrix = mat4.create();
		this.matrix = mat4.create()
	}

	get dirtyTransform() {
		return this.#dirtyTransform
	}

	set dirtyTransform(v) {
		this.#dirtyTransform = v
	}

	get x() {
		return this.#x
	}

	set x(v) {
		this.#x = v;
		this.#dirtyTransform = true;
	}

	get y() {
		return this.#y
	}

	set y(v) {
		this.#y = v;
		this.#dirtyTransform = true;
	}

	get z() {
		return this.#z;
	}

	set z(v) {
		this.#z = v;
		this.#dirtyTransform = true;
	}

	get rotationX() {
		return this.#rotationX;
	}

	set rotationX(v) {
		this.#rotationX = v;
		this.#dirtyTransform = true;
	}

	get rotationY() {
		return this.#rotationY;
	}

	set rotationY(v) {
		this.#rotationY = v;
		this.#dirtyTransform = true;
	}

	get rotationZ() {
		return this.#rotationZ;
	}

	set rotationZ(v) {
		this.#rotationZ = v;
		this.#dirtyTransform = true;
	}

	get scaleX() {
		return this.#scaleX;
	}

	set scaleX(v) {
		this.#scaleX = v;
		this.#dirtyTransform = true;
	}

	get scaleY() {
		return this.#scaleY;
	}

	set scaleY(v) {
		this.#scaleY = v;
		this.#dirtyTransform = true;
	}

	get scaleZ() {
		return this.#scaleZ;
	}

	set scaleZ(v) {
		this.#scaleZ = v;
		this.#dirtyTransform = true;
	}

	get geometry() {
		return this.#geometry
	}

	set geometry(v) {
		this.#geometry = v;
		this.pipeline = null;
		this.dirtyTransform = true
	}

	get material() {
		return this.#material
	}

	set material(v) {
		this.#material = v;
		this.uniformBuffer.setBuffer(v.uniformBufferDescriptor);
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

	createPipeline(redGPU) {
		this.GPUBindGroup = null;
		const device = redGPU.device;
		const descriptor = {
			// 레이아웃은 재질이 알고있으니 들고옴
			layout: device.createPipelineLayout(
				{
					bindGroupLayouts: [
						redGPU.systemUniformInfo.GPUBindGroupLayout,
						this.#material.GPUBindGroupLayout
					]
				}
			),
			// 버텍스와 프레그먼트는 재질에서 들고온다.
			vertexStage: {
				module: this.#material.vShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			fragmentStage: {
				module: this.#material.fShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			// 버텍스 상태는 지오메트리가 알고있음으로 들고옴
			vertexState: this.#geometry.vertexState,
			// 컬러모드 지정하고
			colorStates: [
				{
					format: redGPU.swapChainFormat,
					alphaBlend: {
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
				depthWriteEnabled: this.#useDepthTest,
				depthCompare: this.#depthTestFunc,
				format: "depth24plus-stencil8",
			},
			//alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
		};

		let pipeline = device.createRenderPipeline(descriptor);
		this.pipeline = pipeline;
		return this.pipeline
	}

	getNormalTransform() {
		let tLocalNormalMatrix = mat4.clone(this.matrix);
		mat4.invert(tLocalNormalMatrix, tLocalNormalMatrix);
		mat4.transpose(tLocalNormalMatrix, tLocalNormalMatrix);
		return this.normalMatrix = tLocalNormalMatrix;
	}

	updateUniformBuffer() {
		for (const data of this.material.uniformBufferDescriptor.redStruct) {
			this.uniformBuffer.GPUBuffer.setSubData(data['offset'], this[data.valueName]);
		}
	}

	getTransform() {
		let tLocalMatrix = this.matrix;
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
		return this.matrix = tLocalMatrix
	}

}