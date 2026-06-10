import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.
 * [EN] Generator class responsible for cubemap downsampling and mipmap generation.
 */
declare class DownSampleCubeMapGenerator extends RedGPUObject {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** [KO] 소스 텍스처 뷰 생성 (캐싱) [EN] Create source texture view (cached) */
    createSourceTextureView(sourceCubemap: GPUTexture, sourceMipLevel: number): GPUTextureView;
    /** [KO] 타겟 텍스처 뷰 생성 (캐싱) [EN] Create target texture view (cached) */
    createTargetTextureView(targetCubemap: GPUTexture, targetMipLevel: number): GPUTextureView;
    /** [KO] 바인드 그룹 생성 (캐싱) [EN] Create bind group (cached) */
    createBindGroup(bindGroupLayout: GPUBindGroupLayout, sourceView: GPUTextureView, targetView: GPUTextureView, uniformBuffer: GPUBuffer): GPUBindGroup;
    /**
     * [KO] 큐브맵 다운샘플링을 수행합니다.
     * [EN] Performs cubemap downsampling.
     *
     * @param sourceCubemap - [KO] 소스 큐브맵 텍스처 [EN] Source cubemap texture
     * @param targetSize - [KO] 타겟 크기 [EN] Target size
     * @param format - [KO] 텍스처 포맷 [EN] Texture format
     * @returns [KO] 다운샘플링된 큐브맵 [EN] Downsampled cubemap
     */
    downsampleCubemap(sourceCubemap: GPUTexture, targetSize?: number, format?: GPUTextureFormat): Promise<GPUTexture>;
    /** [KO] 모든 리소스를 해제합니다. [EN] Clears all resources. */
    destroy(): void;
}
export default DownSampleCubeMapGenerator;
