/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */
"use strict";

export default class PostEffect {
	#effectList = [];
	constructor(redGPUContext) {

	}
	get effectList() { return this.#effectList}
	addEffect(v) {this.#effectList.push(v)}
}
