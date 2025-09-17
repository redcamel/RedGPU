import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import {keepLog} from "../../../utils";

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
	invertNodeGlobalTransform: Float32Array
	usedJoints: number[] = null
	WORK_SIZE:number = 64

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

	getUsedJointIndices(mesh: Mesh): number[] {
		const usedJoints = new Set<number>();
		const geometry = mesh.geometry;
		const vertexBuffer = geometry.vertexBuffer;
		const {weightBuffer} = mesh.animationInfo;
		// 인터리브된 데이터에서 joint 정보 추출
		const interleavedStruct = weightBuffer.interleavedStruct;
		const jointInfo = interleavedStruct.attributes.filter(v => v.attributeName === 'aVertexJoint')[0];
		if (!jointInfo) return [];
		const data = weightBuffer.data;
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
		return Array.from(usedJoints);
	}

	createCompute(
		redGPUContext: RedGPUContext,
		device: GPUDevice,
		vertexStorageBuffer: GPUBuffer,
		weightBuffer: VertexBuffer,
	) {
		const source = `
			struct VertexSkinData {
			  vertexWeight: vec4<f32>,
			  vertexJoint:  vec4<f32>,
			};
			
			struct AlignedMatrix {
			  col0: vec4<f32>,
			  col1: vec4<f32>,
			  col2: vec4<f32>,
			  col3: vec4<f32>,
			};
			
			struct Uniforms {
			  invertNodeGlobalTransform:    mat4x4<f32>,
			  jointModelMatrices:     array<mat4x4<f32>, ${this.joints.length}>,
			  inverseBindMatrices:    array<mat4x4<f32>, ${this.joints.length}>,
			};
			
			@group(0) @binding(0) var<storage, read>       vertexSkinBuffer:  array<VertexSkinData>;
			@group(0) @binding(1) var<storage, read_write> skinMatrixBuffer:  array<AlignedMatrix>;
			@group(0) @binding(2) var<uniform>             uniforms:          Uniforms;
			
			@compute @workgroup_size(${this.WORK_SIZE},1,1)
			fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
			  let idx = global_id.x;
			  if (idx >= arrayLength(&vertexSkinBuffer)) {
			    return;
			  }

			  let skin = vertexSkinBuffer[idx];
			  let w    = skin.vertexWeight;
			  let j0   = u32(skin.vertexJoint.x);
			  let j1   = u32(skin.vertexJoint.y);
			  let j2   = u32(skin.vertexJoint.z);
			  let j3   = u32(skin.vertexJoint.w);
			
			  let m0 = uniforms.invertNodeGlobalTransform * uniforms.jointModelMatrices[j0] * uniforms.inverseBindMatrices[j0];
			  let m1 = uniforms.invertNodeGlobalTransform * uniforms.jointModelMatrices[j1] * uniforms.inverseBindMatrices[j1];
			  let m2 = uniforms.invertNodeGlobalTransform * uniforms.jointModelMatrices[j2] * uniforms.inverseBindMatrices[j2];
			  let m3 = uniforms.invertNodeGlobalTransform * uniforms.jointModelMatrices[j3] * uniforms.inverseBindMatrices[j3];
			
			  let resultMat = w.x * m0 + w.y * m1 + w.z * m2 + w.w * m3;
			  skinMatrixBuffer[idx] = AlignedMatrix( resultMat[0], resultMat[1], resultMat[2], resultMat[3] );
			}
    `;
		// keepLog(this.joints, this.usedJoints)
		this.jointData = new Float32Array((1 + this.joints.length)  * 16)
		this.computeShader = redGPUContext.resourceManager.createGPUShaderModule('calcSkinMatrix', {code: source})
		this.computePipeline = device.createComputePipeline({
			label: 'calcSkinMatrix',
			layout: 'auto',
			compute: {
				module: this.computeShader,
				entryPoint: 'main',
			},
		});
		this.uniformBuffer = device.createBuffer({
			size: (1 + this.joints.length * 2) * 16 * 4,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		})

		device.queue.writeBuffer(
			this.uniformBuffer,
			this.jointData.byteLength,
			new Float32Array(this.inverseBindMatrices.map(v => Array.from(v)).flat())
		)
		this.bindGroup = device.createBindGroup({
			layout: this.computePipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
				{binding: 1, resource: {buffer: vertexStorageBuffer}},
				{binding: 2, resource: {buffer: this.uniformBuffer}},
			],
		});
	}
	jointData:Float32Array
	uniformBuffer: GPUBuffer
	computeShader: GPUShaderModule;
	computePipeline: GPUComputePipeline;
	bindGroup: GPUBindGroup;
}

// ParsedSkinInfo_GLTF 클래스를 export 합니다.
export default ParsedSkinInfo_GLTF;
