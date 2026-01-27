import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";

/**
 * [KO] 조명 객체를 시각화하는 디버거의 추상 베이스 클래스입니다.
 * [EN] Abstract base class for debuggers that visualize light objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
 * @category Debugger
 */
abstract class ADrawDebuggerLight {
    #redGPUContext: RedGPUContext;
    #lightMaterial: ColorMaterial;
    #lightDebugMesh: Mesh;

    constructor(redGPUContext: RedGPUContext, color: [number, number, number], maxLines: number = 32) {
        this.#redGPUContext = redGPUContext;
        const lightGeometry = this.createLightDebugGeometry(redGPUContext, maxLines);
        this.#lightMaterial = new ColorMaterial(redGPUContext);
        this.#lightMaterial.color.setColorByRGB(color[0], color[1], color[2]);
        this.#lightDebugMesh = new Mesh(redGPUContext, lightGeometry, this.#lightMaterial);
        this.#lightDebugMesh.primitiveState.cullMode = 'none';
        this.#lightDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;

    }

    get lightMaterial(): ColorMaterial {
        return this.#lightMaterial;
    }

    get lightDebugMesh(): Mesh {
        return this.#lightDebugMesh;
    }

    updateVertexBuffer(lines: number[][][], vertexBuffer: VertexBuffer) {
        const vertexData = vertexBuffer.data;
        let offset = 0;
        const maxLines = Math.min(lines.length, Math.floor(vertexData.length / 16));
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
            // 끝점
            vertexData[offset++] = end[0];
            vertexData[offset++] = end[1];
            vertexData[offset++] = end[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
        }
        vertexBuffer.updateAllData(vertexData);
    }

    abstract render(renderViewStateData: RenderViewStateData): void;

    private createLightDebugGeometry(redGPUContext: RedGPUContext, maxLines: number): Geometry {
        const vertices = new Float32Array(maxLines * 2 * 8); // maxLines * 2개 점 * 8개 데이터
        const interleavedStruct = new VertexInterleavedStruct(
            {
                vertexPosition: VertexInterleaveType.float32x3,
                vertexNormal: VertexInterleaveType.float32x3,
                texcoord: VertexInterleaveType.float32x2,
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

export default ADrawDebuggerLight;
