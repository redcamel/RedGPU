import RedGPUContext from "../../../../context/RedGPUContext";
declare class MipmapGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext);
    createTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number, useCache?: boolean): GPUTextureView;
    createBindGroup(texture: GPUTexture, textureView: GPUTextureView, useCache?: boolean): GPUBindGroup;
    getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline;
    /**
     * 밉맵 생성 메서드
     */
    generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor, useCache?: boolean): GPUTexture;
    destroy(): void;
}
export default MipmapGenerator;
