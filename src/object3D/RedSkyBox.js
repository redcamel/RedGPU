/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */
"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";
import RedBox from "../primitives/RedBox.js";
import RedSkyBoxMaterial from "../material/system/RedSkyBoxMaterial.js";

export default class RedSkyBox extends RedBaseObject3D {
	constructor(redGPUContext, skyBoxTexture) {
		super(redGPUContext);
		this.geometry = new RedBox(redGPUContext);
		this.material = new RedSkyBoxMaterial(redGPUContext, skyBoxTexture);
		this.cullMode = 'front';
	}
}
