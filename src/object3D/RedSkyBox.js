/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 16:32:22
 *
 */
"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";
import RedBox from "../primitives/RedBox.js";
import RedSkyBoxMaterial from "../material/system/RedSkyBoxMaterial.js";

export default class RedSkyBox extends RedBaseObject3D {
	constructor(redGPU, skyBoxTexture) {
		super(redGPU);
		this.geometry = new RedBox(redGPU);
		this.material = new RedSkyBoxMaterial(redGPU, skyBoxTexture);
		this.cullMode = 'front';
	}
}
