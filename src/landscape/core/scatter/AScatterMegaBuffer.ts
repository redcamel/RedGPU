import RedGPUObject from '../../../base/RedGPUObject';
import RedGPUContext from '../../../context/RedGPUContext';

export const CULLING_WORKGROUP_SIZE = 64;

export const DRAW_INDEXED_INDIRECT_ARGS_COUNT = 5;

export interface ScatterShaderReflectionConfig {
    shaderInfo: any;
    instanceStructName: string;
    typeParamStructName?: string;
}

export interface ScatterBaseSegmentAllocation {
    typeId: number;
    name?: string;
    maxInstances: number;
    rawBaseOffset: number;
    culledBaseOffset: number;
    indirectBaseOffset: number;
    renderUnitCount: number;
    instanceCount: number;
}

abstract class AScatterMegaBuffer extends RedGPUObject {
    #instanceCapacity: number;
    #strideFloats: number;
    #strideBytes: number;
    #typeParamFloats: number;
    #maxRenderUnits: number;
    #maxTypes: number;

    #totalAllocatedInstances: number = 0;
    #totalAllocatedCulledInstances: number = 0;
    #totalIndirectDrawCalls: number = 0;

    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #indirectResetTemplate: Uint32Array;
    #indirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #onRecreated: (() => void) | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        reflectionConfig: ScatterShaderReflectionConfig,
        initialCapacity: number,
        maxTypes: number,
        maxRenderUnits: number
    ) {
        super(redGPUContext);

        const {shaderInfo, instanceStructName, typeParamStructName} = reflectionConfig;
        const {structs} = shaderInfo;

        const strideBytes = structs[instanceStructName]?.arrayBufferByteLength;

        if (!strideBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect instance stride for "${instanceStructName}".`);
        }

        const typeParamBytes = typeParamStructName
            ? structs[typeParamStructName]?.arrayBufferByteLength
            : 0;

        if (typeParamStructName && !typeParamBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect type param struct size for "${typeParamStructName}".`);
        }

        this.#maxTypes = maxTypes;
        this.#maxRenderUnits = maxRenderUnits;
        this.#strideBytes = strideBytes;
        this.#strideFloats = strideBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#typeParamFloats = typeParamBytes / Float32Array.BYTES_PER_ELEMENT;

        this.#instanceCapacity = Math.ceil(initialCapacity / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;

        const typeParamsCount = this.#maxTypes * this.#typeParamFloats;
        this.#cpuTypeParamsBuffer = new Float32Array(typeParamsCount > 0 ? typeParamsCount : 1);
        this.#cpuTypeParamsUint32 = new Uint32Array(this.#cpuTypeParamsBuffer.buffer);

        this.#indirectResetTemplate = new Uint32Array(this.#maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT);

        this.#initBaseBuffers();
    }

    get strideBytes(): number {
        return this.#strideBytes;
    }

    get strideFloats(): number {
        return this.#strideFloats;
    }

    get typeParamFloats(): number {
        return this.#typeParamFloats;
    }

    get maxRenderUnits(): number {
        return this.#maxRenderUnits;
    }

    get maxTypes(): number {
        return this.#maxTypes;
    }

    get instanceCapacity(): number {
        return this.#instanceCapacity;
    }

    get cpuTypeParamsBuffer(): Float32Array {
        return this.#cpuTypeParamsBuffer;
    }

    get cpuTypeParamsUint32(): Uint32Array {
        return this.#cpuTypeParamsUint32;
    }

    get isReady(): boolean {
        return this.#rawGPUBuffer != null && this.#indirectGPUBuffer != null;
    }

    get rawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    set culledGPUBuffer(buffer: GPUBuffer | null) {
        this.#culledGPUBuffer = buffer;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
    }

    get onRecreated(): (() => void) | null {
        return this.#onRecreated;
    }

    set onRecreated(cb: (() => void) | null) {
        this.#onRecreated = cb;
    }

    get totalAllocatedInstances(): number {
        return this.#totalAllocatedInstances;
    }

    get totalIndirectDrawCalls(): number {
        return this.#totalIndirectDrawCalls;
    }

    allocateBaseSegment(
        typeIdOrName: number | string,
        maxInstances: number,
        renderUnitCount: number,
        culledMultiplier: number = 2
    ): ScatterBaseSegmentAllocation {
        const alignedMax = Math.ceil(maxInstances / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;
        this.ensureCapacity(this.#totalAllocatedInstances + alignedMax);

        const rawBaseOffset = this.#totalAllocatedInstances;
        const culledBaseOffset = this.#totalAllocatedCulledInstances;
        const indirectBaseOffset = this.#totalIndirectDrawCalls;

        this.#totalAllocatedInstances += alignedMax;
        this.#totalAllocatedCulledInstances += alignedMax * culledMultiplier;
        this.#totalIndirectDrawCalls += renderUnitCount;

        const typeId = typeof typeIdOrName === 'number' ? typeIdOrName : 0;
        const name = typeof typeIdOrName === 'string' ? typeIdOrName : undefined;

        return {
            typeId,
            name,
            maxInstances: alignedMax,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            renderUnitCount,
            instanceCount: 0
        };
    }

    registerIndirectDrawSlot(
        slotIndex: number,
        indexCount: number,
        firstIndex: number = 0,
        baseVertex: number = 0,
        firstInstance: number = 0
    ): void {
        const base = slotIndex * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
        const template = this.#indirectResetTemplate;
        template[base + 0] = indexCount;
        template[base + 1] = 0;
        template[base + 2] = firstIndex;
        template[base + 3] = baseVertex;
        template[base + 4] = firstInstance;
    }

    syncIndirectResetTemplateToGPU(slotIndex?: number, slotCount?: number): void {
        const {gpuDevice} = this;
        const {queue} = gpuDevice;
        const indirectGPUBuffer = this.#indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        const {buffer} = this.#indirectResetTemplate;
        const indirectResetTemplateGPUBuffer = this.#indirectResetTemplateGPUBuffer;

        if (slotIndex !== undefined && slotCount !== undefined) {
            const byteOffset = slotIndex * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            const byteSize = slotCount * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            queue.writeBuffer(
                indirectGPUBuffer,
                byteOffset,
                buffer,
                byteOffset,
                byteSize
            );
            if (indirectResetTemplateGPUBuffer) {
                queue.writeBuffer(
                    indirectResetTemplateGPUBuffer,
                    byteOffset,
                    buffer,
                    byteOffset,
                    byteSize
                );
            }
        } else {
            const byteSize = this.#totalIndirectDrawCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            if (byteSize > 0) {
                queue.writeBuffer(
                    indirectGPUBuffer,
                    0,
                    buffer,
                    0,
                    byteSize
                );
                if (indirectResetTemplateGPUBuffer) {
                    queue.writeBuffer(
                        indirectResetTemplateGPUBuffer,
                        0,
                        buffer,
                        0,
                        byteSize
                    );
                }
            }
        }
    }

    resetMultiIndirectCommands(commandEncoder?: GPUCommandEncoder): void {
        const indirectGPUBuffer = this.#indirectGPUBuffer;
        if (this.#totalIndirectDrawCalls === 0 || !indirectGPUBuffer) return;

        const byteSize = this.#totalIndirectDrawCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;

        if (commandEncoder && this.#indirectResetTemplateGPUBuffer) {
            commandEncoder.copyBufferToBuffer(
                this.#indirectResetTemplateGPUBuffer,
                0,
                indirectGPUBuffer,
                0,
                byteSize
            );
        } else {
            this.gpuDevice.queue.writeBuffer(
                indirectGPUBuffer,
                0,
                this.#indirectResetTemplate.buffer,
                0,
                byteSize
            );
        }

        this.onResetMultiIndirectCommands(commandEncoder ?? null);
    }

    onResetMultiIndirectCommands(commandEncoder: GPUCommandEncoder | null): void {
    }

    clearBaseAllocations(): void {
        this.#totalAllocatedInstances = 0;
        this.#totalAllocatedCulledInstances = 0;
        this.#totalIndirectDrawCalls = 0;
    }

    ensureCapacity(requiredCapacity: number): boolean {
        if (requiredCapacity <= this.#instanceCapacity) {
            return false;
        }

        const {gpuDevice} = this;
        const maxBufferSize = gpuDevice.limits?.maxBufferSize ?? 2147483648;
        const maxSafeInstanceCapacity = Math.floor(maxBufferSize / (this.#strideBytes * 32));

        let newCapacity = this.#instanceCapacity;
        while (newCapacity < requiredCapacity) {
            newCapacity = Math.ceil((newCapacity * 2) / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;
        }

        if (newCapacity > maxSafeInstanceCapacity) {
            console.warn(
                `[${this.constructor.name}] Requested capacity (${newCapacity}) exceeds safe limit (${maxSafeInstanceCapacity}) for WebGPU maxBufferSize (${maxBufferSize} bytes). Clamping to safe limit.`
            );
            newCapacity = Math.floor(maxSafeInstanceCapacity / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;
        }

        if (newCapacity <= this.#instanceCapacity) {
            return false;
        }

        this.#instanceCapacity = newCapacity;

        const {STORAGE, COPY_DST} = GPUBufferUsage;
        this.#rawGPUBuffer.destroy();
        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: `${this.constructor.name}_RawInstances`,
            size: newCapacity * this.#strideBytes,
            usage: STORAGE | COPY_DST,
        });

        this.onResizeBuffers(newCapacity);

        this.#onRecreated?.();
        return true;
    }

    destroy(): void {
        this.#rawGPUBuffer.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer.destroy();
        this.#indirectResetTemplateGPUBuffer.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#indirectResetTemplateGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;

        this.invalidateUnifiedCullingBindGroup();

        this.onDestroy();
    }

    abstract invalidateUnifiedCullingBindGroup(): void;

    abstract onResizeBuffers(newCapacity: number): void;

    abstract onDestroy(): void;

    #initBaseBuffers(): void {
        const {gpuDevice} = this;
        const {STORAGE, COPY_DST, UNIFORM, INDIRECT, COPY_SRC} = GPUBufferUsage;
        const className = this.constructor.name;

        const rawByteSize = Math.max(this.#instanceCapacity * this.#strideBytes, 64);
        const typeParamsByteSize = this.#maxTypes * this.#typeParamFloats * Float32Array.BYTES_PER_ELEMENT;

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: `${className}_RawInstances`,
            size: rawByteSize,
            usage: STORAGE | COPY_DST,
        });

        if (typeParamsByteSize > 0) {
            this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
                label: `${className}_TypeParams`,
                size: typeParamsByteSize,
                usage: STORAGE | UNIFORM | COPY_DST,
            });
        }

        const indirectByteSize = Math.max(
            this.#maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
            64
        );

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: `${className}_Indirect_Main`,
            size: indirectByteSize,
            usage: STORAGE | INDIRECT | COPY_DST,
        });

        this.#indirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: `${className}_Indirect_Template`,
            size: indirectByteSize,
            usage: COPY_SRC | COPY_DST,
        });
    }
}

Object.freeze(AScatterMegaBuffer);
export default AScatterMegaBuffer;

