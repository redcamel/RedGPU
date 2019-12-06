/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */
"use strict";

export default class RedPostEffect {
	#effectList = [];
	constructor(redGPU) {

	}
	get effectList() { return this.#effectList}
	addEffect(v) {this.#effectList.push(v)}
}
