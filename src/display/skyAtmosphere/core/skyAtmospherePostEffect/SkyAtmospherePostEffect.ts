import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../../postEffect/core/ASinglePassPostEffect";
import {IPostEffectResult} from "../../../../postEffect/core/types";
import SkyAtmosphere from "../../SkyAtmosphere";
import ShaderLibrary from "../../../../systemCodeManager/ShaderLibrary";
import skyAtmospherePostEffect_compute_wgsl from "./wgsl/skyAtmospherePostEffect_compute.wgsl";

/**
 * [KO] Aerial Perspective 3D LUT를 참조하여 씬 내 오브젝트들에 깊이에 따른 대기 산란광과 투과율 감쇠를 적용하는 포스트 이펙트 클래스입니다.
 * [EN] Post-effect class that applies depth-based atmospheric scattered light and transmittance attenuation to scene objects by referencing the Aerial Perspective 3D LUT.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const postEffect = skyAtmosphere.postEffect;
 * ```
 *
 * @category SkyAtmosphere
 */
class SkyAtmospherePostEffect extends ASinglePassPostEffect {
    #skyAtmosphere: SkyAtmosphere;
    #transmittanceTextureInfo: IPostEffectResult = {texture: null, textureView: null};
    #skyViewTextureInfo: IPostEffectResult = {texture: null, textureView: null};
    #aerialPerspectiveTextureInfo: IPostEffectResult = {texture: null, textureView: null};

    /**
     * [KO] SkyAtmospherePostEffect 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmospherePostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param skyAtmosphere -
     * [KO] 연결된 SkyAtmosphere 인스턴스
     * [EN] Associated SkyAtmosphere instance
     */
    constructor(redGPUContext: RedGPUContext, skyAtmosphere: SkyAtmosphere) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});
        this.#skyAtmosphere = skyAtmosphere;

        const createCode = (useMSAA: boolean) => {
            const postEffectSystemUniform = useMSAA ? ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM_MSAA : ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM;
            return [
                '#redgpu_include depth.getLinearizeDepth',
                '#redgpu_include skyAtmosphere.skyAtmosphereFn',
                '@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba16float, read>;',
                '@group(0) @binding(1) var transmittanceLUT : texture_2d<f32>;',
                '@group(0) @binding(2) var skyViewLUT : texture_2d<f32>;',
                '@group(0) @binding(3) var aerialPerspectiveLUT : texture_3d<f32>;',
                '',
                postEffectSystemUniform,
                '',
                '@group(3) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
                '',
                'fn fetchDepth(pos: vec2<u32>) -> f32 {',
                '    let dSize = textureDimensions(depthTexture);',
                '    let clampedPos = min(pos, dSize - 1u);',
                '    return textureLoad(depthTexture, clampedPos, 0);',
                '}',
                '',
                `@compute @workgroup_size(${this.WORK_SIZE_X}, ${this.WORK_SIZE_Y}, ${this.WORK_SIZE_Z})`,
                'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
                '    let uniforms = systemUniforms.skyAtmosphere;',
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
     * [KO] 대기 원근(Aerial Perspective) 포스트 이펙트를 렌더링합니다.
     * [EN] Renders the aerial perspective post-effect.
     *
     * @param view -
     * [KO] 렌더링 대상 View3D 인스턴스
     * [EN] Target View3D instance for rendering
     * @param width -
     * [KO] 렌더 타겟 너비
     * [EN] Render target width
     * @param height -
     * [KO] 렌더 타겟 높이
     * [EN] Render target height
     * @param sourceTextureInfo -
     * [KO] 입력 소스 컬러 텍스처 정보
     * [EN] Input source color texture information
     * @returns
     * [KO] 포스트 이펙트 렌더링 결과
     * [EN] Post-effect render result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        const skyAtmosphere = this.#skyAtmosphere;
        const transmittanceLUT = skyAtmosphere.transmittanceLUT;
        const skyViewLUT = skyAtmosphere.skyViewLUT;
        const aerialPerspectiveLUT = skyAtmosphere.aerialPerspectiveLUT;

        this.#transmittanceTextureInfo.texture = transmittanceLUT.gpuTexture;
        this.#transmittanceTextureInfo.textureView = transmittanceLUT.gpuTextureView;
        this.#skyViewTextureInfo.texture = skyViewLUT.gpuTexture;
        this.#skyViewTextureInfo.textureView = skyViewLUT.gpuTextureView;
        this.#aerialPerspectiveTextureInfo.texture = aerialPerspectiveLUT.gpuTexture;
        this.#aerialPerspectiveTextureInfo.textureView = aerialPerspectiveLUT.gpuTextureView;

        return super.render(
            view, width, height,
            sourceTextureInfo,
            this.#transmittanceTextureInfo,
            this.#skyViewTextureInfo,
            this.#aerialPerspectiveTextureInfo
        );
    }

    /**
     * [KO] 포스트 이펙트 인스턴스 및 내부 리소스를 해제합니다.
     * [EN] Releases the post-effect instance and internal resources.
     */
    destroy() {
        super.destroy();
        this.#transmittanceTextureInfo.texture = null;
        this.#transmittanceTextureInfo.textureView = null;
        this.#skyViewTextureInfo.texture = null;
        this.#skyViewTextureInfo.textureView = null;
        this.#aerialPerspectiveTextureInfo.texture = null;
        this.#aerialPerspectiveTextureInfo.textureView = null;
        this.#skyAtmosphere = null;
    }
}

Object.freeze(SkyAtmospherePostEffect);
export default SkyAtmospherePostEffect;
