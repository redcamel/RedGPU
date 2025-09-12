import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";

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
	vertexStorageBuffer: GPUBuffer
	#nodeGlobalTransform: Float32Array
	#reusableJointNodeGlobalTransform: Float32Array
	#usedJoints: Set<number> = null

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
		const jointInfo = interleavedStruct.attributes.filter(v => v.attributeName === 'aVertexJoint')[0];
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

	#createCompute(
		device: GPUDevice,
		vertexStorageBuffer: GPUBuffer,
		weightBuffer: VertexBuffer,
		jointNodeGlobalTransform: Float32Array
	) {
		const source = `
    struct VertexSkinData {
      vertexWeight: vec4<f32>,
      vertexJoint: vec4<f32>,
    };

  
    struct AlignedMatrix {
        col0: vec4<f32>,
        col1: vec4<f32>, 
        col2: vec4<f32>,
        col3: vec4<f32>,
    };

    @group(0) @binding(0) var<storage, read> vertexSkinBuffer: array<VertexSkinData>;
    @group(0) @binding(1) var<storage, read> jointMatrices: array<AlignedMatrix>;
    @group(0) @binding(2) var<storage, read_write> skinMatrixBuffer: array<AlignedMatrix>;

    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      
      let i = global_id.x;
      if (i >= arrayLength(&vertexSkinBuffer)) {
          return;
      }
      
      let skin = vertexSkinBuffer[i];
      

      let j0 = u32(skin.vertexJoint.x);
      let j1 = u32(skin.vertexJoint.y);
      let j2 = u32(skin.vertexJoint.z);
      let j3 = u32(skin.vertexJoint.w);
      
  
      let w = skin.vertexWeight;
      
  
      let m0 = jointMatrices[j0];
      let m1 = jointMatrices[j1];
      let m2 = jointMatrices[j2];
      let m3 = jointMatrices[j3];
      

      let result_col0 = w.x * m0.col0 + w.y * m1.col0 + w.z * m2.col0 + w.w * m3.col0;
      let result_col1 = w.x * m0.col1 + w.y * m1.col1 + w.z * m2.col1 + w.w * m3.col1;
      let result_col2 = w.x * m0.col2 + w.y * m1.col2 + w.z * m2.col2 + w.w * m3.col2;
      let result_col3 = w.x * m0.col3 + w.y * m1.col3 + w.z * m2.col3 + w.w * m3.col3;

   
      skinMatrixBuffer[i] = AlignedMatrix(result_col0, result_col1, result_col2, result_col3);
    }
    `;

		// 2. 정렬된 jointNodeGlobalTransformBuffer 생성
		const jointSize = jointNodeGlobalTransform.byteLength;
		// 256바이트 정렬 (GPU 캐시 라인 최적화)
		const alignedJointSize = Math.ceil(jointSize / 256) * 256;

		const jointBuffer = device.createBuffer({
			size: alignedJointSize,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true,
			label: 'OptimizedJointMatrices'
		});

		const mappedArray = new Float32Array(jointBuffer.getMappedRange());
		mappedArray.set(jointNodeGlobalTransform);
		jointBuffer.unmap();

		this.#jointNodeGlobalTransformBuffer = jointBuffer;

		// 4. 셰이더 모듈 로드 & 컴퓨트 파이프라인 생성
		this.#computeShader = device.createShaderModule({code: source});
		this.#computePipeline = device.createComputePipeline({
			layout: 'auto',
			compute: {
				module: this.#computeShader,
				entryPoint: 'main',
			},
		});

		// 5. 바인드 그룹 생성
		this.#bindGroup = device.createBindGroup({
			layout: this.#computePipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
				{binding: 1, resource: {buffer: this.#jointNodeGlobalTransformBuffer}},
				{binding: 2, resource: {buffer: vertexStorageBuffer}},
			],
		});
	}

	#jointNodeGlobalTransformBuffer: GPUBuffer;
	#computeShader: GPUShaderModule;
	#computePipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;

	get computePipeline(): GPUComputePipeline {
		return this.#computePipeline;
	}

	get bindGroup(): GPUBindGroup {
		return this.#bindGroup;
	}

	// update(redGPUContext: RedGPUContext, mesh: Mesh) {
	// 	const {gpuDevice} = redGPUContext
	// 	const usedJointIndices = this.#usedJoints === null ? this.#getUsedJointIndices(mesh) : this.#usedJoints;
	// 	this.#usedJoints = usedJointIndices
	// 	const nodeGlobalTransform = this.#getNodeGlobalTransform(mesh.modelMatrix);
	// 	const jointNodeGlobalTransform = this.#getOptimizedJointNodeGlobalTransform(
	// 		Array.from(usedJointIndices),
	// 		nodeGlobalTransform
	// 	);
	//
	// 	if (!this.#computeShader) {
	// 		this.#createCompute(gpuDevice,mesh.animationInfo.skinInfo.vertexStorageBuffer, mesh.animationInfo.weightBuffer, jointNodeGlobalTransform)
	// 	}
	// 	gpuDevice.queue.writeBuffer(this.#jointNodeGlobalTransformBuffer,0,jointNodeGlobalTransform)
	// 	{
	// 		const commandEncoder = gpuDevice.createCommandEncoder();
	// 		const passEncoder = commandEncoder.beginComputePass();
	// 		passEncoder.setPipeline(this.#computePipeline);
	// 		passEncoder.setBindGroup(0, this.#bindGroup);
	// 		passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / 64));
	// 		passEncoder.end();
	//
	// 		gpuDevice.queue.submit([commandEncoder.finish()]);
	// 	}
	// 	// this.#writeBuffersToGPU(redGPUContext, mesh.animationInfo.skinInfo, this.#skinMatrixBuffer);
	// }
	update(redGPUContext,commandEncoder: GPUCommandEncoder, mesh: Mesh) {
		const {gpuDevice} = redGPUContext
		const usedJointIndices = this.#usedJoints === null ? this.#getUsedJointIndices(mesh) : this.#usedJoints;
		this.#usedJoints = usedJointIndices
		const nodeGlobalTransform = this.#getNodeGlobalTransform(mesh.modelMatrix);
		const jointNodeGlobalTransform = this.#getOptimizedJointNodeGlobalTransform(
			Array.from(usedJointIndices),
			nodeGlobalTransform
		);

		if (!this.#computeShader) {
			this.#createCompute(gpuDevice,mesh.animationInfo.skinInfo.vertexStorageBuffer, mesh.animationInfo.weightBuffer, jointNodeGlobalTransform)
		}
		gpuDevice.queue.writeBuffer(this.#jointNodeGlobalTransformBuffer,0,jointNodeGlobalTransform)
		{

			const passEncoder = commandEncoder.beginComputePass();
			passEncoder.setPipeline(this.#computePipeline);
			passEncoder.setBindGroup(0, this.#bindGroup);
			passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / 64));
			passEncoder.end();
		}
		// this.#writeBuffersToGPU(redGPUContext, mesh.animationInfo.skinInfo, this.#skinMatrixBuffer);
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
