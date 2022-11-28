"use strict";

import TypeSize from "../resource/buffers/TypeSize";
import hexadecimalToRgb from "../util/color/hexadecimalToRgb";
import BitmapTexture from "../resource/texture/BitmapTexture";
import TextureSampler from "../resource/texture/TextureSampler";

let float32Array_1 = new Float32Array(1);
const MaterialMix = (Base, ...texture) => {
    return [Base, ...texture].reduce((parent, extender) => {
        return extender(parent);
    });
};
const alpha = Base => class extends Base {
    #alpha: number = 1
    get alpha(): number {
        return this.#alpha;
    }

    set alpha(value: number) {
        this.#alpha = value;
        float32Array_1[0] = value
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.fragmentUniformBuffer.gpuBuffer,
            this.fragmentUniformBuffer.descriptor.redGpuStructOffsetMap['alpha'],
            float32Array_1
        )
    }
};
const lightProperty = Base => class extends Base {
    #shininess: number = 32;

    get shininess(): number {
        return this.#shininess;
    }

    set shininess(value: number) {
        this.#shininess = value;
        float32Array_1[0] = this.#shininess;
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.fragmentUniformBuffer.gpuBuffer,
            this.fragmentUniformBuffer.descriptor.redGpuStructOffsetMap['shininess'],
            float32Array_1
        );
    }

    #specularPower: number = 1;

    get specularPower(): number {
        return this.#specularPower;
    }

    set specularPower(value: number) {
        this.#specularPower = value;
        float32Array_1[0] = this.#specularPower;
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.fragmentUniformBuffer.gpuBuffer,
            this.fragmentUniformBuffer.descriptor.redGpuStructOffsetMap['specularPower'],
            float32Array_1
        );
    }

    #specularColor = 0xffffff;

    get specularColor(): number { //TODO color를 타입으로 정해야할듯한데...
        return this.#specularColor;
    }

    set specularColor(value) {
        this.#specularColor = value;
        let rgb = hexadecimalToRgb(value);
        this.#specularColorRGB[0] = rgb.r;
        this.#specularColorRGB[1] = rgb.g;
        this.#specularColorRGB[2] = rgb.b;
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.fragmentUniformBuffer.gpuBuffer,
            this.fragmentUniformBuffer.descriptor.redGpuStructOffsetMap['specularColor'],
            this.#specularColorRGB
        );
    }

    #specularColorRGB: Float32Array = new Float32Array([1, 1, 1]);
    get specularColorRGB(): Float32Array {
        return this.#specularColorRGB;
    }
};
// texture
const diffuseTexture = Base => class extends Base {
    #diffuseTexture: BitmapTexture
    get diffuseTexture(): BitmapTexture {
        return this.#diffuseTexture;
    }

    set diffuseTexture(value: BitmapTexture) {
        this.#diffuseTexture = value;
        if (this.#diffuseTexture) {
            this.#diffuseTexture.addTargetMaterial(this)
        }
        this.dirtyTexture = true
    }

    #diffuseTextureSampler: TextureSampler

    get diffuseTextureSampler(): TextureSampler {
        return this.#diffuseTextureSampler;
    }

    set diffuseTextureSampler(value: TextureSampler) {
        this.#diffuseTextureSampler = value;
    }
}
export default {
    mix: MaterialMix,
    alpha,
    alphaUniformDefine: [{size: TypeSize.float32, valueName: 'alpha'}],
    lightProperty,
    lightPropertyUniformDefine: [
        {size: TypeSize.float32, valueName: 'shininess'},
        {size: TypeSize.float32, valueName: 'specularPower'},
        {size: TypeSize.float32x3, valueName: 'specularColor'}
    ],
    //
    diffuseTexture
};
