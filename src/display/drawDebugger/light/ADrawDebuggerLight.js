import Geometry from "../../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import Mesh from "../../mesh/Mesh";
class ADrawDebuggerLight {
    #redGPUContext;
    #lightMaterial;
    #lightDebugMesh;
    constructor(redGPUContext, color, maxLines = 32) {
        this.#redGPUContext = redGPUContext;
        const lightGeometry = this.createLightDebugGeometry(redGPUContext, maxLines);
        this.#lightMaterial = new ColorMaterial(redGPUContext);
        this.#lightMaterial.color.setColorByRGB(color[0], color[1], color[2]);
        this.#lightDebugMesh = new Mesh(redGPUContext, lightGeometry, this.#lightMaterial);
        this.#lightDebugMesh.primitiveState.cullMode = 'none';
        this.#lightDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
        this.#lightDebugMesh.disableJitter = true;
    }
    get lightMaterial() {
        return this.#lightMaterial;
    }
    get lightDebugMesh() {
        return this.#lightDebugMesh;
    }
    updateVertexBuffer(lines, vertexBuffer) {
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
    createLightDebugGeometry(redGPUContext, maxLines) {
        const vertices = new Float32Array(maxLines * 2 * 8); // maxLines * 2개 점 * 8개 데이터
        const interleavedStruct = new VertexInterleavedStruct({
            vertexPosition: VertexInterleaveType.float32x3,
            vertexNormal: VertexInterleaveType.float32x3,
            texcoord: VertexInterleaveType.float32x2,
        }, `lightDebugStruct_${Math.random()}`);
        const vertexBuffer = new VertexBuffer(redGPUContext, vertices, interleavedStruct);
        return new Geometry(redGPUContext, vertexBuffer);
    }
}
export default ADrawDebuggerLight;
