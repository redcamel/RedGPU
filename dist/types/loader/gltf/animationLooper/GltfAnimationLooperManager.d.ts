import RedGPUContext from "../../../context/RedGPUContext";
import { PlayAnimationInfo } from "../GLTFLoader";
declare class GltfAnimationLooperManager {
    #private;
    render: (redGPUContext: RedGPUContext, timestamp: number, computePassEncoder: GPUComputePassEncoder, playAnimationInfoList: PlayAnimationInfo[]) => void;
}
export default GltfAnimationLooperManager;
