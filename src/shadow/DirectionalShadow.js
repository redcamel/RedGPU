/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 10:47:2
 *
 */
"use strict";
export default class DirectionalShadow {
	#redGPUContext;
	#castingList = [];
	#width = 512;
	#height = 512;
	#shadowSize = 1;
	#targetLight;
	baseAttachment;
	baseAttachmentView;
	lightMatrix = mat4.create();
	#tLightProjectionMTX = mat4.create();
	#resetAttachment() {
		if (this.baseAttachment) this.baseAttachment.destroy();
		this.baseAttachment = this.#redGPUContext.device.createTexture({
			shadowSize: {
				width: this.#width,
				height: this.#height,
				depth: 1
			},
			sampleCount: 1,
			format: this.#redGPUContext.swapChainFormat, // 이거 줄여도 될듯
			usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.SAMPLED
		});
		this.baseAttachmentView = this.baseAttachment.createView();
	}
	get shadowSize() {return this.#shadowSize;}
	set shadowSize(value) {this.#shadowSize = value;}
	get castingList() {return this.#castingList;}
	set castingList(value) {this.#castingList = value;}
	get height() {return this.#height;}
	set height(value) {
		this.#height = value;
		#resetAttachment()
	}
	get width() {return this.#width;}
	set width(value) {
		this.#width = value;
		#resetAttachment()
	}
	get targetLight() {return this.#targetLight;}
	set targetLight(value) {this.#targetLight = value;}
	constructor(redGPUContext, targetLight) {
		this.#redGPUContext = redGPUContext;
		this.targetLight = targetLight;
	}
	calculateLightMatrix() {
		let tPosition = [this.#targetLight.x, this.#targetLight.y, this.#targetLight.z];
		// out, left, right, bottom, top, near, far
		mat4.ortho(this.#tLightProjectionMTX, -this.#shadowSize, this.#shadowSize, -this.#shadowSize, this.#shadowSize, -this.#shadowSize, this.#shadowSize);
		vec3.normalize(tPosition, tPosition);
		mat4.identity(this.lightMatrix);
		mat4.lookAt(
			this.lightMatrix,
			tPosition,
			[0, 0, 0],
			[0, 1, 0]
		);
		mat4.multiply(this.lightMatrix, this.#tLightProjectionMTX, this.lightMatrix);
	}
	addCasting(v) { this.#castingList.includes(v) ? this.#castingList.push(v) : 0}
	removeCasting(v) {
		let t0 = this.#castingList.indexOf(v);
		t0 > -1 ? this.#castingList.splice(t0, 1) : 0
	}
	removeAllCasting() {this.#castingList.length = 0}
}
