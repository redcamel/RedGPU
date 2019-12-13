/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedMix from "./RedMix.js";

export default class RedBaseLight extends RedMix.mix(
	RedMix.EmptyClass,
	RedMix.color
) {
	#intensity = 1;
	x = 0;
	y = 0;
	z = 0;

	get intensity() {
		return this.#intensity;
	}

	set intensity(value) {
		this.#intensity = value;
	}


}