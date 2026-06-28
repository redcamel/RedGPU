import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ParsedSkinInfo_GLTF from "../../loader/gltf/cls/ParsedSkinInfo_GLTF";
import GltfAnimationLooperManager from "../../loader/gltf/animationLooper/GltfAnimationLooperManager";

const processAnimationsAndSkinning = (
    redGPUContext: RedGPUContext,
    renderViewStateData: RenderViewStateData,
    gltfAnimationLooperManager: GltfAnimationLooperManager
) => {
    const {animationList, skinList} = renderViewStateData;
    const skinListNum = skinList.length
    const animationListNum = animationList.length
    if (!skinListNum && !animationListNum) return;
    const {gpuDevice, commandEncoderManager} = redGPUContext;

    commandEncoderManager.addPreProcessComputePass('ProcessAnimationsAndSkinning_ComputePass', (passEncoder) => {
        if (animationListNum) {
            gltfAnimationLooperManager.render(
                redGPUContext,
                renderViewStateData.timestamp,
                passEncoder,
                animationList.flat()
            )
        }
        for (let i = 0; i < skinListNum; i++) {
            const mesh = skinList[i];
            const skinInfo = mesh.animationInfo.skinInfo as ParsedSkinInfo_GLTF;
            // 사용된 조인트 인덱스 초기화
            if (!skinInfo.usedJoints) {
                skinInfo.usedJoints = skinInfo.getUsedJointIndices(mesh);
            }
            // 조인트 행렬 저장 버퍼 크기 확인 및 초기화
            const neededSize = (1 + skinInfo.usedJoints.length) * 16;
            if (!skinInfo.jointData || skinInfo.jointData.length !== neededSize) {
                skinInfo.jointData = new Float32Array(neededSize);
                skinInfo.computeShader = null
            }

            // Compute Shader 초기화 (최초 1회)
            if (!skinInfo.computeShader) {
                skinInfo.createCompute(
                    redGPUContext,
                    gpuDevice,
                    mesh.geometry.vertexBuffer,
                    mesh.animationInfo.weightBuffer,
                    mesh.animationInfo.jointBuffer,
                    mesh
                );
            }

            // Compute Pass 설정 및 Dispatch (매 프레임 CPU단 루프 대입 및 GPU writeBuffer 전송 0회)
            passEncoder.setPipeline(skinInfo.computePipeline);
            passEncoder.setBindGroup(0, skinInfo.bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / skinInfo.WORK_SIZE));
        }
    });
}
export default processAnimationsAndSkinning;