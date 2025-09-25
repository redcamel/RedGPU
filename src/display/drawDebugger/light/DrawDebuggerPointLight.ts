import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import RenderViewStateData from "../../../renderer/RenderViewStateData";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import TextField3D from "../../textFileds/textField3D/TextField3D";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

class DrawDebuggerPointLight extends ADrawDebuggerLight {
	#target: PointLight;
	#label: TextField3D

	constructor(redGPUContext: RedGPUContext, target: PointLight) {
		super(redGPUContext, [0, 255, 255], 51); // 청록색, 51개 라인 (16*3 + 3)
		this.#target = target;
		this.#label = new TextField3D(redGPUContext)
		this.#label.useBillboard = true;
		this.#label.fontSize = 40
		this.#label.text = '💡'
		this.lightDebugMesh.addChild(this.#label)
	}

	render(debugViewRenderState: RenderViewStateData): void {
		if(!debugViewRenderState.view.systemUniform_Vertex_UniformBindGroup) return
		if (!this.#target.enableDebugger) return;
		this.#updateVertexDataFromPointLight(this.#target, this.lightDebugMesh.geometry.vertexBuffer);
		this.lightDebugMesh.setPosition(0, 0, 0);
		this.lightDebugMesh.setRotation(0, 0, 0);
		this.lightDebugMesh.setScale(1, 1, 1);
		this.lightDebugMesh.render(debugViewRenderState);
		this.#label.setPosition(...this.#target.position)
	}

	#updateVertexDataFromPointLight(light: PointLight, vertexBuffer: VertexBuffer) {
		const position = light.position || [0, 0, 0];
		const radius = light.radius || 1.0;
		const segments = 16;
		const lines: number[][][] = [];
		// XY 평면 원
		for (let i = 0; i < segments; i++) {
			const angle1 = (i / segments) * Math.PI * 2;
			const angle2 = ((i + 1) / segments) * Math.PI * 2;
			const x1 = position[0] + Math.cos(angle1) * radius;
			const y1 = position[1] + Math.sin(angle1) * radius;
			const z1 = position[2];
			const x2 = position[0] + Math.cos(angle2) * radius;
			const y2 = position[1] + Math.sin(angle2) * radius;
			const z2 = position[2];
			lines.push([[x1, y1, z1], [x2, y2, z2]]);
		}
		// XZ 평면 원
		for (let i = 0; i < segments; i++) {
			const angle1 = (i / segments) * Math.PI * 2;
			const angle2 = ((i + 1) / segments) * Math.PI * 2;
			const x1 = position[0] + Math.cos(angle1) * radius;
			const y1 = position[1];
			const z1 = position[2] + Math.sin(angle1) * radius;
			const x2 = position[0] + Math.cos(angle2) * radius;
			const y2 = position[1];
			const z2 = position[2] + Math.sin(angle2) * radius;
			lines.push([[x1, y1, z1], [x2, y2, z2]]);
		}
		// YZ 평면 원
		for (let i = 0; i < segments; i++) {
			const angle1 = (i / segments) * Math.PI * 2;
			const angle2 = ((i + 1) / segments) * Math.PI * 2;
			const x1 = position[0];
			const y1 = position[1] + Math.cos(angle1) * radius;
			const z1 = position[2] + Math.sin(angle1) * radius;
			const x2 = position[0];
			const y2 = position[1] + Math.cos(angle2) * radius;
			const z2 = position[2] + Math.sin(angle2) * radius;
			lines.push([[x1, y1, z1], [x2, y2, z2]]);
		}
		// 중심점 십자가
		const crossSize = radius * 0.2;
		lines.push([
			[position[0] - crossSize, position[1], position[2]],
			[position[0] + crossSize, position[1], position[2]]
		]);
		lines.push([
			[position[0], position[1] - crossSize, position[2]],
			[position[0], position[1] + crossSize, position[2]]
		]);
		lines.push([
			[position[0], position[1], position[2] - crossSize],
			[position[0], position[1], position[2] + crossSize]
		]);
		this.updateVertexBuffer(lines, vertexBuffer);
	}
}

Object.freeze(DrawDebuggerPointLight);
export default DrawDebuggerPointLight;
