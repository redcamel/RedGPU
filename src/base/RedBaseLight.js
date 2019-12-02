/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.2 12:39:33
 *
 */

"use strict";
import RedMaterialPreset from "../material/RedMaterialPreset.js";

export default class RedBaseLight extends RedMaterialPreset.mix(
	RedMaterialPreset.EmptyClass,
	RedMaterialPreset.color
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