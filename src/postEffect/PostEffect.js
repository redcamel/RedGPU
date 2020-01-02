/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
"use strict";

export default class PostEffect {
	#effectList = [];
	constructor(redGPUContext) {}
	get effectList() { return this.#effectList}
	addEffect(v) {this.#effectList.push(v)}
}
