/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedUTILColor from './func/RedUTILColor.js';
import RedUTILMath from './func/RedUTILMath.js';

export default {
	throwFunc: function () {
		throw 'Error : ' + Array.prototype.slice.call(arguments).join(' ')
	},
	...RedUTILColor,
	...RedUTILMath
}
