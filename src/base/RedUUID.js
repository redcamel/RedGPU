/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
let UUID = 1;
export default class RedUUID {
	static makeUUID() {
		return UUID++
	}

	constructor() {
		this._UUID = UUID++;
	}
	updateUUID() {
		this._UUID = UUID++
	}
}