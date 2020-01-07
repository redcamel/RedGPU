/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 22:3:4
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
				makeScript("https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js");
				makeScript("../exampleHelper/ExampleHelper.js");
				makeScript("./index.js", 'module', (function () {
					let t0 = title;
					return function(){
						ExampleHelper.setBaseInformation(t0)
					}
				})());
			} else {
				alert('WebGPU를 지원하지 않음')
			}
		}
	})()
};
