import RedGPUContext from "../../../context/RedGPUContext";
import { PlayAnimationInfo } from "../GLTFLoader";
/**
 * [KO] 두 glTF 애니메이션 클립 간의 모션 블렌딩을 계산하고 대상 메쉬들에 적용합니다.
 * [EN] Computes motion blending between two glTF animation clips and applies it to the target meshes.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트
 * [EN] RedGPU context
 * @param timestamp -
 * [KO] 현재 프레임 타임스탬프 (밀리초)
 * [EN] Current frame timestamp (in milliseconds)
 * @param computePassEncoder -
 * [KO] 컴퓨트 패스 인코더
 * [EN] Compute pass encoder
 * @param targetPlayAnimationInfo -
 * [KO] 블렌딩할 애니메이션 재생 정보
 * [EN] Animation playback information to blend
 * @category GLTF
 */
export default function gltfAnimationMotionBlending(redGPUContext: RedGPUContext, timestamp: number, computePassEncoder: GPUComputePassEncoder, targetPlayAnimationInfo: PlayAnimationInfo): void;
