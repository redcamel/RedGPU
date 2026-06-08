import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

/**
 * 점광원({@link PointLight})의 물리적 위치와 영향 범위를 입체적으로 나타내어 주는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 전구 모양('💡') 아이콘 텍스트와 청록색의 3축 교차 원형 와이어프레임(XY, XZ, YZ 평면 원형 루프) 및 십자선을 그려 구형 반경을 시뮬레이션합니다.
 * - 반경 크기는 실시간으로 타겟 조명의 `radius` 설정값을 추적하여 투영 범위를 업데이트합니다.
 *
 * **[EN]**
 * - Visualizes light bounds and origin point of a target {@link PointLight}.
 * - Draws cyan wireframe boundary circles in 3 orthogonal planes (XY, XZ, YZ) alongside a bulb emoji ('💡') icon label.
 * - Tracks change events of the target light's `radius` property to update geometric bounds dynamically.
 *
 * @category Debugger
 */
class DrawDebuggerPointLight extends ADrawDebuggerLight<PointLight> {

    constructor(redGPUContext: RedGPUContext, target: PointLight) {
        super(redGPUContext, target, '💡', [0, 255, 255], 51); // 청록색, 51개 라인 (16*3 + 3)
    }

    render(renderViewStateData: RenderViewStateData): void {
        const {lightDebugMesh, label, target} = this
        if (!renderViewStateData.view.systemUniform_Vertex_UniformBindGroup) return
        if (!target.enableDebugger) return;
        this.#updateVertexDataFromTargetLight(target, lightDebugMesh.geometry.vertexBuffer);

        lightDebugMesh.render(renderViewStateData);
        label.setPosition(...target.position)
    }

    #updateVertexDataFromTargetLight(light: PointLight, vertexBuffer: VertexBuffer) {
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
