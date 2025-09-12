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

	// #getOptimizedJointNodeGlobalTransform(usedJointIndices: number[], nodeGlobalTransform): Float32Array {
	// 	const neededSize = this.joints.length * 16; // GPU 버퍼는 전체 크기 유지
	// 	if (!this.#reusableJointNodeGlobalTransform || this.#reusableJointNodeGlobalTransform.length != neededSize) {
	// 		this.#reusableJointNodeGlobalTransform = new Float32Array(neededSize);
	// 	}
	// 	// 사용되는 조인트만 계산
	// 	for (const jointIndex of usedJointIndices) {
	// 		mat4.multiply(temp0, this.joints[jointIndex].modelMatrix, this.inverseBindMatrices[jointIndex]);
	// 		mat4.multiply(temp1, nodeGlobalTransform, temp0);
	// 		this.#reusableJointNodeGlobalTransform.set(temp1, jointIndex * 16);
	// 	}
	// 	return this.#reusableJointNodeGlobalTransform;
	// }
	#getOptimizedJointNodeGlobalTransform(usedJointIndices: number[], nodeGlobalTransform: Float32Array): Float32Array {
		const neededSize = this.joints.length * 16;
		if (!this.#reusableJointNodeGlobalTransform || this.#reusableJointNodeGlobalTransform.length !== neededSize) {
			this.#reusableJointNodeGlobalTransform = new Float32Array(neededSize);
		}

		for (const jointIndex of usedJointIndices) {
			const jointMatrix = this.joints[jointIndex].modelMatrix;
			const inverseBindMatrix = this.inverseBindMatrices[jointIndex];
			const offset = jointIndex * 16;

			// temp1 = nodeGlobalTransform * jointMatrix ---
			const n00 = nodeGlobalTransform[0],  n01 = nodeGlobalTransform[1],  n02 = nodeGlobalTransform[2],  n03 = nodeGlobalTransform[3];
			const n10 = nodeGlobalTransform[4],  n11 = nodeGlobalTransform[5],  n12 = nodeGlobalTransform[6],  n13 = nodeGlobalTransform[7];
			const n20 = nodeGlobalTransform[8],  n21 = nodeGlobalTransform[9],  n22 = nodeGlobalTransform[10], n23 = nodeGlobalTransform[11];
			const n30 = nodeGlobalTransform[12], n31 = nodeGlobalTransform[13], n32 = nodeGlobalTransform[14], n33 = nodeGlobalTransform[15];

			const j00 = jointMatrix[0],  j01 = jointMatrix[1],  j02 = jointMatrix[2],  j03 = jointMatrix[3];
			const j10 = jointMatrix[4],  j11 = jointMatrix[5],  j12 = jointMatrix[6],  j13 = jointMatrix[7];
			const j20 = jointMatrix[8],  j21 = jointMatrix[9],  j22 = jointMatrix[10], j23 = jointMatrix[11];
			const j30 = jointMatrix[12], j31 = jointMatrix[13], j32 = jointMatrix[14], j33 = jointMatrix[15];

			const t00 = n00 * j00 + n10 * j01 + n20 * j02 + n30 * j03;
			const t01 = n01 * j00 + n11 * j01 + n21 * j02 + n31 * j03;
			const t02 = n02 * j00 + n12 * j01 + n22 * j02 + n32 * j03;
			const t03 = n03 * j00 + n13 * j01 + n23 * j02 + n33 * j03;

			const t10 = n00 * j10 + n10 * j11 + n20 * j12 + n30 * j13;
			const t11 = n01 * j10 + n11 * j11 + n21 * j12 + n31 * j13;
			const t12 = n02 * j10 + n12 * j11 + n22 * j12 + n32 * j13;
			const t13 = n03 * j10 + n13 * j11 + n23 * j12 + n33 * j13;

			const t20 = n00 * j20 + n10 * j21 + n20 * j22 + n30 * j23;
			const t21 = n01 * j20 + n11 * j21 + n21 * j22 + n31 * j23;
			const t22 = n02 * j20 + n12 * j21 + n22 * j22 + n32 * j23;
			const t23 = n03 * j20 + n13 * j21 + n23 * j22 + n33 * j23;

			const t30 = n00 * j30 + n10 * j31 + n20 * j32 + n30 * j33;
			const t31 = n01 * j30 + n11 * j31 + n21 * j32 + n31 * j33;
			const t32 = n02 * j30 + n12 * j31 + n22 * j32 + n32 * j33;
			const t33 = n03 * j30 + n13 * j31 + n23 * j32 + n33 * j33;

			// final = temp1 * inverseBindMatrix ---
			const i00 = inverseBindMatrix[0],  i01 = inverseBindMatrix[1],  i02 = inverseBindMatrix[2],  i03 = inverseBindMatrix[3];
			const i10 = inverseBindMatrix[4],  i11 = inverseBindMatrix[5],  i12 = inverseBindMatrix[6],  i13 = inverseBindMatrix[7];
			const i20 = inverseBindMatrix[8],  i21 = inverseBindMatrix[9],  i22 = inverseBindMatrix[10], i23 = inverseBindMatrix[11];
			const i30 = inverseBindMatrix[12], i31 = inverseBindMatrix[13], i32 = inverseBindMatrix[14], i33 = inverseBindMatrix[15];

			this.#reusableJointNodeGlobalTransform[offset]     = t00 * i00 + t10 * i01 + t20 * i02 + t30 * i03;
			this.#reusableJointNodeGlobalTransform[offset + 1] = t01 * i00 + t11 * i01 + t21 * i02 + t31 * i03;
			this.#reusableJointNodeGlobalTransform[offset + 2] = t02 * i00 + t12 * i01 + t22 * i02 + t32 * i03;
			this.#reusableJointNodeGlobalTransform[offset + 3] = t03 * i00 + t13 * i01 + t23 * i02 + t33 * i03;

			this.#reusableJointNodeGlobalTransform[offset + 4] = t00 * i10 + t10 * i11 + t20 * i12 + t30 * i13;
			this.#reusableJointNodeGlobalTransform[offset + 5] = t01 * i10 + t11 * i11 + t21 * i12 + t31 * i13;
			this.#reusableJointNodeGlobalTransform[offset + 6] = t02 * i10 + t12 * i11 + t22 * i12 + t32 * i13;
			this.#reusableJointNodeGlobalTransform[offset + 7] = t03 * i10 + t13 * i11 + t23 * i12 + t33 * i13;

			this.#reusableJointNodeGlobalTransform[offset + 8]  = t00 * i20 + t10 * i21 + t20 * i22 + t30 * i23;
			this.#reusableJointNodeGlobalTransform[offset + 9]  = t01 * i20 + t11 * i21 + t21 * i22 + t31 * i23;
			this.#reusableJointNodeGlobalTransform[offset + 10] = t02 * i20 + t12 * i21 + t22 * i22 + t32 * i23;
			this.#reusableJointNodeGlobalTransform[offset + 11] = t03 * i20 + t13 * i21 + t23 * i22 + t33 * i23;

			this.#reusableJointNodeGlobalTransform[offset + 12] = t00 * i30 + t10 * i31 + t20 * i32 + t30 * i33;
			this.#reusableJointNodeGlobalTransform[offset + 13] = t01 * i30 + t11 * i31 + t21 * i32 + t31 * i33;
			this.#reusableJointNodeGlobalTransform[offset + 14] = t02 * i30 + t12 * i31 + t22 * i32 + t32 * i33;
			this.#reusableJointNodeGlobalTransform[offset + 15] = t03 * i30 + t13 * i31 + t23 * i32 + t33 * i33;
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
