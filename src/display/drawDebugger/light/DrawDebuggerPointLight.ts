import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";

/**
 * [KO] 점광원(`PointLight`)의 위치와 구형 반경(`radius`)을 3D 공간에 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the position and spherical radius (`radius`) of a `PointLight` in 3D space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] PointLight의 enableDebugger 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the enableDebugger property of PointLight.
 * pointLight.enableDebugger = true;
 * ```
 *
 * @see [PointLight example](/RedGPU/examples/3d/light/pointLight/)
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
class DrawDebuggerPointLight extends ADrawDebuggerLight<PointLight> {

    /**
     * [KO] `DrawDebuggerPointLight` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerPointLight` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param target -
     * [KO] 디버깅할 대상 점광원 객체
     * [EN] Target point light object to debug
     */
    constructor(redGPUContext: RedGPUContext, target: PointLight) {
        super(redGPUContext, target, '💡', [0, 255, 255], 51);
    }

    /**
     * [KO] 점광원 디버그 가이드와 아이콘 레이블을 렌더링합니다.
     * [EN] Renders the point light debug guide and icon label.
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

    #updateVertexDataFromTargetLight(light: PointLight, vertexBuffer: VertexBuffer) {
        const position = light.position || [0, 0, 0];
        const radius = light.radius || 1.0;
        const segments = 16;
        const lines: number[][][] = [];
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
