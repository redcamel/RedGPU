import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
declare const createPrimitiveGeometry: (redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string) => Geometry;
export default createPrimitiveGeometry;
