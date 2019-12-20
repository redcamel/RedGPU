/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 13:27:33
 *
 */

"use strict"

import UniformBuffer from "../src/buffer/UniformBuffer.js";
import RedGPUContext from "../src/RedGPUContext.js";
import UniformBufferDescriptor from "../src/buffer/UniformBufferDescriptor.js";
import TypeSize from "../src/resources/TypeSize.js";

let redGPUContext = new RedGPU.RedGPUContext(document.createElement('canvas'), null, function () {})
let t = new RedGPU.UniformBuffer(redGPUContext)
new RedGPU.UniformBufferDescriptor([
	{valueName: 'test',size : TypeSize.float4}
])
t.setBuffer(new RedGPU.UniformBufferDescriptor([]))