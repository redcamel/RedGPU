/**
 * [KO] 후처리 이펙트 렌더링 결과 텍스처 정보 인터페이스입니다.
 * [EN] Interface representing the output texture information of a post-processing effect.
 *
 * @category PostEffect
 */
export interface IPostEffectResult {
    /**
     * [KO] 결과 `GPUTexture` 인스턴스
     * [EN] Result `GPUTexture` instance
     */
    texture: GPUTexture;
    /**
     * [KO] 결과 `GPUTextureView` 인스턴스
     * [EN] Result `GPUTextureView` instance
     */
    textureView: GPUTextureView;
}
/**
 * [KO] 후처리 소스 텍스처 바인딩 설정 인터페이스입니다.
 * [EN] Interface for post-processing source texture binding configuration.
 *
 * @category PostEffect
 */
export interface IPostEffectSourceConfig {
    /**
     * [KO] 셰이더 내 텍스처 바인딩 식별자 이름
     * [EN] Texture binding identifier name in the shader
     */
    name: string;
    /**
     * [KO] 샘플러와 함께 사용하는 샘플링 가능 타입(`texture_2d<f32>`) 여부
     * [EN] Whether to use as a sampleable texture type (`texture_2d<f32>`) with a sampler
     * @defaultValue true
     */
    isSampled?: boolean;
}
