import RedGPUContext from "../../../context/RedGPUContext";
import SpotLight from "../../../light/lights/SpotLight";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

/**
 * 스포트라이트({@link SpotLight})의 원추형 조사 범위, 방향, 도달거리를 입체 기하 형태로 시각화하는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 🔦 모양의 레이블 아이콘과 함께, 조명의 조사각 설정(`innerCutoff` 및 `outerCutoff`)에 정렬된 이중 원뿔 선 형태를 노란색 와이어프레임으로 제공합니다.
 * - 도달 거리 경계 원호와 중심선, 시작점 조준 십자선 등을 조합하여 광원의 유효 방향을 입체적으로 인지하기 좋습니다.
 *
 * **[EN]**
 * - Renders nested cones corresponding to the inner (`innerCutoff`) and outer (`outerCutoff`) bounds of a target {@link SpotLight}.
 * - Employs a flashlight emoji ('🔦') label alongside yellow guidelines mapping directions, lengths, and point anchors.
 *
 * @category Debugger
 */
class DrawDebuggerSpotLight extends ADrawDebuggerLight<SpotLight> {

    constructor(redGPUContext: RedGPUContext, target: SpotLight) {
        super(redGPUContext, target, '🔦', [255, 255, 0], 80); // 노란색, 80개 라인 (원뿔 + 방향선 + 십자가)
    }

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
        const outerCutoff = light.outerCutoff || 22.5; // 외부 각도 (degrees)
        const innerCutoff = light.innerCutoff || 15.0; // 내부 각도 (degrees)
        const lines: number[][][] = [];
        // 방향 벡터 정규화
        const dirLength = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
        const normalizedDir = [
            direction[0] / dirLength,
            direction[1] / dirLength,
            direction[2] / dirLength
        ];
        // 원뿔의 끝점 (빛이 닿는 최대 거리)
        const coneEnd = [
            position[0] + normalizedDir[0] * radius,
            position[1] + normalizedDir[1] * radius,
            position[2] + normalizedDir[2] * radius
        ];
        // 외부 원뿔 반지름 계산
        const outerConeRadius = radius * Math.tan(outerCutoff * Math.PI / 180);
        const innerConeRadius = radius * Math.tan(innerCutoff * Math.PI / 180);
        // 방향에 수직인 두 벡터 계산 (원뿔 원을 그리기 위함)
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
        // up 벡터 재계산 (정확한 직교 벡터)
        const normalizedUp = [
            normalizedRight[1] * normalizedDir[2] - normalizedRight[2] * normalizedDir[1],
            normalizedRight[2] * normalizedDir[0] - normalizedRight[0] * normalizedDir[2],
            normalizedRight[0] * normalizedDir[1] - normalizedRight[1] * normalizedDir[0]
        ];
        const segments = 16;
        // 외부 원뿔 원 그리기
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
            // 외부 원 둘레
            lines.push([point1, point2]);
            // 원뿔 모서리 (스포트라이트 중심에서 외부 원까지)
            lines.push([position, point1]);
        }
        // 내부 원뿔 원 그리기 (더 작은 원)
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
            // 내부 원 둘레
            lines.push([point1, point2]);
        }
        // 중심 방향선 (스포트라이트 중심에서 원뿔 끝까지)
        lines.push([position, coneEnd]);
        // 스포트라이트 위치 표시용 십자가
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
        // 원뿔의 4개 주요 방향선 (더 명확한 형태를 위해)
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
