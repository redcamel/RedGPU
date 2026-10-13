import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import type Landscape from "../../Landscape";

export interface ResolvedWeightLayerInfo {
    weightView: GPUTextureView;
    hasWeightMap: number;
    weightChannelIndex: number;
}

interface ScatterBakeBindGroupCacheEntry {
    bindGroup: GPUBindGroup;
    rawBuffer: GPUBuffer;
    vhtView: GPUTextureView;
    vbtView: GPUTextureView;
    weightView: GPUTextureView;
    tasksBuffer: GPUBuffer;
}

abstract class AScatterInstanceBaker extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformGPUBuffer: GPUBuffer | null = null;
    #defaultSampler: GPUSampler | null = null;

    #bakeBindGroupCache: Map<number, ScatterBakeBindGroupCacheEntry> = new Map();
    #resolvedWeightInfo: ResolvedWeightLayerInfo = {
        weightView: null as any,
        hasWeightMap: 0,
        weightChannelIndex: 0
    };

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    destroy(): void {
        this.#resolvedWeightInfo.weightView = null as any;
        this.#uniformGPUBuffer?.destroy();
        this.#uniformGPUBuffer = null;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
        this.#defaultSampler = null;
        this.#bakeBindGroupCache.clear();
    }

    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    get uniformGPUBuffer(): GPUBuffer | null {
        return this.#uniformGPUBuffer;
    }

    get defaultSampler(): GPUSampler | null {
        return this.#defaultSampler;
    }

    getOrCreateBindGroup(
        typeId: number,
        labelPrefix: string,
        rawBuffer: GPUBuffer,
        vhtView: GPUTextureView,
        vbtView: GPUTextureView,
        weightView: GPUTextureView,
        tasksBuffer: GPUBuffer
    ): GPUBindGroup | null {
        const {gpuDevice, bindGroupLayout, uniformGPUBuffer, defaultSampler} = this;
        if (!bindGroupLayout || !uniformGPUBuffer || !defaultSampler) return null;

        let cacheEntry = this.#bakeBindGroupCache.get(typeId);
        const needsNewBindGroup = !cacheEntry
            || cacheEntry.rawBuffer !== rawBuffer
            || cacheEntry.vhtView !== vhtView
            || cacheEntry.vbtView !== vbtView
            || cacheEntry.weightView !== weightView
            || cacheEntry.tasksBuffer !== tasksBuffer;

        if (needsNewBindGroup) {
            const bindGroup = gpuDevice.createBindGroup({
                label: `${labelPrefix}_BG_Type_${typeId}`,
                layout: bindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: uniformGPUBuffer}},
                    {binding: 1, resource: {buffer: rawBuffer}},
                    {binding: 2, resource: vhtView},
                    {binding: 3, resource: vbtView},
                    {binding: 4, resource: defaultSampler},
                    {binding: 5, resource: weightView},
                    {binding: 6, resource: {buffer: tasksBuffer}}
                ]
            });

            cacheEntry = {
                bindGroup,
                rawBuffer,
                vhtView,
                vbtView,
                weightView,
                tasksBuffer
            };
            this.#bakeBindGroupCache.set(typeId, cacheEntry);
        }

        return cacheEntry.bindGroup;
    }

    initComputePipeline(
        shaderCode: string,
        label: string,
        uniformByteLength: number = 256
    ): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        const {wgslParser} = resourceManager;

        const shaderName = `${label}_ShaderModule`;
        const shaderInfo = wgslParser.parse(shaderName, shaderCode);
        let computeModule = resourceManager.getGPUShaderModule(shaderName);
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule(shaderName, {
                code: shaderCode
            });
        }

        const layoutDesc = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(`${label}_BindGroupLayout`, {
            label: `${label}_BindGroupLayout`,
            ...layoutDesc
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout(`${label}_PipelineLayout`, {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${label}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main'
            }
        });

        const {UNIFORM, COPY_DST} = GPUBufferUsage;
        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: `${label}_UniformBuffer`,
            size: uniformByteLength,
            usage: UNIFORM | COPY_DST
        });

        const {basicSampler} = resourceManager;
        this.#defaultSampler = basicSampler.gpuSampler;
    }

    resolveWeightLayer(
        landscape: Landscape,
        targetLayer?: string | number | null
    ): ResolvedWeightLayerInfo {
        const info = this.#resolvedWeightInfo;
        const {resourceManager} = this.redGPUContext;
        const {emptyBitmapTextureView} = resourceManager;
        info.weightView = emptyBitmapTextureView;
        info.hasWeightMap = 0;
        info.weightChannelIndex = 0;

        const {layers} = landscape;
        if (targetLayer != null && targetLayer !== '' && layers) {
            const matchedLayer = typeof targetLayer === 'number'
                ? layers[targetLayer]
                : layers.find((l: any) => l.name === targetLayer);
            if (matchedLayer) {
                const {weightTexture, weightChannelIndex = 0} = matchedLayer;
                if (weightTexture?.gpuTexture) {
                    info.weightView = resourceManager.getGPUResourceBitmapTextureView(weightTexture);
                    info.hasWeightMap = 1;
                    info.weightChannelIndex = weightChannelIndex;
                }
            }
        }
        return info;
    }
}

Object.freeze(AScatterInstanceBaker);
export default AScatterInstanceBaker;

