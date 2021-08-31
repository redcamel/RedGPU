/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
"use strict";
import BaseObject3D from "../base/BaseObject3D.js";
import Box from "../primitives/Box.js";
import SkyBoxMaterial from "../material/system/SkyBoxMaterial.js";

export default class SkyBox extends BaseObject3D {
  constructor(redGPUContext, skyBoxTexture) {
    super(redGPUContext);
    this.geometry = new Box(redGPUContext);
    this.material = new SkyBoxMaterial(redGPUContext, skyBoxTexture);
    this.cullMode = 'front';
  }
}
