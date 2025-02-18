import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import LineMaterial from "./core/LineMaterial";
import Line3D from "./Line3D";
import LINE_TYPE from "./LINE_TYPE";
import vertexModuleSource from "./shader/lineVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_LINE_2D'
const STRUCT_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = STRUCT_INFO.uniforms.vertexUniforms;

class Line2D extends Line3D {
    constructor(redGPUContext: RedGPUContext, type: LINE_TYPE = LINE_TYPE.LINEAR, baseColor: string = '#fff') {
        super(redGPUContext, type, baseColor)
        this._material = new LineMaterial(redGPUContext)
    }

    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('Line2D can not change geometry')
    }

    get material() {
        return this._material
    }

    set material(value) {
        consoleAndThrowError('Line2D can not change material')
    }

    createCustomMeshVertexShaderModule() {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, STRUCT_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

    // @ts-ignore
    addPoint(
        x = 0, y = 0,
        color: string = this.baseColor, colorAlpha = 1,
        inX = 0, inY = 0,
        outX = 0, outY = 0,
    ) {
        super.addPoint(x, y, 0, color, colorAlpha, inX, inY, 0, outX, outY, 0)
    }

    // @ts-ignore
    addPointAt(
        index: number,
        x = 0, y = 0,
        color: string = this.baseColor, colorAlpha = 1,
        inX = 0, inY = 0,
        outX = 0, outY = 0
    ) {
        super.addPointAt(index, x, y, 0, color, colorAlpha, inX, inY, 0, outX, outY, 0)
    }
}

export default Line2D
