import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import GltfAnimationLooperManager from "../../loader/gltf/animationLooper/GltfAnimationLooperManager";
import View3D from "../../display/view/View3D";
/**
 * [KO] 컴퓨트 패스를 통해 glTF 애니메이션 업데이트 및 정점 스키닝 연산을 수행합니다.
 * [EN] Performs glTF animation updates and vertex skinning calculations via a compute pass.
 *
 * @param redGPUContext -
 * [KO] `RedGPUContext` 인스턴스
 * [EN] `RedGPUContext` instance
 * @param renderViewStateData -
 * [KO] 현재 뷰의 렌더링 상태 데이터 (`RenderViewStateData`)
 * [EN] Render state data of the current view (`RenderViewStateData`)
 * @param gltfAnimationLooperManager -
 * [KO] glTF 애니메이션 루퍼 매니저 인스턴스 (`GltfAnimationLooperManager`)
 * [EN] glTF animation looper manager instance (`GltfAnimationLooperManager`)
 * @param view -
 * [KO] 대상 `View3D` 인스턴스
 * [EN] Target `View3D` instance
 * @category Renderer
 */
declare const processAnimationsAndSkinning: (redGPUContext: RedGPUContext, renderViewStateData: RenderViewStateData, gltfAnimationLooperManager: GltfAnimationLooperManager, view: View3D) => void;
export default processAnimationsAndSkinning;
