import RedGPUContext from "../../../context/RedGPUContext";
import { PlayAnimationInfo } from "../GLTFLoader";
/**
 * [KO] glTF 애니메이션 모션 Blending 메인 진입 함수 (호이스팅 최적화 적용)
 * [EN] Main entry function for glTF animation motion blending
 */
export default function gltfAnimationMotionBlending(redGPUContext: RedGPUContext, timestamp: number, computePassEncoder: GPUComputePassEncoder, targetPlayAnimationInfo: PlayAnimationInfo): void;
