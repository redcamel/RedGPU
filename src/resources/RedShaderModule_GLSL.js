/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 18:48:37
 *
 */
const rootMap = {
	vertex: {},
	fragment: {}
}
const shaderModuleMap = {
	vertex: {},
	fragment: {}
}
let RedShaderModule_GLSL_callNum = 0
const parseSource = function (tSource, replaceList) {
	tSource = JSON.parse(JSON.stringify(tSource))
	console.time('searchTime :' + replaceList)
	let i = replaceList.length
	while (i--) {
		let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
		tSource = tSource.replace(tReg, '')
	}

	console.timeEnd('searchTime :' + replaceList)
	return tSource
}
export default class RedShaderModule_GLSL {
	#redGPU;
	type;
	shaderModuleMap;
	GPUShaderModule;
	currentKey;
	constructor(redGPU, type, materialClass, source, programOptionList = []) {
		if (!rootMap[type][materialClass.name]) {
			let tSourceMap = new Map();
			programOptionList.sort();
			// let parseSource = function (optionList) {
			// 	let i = optionList.length;
			// 	while(i--){
			// 		let key = optionList[i]
			// 		let newList = optionList.concat();
			// 		let tSource = source;
			// 		newList.forEach(function (replaceKey) {
			// 			let tReg = new RegExp(`\/\/\#RedGPU\#${replaceKey}\#`, 'gi');
			// 			tSource = tSource.replace(tReg, '')
			// 		});
			// 		tSourceMap.set([materialClass.name, ...newList].join('_'), tSource);
			// 		newList.splice(i, 1);
			// 		parseSource(newList);
			// 	}
			//
			//
			// };
			// parseSource(programOptionList);
			tSourceMap.set(materialClass.name, source);
			rootMap[type][materialClass.name] = tSourceMap;
		}
		this.#redGPU = redGPU;
		this.type = type;
		this.originSource = source;
		this.sourceMap = rootMap[type][materialClass.name];
		if (!shaderModuleMap[type][materialClass.name]) shaderModuleMap[type][materialClass.name] = {}
		this.shaderModuleMap = shaderModuleMap[type][materialClass.name]
		this.searchShaderModule([materialClass.name]);

		console.log(this);
	}

	searchShaderModule(optionList) {
		optionList.sort()
		let searchKey = optionList.join('_')
		if (this.currentKey == searchKey) return
		RedShaderModule_GLSL_callNum++
		console.log('RedShaderModule_GLSL_callNum',RedShaderModule_GLSL_callNum)
		this.currentKey = searchKey
		if (!this.sourceMap.get(searchKey)) {
			this.sourceMap.set(searchKey, parseSource(this.originSource, optionList));
		}
		if (this.shaderModuleMap[searchKey]) {
			this.GPUShaderModule = this.shaderModuleMap[searchKey];
			return this.GPUShaderModule
		} else {

			this.shaderModuleDescriptor = {
				key: searchKey,
				code: this.#redGPU.glslang.compileGLSL(this.sourceMap.get(searchKey), this.type),
				source: this.sourceMap.get(searchKey)
			};
			this.GPUShaderModule = this.#redGPU.device.createShaderModule(this.shaderModuleDescriptor);
			this.shaderModuleMap[searchKey] = this.GPUShaderModule;
			// console.log(searchKey, this.shaderModuleMap[searchKey])
		}


	}
}