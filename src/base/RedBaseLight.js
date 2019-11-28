/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 17:31:6
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
	#position = new Float32Array([0, 0, 0]);
	get position() {
		this.#position[0] = this.x;
		this.#position[1] = this.y;
		this.#position[2] = this.z;
		return this.#position
	}

	get intensity() {
		return this.#intensity;
	}

	set intensity(value) {
		this.#intensity = value;
	}


}