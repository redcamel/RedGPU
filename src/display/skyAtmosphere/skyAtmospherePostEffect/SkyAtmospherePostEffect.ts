import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
import {IPostEffectResult} from "../../../postEffect/core/types";
import SkyAtmosphere from "../SkyAtmosphere";
import ShaderLibrary from "../../../systemCodeManager/ShaderLibrary";
import skyAtmospherePostEffect_compute_wgsl from "./wgsl/skyAtmospherePostEffect_compute.wgsl";

//TODO - 바인딩 계속 생성되는 이유 찾아야함
/**
 * [KO] SkyAtmospherePostEffect 클래스는 씬 내의 오브젝트들에 대해 대기 투과(Transmittance) 및 산란(Scattering)을 적용합니다.
 * [EN] The SkyAtmospherePostEffect class applies atmospheric transmittance and scattering to objects in the scene.
 */
class SkyAtmospherePostEffect extends ASinglePassPostEffect {
    #skyAtmosphere: SkyAtmosphere;

    constructor(redGPUContext: RedGPUContext, skyAtmosphere: SkyAtmosphere) {
        super(redGPUContext);
        this.#skyAtmosphere = skyAtmosphere;

        const createCode = (useMSAA: boolean) => {
            return [
                '#redgpu_include depth.getLinearizeDepth',
                '#redgpu_include skyAtmosphere.skyAtmosphereFn',
                '@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba16float, read>;',
                '@group(0) @binding(1) var transmittanceLUT : texture_2d<f32>;',
                '@group(0) @binding(2) var multiScatLUT : texture_2d<f32>;',
                '@group(0) @binding(3) var skyViewLUT : texture_2d<f32>;',
                '@group(0) @binding(4) var aerialPerspectiveLUT : texture_3d<f32>;',
                '@group(0) @binding(5) var skyAtmosphereIrradianceLUT : texture_cube<f32>;',
                '',
                ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM,
                '@group(2) @binding(5) var basicSampler : sampler;',
                '',
                `@group(2) @binding(0) var depthTexture : ${useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d'};`,
                '@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;',
                '@group(2) @binding(2) var gBufferMotionVector : texture_2d<f32>;',
                `@group(2) @binding(3) var prevDepthTexture : ${useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d'};`,
                '',
                '@group(3) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
                '',
                'fn fetchDepth(pos: vec2<u32>) -> f32 {',
                '    let dSize = textureDimensions(depthTexture);',
                '    let clampedPos = min(pos, dSize - 1u);',
                '    return textureLoad(depthTexture, clampedPos, 0);',
                '}',
                '',
                '@compute @workgroup_size(16, 16)',
                'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
                '    let uniforms = systemUniforms.skyAtmosphere;',
                '    let viewHeight = uniforms.cameraHeight;',
                skyAtmospherePostEffect_compute_wgsl,
                '}'
            ].join('\n');
        };

        this.init(
            redGPUContext,
            'POST_EFFECT_SKY_ATMOSPHERE',
            {
                msaa: createCode(true),
                nonMsaa: createCode(false)
            }
        );
    }

    /**
     * [KO] 스카이 대기 포스트 이펙트를 렌더링합니다.
     * [EN] Renders the sky atmosphere post effect.
     *
     * @param view - [KO] 현재 뷰 [EN] Current view
     * @param width - [KO] 너비 [EN] Width
     * @param height - [KO] 높이 [EN] Height
     * @param sourceTextureInfo - [KO] 소스 컬러 텍스처 [EN] Source color texture
     * @returns [KO] 렌더링 결과 [EN] Render result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        const skyAtmosphere = this.#skyAtmosphere;

        return super.render(view, width, height,
            sourceTextureInfo, // 0
            {
                texture: skyAtmosphere.transmittanceLUT.gpuTexture,
                textureView: skyAtmosphere.transmittanceLUT.gpuTextureView
            }, // 1
            {texture: skyAtmosphere.multiScatLUT.gpuTexture, textureView: skyAtmosphere.multiScatLUT.gpuTextureView}, // 2
            {texture: skyAtmosphere.skyViewLUT.gpuTexture, textureView: skyAtmosphere.skyViewLUT.gpuTextureView}, // 3
            {
                texture: skyAtmosphere.aerialPerspectiveLUT.gpuTexture,
                textureView: skyAtmosphere.aerialPerspectiveLUT.gpuTextureView
            }, // 4
            {
                texture: skyAtmosphere.skyAtmosphereIrradianceLUT.gpuTexture,
                textureView: skyAtmosphere.skyAtmosphereIrradianceLUT.gpuTextureView
            } // 5
        );
    }
}

Object.freeze(SkyAtmospherePostEffect);
export default SkyAtmospherePostEffect;
