import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import postEffectSystemUniform from "../../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * SSAO(Screen Space Ambient Occlusion) 후처리 이펙트입니다.
 * 화면 공간의 깊이와 노멀을 이용해 구석진 곳에 음영을 만들어 입체감을 더합니다.
 */
class SSAO extends ASinglePassPostEffect {
    /** 샘플링 반경. 기본값 0.5 */
    #radius: number = 0.5;
    /** 그림자 강도. 기본값 1.5 */
    #intensity: number = 1;
    /** 자가 차폐 방지 바이어스. 기본값 0.025 */
    #bias: number = 0.025;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.WORK_SIZE_X = 8;
        this.WORK_SIZE_Y = 8;
        this.WORK_SIZE_Z = 1;
        this.useDepthTexture = true; // 깊이 텍스처 활성화

        const shaderCode = this.#createSSAOShaderCode();
        this.init(
          redGPUContext,
          'POST_EFFECT_SSAO',
          {
              msaa: shaderCode.msaa,
              nonMsaa: shaderCode.nonMsaa
          }
        );

        this.radius = this.#radius;
        this.intensity = this.#intensity;
        this.bias = this.#bias;
    }

    get radius(): number { return this.#radius; }
    set radius(value: number) {
        validatePositiveNumberRange(value, 0.01, 5.0);
        this.#radius = value;
        this.updateUniform('radius', value);
    }

    get intensity(): number { return this.#intensity; }
    set intensity(value: number) {
        validateNumberRange(value, 0.0, 10.0);
        this.#intensity = value;
        this.updateUniform('intensity', value);
    }

    get bias(): number { return this.#bias; }
    set bias(value: number) {
        validateNumberRange(value, 0.0, 0.1);
        this.#bias = value;
        this.updateUniform('bias', value);
    }

    #createSSAOShaderCode() {
        const createCode = (useMSAA: boolean) => {
            const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';
            return `
                ${uniformStructCode}
                
                @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
                @group(0) @binding(1) var depthTexture : ${depthTextureType};
                @group(0) @binding(2) var gBufferNormalTexture : texture_2d<f32>;
                
                @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
                ${postEffectSystemUniform}
                @group(1) @binding(2) var<uniform> uniforms: Uniforms;
                
                @compute @workgroup_size(${this.WORK_SIZE_X}, ${this.WORK_SIZE_Y}, ${this.WORK_SIZE_Z})
                fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                    ${computeCode}
                }
            `;
        };
        return { msaa: createCode(true), nonMsaa: createCode(false) };
    }
}

Object.freeze(SSAO);
export default SSAO;
