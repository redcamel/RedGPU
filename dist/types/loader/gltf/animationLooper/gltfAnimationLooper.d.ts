import RedGPUContext from "../../../context/RedGPUContext";
import { PlayAnimationInfo } from "../GLTFLoader";
declare const gltfAnimationLooper: (redGPUContext: RedGPUContext, timestamp: number, computePassEncoder: GPUComputePassEncoder, playAnimationInfoList: PlayAnimationInfo[]) => void;
export default gltfAnimationLooper;
