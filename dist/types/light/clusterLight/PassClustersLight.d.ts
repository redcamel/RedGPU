import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
declare class PassClustersLight {
    #private;
    constructor(redGPUContext: RedGPUContext, view: View3D);
    get clusterLightsBuffer(): GPUBuffer;
    render(): void;
}
export default PassClustersLight;
