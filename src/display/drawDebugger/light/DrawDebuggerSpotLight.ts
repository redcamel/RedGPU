import RedGPUContext from "../../../context/RedGPUContext";
import SpotLight from "../../../light/lights/SpotLight";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

/**
 * [KO] 스포트라이트(`SpotLight`)의 원추형 조사 범위(`innerCutoff`, `outerCutoff`), 방향, 도달 거리(`radius`)를 3D 공간에 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the conical light range (`innerCutoff`, `outerCutoff`), direction, and reach distance (`radius`) of a `SpotLight` in 3D space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] SpotLight의 enableDebugger 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the enableDebugger property of SpotLight.
 * spotLight.enableDebugger = true;
 * ```
 *
 * @see [SpotLight example](/RedGPU/examples/3d/light/spotLight/)
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
class DrawDebuggerSpotLight extends ADrawDebuggerLight<SpotLight> {

    /**
     * [KO] `DrawDebuggerSpotLight` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerSpotLight` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param target -
     * [KO] 디버깅할 대상 스포트라이트 객체
     * [EN] Target spot light object to debug
     */
    constructor(redGPUContext: RedGPUContext, target: SpotLight) {
        super(redGPUContext, target, '🔦', [255, 255, 0], 80);
    }

    /**
     * [KO] 스포트라이트 디버그 가이드와 아이콘 레이블을 렌더링합니다.
     * [EN] Renders the spot light debug guide and icon label.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void {
        const {lightDebugMesh, label, target} = this
        if (!renderViewStateData.view.systemUniform_Vertex_UniformBindGroup) return
        if (!target.enableDebugger) return;
        this.#updateVertexDataFromTargetLight(target, lightDebugMesh.geometry.vertexBuffer);

        lightDebugMesh.render(renderViewStateData);
        label.setPosition(...target.position)
    }

    #updateVertexDataFromTargetLight(light: SpotLight, vertexBuffer: VertexBuffer) {
        const position = light.position || [0, 0, 0];
        const direction = light.direction || [0, -1, 0];
        const radius = light.radius || 5.0;
        const outerCutoff = light.outerCutoff || 22.5;
        const innerCutoff = light.innerCutoff || 15.0;
        const lines: number[][][] = [];
        const dirLength = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
        const normalizedDir = [
            direction[0] / dirLength,
            direction[1] / dirLength,
            direction[2] / dirLength
        ];
        const coneEnd = [
            position[0] + normalizedDir[0] * radius,
            position[1] + normalizedDir[1] * radius,
            position[2] + normalizedDir[2] * radius
        ];
        const outerConeRadius = radius * Math.tan(outerCutoff * Math.PI / 180);
        const innerConeRadius = radius * Math.tan(innerCutoff * Math.PI / 180);
        let up = [0, 1, 0];
        if (Math.abs(normalizedDir[1]) > 0.99) {
            up = [1, 0, 0];
        }
        const right = [
            normalizedDir[1] * up[2] - normalizedDir[2] * up[1],
            normalizedDir[2] * up[0] - normalizedDir[0] * up[2],
            normalizedDir[0] * up[1] - normalizedDir[1] * up[0]
        ];
        const rightLength = Math.sqrt(right[0] * right[0] + right[1] * right[1] + right[2] * right[2]);
        const normalizedRight = [
            right[0] / rightLength,
            right[1] / rightLength,
            right[2] / rightLength
        ];
        const normalizedUp = [
            normalizedRight[1] * normalizedDir[2] - normalizedRight[2] * normalizedDir[1],
            normalizedRight[2] * normalizedDir[0] - normalizedRight[0] * normalizedDir[2],
            normalizedRight[0] * normalizedDir[1] - normalizedRight[1] * normalizedDir[0]
        ];
        const segments = 16;
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2;
            const angle2 = ((i + 1) / segments) * Math.PI * 2;
            const cos1 = Math.cos(angle1);
            const sin1 = Math.sin(angle1);
            const cos2 = Math.cos(angle2);
            const sin2 = Math.sin(angle2);
            const point1 = [
                coneEnd[0] + (normalizedRight[0] * cos1 + normalizedUp[0] * sin1) * outerConeRadius,
                coneEnd[1] + (normalizedRight[1] * cos1 + normalizedUp[1] * sin1) * outerConeRadius,
                coneEnd[2] + (normalizedRight[2] * cos1 + normalizedUp[2] * sin1) * outerConeRadius
            ];
            const point2 = [
                coneEnd[0] + (normalizedRight[0] * cos2 + normalizedUp[0] * sin2) * outerConeRadius,
                coneEnd[1] + (normalizedRight[1] * cos2 + normalizedUp[1] * sin2) * outerConeRadius,
                coneEnd[2] + (normalizedRight[2] * cos2 + normalizedUp[2] * sin2) * outerConeRadius
            ];
            lines.push([point1, point2]);
            lines.push([position, point1]);
        }
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2;
            const angle2 = ((i + 1) / segments) * Math.PI * 2;
            const cos1 = Math.cos(angle1);
            const sin1 = Math.sin(angle1);
            const cos2 = Math.cos(angle2);
            const sin2 = Math.sin(angle2);
            const point1 = [
                coneEnd[0] + (normalizedRight[0] * cos1 + normalizedUp[0] * sin1) * innerConeRadius,
                coneEnd[1] + (normalizedRight[1] * cos1 + normalizedUp[1] * sin1) * innerConeRadius,
                coneEnd[2] + (normalizedRight[2] * cos1 + normalizedUp[2] * sin1) * innerConeRadius
            ];
            const point2 = [
                coneEnd[0] + (normalizedRight[0] * cos2 + normalizedUp[0] * sin2) * innerConeRadius,
                coneEnd[1] + (normalizedRight[1] * cos2 + normalizedUp[1] * sin2) * innerConeRadius,
                coneEnd[2] + (normalizedRight[2] * cos2 + normalizedUp[2] * sin2) * innerConeRadius
            ];
            lines.push([point1, point2]);
        }
        lines.push([position, coneEnd]);
        const crossSize = 0.3;
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
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const edgePoint = [
                coneEnd[0] + (normalizedRight[0] * cos + normalizedUp[0] * sin) * outerConeRadius,
                coneEnd[1] + (normalizedRight[1] * cos + normalizedUp[1] * sin) * outerConeRadius,
                coneEnd[2] + (normalizedRight[2] * cos + normalizedUp[2] * sin) * outerConeRadius
            ];
            lines.push([position, edgePoint]);
        }
        this.updateVertexBuffer(lines, vertexBuffer);
    }
}

Object.freeze(DrawDebuggerSpotLight);
export default DrawDebuggerSpotLight;
