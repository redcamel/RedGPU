import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import DirectionalLight from "../../light/lights/DirectionalLight";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import InterleaveType from "../../resources/buffer/core/type/InterleaveType";
import InterleavedStruct from "../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import {keepLog} from "../../utils";
import {IVolumeAABB} from "../../utils/math/volume/calculateGeometryAABB";
import {IVolumeOBB} from "../../utils/math/volume/calculateMeshOBB";
import Mesh from "../mesh/Mesh";

type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'LIGHT';

class DrawDebugger {
	#redGPUContext: RedGPUContext;
	#target: Mesh | DirectionalLight;
	#vertexBuffer: VertexBuffer;
	#material: any;
	#debugMesh: Mesh;
	#debugMode: DebugMode = 'LIGHT';
	// BOTH 모드용 추가 메시
	#aabbMaterial: any;
	#aabbDebugMesh: Mesh;
	// 라이트 디버깅용 메시
	#lightMaterial: any;
	#lightDebugMesh: Mesh;

	constructor(redGPUContext: RedGPUContext, target: Mesh | DirectionalLight) {
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

		// 라이트 디버깅용 메시 (노란색)
		const lightGeometry = this.#createLightDebugGeometry(redGPUContext);
		this.#lightMaterial = new ColorMaterial(redGPUContext);
		this.#lightMaterial.color.setColorByRGB(255, 255, 0);
		this.#lightDebugMesh = new Mesh(redGPUContext, lightGeometry, this.#lightMaterial);
		this.#lightDebugMesh.primitiveState.cullMode = 'none';
		this.#lightDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
		this.#lightDebugMesh.depthStencilState.depthWriteEnabled = false;
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
		} else if (value === 'LIGHT') {
			this.#material.color.setColorByRGB(255, 255, 0); // 노란색
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
	#createLightDebugGeometry(redGPUContext: RedGPUContext): Geometry {
		// 방향성 라이트용 화살표 지오메트리 (8개 라인: 화살표 1개 + 머리 4개 + 십자가 3개)
		const vertices = new Float32Array(16 * 8); // 8개 라인 * 2개 점 * 8개 데이터 = 128개 요소
		const interleavedStruct = new InterleavedStruct(
			{
				vertexPosition: InterleaveType.float32x3,
				vertexNormal: InterleaveType.float32x3,
				texcoord: InterleaveType.float32x2,
			},
			`lightDebugStruct_${Math.random()}`
		);
		const vertexBuffer = new VertexBuffer(
			redGPUContext,
			vertices,
			interleavedStruct
		);
		return new Geometry(redGPUContext, vertexBuffer);
	}

	#updateVertexDataFromDirectionalLight(light: DirectionalLight, vertexBuffer: VertexBuffer) {
		console.log('🔥 DirectionalLight 디버깅 업데이트 시작', {
			direction: light.direction,
			enableDebugger: light.enableDebugger,
			bufferSize: vertexBuffer.data.length
		});

		// 방향성 라이트는 위치가 없으므로 고정된 시각적 위치에서 방향만 표시
		const visualPosition = [0, 5, 0]; // 시각적 표시를 위한 고정 위치 (더 높게)
		const direction = light.direction || [0, -1, 0];
		const length = 3.0; // 화살표 길이를 더 길게

		// 방향 벡터 정규화
		const dirLength = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
		const normalizedDir = [
			direction[0] / dirLength,
			direction[1] / dirLength,
			direction[2] / dirLength
		];

		// 화살표 끝점
		const arrowEnd = [
			visualPosition[0] + normalizedDir[0] * length,
			visualPosition[1] + normalizedDir[1] * length,
			visualPosition[2] + normalizedDir[2] * length
		];

		// 간단한 화살표 머리 계산 (안정적인 방법)
		const arrowHeadLength = 0.5;
		const arrowHeadWidth = 0.3;

		// 방향에 수직인 두 벡터 계산
		let up = [0, 1, 0];
		// direction이 y축과 거의 평행하면 x축을 기준으로 사용
		if (Math.abs(normalizedDir[1]) > 0.99) {
			up = [1, 0, 0];
		}

		// 외적으로 수직 벡터 계산
		const right = [
			normalizedDir[1] * up[2] - normalizedDir[2] * up[1],
			normalizedDir[2] * up[0] - normalizedDir[0] * up[2],
			normalizedDir[0] * up[1] - normalizedDir[1] * up[0]
		];

		// right 벡터 정규화
		const rightLength = Math.sqrt(right[0] * right[0] + right[1] * right[1] + right[2] * right[2]);
		const normalizedRight = [
			right[0] / rightLength,
			right[1] / rightLength,
			right[2] / rightLength
		];

		// up 벡터 재계산 (정확한 직교 벡터)
		const normalizedUp = [
			normalizedRight[1] * normalizedDir[2] - normalizedRight[2] * normalizedDir[1],
			normalizedRight[2] * normalizedDir[0] - normalizedRight[0] * normalizedDir[2],
			normalizedRight[0] * normalizedDir[1] - normalizedRight[1] * normalizedDir[0]
		];

