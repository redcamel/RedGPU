import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import GltfAnimationLooperManager from "../../loader/gltf/animationLooper/GltfAnimationLooperManager";
import View3D from "../../display/view/View3D";
declare const processAnimationsAndSkinning: (redGPUContext: RedGPUContext, renderViewStateData: RenderViewStateData, gltfAnimationLooperManager: GltfAnimationLooperManager, view: View3D) => void;
export default processAnimationsAndSkinning;
