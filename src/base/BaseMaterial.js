/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */

"use strict";
import ShaderModule_GLSL from "../resources/ShaderModule_GLSL.js";
import Sampler from "../resources/Sampler.js";
import UUID from "./UUID.js";
import UniformBuffer from "../buffer/UniformBuffer.js";
import UniformBufferDescriptor from "../buffer/UniformBufferDescriptor.js";
import BindGroup from "../buffer/BindGroup.js";
import RedGPUContext from "../RedGPUContext.js";

const TABLE = new Map();
let makeUniformBindLayout = function (redGPUContext, uniformsBindGroupLayoutDescriptor) {
	let uniformsBindGroupLayout;
	if (!(uniformsBindGroupLayout = TABLE.get(uniformsBindGroupLayoutDescriptor))) {
		uniformsBindGroupLayout = redGPUContext.device.createBindGroupLayout(uniformsBindGroupLayoutDescriptor);
		TABLE.set(uniformsBindGroupLayoutDescriptor, uniformsBindGroupLayout)
	}
	return uniformsBindGroupLayout
};
let BaseMaterial_searchModules_callNum = 0;
export default class BaseMaterial extends UUID {
	get redGPUContext() {return this.#redGPUContext;}
	set redGPUContext(value) {this.#redGPUContext = value;}
	static uniformBufferDescriptor_empty = [];

	uniformBufferDescriptor_vertex;
	uniformBufferDescriptor_fragment;
	GPUBindGroupLayout;
	#uniformBufferUpdated = false;
	vShaderModule;
	fShaderModule;
	vertexStage;
	fragmentStage;
	bindings;
	#redGPUContext;
	//
	uniformBuffer_vertex;
	uniformBuffer_fragment;
	uniformBindGroup_material;
	needResetBindingInfo = true;
	constructor(redGPUContext) {
		super();
		let vShaderModule, fShaderModule;
		let materialClass = this.constructor;
		let vertexGLSL = materialClass.vertexShaderGLSL;
		let fragmentGLSL = materialClass.fragmentShaderGLSL;
		let programOptionList = materialClass.PROGRAM_OPTION_LIST || {vertex: [], fragment: []};

		fShaderModule = new ShaderModule_GLSL(redGPUContext, 'fragment', materialClass, fragmentGLSL);
		vShaderModule = new ShaderModule_GLSL(redGPUContext, 'vertex', materialClass, vertexGLSL);

		if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_vertex.`);
		if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_fragment.`);
		if (!materialClass.uniformsBindGroupLayoutDescriptor_material) throw  new Error(`${materialClass.name} : must define a static uniformsBindGroupLayoutDescriptor_material.`);

		this.uniformBufferDescriptor_vertex = new UniformBufferDescriptor(materialClass.uniformBufferDescriptor_vertex);
		this.uniformBufferDescriptor_fragment = new UniformBufferDescriptor(materialClass.uniformBufferDescriptor_fragment);
		this.GPUBindGroupLayout = makeUniformBindLayout(redGPUContext, materialClass.uniformsBindGroupLayoutDescriptor_material);

		this.vShaderModule = vShaderModule;
		this.fShaderModule = fShaderModule;

		// 버퍼속성
		this.uniformBuffer_vertex = new UniformBuffer(redGPUContext);
		this.uniformBuffer_vertex.setBuffer(this.uniformBufferDescriptor_vertex);
		this.uniformBuffer_fragment = new UniformBuffer(redGPUContext);
		this.uniformBuffer_fragment.setBuffer(this.uniformBufferDescriptor_fragment);
		this.uniformBindGroup_material = new BindGroup(redGPUContext);

		this.#redGPUContext = redGPUContext;
	}
	updateUniformBuffer() {
		let tempFloat32 = new Float32Array(1);
		//TODO : 이거 한번에 업데이트 할수있게 수정해야함
		let i2;
		let dataVertex, dataFragment, tData;
		let tValue;
		dataVertex = this.uniformBufferDescriptor_vertex.redStruct;
		dataFragment = this.uniformBufferDescriptor_fragment.redStruct;
		i2 = dataVertex.length > dataFragment.length ? dataVertex.length : dataFragment.length;
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
				this.uniformBuffer_vertex.float32Array.set(tValue, tData['offset'] / Float32Array.BYTES_PER_ELEMENT)
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
				this.uniformBuffer_fragment.float32Array.set(tValue, tData['offset'] / Float32Array.BYTES_PER_ELEMENT)

			}
		}
		this.uniformBuffer_vertex.GPUBuffer.setSubData(0, this.uniformBuffer_vertex.float32Array);
		this.uniformBuffer_fragment.GPUBuffer.setSubData(0, this.uniformBuffer_fragment.float32Array);
	}

	checkTexture(texture, textureName) {throw new Error(`${this.constructor.name} : checkTexture must override!!!`)}

	resetBindingInfo() {throw new Error(`${this.constructor.name} : resetBindingInfo must override!!!`)}

	_afterResetBindingInfo() {
		if (RedGPUContext.useDebugConsole) console.time('_afterResetBindingInfo - ' + this.constructor.name);
		this.searchModules();
		this.setUniformBindGroupDescriptor();
		this.uniformBindGroup_material.setGPUBindGroup(this.uniformBindGroupDescriptor);
		if (!this.#uniformBufferUpdated) {
			this.updateUniformBuffer();
			this.#uniformBufferUpdated = true;
		}
		if (RedGPUContext.useDebugConsole) console.timeEnd('_afterResetBindingInfo - ' + this.constructor.name);
		this.updateUUID();
	}

	searchModules() {
		BaseMaterial_searchModules_callNum++;
		if (RedGPUContext.useDebugConsole) console.log('BaseMaterial_searchModules_callNum', BaseMaterial_searchModules_callNum);
		let tKeyVertex = [this.constructor.name];
		let tKeyFragment = [this.constructor.name];
		let i = 0, len = Math.max(this.constructor.PROGRAM_OPTION_LIST.vertex.length,this.constructor.PROGRAM_OPTION_LIST.fragment.length);
		for (i; i < len; i++) {
			let key;
			key= this.constructor.PROGRAM_OPTION_LIST.vertex[i];
			if (key && this[key]) tKeyVertex.push(key);
			key= this.constructor.PROGRAM_OPTION_LIST.fragment[i];
			if (key && this[key]) tKeyFragment.push(key);
		}
		if (RedGPUContext.useDebugConsole) console.log('searchModules_vertex_', tKeyVertex);
		if (RedGPUContext.useDebugConsole) console.log('searchModules_fragment_', tKeyFragment);
		if (RedGPUContext.useDebugConsole) console.time('searchModules_vertex_' + tKeyVertex);
		if (RedGPUContext.useDebugConsole) console.time('searchModules_fragment_' + tKeyFragment);
		this.vShaderModule.searchShaderModule(tKeyVertex);
		this.fShaderModule.searchShaderModule(tKeyFragment);
		if (RedGPUContext.useDebugConsole) console.timeEnd('searchModules_vertex_' + tKeyVertex);
		if (RedGPUContext.useDebugConsole) console.timeEnd('searchModules_fragment_' + tKeyFragment);
	}

	setUniformBindGroupDescriptor() {
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
	}
}