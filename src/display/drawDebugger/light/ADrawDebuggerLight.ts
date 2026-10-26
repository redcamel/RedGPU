import RedGPUObject from "../../../base/RedGPUObject";
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
 * [KO] 광원(Light) 디버거들의 조명 시각 가이드와 레이블 아이콘을 렌더링하기 위한 추상 클래스입니다.
 * [EN] Abstract class for rendering light visual guides and label icons for light debuggers.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @typeParam T -
 * [KO] 디버깅 대상 조명 클래스 타입 (`ABaseLight` 상속)
 * [EN] Target light class type for debugging (extends `ABaseLight`)
 * @category Debugger
 */
abstract class ADrawDebuggerLight<T extends ABaseLight> extends RedGPUObject {
    #lightMaterial: ColorMaterial;
    #lightDebugMesh: Mesh;
    #target: T;
    #label: TextField3D;

    /**
     * [KO] `ADrawDebuggerLight` 인스턴스를 생성합니다.
     * [EN] Creates an `ADrawDebuggerLight` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param target -
     * [KO] 시각화할 대상 조명 객체
     * [EN] Target light object to visualize
     * @param labelIcon -
     * [KO] 조명 위치에 표시할 3D 텍스트 아이콘 문자열
     * [EN] 3D text icon string to display at the light position
     * @param color -
     * [KO] 디버그 라인의 RGB 색상 배열 (`[r, g, b]`, 0~255)
     * [EN] RGB color array for debug lines (`[r, g, b]`, 0–255)
     * @param maxLines -
     * [KO] 버텍스 버퍼에 할당할 최대 라인 수 (기본값: 32)
     * [EN] Maximum number of lines to allocate in the vertex buffer (default: 32)
     */
    constructor(redGPUContext: RedGPUContext, target: T, labelIcon: string, color: [number, number, number], maxLines: number = 32) {
        super(redGPUContext);
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

    /**
     * [KO] 디버깅 대상 조명 객체를 반환합니다.
     * [EN] Returns the target light object being debugged.
     *
     * @returns
     * [KO] 대상 조명 객체
     * [EN] Target light object
     */
    get target(): T {
        return this.#target;
    }

    /**
     * [KO] 조명 위치를 표시하는 3D 텍스트 레이블 객체를 반환합니다.
     * [EN] Returns the 3D text label object indicating the light position.
     *
     * @returns
     * [KO] 3D 텍스트 레이블 객체
     * [EN] 3D text label object
     */
    get label(): TextField3D {
        return this.#label;
    }

    /**
     * [KO] 조명 가이드를 그리는 디버그 메시 객체를 반환합니다.
     * [EN] Returns the debug mesh object that draws the light guide.
     *
     * @returns
     * [KO] 조명 디버그 메시 객체
     * [EN] Light debug mesh object
     */
    get lightDebugMesh(): Mesh {
        return this.#lightDebugMesh;
    }

    /**
     * [KO] 선분 좌표 목록을 기반으로 디버그 메시의 정점 버퍼 데이터를 갱신합니다.
     * [EN] Updates the vertex buffer data of the debug mesh based on the list of line segment coordinates.
     *
     * @param lines -
     * [KO] 시작점과 끝점 좌표 쌍의 배열 (`[[x1, y1, z1], [x2, y2, z2]][]`)
     * [EN] Array of start and end coordinate pairs (`[[x1, y1, z1], [x2, y2, z2]][]`)
     * @param vertexBuffer -
     * [KO] 데이터를 갱신할 대상 정점 버퍼
     * [EN] Target vertex buffer to update
     */
    updateVertexBuffer(lines: number[][][], vertexBuffer: VertexBuffer) {
        const vertexData = vertexBuffer.data;
        let offset = 0;
        const maxLines = Math.min(lines.length, Math.floor(vertexData.length / 24));
        for (let i = 0; i < maxLines; i++) {
            const [start, end] = lines[i];
            vertexData[offset++] = start[0];
            vertexData[offset++] = start[1];
            vertexData[offset++] = start[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = end[0];
            vertexData[offset++] = end[1];
            vertexData[offset++] = end[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
        }
        vertexBuffer.updateAllData(vertexData);
    }

    /**
     * [KO] 조명 디버그 가이드를 렌더링합니다.
     * [EN] Renders the light debug guide.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    abstract render(renderViewStateData: RenderViewStateData): void;

    #createLightDebugGeometry(redGPUContext: RedGPUContext, maxLines: number): Geometry {
        const vertices = new Float32Array(maxLines * 2 * 12);
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
