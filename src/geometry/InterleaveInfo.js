/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:27
 *
 */

"use strict";
import TypeSize from "../resources/TypeSize.js";
import GPUContext from "../GPUContext.js";

export default class InterleaveInfo {
	constructor(attributeHint, format) {
		this['attributeHint'] = attributeHint;
		this['format'] = format;
		this['stride'] = TypeSize[format];
		if (GPUContext.useDebugConsole) console.log(this)
	}
}