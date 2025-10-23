import shaderCode from './compute.wgsl';
class AniTrack_GLTF {
    lastPrevIdx;
    key;
    timeAnimationInfo;
    aniDataAnimationInfo;
    interpolation;
    weightMeshes;
    animationTargetMesh;
    cacheTable = {};
    #computeShader;
    #computePipeline;
    #animationDataListBuffer;
    #uniformBuffer;
    #uniformData;
    #meshResourcesMap = new Map();
    constructor(key, time, data, interpolation, targetMesh, weightMeshes) {
        this.key = key;
        this.timeAnimationInfo = time;
        this.aniDataAnimationInfo = data;
        this.interpolation = interpolation;
        this.animationTargetMesh = targetMesh;
        this.weightMeshes = weightMeshes;
        this.#uniformData = new Float32Array(8);
    }
    async renderWeight(redGPUContext, computePassEncoder, targetMesh, interpolationValue, prevIDX, nextIDX) {
        const { gpuDevice } = redGPUContext;
        if (!this.#computeShader) {
            this.#initCommonCompute(redGPUContext);
        }
        if (!this.#meshResourcesMap.has(targetMesh)) {
            this.#initMeshResources(redGPUContext, targetMesh);
        }
        const resources = this.#meshResourcesMap.get(targetMesh);
        this.#uniformData.set([
            interpolationValue,
            prevIDX,
            nextIDX,
            targetMesh.animationInfo.morphInfo.morphInfoDataList.length,
            targetMesh.geometry.vertexBuffer.stride,
            targetMesh.geometry.vertexBuffer.vertexCount,
            0,
            0
        ]);
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData);
        computePassEncoder.setPipeline(this.#computePipeline);
        computePassEncoder.setBindGroup(0, resources.bindGroup);
        const workgroupCount = Math.ceil(targetMesh.geometry.vertexBuffer.vertexCount / 64);
        computePassEncoder.dispatchWorkgroups(workgroupCount);
    }
    #initCommonCompute(redGPUContext) {
        const { gpuDevice } = redGPUContext;
        this.#computeShader = gpuDevice.createShaderModule({ code: shaderCode });
        this.#computePipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {
                module: this.#computeShader,
                entryPoint: 'main'
            }
        });
        this.#animationDataListBuffer = gpuDevice.createBuffer({
            size: this.aniDataAnimationInfo.dataList.length * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.#uniformBuffer = gpuDevice.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        gpuDevice.queue.writeBuffer(this.#animationDataListBuffer, 0, this.aniDataAnimationInfo.dataList);
    }
    #initMeshResources(redGPUContext, mesh) {
        const { gpuDevice } = redGPUContext;
        const morphInfo = mesh.animationInfo.morphInfo;
        const vertexBuffer = mesh.geometry.vertexBuffer;
        const originBuffer = gpuDevice.createBuffer({
            size: morphInfo.origin.length * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const morphInterleavedData = morphInfo.morphInfoDataList
            .flatMap(m => Array.from(m.interleaveData));
        const morphInterleavedBuffer = gpuDevice.createBuffer({
            size: morphInterleavedData.length * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        gpuDevice.queue.writeBuffer(originBuffer, 0, morphInfo.origin);
        gpuDevice.queue.writeBuffer(morphInterleavedBuffer, 0, new Float32Array(morphInterleavedData));
        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#computePipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.#animationDataListBuffer } },
                { binding: 1, resource: { buffer: this.#uniformBuffer } },
                { binding: 2, resource: { buffer: vertexBuffer.gpuBuffer } },
                { binding: 3, resource: { buffer: originBuffer } },
                { binding: 4, resource: { buffer: morphInterleavedBuffer } }
            ]
        });
        this.#meshResourcesMap.set(mesh, {
            bindGroup,
            originBuffer,
            morphInterleavedBuffer
        });
    }
}
export default AniTrack_GLTF;
