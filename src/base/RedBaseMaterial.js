/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 18:53:51
 *
 */

"use strict";
import RedShaderModule_GLSL from "../resources/RedShaderModule_GLSL.js";
import RedSampler from "../resources/RedSampler.js";
import RedUUID from "./RedUUID.js";
import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedUniformBufferDescriptor from "../buffer/RedUniformBufferDescriptor.js";
import RedBindGroup from "../buffer/RedBindGroup.js";

const TABLE = new Map();
let makeUniformBindLayout = function (redGPU, uniformsBindGroupLayoutDescriptor) {
	let uniformsBindGroupLayout;
	if (!(uniformsBindGroupLayout = TABLE.get(uniformsBindGroupLayoutDescriptor))) {
		uniformsBindGroupLayout = redGPU.device.createBindGroupLayout(uniformsBindGroupLayoutDescriptor);
		TABLE.set(uniformsBindGroupLayoutDescriptor, uniformsBindGroupLayout)
	}
	return uniformsBindGroupLayout
};
let RedBaseMaterial_searchModules_callNum = 0
export default class RedBaseMaterial extends RedUUID {
	get redGPU() {
		return this.#redGPU;
	}

	set redGPU(value) {
		this.#redGPU = value;
	}
	static uniformBufferDescriptor_empty = [];

	uniformBufferDescriptor_vertex;
	uniformBufferDescriptor_fragment;
	GPUBindGroupLayout;
	#uniformBufferUpdated = false;
	vShaderModule;
	fShaderModule;
	vertexStage;
	fragmentStage;
	sampler;
	bindings;
	#redGPU;
	//
	uniformBuffer_vertex;
	uniformBuffer_fragment;
	uniformBindGroup_material;
	needResetBindingInfo = false
	constructor(redGPU) {
		super();
		let vShaderModule, fShaderModule;
		let materialClass = this.constructor;
		let vertexGLSL = materialClass.vertexShaderGLSL;
		let fragmentGLSL = materialClass.fragmentShaderGLSL;
		let programOptionList = materialClass.PROGRAM_OPTION_LIST || [];

		vShaderModule = new RedShaderModule_GLSL(redGPU, 'vertex', materialClass, vertexGLSL);
		fShaderModule = new RedShaderModule_GLSL(redGPU, 'fragment', materialClass, fragmentGLSL);

		if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_vertex.`);
		if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_fragment.`);
		if (!materialClass.uniformsBindGroupLayoutDescriptor_material) throw  new Error(`${materialClass.name} : must define a static uniformsBindGroupLayoutDescriptor_material.`);

		this.uniformBufferDescriptor_vertex = new RedUniformBufferDescriptor(materialClass.uniformBufferDescriptor_vertex);
		this.uniformBufferDescriptor_fragment = new RedUniformBufferDescriptor(materialClass.uniformBufferDescriptor_fragment);
		this.GPUBindGroupLayout = makeUniformBindLayout(redGPU, materialClass.uniformsBindGroupLayoutDescriptor_material);

		this.vShaderModule = vShaderModule;
		this.fShaderModule = fShaderModule;

		// 버퍼속성
		this.uniformBuffer_vertex = new RedUniformBuffer(redGPU);
		this.uniformBuffer_vertex.setBuffer(this.uniformBufferDescriptor_vertex);
		this.uniformBuffer_fragment = new RedUniformBuffer(redGPU);
		this.uniformBuffer_fragment.setBuffer(this.uniformBufferDescriptor_fragment);
		this.uniformBindGroup_material = new RedBindGroup(redGPU);


		this.sampler = new RedSampler(redGPU);
		this.#redGPU = redGPU;
	}
	updateUniformBuffer() {
		let tempFloat32 = new Float32Array(1);
		//음 전체 속성 업데이트라고 봐야할까나..
		//TODO : 최적화...필요..
		let i2;
		let dataVertex, dataFragment, tData;
		let tValue;
		dataVertex = this.uniformBufferDescriptor_vertex.redStruct;
		dataFragment = this.uniformBufferDescriptor_fragment.redStruct;
		// console.log(dataVertex)
		i2 = dataVertex.length > dataFragment.length ? dataVertex.length : dataFragment.length;
		// console.log('뭐하나보자')
		//FIXME - _로 가져올 수있게 변경할까?
		while (i2--) {
			tData = dataVertex[i2];
			if (tData) {
				// console.log(tData);
				tValue = this[tData.valueName];
				if (typeof tValue == 'number') {
					tempFloat32[0] = tValue;
					tValue = tempFloat32
				}
				this.uniformBuffer_vertex.GPUBuffer.setSubData(tData['offset'], tValue);

			}
			tData = dataFragment[i2];

			if (tData) {
				// console.log(tData);
				tValue = this[tData.valueName];
				// 	console.log('변경!',tData)
				if (typeof tValue == 'number') {
					tempFloat32[0] = tValue;
					tValue = tempFloat32
				}
				this.uniformBuffer_fragment.GPUBuffer.setSubData(tData['offset'], tValue);

			}
		}
	}

	checkTexture(texture, textureName) {
		throw new Error(`${this.constructor.name} : checkTexture must override!!!`)
	}

	resetBindingInfo() {
		throw new Error(`${this.constructor.name} : resetBindingInfo must override!!!`)
	}
	_afterResetBindingInfo() {
		console.time('_afterResetBindingInfo'+this._UUID)

		this.searchModules();
		this.setUniformBindGroupDescriptor();
		this.uniformBindGroup_material.setGPUBindGroup(this.uniformBindGroupDescriptor);
		if (!this.#uniformBufferUpdated) {
			this.updateUniformBuffer();
			this.#uniformBufferUpdated = true;
		}
		console.timeEnd('_afterResetBindingInfo'+this._UUID)
		this.updateUUID();
	}

	searchModules() {
		// console.log(this, this.constructor, this.constructor.name);
		// console.log(this.constructor.PROGRAM_OPTION_LIST);
		RedBaseMaterial_searchModules_callNum++
		console.log('RedBaseMaterial_searchModules_callNum', RedBaseMaterial_searchModules_callNum)
		let tKey = [this.constructor.name];
		let i = 0, len = this.constructor.PROGRAM_OPTION_LIST.length;
		for (i; i < len; i++) {
			let key = this.constructor.PROGRAM_OPTION_LIST[i];
			// console.log(key, this[key]);
			if (this[key]) tKey.push(key);
		}
		// tKey = tKey.join('_');
		console.log('searchModules', tKey);
		this.vShaderModule.searchShaderModule(tKey);
		this.fShaderModule.searchShaderModule(tKey);
		// console.log(this.vShaderModule);
		// console.log(this.fShaderModule);
	}

	setUniformBindGroupDescriptor() {
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
	}
}