/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.21 12:26:45
 *
 */
import RedGPUWorker from "../src/base/RedGPUWorker.js";

let t = RedGPUWorker.createWorkerPromise(str=>str+'world')
t('hello').then(async e=>{

	let glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
	let glslang = await glslangModule.default();
})

