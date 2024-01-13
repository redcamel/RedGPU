/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 16:39:19
 *
 */

import BaseLight from "../base/BaseLight.js";

export default class AmbientLight extends BaseLight {
  constructor(redGPUContext, color = '#111', intensity = 0.1) {
    super(redGPUContext);
    this.color = color;
    this.intensity = intensity;
  }
}
