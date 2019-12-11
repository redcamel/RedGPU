/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 20:19:9
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedInterleaveInfo {
	constructor(attributeHint, format) {
		this['attributeHint'] = attributeHint;
		this['format'] = format;
		this['stride'] = RedTypeSize[format];
		console.log(this)
	}
}