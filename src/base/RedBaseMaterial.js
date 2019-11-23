"use strict";
import RedShaderModule_GLSL from "../resources/RedShaderModule_GLSL.js";
import RedSampler from "../resources/RedSampler.js";
import RedUUID from "./RedUUID.js";

let TABLE = new Map();
let makeUniformBindLayout = function (redGPU, uniformsBindGroupLayoutDescriptor) {
	let uniformsBindGroupLayout;
	if (!(uniformsBindGroupLayout = TABLE.get(uniformsBindGroupLayoutDescriptor))) {
		uniformsBindGroupLayout = redGPU.device.createBindGroupLayout(uniformsBindGroupLayoutDescriptor);
		TABLE.set(uniformsBindGroupLayoutDescriptor, uniformsBindGroupLayout)
	}
	return uniformsBindGroupLayout
};
export default class RedBaseMaterial {
	get redGPU() {
		return this.#redGPU;
	}

	set redGPU(value) {
		this.#redGPU = value;
	}

	static uniformBufferDescriptor_empty = {
		size: 1,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: []
	};
	static GLSL_SystemUniforms = `
	layout(set=0,binding = 0) uniform SystemUniforms {
        mat4 perspectiveMTX;
        mat4 cameraMTX;
    } systemUniforms;
    `;

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

	constructor(redGPU) {
		let vShaderModule, fShaderModule;
		let materialClass = this.constructor;
		let vertexGLSL = materialClass.vertexShaderGLSL
		let fragmentGLSL = materialClass.fragmentShaderGLSL
		let programOptionList = materialClass.PROGRAM_OPTION_LIST || [];
		let vKey = materialClass.name + '_vertex'
		let fKey = materialClass.name + '_fragment'
		if (!(vShaderModule = TABLE.get(vKey))) TABLE.set(vKey, vShaderModule = new RedShaderModule_GLSL(redGPU, 'vertex', materialClass, vertexGLSL, programOptionList));
		if (!(fShaderModule = TABLE.get(fKey))) TABLE.set(fKey, fShaderModule = new RedShaderModule_GLSL(redGPU, 'fragment', materialClass, fragmentGLSL, programOptionList));

		if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : uniformBufferDescriptor_vertex 를 정의해야함`);
		if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : uniformBufferDescriptor_fragment 를 정의해야함`);
		if (!materialClass.uniformsBindGroupLayoutDescriptor) throw  new Error(`${materialClass.name} : uniformsBindGroupLayoutDescriptor 를  정의해야함`);

		this.uniformBufferDescriptor_vertex = materialClass.uniformBufferDescriptor_vertex;
		this.uniformBufferDescriptor_fragment = materialClass.uniformBufferDescriptor_fragment;
		this.GPUBindGroupLayout = makeUniformBindLayout(redGPU, materialClass.uniformsBindGroupLayoutDescriptor);
		this.vShaderModule = vShaderModule;
		this.fShaderModule = fShaderModule;

		this.sampler = new RedSampler(redGPU);
		this.#redGPU = redGPU;
		this._UUID = RedUUID.makeUUID()
		console.log('TABLE', TABLE)
	}

	checkTexture(texture, textureName) {
		throw new Error(`${this.constructor.name} : must override!!!`)
	}

	resetBindingInfo() {
		throw new Error(`${this.constructor.name} : must override!!!`)
	}

	searchModules() {
		let tKey = [this.constructor.name];
		this.constructor.PROGRAM_OPTION_LIST.forEach(key => {
			if (this[key]) tKey.push(key);
		});
		this.vShaderModule.searchShaderModule(tKey.join('_'));
		this.fShaderModule.searchShaderModule(tKey.join('_'));
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