/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
let _UUID = 1;
export default class UUID {
	static getNextUUID() {return _UUID++}
	constructor() {this._UUID = _UUID++;}
	updateUUID() {this._UUID = _UUID++}
}