import RedGPUContext from "../../../context/RedGPUContext";
import DirectionalLight from "../../../light/lights/DirectionalLight";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

/**
 * 직사광({@link DirectionalLight})의 위치 및 조사 방향 벡터를 공간상에 투영하는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - ☀️ 모양의 레이블 아이콘과 노란색의 화살표 라인을 이용하여 직사광이 비추는 투사 각도를 명시해 줍니다.
 * - 대상 조명 객체의 `enableDebugger` 플래그 상태에 따라 자동으로 렌더링 노출을 온/오프 처리합니다.
 *
 * **[EN]**
 * - Visualizes direction vectors and reference coordinates of a target {@link DirectionalLight}.
 * - Utilizes a sun emoji icon ('☀️') and a yellow line arrow pointing towards the light projection vector.
 * - Listens to the `enableDebugger` flag of the source light object to dynamically switch draw execution.
 *
 * @category Debugger
 */
class DrawDebuggerDirectionalLight extends ADrawDebuggerLight<DirectionalLight> {
    #visualPosition: [number, number, number] = [0, 10, 0];

    constructor(redGPUContext: RedGPUContext, target: DirectionalLight) {
        super(redGPUContext, target, '☀️', [255, 255, 0], 8); // 노란색, 8개 라인
    }

    render(renderViewStateData: RenderViewStateData): void {
        const {lightDebugMesh, label, target} = this
        if (!renderViewStateData.view.systemUniform_Vertex_UniformBindGroup) return
        if (!target.enableDebugger) return;
        this.#updateVertexDataFromTargetLight(target, lightDebugMesh.geometry.vertexBuffer);
        lightDebugMesh.render(renderViewStateData);
        // 빛이 오는 방향 (화살표 반대편)에 레이블 배치
        const {direction} = target;
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
        label.setPosition(
            visualPosition[0] - normalizedDir[0] * labelDistance,
            visualPosition[1] - normalizedDir[1] * labelDistance,
            visualPosition[2] - normalizedDir[2] * labelDistance
        );
    }

    #updateVertexDataFromTargetLight(light: DirectionalLight, vertexBuffer: VertexBuffer) {
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
}

Object.freeze(DrawDebuggerDirectionalLight);
export default DrawDebuggerDirectionalLight;
