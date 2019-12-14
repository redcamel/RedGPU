/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:10:39
 *
 */
const rootMap = {
	vertex: {},
	fragment: {}
};
const shaderModuleMap = {
	vertex: {},
	fragment: {}
};
let RedShaderModule_GLSL_searchShaderModule_callNum = 0;
const parseSource = function (tSource, replaceList) {
	tSource = JSON.parse(JSON.stringify(tSource));
	console.time('searchTime :' + replaceList);
	let i = replaceList.length;
	while (i--) {
		let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
		tSource = tSource.replace(tReg, '')
	}
	console.timeEnd('searchTime :' + replaceList);
	return tSource
};
export default class RedShaderModule_GLSL {
	#redGPUContext;
	type;
	shaderModuleMap;
	GPUShaderModule;
	currentKey;
	constructor(redGPUContext, type, materialClass, source,) {
		if (!rootMap[type][materialClass.name]) {
			let tSourceMap = new Map();
			tSourceMap.set(materialClass.name, source);
			rootMap[type][materialClass.name] = tSourceMap;
		}
		this.#redGPUContext = redGPUContext;
		this.type = type;
		this.originSource = source;
		this.sourceMap = rootMap[type][materialClass.name];
		if (!shaderModuleMap[type][materialClass.name]) shaderModuleMap[type][materialClass.name] = {};
		this.shaderModuleMap = shaderModuleMap[type][materialClass.name];
		this.searchShaderModule([materialClass.name]);

		// console.log(this);
	}

	searchShaderModule(optionList) {
		optionList.sort();
		let searchKey = optionList.join('_');
		if (this.currentKey == searchKey) return;
		RedShaderModule_GLSL_searchShaderModule_callNum++;
		console.log('RedShaderModule_GLSL_searchShaderModule_callNum', RedShaderModule_GLSL_searchShaderModule_callNum);
		this.currentKey = searchKey;
		if (!this.sourceMap.get(searchKey)) {
			this.sourceMap.set(searchKey, parseSource(this.originSource, optionList));
		}
		if (this.shaderModuleMap[searchKey]) {
			this.GPUShaderModule = this.shaderModuleMap[searchKey];
			return this.GPUShaderModule
		} else {

			console.time('compileGLSL : ' + this.type + ' / ' + searchKey);
			this.shaderModuleDescriptor = {
				key: searchKey,
				code: this.#redGPUContext.glslang.compileGLSL(this.sourceMap.get(searchKey), this.type),
				source: this.sourceMap.get(searchKey)
			};
			console.timeEnd('compileGLSL : ' + this.type + ' / ' + searchKey);
			this.GPUShaderModule = this.#redGPUContext.device.createShaderModule(this.shaderModuleDescriptor);
			this.shaderModuleMap[searchKey] = this.GPUShaderModule;
			// console.log(searchKey, this.shaderModuleMap[searchKey])
		}


	}
}