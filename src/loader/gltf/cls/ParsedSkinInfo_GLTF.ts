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
	joints: any[];
	inverseBindMatrices: Float32Array[];
	skeletonMesh: any;
	vertexStorageInfo
	vertexStorageBuffer: StorageBuffer
	#nodeGlobalTransform: Float32Array
	#reusableJointNodeGlobalTransform: Float32Array
	#usedJoints:Set<number> = null
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

	#getUsedJointIndices(mesh: Mesh): Set<number> {
		const usedJoints = new Set<number>();
		const geometry = mesh.geometry;
		const vertexBuffer = geometry.vertexBuffer;

		// 인터리브된 데이터에서 joint 정보 추출
		const interleavedStruct = vertexBuffer.interleavedStruct;
		const jointInfo = interleavedStruct.attributes.filter(v=>v.attributeName === 'aVertexJoint')[0];

		if (!jointInfo) return usedJoints;

		const data = vertexBuffer.data;
		const stride = interleavedStruct.arrayStride / 4;
		const jointOffset = jointInfo.offset / 4;
		const vertexCount = data.length / stride;

		for (let i = 0; i < vertexCount; i++) {
			const baseIndex = i * stride + jointOffset;
			// 각 정점마다 4개의 조인트 인덱스
			for (let j = 0; j < 4; j++) {
				const jointIndex = Math.floor(data[baseIndex + j]);
				if (jointIndex >= 0 && jointIndex < this.joints.length) {
					usedJoints.add(jointIndex);
				}
			}
		}
		// keepLog('usedJoints',usedJoints)
		return usedJoints;
	}

	update(redGPUContext: RedGPUContext, mesh: Mesh) {

		const usedJointIndices = this.#usedJoints === null ? this.#getUsedJointIndices(mesh) : this.#usedJoints;
		this.#usedJoints = usedJointIndices
		const nodeGlobalTransform = this.#getNodeGlobalTransform(mesh.modelMatrix);
		const jointNodeGlobalTransform = this.#getOptimizedJointNodeGlobalTransform(
			Array.from(usedJointIndices),
			nodeGlobalTransform
		);
		this.#writeBuffersToGPU(redGPUContext, mesh.animationInfo.skinInfo, jointNodeGlobalTransform);
	}

	#getOptimizedJointNodeGlobalTransform(usedJointIndices: number[], nodeGlobalTransform): Float32Array {
		const neededSize = this.joints.length * 16; // GPU 버퍼는 전체 크기 유지
		if (!this.#reusableJointNodeGlobalTransform || this.#reusableJointNodeGlobalTransform.length != neededSize) {
			this.#reusableJointNodeGlobalTransform = new Float32Array(neededSize);
		}

		// 사용되는 조인트만 계산
		for (const jointIndex of usedJointIndices) {
			const t0 = mat4.multiply(temp0, nodeGlobalTransform, this.joints[jointIndex].modelMatrix)
			const t1 = mat4.multiply(temp1, t0, this.inverseBindMatrices[jointIndex])
			this.#reusableJointNodeGlobalTransform.set(t1, jointIndex * 16);
		}

		return this.#reusableJointNodeGlobalTransform;
	}


	// 노드의 글로벌 변형을 가져오는 메서드입니다.
	#getNodeGlobalTransform(matrix: Float32Array | mat4): Float32Array {
		this.#nodeGlobalTransform = this.#nodeGlobalTransform || new Float32Array(matrix.length);
		this.#nodeGlobalTransform.set(matrix);
		mat4.invert(this.#nodeGlobalTransform, this.#nodeGlobalTransform)
		return this.#nodeGlobalTransform;
	}
	//
	// // joint의 노드 글로벌 변형을 가져옵니다.
	// #getJointNodeGlobalTransform(joints: any[], nodeGlobalTransform): Float32Array {
	// 	const neededSize = joints.length * 16;
	// 	if (!this.#reusableJointNodeGlobalTransform || this.#reusableJointNodeGlobalTransform.length != neededSize) {
	// 		this.#reusableJointNodeGlobalTransform = new Float32Array(neededSize);
	// 	}
	// 	for (let i = 0; i < joints.length; i++) {
	// 		const t0 = mat4.multiply(temp0, nodeGlobalTransform, joints[i].modelMatrix)
	// 		const t1 = mat4.multiply(
	// 			temp1,
	// 			t0,
	// 			this.inverseBindMatrices[i]
	// 		)
	// 		this.#reusableJointNodeGlobalTransform.set(t1, i * 16);
	// 	}
	// 	return this.#reusableJointNodeGlobalTransform;
	// }

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
