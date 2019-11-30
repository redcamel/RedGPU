/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 18:40:19
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
	constructor(redGPU) {
		super();
		let vShaderModule, fShaderModule;
		let materialClass = this.constructor;
		let vertexGLSL = materialClass.vertexShaderGLSL;
		let fragmentGLSL = materialClass.fragmentShaderGLSL;
		let programOptionList = materialClass.PROGRAM_OPTION_LIST || [];
		let vKey = materialClass.name + '_vertex';
		let fKey = materialClass.name + '_fragment';
		vShaderModule = new RedShaderModule_GLSL(redGPU, 'vertex', materialClass, vertexGLSL, programOptionList);
		fShaderModule = new RedShaderModule_GLSL(redGPU, 'fragment', materialClass, fragmentGLSL, programOptionList);

		if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : uniformBufferDescriptor_vertex 를 정의해야함`);
		if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : uniformBufferDescriptor_fragment 를 정의해야함`);
		if (!materialClass.uniformsBindGroupLayoutDescriptor_material) throw  new Error(`${materialClass.name} : uniformsBindGroupLayoutDescriptor 를  정의해야함`);

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
		while (i2--) {
			tData = dataVertex[i2];
			// console.log(tData)
			if (tData) {
				tValue = this[tData.valueName];
				if (typeof tValue == 'number') {
					tempFloat32[0] = tValue;
					tValue = tempFloat32
				}
				this.uniformBuffer_vertex.GPUBuffer.setSubData(tData['offset'], tValue);

			}
			tData = dataFragment[i2];
			// console.log(tData)
			if (tData) {
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
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
		this.searchModules();
		this.setUniformBindGroupDescriptor();
		this.uniformBindGroup_material.setGPUBindGroup(this.uniformBindGroupDescriptor);
		this.updateUniformBuffer();// FIXME - 아마도 프로그램당 고유 재질 주소를 공유한다고 치면... 재질 프로그램 버전별로 하나씩 들고있어야한다...그렇다면 이거 재업로드 비용을 상당히 줄일수있을듯
		this.updateUUID();
	}

	searchModules() {
		console.log(this,this.constructor,this.constructor.name)
		console.log(this.constructor.PROGRAM_OPTION_LIST)
		let tKey = [this.constructor.name];
		let i = 0, len = this.constructor.PROGRAM_OPTION_LIST.length;
		for (i; i < len; i++) {
			let key = this.constructor.PROGRAM_OPTION_LIST[i];
			console.log(key,this[key])
			if (this[key]) tKey.push(key);
		}
		tKey = tKey.join('_');
		console.log('searchModules', tKey);
		this.vShaderModule.searchShaderModule(tKey);
		this.fShaderModule.searchShaderModule(tKey);
		console.log(this.vShaderModule);
		console.log(this.fShaderModule);
	}

	setUniformBindGroupDescriptor() {
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
	}
}