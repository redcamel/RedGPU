import RedGPUContext from "../../../context/RedGPUContext";

export default class PackedTextureManager {
    readonly #redGPUContext: RedGPUContext;
    readonly #cacheMap: Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string
    }> = new Map();
    readonly #instanceMappingKeys: WeakMap<any, string> = new WeakMap();

    #globalPipeline: GPURenderPipeline | null = null;
    #globalBindGroupLayout: GPUBindGroupLayout | null = null;
    #mappingBuffer: GPUBuffer | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    get cacheMap() {
        return this.#cacheMap;
    }

    get instanceMappingKeys() {
        return this.#instanceMappingKeys;
    }

    /**
     * 컨텍스트에 의존적인 텍스처 패킹 전용 GPU 리소스들을 반환하거나 최초 생성합니다.
     */
    getOrCreateResources(computeShaderCode: string) {
        const {resourceManager, gpuDevice} = this.#redGPUContext;

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
     * 매니저 파괴 시, 이 컨텍스트 소속의 모든 패킹 GPU 자원들을 일괄 해제합니다.
     */
    destroy() {
        // 캐시된 텍스처 파괴
        for (const entry of this.#cacheMap.values()) {
            try {
                entry.gpuTexture?.destroy();
            } catch (e) {
                // 이미 해제된 경우 등 예외 처리
            }
        }
        this.#cacheMap.clear();

        // 매핑 버퍼 해제
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
