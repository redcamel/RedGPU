/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */

"use strict"

import UniformBuffer from "../src/buffer/UniformBuffer.js";
import GPUContext from "../src/GPUContext.js";
import UniformBufferDescriptor from "../src/buffer/UniformBufferDescriptor.js";
import TypeSize from "../src/resources/TypeSize.js";

let redGPUContext = new RedGPU.GPUContext(document.createElement('canvas'), null, function () {})
let t = new RedGPU.UniformBuffer(redGPUContext)
new RedGPU.UniformBufferDescriptor([
	{valueName: 'test',size : TypeSize.float4}
])
t.setBuffer(new RedGPU.UniformBufferDescriptor([]))