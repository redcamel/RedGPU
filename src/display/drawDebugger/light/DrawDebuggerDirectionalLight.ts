import DirectionalLight from "../../../light/lights/DirectionalLight";
import RenderViewStateData from "../../../renderer/RenderViewStateData";
import RedGPUContext from "../../../context/RedGPUContext";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import TextField3D from "../../textFileds/textField3D/TextField3D";
import ADrawDebuggerLight from "./ADrawDebuggerLight";


class DrawDebuggerDirectionalLight extends ADrawDebuggerLight {
	#target: DirectionalLight;
	#label:TextField3D
	#visualPosition:[number,number,number] = [0, 10, 0];
	constructor(redGPUContext: RedGPUContext, target: DirectionalLight) {
		super(redGPUContext, [255, 255, 0], 8); // 노란색, 8개 라인
		this.#target = target;
		this.#label = new TextField3D(redGPUContext)
		this.#label.useBillboard = true;
		this.#label.fontSize = 40
		this.#label.text = '☀️'
		this.lightDebugMesh.addChild(	this.#label)
	}

	#updateVertexDataFromDirectionalLight(light: DirectionalLight, vertexBuffer: VertexBuffer) {
		const visualPosition = this.#visualPosition
		const direction = light.direction || [0, -1, 0];
		const length = 3.0;

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

		// 화살표 머리 계산
		const arrowHeadLength = 0.5;
		const arrowHeadWidth = 0.3;

		// 방향에 수직인 두 벡터 계산
		let up = [0, 1, 0];
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

		// up 벡터 재계산
		const normalizedUp = [
			normalizedRight[1] * normalizedDir[2] - normalizedRight[2] * normalizedDir[1],
			normalizedRight[2] * normalizedDir[0] - normalizedRight[0] * normalizedDir[2],
			normalizedRight[0] * normalizedDir[1] - normalizedRight[1] * normalizedDir[0]
		];

		// 화살표 머리 4개 점
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

		const lines = [
			[visualPosition, arrowEnd],
			[arrowEnd, arrowHead1],
			[arrowEnd, arrowHead2],
			[arrowEnd, arrowHead3],
			[arrowEnd, arrowHead4],
			[[visualPosition[0] - 0.3, visualPosition[1], visualPosition[2]], [visualPosition[0] + 0.3, visualPosition[1], visualPosition[2]]],
			[[visualPosition[0], visualPosition[1] - 0.3, visualPosition[2]], [visualPosition[0], visualPosition[1] + 0.3, visualPosition[2]]],
			[[visualPosition[0], visualPosition[1], visualPosition[2] - 0.3], [visualPosition[0], visualPosition[1], visualPosition[2] + 0.3]]
		];

		this.updateVertexBuffer(lines, vertexBuffer);
	}

	render(debugViewRenderState: RenderViewStateData): void {
		if (!this.#target.enableDebugger) return;

		this.#updateVertexDataFromDirectionalLight(this.#target, this.lightDebugMesh.geometry.vertexBuffer);
		this.lightDebugMesh.setPosition(0, 0, 0);
		this.lightDebugMesh.setRotation(0, 0, 0);
		this.lightDebugMesh.setScale(1, 1, 1);
		this.lightDebugMesh.render(debugViewRenderState);
		// 빛이 오는 방향 (화살표 반대편)에 레이블 배치
		const direction = this.#target.direction ;
		const visualPosition = this.#visualPosition;
		const labelDistance = 0;

		// 방향 벡터 정규화
		const dirLength = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
		const normalizedDir = [
			direction[0] / dirLength,
			direction[1] / dirLength,
			direction[2] / dirLength
		];

		// 빛이 오는 방향 (화살표 반대편)에 레이블 배치
		this.#label.setPosition(
			visualPosition[0] - normalizedDir[0] * labelDistance,
			visualPosition[1] - normalizedDir[1] * labelDistance,
			visualPosition[2] - normalizedDir[2] * labelDistance
		);

	}
}

Object.freeze(DrawDebuggerDirectionalLight);
export default DrawDebuggerDirectionalLight;
