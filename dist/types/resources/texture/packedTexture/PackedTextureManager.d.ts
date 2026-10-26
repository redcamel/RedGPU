import RedGPUContext from "../../../context/RedGPUContext";
export default class PackedTextureManager {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get cacheMap(): Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string;
    }>;
    get instanceMappingKeys(): WeakMap<any, string>;
    /**
     * 컨텍스트에 의존적인 텍스처 패킹 전용 GPU 리소스들을 반환하거나 최초 생성합니다.
     */
    getOrCreateResources(computeShaderCode: string): {
        globalPipeline: GPURenderPipeline;
        globalBindGroupLayout: GPUBindGroupLayout;
        mappingBuffer: GPUBuffer;
    };
    /**
     * 매니저 파괴 시, 이 컨텍스트 소속의 모든 패킹 GPU 자원들을 일괄 해제합니다.
     */
    destroy(): void;
}
