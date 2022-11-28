import BaseObject3DTransform from "../object3d/base/BaseObject3DTransform";
import UniformBufferDescriptor from "../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import UniformBufferFloat32 from "../resource/buffers/uniformBuffer/UniformBufferFloat32";
import RedGPUContext from "../context/RedGPUContext";
import throwErrorInstanceOf from "../util/errorFunc/throwErrorInstanceOf";
import hexadecimalToRgb from "../util/color/hexadecimalToRgb";

class BaseLight extends BaseObject3DTransform {
    // TODO - dirtyLight를 매쉬와 같이 dirtyPipeline 으로 통일 할지 결정해야함
    dirtyLight: boolean = false

    #r: number

    get r(): number {
        return this.#r;
    }

    #g: number

    get g(): number {
        return this.#g;
    }

    #b: number

    get b(): number {
        return this.#b;
    }

    #a: number

    get a(): number {
        return this.#a;
    }

    #color
    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
        this.dirtyLight = true
        const rgb = hexadecimalToRgb(value)
        this.#r = rgb.r;
        this.#g = rgb.g;
        this.#b = rgb.b;
        this.#a = 1;
    }

    #intensity: number

    get intensity(): number {
        return this.#intensity;
    }

    set intensity(value: number) {
        this.#intensity = value;
        this.dirtyLight = true
    }

    #uniformBufferDescriptor: UniformBufferDescriptor
    get uniformBufferDescriptor(): UniformBufferDescriptor {
        return this.#uniformBufferDescriptor;
    }

    #uniformBuffer: UniformBufferFloat32
    get uniformBuffer(): UniformBufferFloat32 {
        return this.#uniformBuffer;
    }

    #redGPUContext: RedGPUContext

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }


    constructor(redGPUContext: RedGPUContext, uniformBufferDescriptor: UniformBufferDescriptor, color: number = 0x404040, intensity: number = 1) {
        super()
        if (!(redGPUContext instanceof RedGPUContext)) throwErrorInstanceOf(this, 'redGPUContext', 'RedGPUContext')
        this.#redGPUContext = redGPUContext
        this.#uniformBufferDescriptor = uniformBufferDescriptor
        this.#uniformBuffer = new UniformBufferFloat32(this.redGPUContext, uniformBufferDescriptor)
        //
        this.color = color
        this.#intensity = intensity
        this.dirtyLight = true
    }

}

export default BaseLight