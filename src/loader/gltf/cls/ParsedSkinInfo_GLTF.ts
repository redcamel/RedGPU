import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";

let temp0 = new Float32Array(16)
let temp1 = new Float32Array(16)

/**
 * GLTF 형식에서 파싱된 스킨 정보를 나타내는 클래스입니다.
 * @class ParsedSkinInfo_GLTF
 */
class ParsedSkinInfo_GLTF {
    // 클래스 멤버변수를 선언합니다.
    joints: any[];
    inverseBindMatrices: Float32Array[];
    skeletonMesh: any;
    isInverseBindMatrixUpdated: boolean = false
    vertexStorageInfo
    vertexStorageBuffer: StorageBuffer
    #nodeGlobalTransform: Float32Array
    #reusableJointNodeGlobalTransform: Float32Array

    /**
     * Constructor 클래스의 새 인스턴스를 생성합니다.
     * 클래스를 설명하는 @classdesc 도 추가했습니다.
     * @constructor
     */
    constructor() {
        this.joints = [];
        this.inverseBindMatrices = null;
        this.skeletonMesh = null;
    }

    // 스킨 정보를 업데이트하는 메서드입니다.
    update(redGPUContext: RedGPUContext, mesh: Mesh) {
        const nodeGlobalTransform = this.#getNodeGlobalTransform(mesh.modelMatrix);
        const jointNodeGlobalTransform = this.#getJointNodeGlobalTransform(this.joints, nodeGlobalTransform);
        this.#writeBuffersToGPU(redGPUContext, mesh.animationInfo.skinInfo, jointNodeGlobalTransform);
    }

    // 노드의 글로벌 변형을 가져오는 메서드입니다.
    #getNodeGlobalTransform(matrix: Float32Array | mat4): Float32Array {
        this.#nodeGlobalTransform = this.#nodeGlobalTransform || new Float32Array(matrix.length);
        this.#nodeGlobalTransform.set(matrix);
        mat4.invert(this.#nodeGlobalTransform, this.#nodeGlobalTransform)
        return this.#nodeGlobalTransform;
    }

    // joint의 노드 글로벌 변형을 가져옵니다.
    #getJointNodeGlobalTransform(joints: any[], nodeGlobalTransform): Float32Array {
        const neededSize = joints.length * 16;
        if (!this.#reusableJointNodeGlobalTransform || this.#reusableJointNodeGlobalTransform.length != neededSize) {
            this.#reusableJointNodeGlobalTransform = new Float32Array(neededSize);
        }
        for (let i = 0; i < joints.length; i++) {
            const t0 = mat4.multiply(temp0, nodeGlobalTransform, joints[i].modelMatrix)
            const t1 = mat4.multiply(
                temp1,
                t0,
                this.inverseBindMatrices[i]
            )
            this.#reusableJointNodeGlobalTransform.set(t1, i * 16);
        }
        return this.#reusableJointNodeGlobalTransform;
    }

    // GPU로 버퍼를 작성하는 메서드입니다.
    #writeBuffersToGPU(
        redGPUContext: RedGPUContext,
        gpuRenderInfo,
        jointNodeGlobalTransform: Float32Array
    ) {
        const {vertexStorageBuffer, vertexStorageInfo} = gpuRenderInfo;
        const {gpuBuffer} = vertexStorageBuffer
        const {jointMatrix} = vertexStorageInfo.members
        redGPUContext.gpuDevice.queue.writeBuffer(
            gpuBuffer,
            jointMatrix.uniformOffset,
            jointNodeGlobalTransform
        );
    }
}

// ParsedSkinInfo_GLTF 클래스를 export 합니다.
export default ParsedSkinInfo_GLTF;
