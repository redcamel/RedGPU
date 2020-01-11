/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.11 18:20:56
 *
 */
"use strict";

import UTIL from "../util/UTIL.js";

export default class PostEffect {
	#effectList = [];
	constructor(redGPUContext) {}
	get effectList() { return this.#effectList}
	addEffect(v) {this.#effectList.push(v)}
	removeEffect(v) {
		if (this.#effectList.includes(v)) this.#effectList.splice(this.#effectList.indexOf(v), 1);
		else UTIL.throwFunc(`removeEffect - Attempt to delete an object that does not exist. - inputValue : ${v} { type : ${typeof v} }`);

	}
}
