import BaseLight from "./BaseLight";
import UniformBufferDescriptor from "../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import TypeSize from "../resource/buffers/TypeSize";
import RedGPUContext from "../context/RedGPUContext";

const bufferDefine = new UniformBufferDescriptor(
    [
        {size: TypeSize.float32x3, valueName: 'color'},
        {size: TypeSize.float32, valueName: 'intensity'},
    ]
);

class AmbientLight extends BaseLight {
    constructor(redGPUContext: RedGPUContext, color: number = 0x404040, intensity: number = 1) {
        super(redGPUContext, bufferDefine, color, intensity)
    }
}

export default AmbientLight