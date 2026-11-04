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
    texture: GPUTexture
    /**
     * [KO] 결과 `GPUTextureView` 인스턴스
     * [EN] Result `GPUTextureView` instance
     */
    textureView: GPUTextureView
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
     * [KO] 명시적 WGSL 텍스처 타입 (예: `'texture_2d<f32>'`, `'texture_3d<f32>'`)
     * [EN] Explicit WGSL texture type (e.g., `'texture_2d<f32>'`, `'texture_3d<f32>'`)
     * @defaultValue 'texture_2d<f32>'
     */
    textureType?: string;
}
