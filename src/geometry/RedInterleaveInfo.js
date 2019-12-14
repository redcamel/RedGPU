/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 16:4:46
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedGPUContext from "../RedGPUContext.js";

export default class RedInterleaveInfo {
	constructor(attributeHint, format) {
		this['attributeHint'] = attributeHint;
		this['format'] = format;
		this['stride'] = RedTypeSize[format];
		if (RedGPUContext.useDebugConsole) console.log(this)
	}
}