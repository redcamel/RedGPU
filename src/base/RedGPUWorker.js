/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.21 12:26:45
 *
 */


function createWorker(f) {
	let resolve, reject;
	let worker = new Worker(URL.createObjectURL(new Blob([`onmessage = e=>postMessage((${f})(e.data))`], {type: 'text/javascript'})));
	worker.onmessage = e => resolve(e.data)
	worker.onerror = e => reject(e.data)
	return data => new Promise((res, rej) => {
		resolve = res;
		reject = rej;
		worker.postMessage(data)
	})
}
let RedGPUWorker = {
	createWorkerPromise: createWorker
}

export default RedGPUWorker