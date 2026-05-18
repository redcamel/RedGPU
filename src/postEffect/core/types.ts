/**
 * [KO] 단일 패스 후처리 이펙트 결과 인터페이스입니다.
 * [EN] Result interface for a single-pass post-processing effect.
 */
export interface IPostEffectResult {
    /**
     * [KO] 결과 텍스처
     * [EN] Result texture
     */
    texture: GPUTexture
    /**
     * [KO] 결과 텍스처 뷰
     * [EN] Result texture view
     */
    textureView: GPUTextureView
}

/**
 * [KO] 후처리 소스 텍스처 설정 인터페이스
 * [EN] Post-effect source texture configuration interface
 */
export interface IPostEffectSourceConfig {
    /** [KO] 텍스처 이름 [EN] Texture name */
    name: string;
    /** [KO] 샘플링 가능한 타입(texture_2d)으로 사용할지 여부 [EN] Whether to use as a sampleable type (texture_2d) */
    isSampled?: boolean;
}
