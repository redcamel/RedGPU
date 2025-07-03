import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import InterleaveType from "../../resources/buffer/core/type/InterleaveType";
import InterleavedStruct from "../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import {IVolumeAABB} from "../../utils/math/volume/calculateGeometryAABB";
import {IVolumeOBB} from "../../utils/math/volume/calculateMeshOBB";
import Mesh from "../mesh/Mesh";

type DebugMode = 'OBB' | 'AABB' | 'BOTH';

class DrawDebugger {
	#redGPUContext: RedGPUContext;
	#target: Mesh;
	#vertexBuffer: VertexBuffer;
	#material: any;
	#debugMesh: Mesh;
	#debugMode: DebugMode = 'BOTH';
	// BOTH 모드용 추가 메시
	#aabbMaterial: any;
	#aabbDebugMesh: Mesh;

	constructor(redGPUContext: RedGPUContext, target: Mesh) {
		this.#redGPUContext = redGPUContext;
		this.#target = target;

		// OBB용 메시 (빨간색)
		const geometry = this.#createWireframeBoxGeometry(redGPUContext);
		this.#vertexBuffer = geometry.vertexBuffer;
		this.#material = new ColorMaterial(redGPUContext);
		this.#material.color.setColorByRGB(255, 0, 0);
		this.#debugMesh = new Mesh(redGPUContext, geometry, this.#material);
		this.#debugMesh.primitiveState.cullMode = 'none';
		this.#debugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
		this.#debugMesh.depthStencilState.depthWriteEnabled = false;

		// AABB용 메시 (초록색) - BOTH 모드용
		const aabbGeometry = this.#createWireframeBoxGeometry(redGPUContext);
		this.#aabbMaterial = new ColorMaterial(redGPUContext);
		this.#aabbMaterial.color.setColorByRGB(0, 255, 0);
		this.#aabbDebugMesh = new Mesh(redGPUContext, aabbGeometry, this.#aabbMaterial);
		this.#aabbDebugMesh.primitiveState.cullMode = 'none';
		this.#aabbDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
		this.#aabbDebugMesh.depthStencilState.depthWriteEnabled = false;
	}

	get debugMode(): DebugMode {
		return this.#debugMode;
	}

	set debugMode(value: DebugMode) {
		this.#debugMode = value;
		// 모드에 따라 색상 변경
		if (value === 'OBB') {
			this.#material.color.setColorByRGB(255, 0, 0); // 빨간색
		} else if (value === 'AABB') {
			this.#material.color.setColorByRGB(0, 255, 0); // 초록색
		}
		// BOTH 모드에서는 각각 다른 색상 유지
	}

