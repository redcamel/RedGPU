/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */
'use strict'
var CheckWebGPU = {
	checkWebGPU: (function () {
		var makeScript;
		makeScript = function (src, type, onload,async) {
			var script;
			script = document.createElement('script');
			if (type) script.type = type;
			if (onload) script.onload = onload;
			if(async) script.setAttribute('async','')
			script.src = src;
			document.head.appendChild(script)

		};
		return function (title, description) {
			if (navigator.gpu) {
				makeScript("https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js");
				makeScript("../../exampleHelper/ExampleHelper.js");
				makeScript("./index.js", 'module', (function () {
					var t0, t1;
					t0 = title;
					t1 = description;
					return function () {
						ExampleHelper.setBaseInformation(t0,t1)
					}
				})());
				<!-- Global site tag (gtag.js) - Google Analytics -->
				makeScript("https://www.googletagmanager.com/gtag/js?id=UA-134079611-3",null,null,true);
				if (window.location.hostname == 'github.com' || window.location.hostname == 'redcamel.github.io') {
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'UA-134079611-3');
				}
			} else {
				alert('- WebGPU not supported!. Use the latest version of Chrome Canary.\n- When running localhost, port 3003 should be used.')
			}
		}
	})()
};
