import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import convertRgbToHex from "../../../color/convertRgbToHex";
import ABaseLight from "../../../light/core/ABaseLight";
import TextField3D from "../../textFields/textField3D/TextField3D";

/**
 * 광원(Light) 디버거들의 조명 매개변수 및 시각 가이드를 그리기 위한 공통 추상 부모 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 3D 뷰포트 내에 조명의 위치를 상징하는 3D 텍스트 레이블({@link TextField3D}) 아이콘을 자동으로 오버레이 투영해 줍니다.
 * - 서브클래스에서 조명 데이터로부터 라인을 빌드하면, 이를 부드럽게 버텍스 버퍼에 매핑하는 공유 로직을 제공합니다.
 *
 * **[EN]**
 * - Draws light visualization layouts (lines, boundaries, emoji icons).
 * - Automatically initializes a 3D icon label using {@link TextField3D}.
 * - Implements a common buffer pipeline to stream coordinate details directly to GPU drawing passes.
 *
 * @category Debugger
 */
abstract class ADrawDebuggerLight<T extends ABaseLight> {
    #lightMaterial: ColorMaterial;
    #lightDebugMesh: Mesh;
    #target: T;
    #label: TextField3D;

    protected constructor(redGPUContext: RedGPUContext, target: T, labelIcon: string, color: [number, number, number], maxLines: number = 32) {
        this.#target = target;
        const lightGeometry = this.#createLightDebugGeometry(redGPUContext, maxLines);
        this.#lightMaterial = new ColorMaterial(redGPUContext, convertRgbToHex(color[0], color[1], color[2]));
        this.#lightDebugMesh = new Mesh(redGPUContext, lightGeometry, this.#lightMaterial);
        const {primitiveState} = this.#lightDebugMesh
        primitiveState.cullMode = 'none';
        primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;

        this.#label = new TextField3D(redGPUContext)
        this.#label.usePixelSize = true
        this.#label.fontSize = 40
        this.#label.text = labelIcon
        this.#lightDebugMesh.addChild(this.#label)
    }

    get target(): T {
        return this.#target;
    }

    get label(): TextField3D {
        return this.#label;
    }

    get lightDebugMesh(): Mesh {
        return this.#lightDebugMesh;
    }

    updateVertexBuffer(lines: number[][][], vertexBuffer: VertexBuffer) {
        const vertexData = vertexBuffer.data;
        let offset = 0;
        const maxLines = Math.min(lines.length, Math.floor(vertexData.length / 24)); // 16 -> 24 (각 점당 12개 float)
        for (let i = 0; i < maxLines; i++) {
            const [start, end] = lines[i];
            // 시작점
            vertexData[offset++] = start[0];
            vertexData[offset++] = start[1];
            vertexData[offset++] = start[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            // 탄젠트 (더미 데이터)
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            // 끝점
            vertexData[offset++] = end[0];
            vertexData[offset++] = end[1];
            vertexData[offset++] = end[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            // 탄젠트 (더미 데이터)
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
        }
        vertexBuffer.updateAllData(vertexData);
    }

    abstract render(renderViewStateData: RenderViewStateData): void;

    #createLightDebugGeometry(redGPUContext: RedGPUContext, maxLines: number): Geometry {
        const vertices = new Float32Array(maxLines * 2 * 12); // maxLines * 2개 점 * 12개 데이터 (pos:3, normal:3, uv:2, tangent:4)
        const interleavedStruct = new VertexInterleavedStruct(
            {
                vertexPosition: VertexInterleaveType.float32x3,
                vertexNormal: VertexInterleaveType.float32x3,
                texcoord: VertexInterleaveType.float32x2,
                vertexTangent: VertexInterleaveType.float32x4,
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
}

Object.freeze(ADrawDebuggerLight);
export default ADrawDebuggerLight;
