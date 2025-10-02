import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
/**
 * Represents the DrawDebuggerAxis class with larger cone-like indicators at the ends of each axis.
 * @extends Mesh
 */
declare class DrawDebuggerAxis extends Mesh {
    #private;
    constructor(redGPUContext: RedGPUContext);
}
export default DrawDebuggerAxis;
