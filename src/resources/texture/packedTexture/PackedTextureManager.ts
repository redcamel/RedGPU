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
class PackedTextureManager extends RedGPUObject {
    #cacheMap: Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string;
    }> = new Map();
    #instanceMappingKeys: WeakMap<any, string> = new WeakMap();

    #globalPipeline: GPURenderPipeline | null = null;
    #globalBindGroupLayout: GPUBindGroupLayout | null = null;
    #mappingBuffer: GPUBuffer | null = null;

    /**
     * [KO] PackedTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a PackedTextureManager instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 패킹된 텍스처 캐시 맵을 반환합니다.
     * [EN] Returns the packed texture cache map.
     */
    get cacheMap() {
        return this.#cacheMap;
    }

    /**
     * [KO] 인스턴스 매핑 키 맵을 반환합니다.
     * [EN] Returns the instance mapping keys map.
     */
    get instanceMappingKeys() {
        return this.#instanceMappingKeys;
    }

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
    getOrCreateResources(computeShaderCode: string) {
        const {resourceManager, gpuDevice} = this;

        if (!this.#mappingBuffer) {
            this.#mappingBuffer = resourceManager.createGPUBuffer('PACK_TEXTURE_MAPPING_BUFFER', {
                size: 16,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
        }

        if (!this.#globalBindGroupLayout) {
            this.#globalBindGroupLayout = resourceManager.createBindGroupLayout(
                'PACK_TEXTURE_BIND_GROUP_LAYOUT',
                {
                    entries: [
                        {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
                        {binding: 5, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}}
                    ]
                }
            );
        }

        if (!this.#globalPipeline) {
            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: 'PACK_TEXTURE_PIPELINE_LAYOUT',
                bindGroupLayouts: [this.#globalBindGroupLayout]
            });

            this.#globalPipeline = gpuDevice.createRenderPipeline({
                label: 'PACK_TEXTURE_PIPELINE',
                layout: pipelineLayout,
                vertex: {
                    module: resourceManager.createGPUShaderModule('PACK_TEXTURE_SHADER_MODULE', {code: computeShaderCode}),
                    entryPoint: 'vertexMain',
                },
                fragment: {
                    module: resourceManager.createGPUShaderModule('PACK_TEXTURE_SHADER_MODULE', {code: computeShaderCode}),
                    entryPoint: 'fragmentMain',
                    targets: [{format: 'rgba8unorm'}],
                },
                primitive: {topology: 'triangle-list'},
            });
        }

        return {
            globalPipeline: this.#globalPipeline,
            globalBindGroupLayout: this.#globalBindGroupLayout,
            mappingBuffer: this.#mappingBuffer
        };
    }

    /**
     * [KO] 매니저와 관련된 모든 패킹 GPU 리소스를 해제합니다.
     * [EN] Releases all packing GPU resources associated with the manager.
     */
    destroy() {
        for (const entry of this.#cacheMap.values()) {
            try {
                entry.gpuTexture?.destroy();
            } catch (e) {
            }
        }
        this.#cacheMap.clear();

        if (this.#mappingBuffer) {
            try {
                this.#mappingBuffer.destroy();
            } catch (e) {
            }
            this.#mappingBuffer = null;
        }

        this.#globalPipeline = null;
        this.#globalBindGroupLayout = null;
    }
}

Object.freeze(PackedTextureManager);
export default PackedTextureManager;

