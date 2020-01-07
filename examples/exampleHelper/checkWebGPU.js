/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 18:49:16
 *
 */
'use strict'
var CheckWebGPU = {
	checkWebGPU: (function () {
		var makeScript;
		makeScript = function (src, type, onload) {
			let script;
			script = document.createElement('script');
			if (type) script.type = type;
			if (onload) script.onload = onload;
			script.src = src;
			document.head.appendChild(script)

		};
		return function (title) {
			if (navigator.gpu) {
				makeScript("../exampleHelper/ExampleHelper.js");
				makeScript("./index.js", 'module', _ => {
					ExampleHelper.setBaseInformation(title);
				});
			} else {
				alert('WebGPU를 지원하지 않음')
			}
		}
	})()
};
