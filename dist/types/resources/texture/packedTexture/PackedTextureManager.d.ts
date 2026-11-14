import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 여러 텍스처를 단일 GPUTexture로 패킹하고 캐싱을 관리하는 클래스입니다.
 * [EN] Class that packs multiple textures into a single GPUTexture and manages caching.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
declare class PackedTextureManager extends RedGPUObject {
    #private;
    /**
     * [KO] PackedTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a PackedTextureManager instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 패킹된 텍스처 캐시 맵을 반환합니다.
     * [EN] Returns the packed texture cache map.
     */
    get cacheMap(): Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string;
    }>;
    /**
     * [KO] 인스턴스 매핑 키 맵을 반환합니다.
     * [EN] Returns the instance mapping keys map.
     */
    get instanceMappingKeys(): WeakMap<any, string>;
    /**
     * [KO] 컨텍스트에 의존적인 텍스처 패킹 전용 GPU 리소스들을 반환하거나 최초 생성합니다.
     * [EN] Returns or initializes context-dependent GPU resources dedicated to texture packing.
     *
     * @param computeShaderCode -
     * [KO] 셰이더 코드
     * [EN] Shader code
     * @returns
     * [KO] 패킹용 GPU 리소스 객체
     * [EN] GPU resources object for packing
     */
    getOrCreateResources(computeShaderCode: string): {
        globalPipeline: GPURenderPipeline;
        globalBindGroupLayout: GPUBindGroupLayout;
        mappingBuffer: GPUBuffer;
    };
    /**
     * [KO] 매니저와 관련된 모든 패킹 GPU 리소스를 해제합니다.
     * [EN] Releases all packing GPU resources associated with the manager.
     */
    destroy(): void;
}
export default PackedTextureManager;
