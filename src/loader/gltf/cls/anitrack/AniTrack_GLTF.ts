import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../../display/mesh/Mesh";
import AnimationData_GLTF from "../AnimationData_GLTF";
import shaderCode from './compute.wgsl'

type MeshResources = {
    bindGroup: GPUBindGroup;
    originBuffer: GPUBuffer;
    morphInterleavedBuffer: GPUBuffer;
};

class AniTrack_GLTF {
    lastPrevIdx: number
    lastNextIdx: number
    lastInterpolationValue: number

    timeAnimationInfo: AnimationData_GLTF;
    aniDataAnimationInfo: AnimationData_GLTF;

    weightMeshes: Mesh[];
    animationTargetMesh: Mesh;
    cacheTable = {};

    // 마이크로 성능 최적화용 필드 추가
    key;
    keyType: number;            // 1: rotation, 2: translation, 3: scale, 4: weights
    interpolation: "CUBICSPLINE" | "STEP" | "LINEAR" | string;
    interpolationType: number;  // 0: STEP, 1: LINEAR, 2: CUBICSPLINE
    lastCachedKey: number = -1;
    lastCachedItem: Float32Array | null = null;

    #computeShader: GPUShaderModule;
    #computePipeline: GPUComputePipeline;
    #animationDataListBuffer: GPUBuffer;
    #uniformBuffer: GPUBuffer;
    #uniformData: Float32Array;
    #meshResourcesMap: Map<Mesh, MeshResources> = new Map();

    constructor(key, time, data, interpolation, targetMesh: Mesh, weightMeshes) {
        this.key = key
        this.timeAnimationInfo = time
        this.aniDataAnimationInfo = data
        this.interpolation = interpolation
        this.animationTargetMesh = targetMesh
        this.weightMeshes = weightMeshes
        this.#uniformData = new Float32Array(8);

        // keyType 정수 변환 캐싱 (1: rotation, 2: translation, 3: scale, 4: weights)
        switch (key) {
            case 'rotation':
                this.keyType = 1;
                break;
            case 'translation':
                this.keyType = 2;
                break;
            case 'scale':
                this.keyType = 3;
                break;
            case 'weights':
                this.keyType = 4;
                break;
            default:
                this.keyType = 0;
                break;
        }

        // interpolationType 정수 변환 캐싱 (0: STEP, 1: LINEAR, 2: CUBICSPLINE)
        switch (interpolation) {
            case 'STEP':
                this.interpolationType = 0;
                break;
            case 'LINEAR':
                this.interpolationType = 1;
                break;
            case 'CUBICSPLINE':
                this.interpolationType = 2;
                break;
            default:
                this.interpolationType = 1;
                break;
        }
    }

    async renderWeight(redGPUContext: RedGPUContext,
                       computePassEncoder: GPUComputePassEncoder,
                       targetMesh: Mesh, interpolationValue: number, prevIDX: number, nextIDX: number) {
        const {gpuDevice} = redGPUContext;
        if (!this.#computeShader) {
            this.#initCommonCompute(redGPUContext);
        }
        if (!this.#meshResourcesMap.has(targetMesh)) {
            this.#initMeshResources(redGPUContext, targetMesh);
        }
        const resources = this.#meshResourcesMap.get(targetMesh)!;
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
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);
        computePassEncoder.setPipeline(this.#computePipeline);
        computePassEncoder.setBindGroup(0, resources.bindGroup);
        const workgroupCount = Math.ceil(targetMesh.geometry.vertexBuffer.vertexCount / 64);
        computePassEncoder.dispatchWorkgroups(workgroupCount);
    }

    #initCommonCompute(redGPUContext: RedGPUContext) {
        const {gpuDevice} = redGPUContext;
        this.#computeShader = gpuDevice.createShaderModule({code: shaderCode});
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
        gpuDevice.queue.writeBuffer(
            this.#animationDataListBuffer,
            0,
            this.aniDataAnimationInfo.dataList as BufferSource
        );
    }

    #initMeshResources(redGPUContext: RedGPUContext, mesh: Mesh) {
        const {gpuDevice} = redGPUContext;
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
                {binding: 0, resource: {buffer: this.#animationDataListBuffer}},
                {binding: 1, resource: {buffer: this.#uniformBuffer}},
                {binding: 2, resource: {buffer: vertexBuffer.gpuBuffer}},
                {binding: 3, resource: {buffer: originBuffer}},
                {binding: 4, resource: {buffer: morphInterleavedBuffer}}
            ]
        });
        this.#meshResourcesMap.set(mesh, {
            bindGroup,
            originBuffer,
            morphInterleavedBuffer
        });
    }
}

export default AniTrack_GLTF
