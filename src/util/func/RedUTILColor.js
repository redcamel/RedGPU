/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
export default {
	rgb2hex: (red, green, blue) => {
		let rgb = blue | (green << 8) | (red << 16);
		return '#' + (0x1000000 + rgb).toString(16).slice(1)
	},
	regHex: (function () {
		var reg = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
		return function (hex) {
			return reg.test(hex);
		}
	})()
}
