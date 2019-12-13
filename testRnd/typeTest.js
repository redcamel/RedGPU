/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict"

import RedUniformBuffer from "../src/buffer/RedUniformBuffer.js";
import RedGPUContext from "../src/RedGPUContext.js";
import RedUniformBufferDescriptor from "../src/buffer/RedUniformBufferDescriptor.js";
import RedTypeSize from "../src/resources/RedTypeSize.js";

let redGPUContext = new RedGPU.RedGPUContext(document.createElement('canvas'), null, function () {})
let t = new RedGPU.RedUniformBuffer(redGPUContext)
new RedGPU.RedUniformBufferDescriptor([
	{valueName: 'test',size : RedTypeSize.float4}
])
t.setBuffer(new RedGPU.RedUniformBufferDescriptor([]))