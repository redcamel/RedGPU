import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
/**
 * GLTF 형식에서 파싱된 스킨 정보를 나타내는 클래스입니다.
 * @class ParsedSkinInfo_GLTF
 */
declare class ParsedSkinInfo_GLTF {
    joints: any[];
    inverseBindMatrices: Float32Array[];
    skeletonMesh: any;
    vertexStorageInfo: any;
    vertexStorageBuffer: GPUBuffer;
    prevVertexStorageBuffer: GPUBuffer;
    invertNodeGlobalTransform: Float32Array;
    usedJoints: number[];
    WORK_SIZE: number;
    jointData: Float32Array;
    uniformBuffer: GPUBuffer;
    computeShader: GPUShaderModule;
    computePipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
    /**
     * Constructor 클래스의 새 인스턴스를 생성합니다.
     * 클래스를 설명하는 @classdesc 도 추가했습니다.
     * @constructor
     */
    constructor();
    getUsedJointIndices(mesh: Mesh): number[];
    createCompute(redGPUContext: RedGPUContext, device: GPUDevice, vertexStorageBuffer: GPUBuffer, weightBuffer: VertexBuffer, jointBuffer: IndexBuffer): void;
}
export default ParsedSkinInfo_GLTF;
