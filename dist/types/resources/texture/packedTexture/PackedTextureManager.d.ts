import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * ::: warning [KO] 직접 인스턴스 생성 금지
 * 이 클래스는 RedGPU 시스템 내부에서 자동으로 생성 및 관리되므로 사용자가 직접 인스턴스를 생성할 수 없습니다.
 * :::
 *
 * ::: warning [EN] Do Not Instantiate Directly
 * This class is automatically instantiated and managed internally by the RedGPU system. Direct instantiation is prohibited.
 * :::
 *
 * [KO] 여러 텍스처를 단일 GPUTexture로 패킹하고 캐싱을 관리하는 클래스입니다.
 * [EN] Class that packs multiple textures into a single GPUTexture and manages caching.
 *
 * @category Manager
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
