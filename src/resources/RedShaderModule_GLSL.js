/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

export default class RedShaderModule_GLSL {
	#redGPU;
	type;
	sourceMap;
	shaderModuleMap;
	GPUShaderModule;

	constructor(redGPU, type, materialClass, source, programOptionList = []) {
		let tSourceMap = new Map();
		programOptionList.sort();
		let parseSource = function (optionList) {
			//[a,b]
			optionList.forEach(
				function (key, index) {
					let newList = optionList.concat();
					let tSource = source;
					newList.forEach(function (replaceKey) {
						let tReg = new RegExp(`\/\/\#RedGPU\#${replaceKey}\#`, 'gi');
						tSource = tSource.replace(tReg, '')
					});
					tSourceMap.set([materialClass.name, ...newList].join('_'), tSource);
					newList.splice(index, 1);
					parseSource(newList);
				}
			);

		};
		parseSource(programOptionList);
		tSourceMap.set(materialClass.name, source);
		this.#redGPU = redGPU;
		this.type = type;
		this.sourceMap = tSourceMap;
		this.shaderModuleMap = new Map();
		this.searchShaderModule(materialClass.name);
		console.log(this);
	}

	async searchShaderModule(key) {
		console.log('searchShaderModule', key);
		if (this.shaderModuleMap.get(key)) {
			this.GPUShaderModule = this.shaderModuleMap.get(key);
			return this.GPUShaderModule
		} else {

			this.shaderModuleDescriptor = {
				key: key,
				code: await this.#redGPU.glslang.compileGLSL(this.sourceMap.get(key), this.type),
				source: this.sourceMap.get(key)
			};
			this.GPUShaderModule = await this.#redGPU.device.createShaderModule(this.shaderModuleDescriptor);
			this.shaderModuleMap.set(key, this.GPUShaderModule);
			console.log(key, this.shaderModuleMap.get(key))
		}


	}
}