	#createWireframeBoxGeometry(redGPUContext: RedGPUContext): Geometry {
		const vertices = new Float32Array(24 * 8);
		const interleavedStruct = new InterleavedStruct(
			{
				vertexPosition: InterleaveType.float32x3,
				vertexNormal: InterleaveType.float32x3,
				texcoord: InterleaveType.float32x2,
			},
			`wireframeBoxStruct_${Math.random()}`
		);
		const vertexBuffer = new VertexBuffer(
			redGPUContext,
			vertices,
			interleavedStruct
		);
		return new Geometry(redGPUContext, vertexBuffer);
	}

	#updateVertexDataFromOBB(targetOBB: IVolumeOBB, vertexBuffer: VertexBuffer) {
		const { center, halfExtents, orientation } = targetOBB;
		const localVertices = [
			[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
			[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
		];

		const transformedVertices = localVertices.map(vertex => {
			const scaledVertex = [
				vertex[0] * halfExtents[0],
				vertex[1] * halfExtents[1],
				vertex[2] * halfExtents[2]
			];

			const rotatedVertex = [
				orientation[0] * scaledVertex[0] + orientation[4] * scaledVertex[1] + orientation[8] * scaledVertex[2],
				orientation[1] * scaledVertex[0] + orientation[5] * scaledVertex[1] + orientation[9] * scaledVertex[2],
				orientation[2] * scaledVertex[0] + orientation[6] * scaledVertex[1] + orientation[10] * scaledVertex[2]
			];

			return [
				rotatedVertex[0] + center[0],
				rotatedVertex[1] + center[1],
				rotatedVertex[2] + center[2]
			];
		});
		this.#updateVertexBuffer(transformedVertices, vertexBuffer);
	}

	/**
	 * ✅ AABB 업데이트: 이제 targetAABB 값을 직접 사용 (추가 변환 없음)
	 */
	#updateVertexDataFromAABB(targetAABB: IVolumeAABB, vertexBuffer: VertexBuffer) {
		const { minX, maxX, minY, maxY, minZ, maxZ } = targetAABB;

		// ✅ AABB 정점들 (이미 월드 좌표계)
		const transformedVertices = [
			[minX, minY, minZ], [maxX, minY, minZ], [maxX, maxY, minZ], [minX, maxY, minZ], // 뒷면
			[minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ]  // 앞면
		];

		this.#updateVertexBuffer(transformedVertices, vertexBuffer);
	}

	#updateVertexBuffer(transformedVertices: number[][], vertexBuffer: VertexBuffer) {
		const edges = [
			[0, 1], [1, 2], [2, 3], [3, 0], // 뒷면
			[4, 5], [5, 6], [6, 7], [7, 4], // 앞면
			[0, 4], [1, 5], [2, 6], [3, 7]  // 연결선
		];

		const vertexData = vertexBuffer.data;
		let offset = 0;
		edges.forEach(([start, end]) => {
			// 시작점
			vertexData[offset++] = transformedVertices[start][0];
			vertexData[offset++] = transformedVertices[start][1];
			vertexData[offset++] = transformedVertices[start][2];
			vertexData[offset++] = 0; vertexData[offset++] = 0; vertexData[offset++] = 1;
			vertexData[offset++] = 0; vertexData[offset++] = 0;
			// 끝점
			vertexData[offset++] = transformedVertices[end][0];
			vertexData[offset++] = transformedVertices[end][1];
			vertexData[offset++] = transformedVertices[end][2];
			vertexData[offset++] = 0; vertexData[offset++] = 0; vertexData[offset++] = 1;
			vertexData[offset++] = 0; vertexData[offset++] = 0;
		});

		vertexBuffer.updateAllData(vertexData);
	}

	render(debugViewRenderState: RenderViewStateData) {
		if (!this.#target.enableDebugger) return;

		const targetOBB = this.#target.volumeOBB;
		const targetAABB = this.#target.volumeAABB;
		if (!targetOBB || !targetAABB) return;

		if (this.#debugMode === 'OBB') {
			this.#updateVertexDataFromOBB(targetOBB, this.#vertexBuffer);
			this.#debugMesh.setPosition(0, 0, 0);
			this.#debugMesh.setRotation(0, 0, 0);
			this.#debugMesh.setScale(1, 1, 1);
			this.#debugMesh.render(debugViewRenderState);
		}
		else if (this.#debugMode === 'AABB') {
			this.#updateVertexDataFromAABB(targetAABB, this.#vertexBuffer);
			this.#debugMesh.setPosition(0, 0, 0);
			this.#debugMesh.setRotation(0, 0, 0);
			this.#debugMesh.setScale(1, 1, 1);
			this.#debugMesh.render(debugViewRenderState);
		}
		else if (this.#debugMode === 'BOTH') {
			// OBB (빨간색)
			this.#updateVertexDataFromOBB(targetOBB, this.#vertexBuffer);
			this.#debugMesh.setPosition(0, 0, 0);
			this.#debugMesh.setRotation(0, 0, 0);
			this.#debugMesh.setScale(1, 1, 1);
			this.#debugMesh.render(debugViewRenderState);

			// AABB (초록색)
			this.#updateVertexDataFromAABB(targetAABB, this.#aabbDebugMesh.geometry.vertexBuffer);
			this.#aabbDebugMesh.setPosition(0, 0, 0);
			this.#aabbDebugMesh.setRotation(0, 0, 0);
			this.#aabbDebugMesh.setScale(1, 1, 1);
			this.#aabbDebugMesh.render(debugViewRenderState);
		}
	}
}

Object.freeze(DrawDebugger)
export default DrawDebugger
