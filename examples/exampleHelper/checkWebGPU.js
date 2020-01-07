/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 22:51:24
 *
 */
'use strict'
var CheckWebGPU = {
	checkWebGPU: (function () {
		var makeScript;
		makeScript = function (src, type, onload) {
			var script;
			script = document.createElement('script');
			if (type) script.type = type;
			if (onload) script.onload = onload;
			script.src = src;
			document.head.appendChild(script)

		};
		return function (title, description) {
			if (navigator.gpu) {
				makeScript("https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js");
				makeScript("../exampleHelper/ExampleHelper.js");
				makeScript("./index.js", 'module', (function () {
					var t0, t1;
					t0 = title;
					t1 = description;
					return function () {
						ExampleHelper.setBaseInformation(t0,t1)
					}
				})());
			} else {
				alert('WebGPU를 지원하지 않음')
			}
		}
	})()
};
