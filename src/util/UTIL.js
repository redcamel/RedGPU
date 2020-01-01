/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:43:39
 *
 */

"use strict";
import UTILColor from './func/UTILColor.js';
import UTILMath from './func/UTILMath.js';

export default {
	throwFunc: function () {
		throw 'Error : ' + Array.prototype.slice.call(arguments).join(' ')
	},
	...UTILColor,
	...UTILMath
}
