import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
declare class PassClusterLightBound {
    #private;
    constructor(redGPUContext: RedGPUContext, view: View3D);
    get clusterBoundBuffer(): GPUBuffer;
    render(): void;
}
export default PassClusterLightBound;
