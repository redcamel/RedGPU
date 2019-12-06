/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 20:7:15
 *
 */

"use strict"

import RedUniformBuffer from "../src/buffer/RedUniformBuffer.js";
import RedGPU from "../src/RedGPU.js";
import RedUniformBufferDescriptor from "../src/buffer/RedUniformBufferDescriptor.js";
import RedTypeSize from "../src/resources/RedTypeSize.js";

let redGPU = new RedGPU(document.createElement('canvas'), null, function () {})
let t = new RedUniformBuffer(redGPU)
new RedUniformBufferDescriptor([
	{valueName: 'test',size : RedTypeSize.float4}
])
t.setBuffer(new RedUniformBufferDescriptor([]))