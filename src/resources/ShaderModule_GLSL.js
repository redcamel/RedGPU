/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.26 20:16:42
 *
 */
import RedGPUContext from "../RedGPUContext.js";
import RedGPUWorker from "../base/RedGPUWorker.js";

//TODO 정리해야함
//TODO 정리해야함
//TODO 정리해야함
//TODO 정리해야함
const checkMap = {
	vertex: {},
	fragment: {}
};
const rootOriginSourceMap = {
	vertex: {},
	fragment: {}
};
const shaderModuleMap = {
	vertex: {},
	fragment: {}
};
let ShaderModule_GLSL_searchShaderModule_callNum = 0;
const parseSource = function (tSource, replaceList) {
	tSource = JSON.parse(JSON.stringify(tSource));
	if (RedGPUContext.useDebugConsole) console.time('searchTime :' + replaceList);
	let i = replaceList.length;
	while (i--) {
		let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
		tSource = tSource.replace(tReg, '')
	}
	if (RedGPUContext.useDebugConsole) console.timeEnd('searchTime :' + replaceList);
	return tSource
};
export default class ShaderModule_GLSL {
	#redGPUContext;
	type;
	shaderModuleMap;
	GPUShaderModule;
	currentKey;
	constructor(redGPUContext, type, materialClass, source,) {
		if (!rootOriginSourceMap[type][materialClass.name]) {
			rootOriginSourceMap[type][materialClass.name] = new Map();
			;
		}
		this.#redGPUContext = redGPUContext;
		this.type = type;
		this.originSource = source;
		this.sourceMap = rootOriginSourceMap[type][materialClass.name];
		if (!shaderModuleMap[type][materialClass.name]) shaderModuleMap[type][materialClass.name] = {};
		this.shaderModuleMap = shaderModuleMap[type][materialClass.name];
		if (!checkMap[type][materialClass.name]) {
			console.log('type',type)
			console.log(`materialClass.PROGRAM_OPTION_LIST - ${materialClass.name}`, materialClass.PROGRAM_OPTION_LIST[type].length, materialClass.PROGRAM_OPTION_LIST[type]);
			checkMap[type][materialClass.name] = 1;
			if (materialClass.PROGRAM_OPTION_LIST[type].length) {
				RedGPUWorker.glslParserWorker(this, materialClass.name, this.originSource, this.type, materialClass.PROGRAM_OPTION_LIST[type]).then(
					e => {
						console.log('모든경우의수 컴파일 완료', e.data.shaderName, e.data.shaderType, e.data.totalNum)
						// console.log(this.sourceMap)
					}
				)
			}
		}
		this.searchShaderModule([materialClass.name]);

	}

	searchShaderModule(optionList) {
		optionList.sort();
		let searchKey = optionList.join('_');
		if (this.currentKey == searchKey) return;
		ShaderModule_GLSL_searchShaderModule_callNum++;
		if (RedGPUContext.useDebugConsole) console.log('ShaderModule_GLSL_searchShaderModule_callNum', ShaderModule_GLSL_searchShaderModule_callNum);
		this.currentKey = searchKey;
		if (this.shaderModuleMap[searchKey]) {
			this.GPUShaderModule = this.shaderModuleMap[searchKey];
			return this.GPUShaderModule
		} else {
			// console.log('searchKey', searchKey)
			let tCompileGLSL;
			// console.time('compileGLSL : ' + this.type + ' / ' + searchKey);
			if (this.sourceMap.get(searchKey) instanceof Uint32Array) {
				tCompileGLSL = this.sourceMap.get(searchKey);
				console.log('compileGLSL - 캐쉬된놈을 쓴다', this.type, searchKey)
			} else {
				if (!this.sourceMap.get(searchKey)) {
					this.sourceMap.set(searchKey, this.#redGPUContext.glslang.compileGLSL(parseSource(this.originSource, optionList), this.type));
				}
				tCompileGLSL = this.sourceMap.get(searchKey);
				console.log('compileGLSL - 신규생성을 쓴다', this.type, searchKey)
			}
			// console.timeEnd('compileGLSL : ' + this.type + ' / ' + searchKey);
			// console.log(' 쓴다', tCompileGLSL)

			this.shaderModuleDescriptor = {
				key: searchKey,
				code: tCompileGLSL,
				// source: this.sourceMap.get(searchKey)
			};
			this.GPUShaderModule = this.#redGPUContext.device.createShaderModule(this.shaderModuleDescriptor);
			this.shaderModuleMap[searchKey] = this.GPUShaderModule;

		}


	}
}