import RedGPUContext from "../../../../context/RedGPUContext";
declare class DownSampleCubeMapGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext);
    createSourceTextureView(sourceCubemap: GPUTexture, sourceMipLevel: number): GPUTextureView;
    createTargetTextureView(targetCubemap: GPUTexture, targetMipLevel: number): GPUTextureView;
    createBindGroup(bindGroupLayout: GPUBindGroupLayout, sourceView: GPUTextureView, targetView: GPUTextureView): GPUBindGroup;
    /**
     * 큐브맵 다운샘플링 메서드
     * @param sourceCubemap 소스 큐브맵 텍스처
     * @param targetSize 타겟 크기 (기본값: 256)
     * @param format 텍스처 포맷 (기본값: 'rgba16float')
     * @returns 다운샘플링된 큐브맵 텍스처
     */
    downsampleCubemap(sourceCubemap: GPUTexture, targetSize?: number, format?: GPUTextureFormat): Promise<GPUTexture>;
    /**
     * 정리 메서드
     */
    destroy(): void;
}
export default DownSampleCubeMapGenerator;
