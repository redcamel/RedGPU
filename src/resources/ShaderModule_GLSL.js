/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 19:42:18
 *
 */
import RedGPUContext from "../RedGPUContext.js";

//TODO 정리해야함
//TODO 정리해야함
//TODO 정리해야함
//TODO 정리해야함
function createWorker(f) {
	return new Worker(URL.createObjectURL(new Blob([`(${f})()`])));
}

const worker = createWorker(async () => {
	let glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
	let glslang = await glslangModule.default();
	const parseSource = function (tSource, replaceList) {
		tSource = JSON.parse(JSON.stringify(tSource));
		// console.time('searchTime :' + replaceList);
		let i = replaceList.length;
		while (i--) {
			let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
			tSource = tSource.replace(tReg, '')
		}
		// console.timeEnd('searchTime :' + replaceList);
		return tSource
	};

	self.addEventListener('message', e => {
		const type = e.data.type;
		const name = e.data.name;
		let originSource = e.data.originSource;
		let temp = {}
		let num = 0
		//FIXME - 이부분 최적화해야함
		let parse = optionList => {
			let i = optionList.length;
			while (i--) {
				let searchKey = name + '_' + optionList.join('_')
				if (!temp[searchKey]) {
					temp[searchKey] = 1
					let parsedSource = parseSource(originSource, optionList)
					console.time('compileGLSL - in worker : ' + type + ' / ' + searchKey);
					let compileGLSL = glslang.compileGLSL(parsedSource, type)
					console.timeEnd('compileGLSL - in worker : ' + type + ' / ' + searchKey);
					num++
					self.postMessage({
						endCompile: true,
						name: name,
						searchKey: searchKey,
						compileGLSL: compileGLSL,
						type: type
					});
				}
				let newList = optionList.concat();
				newList.splice(i, 1);
				parse(newList);
			}
		};
		parse(e.data.optionList);

		self.postMessage({
			end: true,
			name: name,
			type: type,
			totalNum: num
		});
		// console.log('optionList', e.data.optionList)
	});
});

function glslParserWorker(target, name, originSource, type, optionList) {
	return new Promise((resolve, reject) => {
		function handler(e) {
			if (e.data.name === name && e.data.type === type) {

				if (e.data.endCompile) {
					// console.log('오니', e.data.searchKey)
					let tSearchKey = e.data.searchKey;
					if (!target.sourceMap.has(tSearchKey)) {
						target.sourceMap.set(tSearchKey, e.data.compileGLSL);
					}
					if (e.data.error) reject(e.data.error);
				}
				if (e.data.end) {
					worker.removeEventListener('message', handler);
					resolve(e)
				}
			}
		}
		worker.addEventListener('message', handler);
		worker.postMessage({
			originSource: originSource,
			name: name,
			type: type,
			optionList: optionList
		});
	});
}
const checkMap = {
	vertex: {},
	fragment: {}
}
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
			let tSourceMap = new Map();
			tSourceMap.set(materialClass.name, source);
			rootOriginSourceMap[type][materialClass.name] = tSourceMap;
		}
		this.#redGPUContext = redGPUContext;
		this.type = type;
		this.originSource = source;
		this.sourceMap = rootOriginSourceMap[type][materialClass.name];
		if (!shaderModuleMap[type][materialClass.name]) shaderModuleMap[type][materialClass.name] = {};
		this.shaderModuleMap = shaderModuleMap[type][materialClass.name];
		this.searchShaderModule([materialClass.name]);
		if (!checkMap[type][materialClass.name]) {
			checkMap[type][materialClass.name] = 1
			glslParserWorker(this, materialClass.name, this.originSource, this.type, materialClass.PROGRAM_OPTION_LIST).then(
				e => {
					console.log('종료', e.data.name, e.data.type, e.data.totalNum)
					// console.log(this.sourceMap)
				}
			)
		}

		// console.log(this);
	}

	searchShaderModule(optionList) {
		optionList.sort();
		let searchKey = optionList.join('_');
		if (this.currentKey == searchKey) return;
		ShaderModule_GLSL_searchShaderModule_callNum++;
		if (RedGPUContext.useDebugConsole) console.log('ShaderModule_GLSL_searchShaderModule_callNum', ShaderModule_GLSL_searchShaderModule_callNum);
		this.currentKey = searchKey;

		if (!this.sourceMap.get(searchKey)) {
			this.sourceMap.set(searchKey, parseSource(this.originSource, optionList));
		}
		if (this.shaderModuleMap[searchKey]) {
			this.GPUShaderModule = this.shaderModuleMap[searchKey];
			return this.GPUShaderModule
		} else {
			// console.log('searchKey', searchKey)
			let tCompileGLSL;
			console.time('compileGLSL : ' + this.type + ' / ' + searchKey);
			if (this.sourceMap.get(searchKey) && this.sourceMap.get(searchKey) instanceof Uint32Array) {
				tCompileGLSL = this.sourceMap.get(searchKey)
				console.log('compileGLSL - 캐쉬된놈을 쓴다', this.type, searchKey)
			} else {

				tCompileGLSL = this.#redGPUContext.glslang.compileGLSL(this.sourceMap.get(searchKey), this.type)
				console.log('compileGLSL - 신규생성을 쓴다', this.type, searchKey)
			}
			console.timeEnd('compileGLSL : ' + this.type + ' / ' + searchKey);
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