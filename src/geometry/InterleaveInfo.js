/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */

"use strict";
import TypeSize from "../resources/TypeSize.js";
import RedGPUContext from "../RedGPUContext.js";

export default class InterleaveInfo {
	constructor(attributeHint, format) {
		this['attributeHint'] = attributeHint;
		this['format'] = format;
		this['stride'] = TypeSize[format];
		if (RedGPUContext.useDebugConsole) console.log(this)
	}
}