		// 화살표 머리 4개 점 계산
		const arrowHead1 = [
			arrowEnd[0] + normalizedDir[0] * -arrowHeadLength + normalizedRight[0] * arrowHeadWidth,
			arrowEnd[1] + normalizedDir[1] * -arrowHeadLength + normalizedRight[1] * arrowHeadWidth,
			arrowEnd[2] + normalizedDir[2] * -arrowHeadLength + normalizedRight[2] * arrowHeadWidth
		];

		const arrowHead2 = [
			arrowEnd[0] + normalizedDir[0] * -arrowHeadLength - normalizedRight[0] * arrowHeadWidth,
			arrowEnd[1] + normalizedDir[1] * -arrowHeadLength - normalizedRight[1] * arrowHeadWidth,
			arrowEnd[2] + normalizedDir[2] * -arrowHeadLength - normalizedRight[2] * arrowHeadWidth
		];

		const arrowHead3 = [
			arrowEnd[0] + normalizedDir[0] * -arrowHeadLength + normalizedUp[0] * arrowHeadWidth,
			arrowEnd[1] + normalizedDir[1] * -arrowHeadLength + normalizedUp[1] * arrowHeadWidth,
			arrowEnd[2] + normalizedDir[2] * -arrowHeadLength + normalizedUp[2] * arrowHeadWidth
		];

		const arrowHead4 = [
			arrowEnd[0] + normalizedDir[0] * -arrowHeadLength - normalizedUp[0] * arrowHeadWidth,
			arrowEnd[1] + normalizedDir[1] * -arrowHeadLength - normalizedUp[1] * arrowHeadWidth,
			arrowEnd[2] + normalizedDir[2] * -arrowHeadLength - normalizedUp[2] * arrowHeadWidth
		];

		// 라인 목록: [시작점, 끝점] 형태 (총 8개 라인)
		const lines = [
			[visualPosition, arrowEnd],      // 화살표 몸체
			[arrowEnd, arrowHead1],          // 화살표 머리 1
			[arrowEnd, arrowHead2],          // 화살표 머리 2
			[arrowEnd, arrowHead3],          // 화살표 머리 3
			[arrowEnd, arrowHead4],          // 화살표 머리 4
			// 방향성 라이트 표시를 위한 십자가 (시작점에)
			[[visualPosition[0] - 0.3, visualPosition[1], visualPosition[2]], [visualPosition[0] + 0.3, visualPosition[1], visualPosition[2]]],
			[[visualPosition[0], visualPosition[1] - 0.3, visualPosition[2]], [visualPosition[0], visualPosition[1] + 0.3, visualPosition[2]]],
			[[visualPosition[0], visualPosition[1], visualPosition[2] - 0.3], [visualPosition[0], visualPosition[1], visualPosition[2] + 0.3]]
		];

		console.log('📏 라인 정보:', {
			라인수: lines.length,
			필요한_버퍼크기: lines.length * 2 * 8,
			실제_버퍼크기: vertexBuffer.data.length,
			화살표시작점: visualPosition,
			화살표끝점: arrowEnd,
			방향: normalizedDir
		});

		const vertexData = vertexBuffer.data;
		let offset = 0;

		lines.forEach(([start, end], index) => {
			console.log(`라인 ${index}:`, start, '→', end);

			// 시작점
			vertexData[offset++] = start[0];
			vertexData[offset++] = start[1];
			vertexData[offset++] = start[2];
			vertexData[offset++] = 0; vertexData[offset++] = 0; vertexData[offset++] = 1;
			vertexData[offset++] = 0; vertexData[offset++] = 0;
			// 끝점
			vertexData[offset++] = end[0];
			vertexData[offset++] = end[1];
			vertexData[offset++] = end[2];
			vertexData[offset++] = 0; vertexData[offset++] = 0; vertexData[offset++] = 1;
			vertexData[offset++] = 0; vertexData[offset++] = 0;
		});

		console.log('✅ 버텍스 데이터 업데이트 완료, offset:', offset);
		vertexBuffer.updateAllData(vertexData);
	}

	render(debugViewRenderState: RenderViewStateData) {
		if (!this.#target.enableDebugger) return;

		console.log('🎯 DrawDebugger render 호출됨', {
			target: this.#target.constructor.name,
			debugMode: this.#debugMode,
			enableDebugger: this.#target.enableDebugger
		});

		// 타겟이 DirectionalLight인지 Mesh인지 확인
		const isDirectionalLight = this.#target instanceof DirectionalLight;

		if (isDirectionalLight) {
			console.log('💡 DirectionalLight 렌더링 시작');
			// DirectionalLight 디버깅 렌더링
			if (this.#debugMode === 'LIGHT' || this.#debugMode === 'BOTH') {
				this.#updateVertexDataFromDirectionalLight(this.#target as DirectionalLight, this.#lightDebugMesh.geometry.vertexBuffer);
				this.#lightDebugMesh.setPosition(0, 0, 0);
				this.#lightDebugMesh.setRotation(0, 0, 0);
				this.#lightDebugMesh.setScale(1, 1, 1);
				console.log('🚀 DirectionalLight 메시 렌더링 중...');
				this.#lightDebugMesh.render(debugViewRenderState);
			}
		} else {
			// Mesh 디버깅 렌더링
			const targetOBB = (this.#target as Mesh).volumeOBB;
			const targetAABB = (this.#target as Mesh).volumeAABB;
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

}

Object.freeze(DrawDebugger)
export default DrawDebugger
