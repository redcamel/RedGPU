import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 올드 블룸 블렌딩 이펙트입니다. (내부용)
 * [EN] Old Bloom blending effect. (Internal use)
 * @category Visual Effects
 */
class OldBloomBlend extends ASinglePassPostEffect {
    #bloomStrength: number = 1;
    #exposure: number = 1;

    /**
     * [KO] OldBloomBlend 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomBlend instance.
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        
        const shaderSource = {
            msaa: `
                @group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba16float, read>;
                @group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba16float, read>;
                @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
                @group(1) @binding(1) var<uniform> uniforms: Uniforms;
                
                ${uniformStructCode}
                
                @compute @workgroup_size(${this.WORK_SIZE_X}, ${this.WORK_SIZE_Y}, ${this.WORK_SIZE_Z})
                fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                    ${computeCode}
                }
            `,
            nonMsaa: `
                @group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba16float, read>;
                @group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba16float, read>;
                @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
                @group(1) @binding(1) var<uniform> uniforms: Uniforms;
                
                ${uniformStructCode}
                
                @compute @workgroup_size(${this.WORK_SIZE_X}, ${this.WORK_SIZE_Y}, ${this.WORK_SIZE_Z})
                fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                    ${computeCode}
                }
            `
        };

        this.init(redGPUContext, 'POST_EFFECT_OLD_BLOOM_BLEND', shaderSource);
        this.exposure = this.#exposure;
        this.bloomStrength = this.#bloomStrength;
    }

    get bloomStrength(): number { return this.#bloomStrength; }
    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.updateUniform('bloomStrength', value);
    }

    get exposure(): number { return this.#exposure; }
    set exposure(value: number) {
        this.#exposure = value;
        this.updateUniform('exposure', value);
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1);
    }
}

Object.freeze(OldBloomBlend);
export default OldBloomBlend;
