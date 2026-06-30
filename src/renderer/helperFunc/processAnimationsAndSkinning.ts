import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ParsedSkinInfo_GLTF from "../../loader/gltf/cls/ParsedSkinInfo_GLTF";
import GltfAnimationLooperManager from "../../loader/gltf/animationLooper/GltfAnimationLooperManager";
import View3D from "../../display/view/View3D";

const processAnimationsAndSkinning = (
    redGPUContext: RedGPUContext,
    renderViewStateData: RenderViewStateData,
    gltfAnimationLooperManager: GltfAnimationLooperManager,
    view: View3D
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

        // @group(0): 시스템 유니폼 바인드 그룹 연결
        passEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);

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

            // 모델 행렬의 역행렬 계산
            skinInfo.invertNodeGlobalTransform = skinInfo.invertNodeGlobalTransform || new Float32Array(16);
            {
                const sourceMatrix = mesh.modelMatrix;
                const resultMatrix = skinInfo.invertNodeGlobalTransform;
                const m00 = sourceMatrix[0], m01 = sourceMatrix[1], m02 = sourceMatrix[2], m03 = sourceMatrix[3];
                const m10 = sourceMatrix[4], m11 = sourceMatrix[5], m12 = sourceMatrix[6], m13 = sourceMatrix[7];
                const m20 = sourceMatrix[8], m21 = sourceMatrix[9], m22 = sourceMatrix[10], m23 = sourceMatrix[11];
                const m30 = sourceMatrix[12], m31 = sourceMatrix[13], m32 = sourceMatrix[14], m33 = sourceMatrix[15];
                const c00 = m11 * (m22 * m33 - m23 * m32) - m12 * (m21 * m33 - m23 * m31) + m13 * (m21 * m32 - m22 * m31);
                const c01 = -(m10 * (m22 * m33 - m23 * m32) - m12 * (m20 * m33 - m23 * m30) + m13 * (m20 * m32 - m22 * m30));
                const c02 = m10 * (m21 * m33 - m23 * m31) - m11 * (m20 * m33 - m23 * m30) + m13 * (m20 * m31 - m21 * m30);
                const c03 = -(m10 * (m21 * m32 - m22 * m31) - m11 * (m20 * m32 - m22 * m30) + m12 * (m20 * m31 - m21 * m30));
                const c10 = -(m01 * (m22 * m33 - m23 * m32) - m02 * (m21 * m33 - m23 * m31) + m03 * (m21 * m32 - m22 * m31));
                const c11 = m00 * (m22 * m33 - m23 * m32) - m02 * (m20 * m33 - m23 * m30) + m03 * (m20 * m32 - m22 * m30);
                const c12 = -(m00 * (m21 * m33 - m23 * m31) - m01 * (m20 * m33 - m23 * m30) + m03 * (m20 * m31 - m21 * m30));
                const c13 = m00 * (m21 * m32 - m22 * m31) - m01 * (m20 * m32 - m22 * m30) + m02 * (m20 * m31 - m21 * m30);
                const c20 = m01 * (m12 * m33 - m13 * m32) - m02 * (m11 * m33 - m13 * m31) + m03 * (m11 * m32 - m12 * m31);
                const c21 = -(m00 * (m12 * m33 - m13 * m32) - m02 * (m10 * m33 - m13 * m30) + m03 * (m10 * m32 - m12 * m30));
                const c22 = m00 * (m11 * m33 - m13 * m31) - m01 * (m10 * m33 - m13 * m30) + m03 * (m10 * m31 - m11 * m30);
                const c23 = -(m00 * (m11 * m32 - m12 * m31) - m01 * (m10 * m32 - m12 * m30) + m02 * (m10 * m31 - m11 * m30));
                const c30 = -(m01 * (m12 * m23 - m13 * m22) - m02 * (m11 * m23 - m13 * m21) + m03 * (m11 * m22 - m12 * m21));
                const c31 = m00 * (m12 * m23 - m13 * m22) - m02 * (m10 * m23 - m13 * m20) + m03 * (m10 * m22 - m12 * m20);
                const c32 = -(m00 * (m11 * m23 - m13 * m21) - m01 * (m10 * m23 - m13 * m20) + m03 * (m10 * m21 - m11 * m20));
                const c33 = m00 * (m11 * m22 - m12 * m21) - m01 * (m10 * m22 - m12 * m20) + m02 * (m10 * m21 - m11 * m20);
                const determinant = m00 * c00 + m01 * c01 + m02 * c02 + m03 * c03;
                if (Math.abs(determinant) < 1e-10) {
                    resultMatrix[0] = 1;
                    resultMatrix[1] = 0;
                    resultMatrix[2] = 0;
                    resultMatrix[3] = 0;
                    resultMatrix[4] = 0;
                    resultMatrix[5] = 1;
                    resultMatrix[6] = 0;
                    resultMatrix[7] = 0;
                    resultMatrix[8] = 0;
                    resultMatrix[9] = 0;
                    resultMatrix[10] = 1;
                    resultMatrix[11] = 0;
                    resultMatrix[12] = 0;
                    resultMatrix[13] = 0;
                    resultMatrix[14] = 0;
                    resultMatrix[15] = 1;
                } else {
                    const invDet = 1.0 / determinant;
                    resultMatrix[0] = c00 * invDet;
                    resultMatrix[1] = c10 * invDet;
                    resultMatrix[2] = c20 * invDet;
                    resultMatrix[3] = c30 * invDet;
                    resultMatrix[4] = c01 * invDet;
                    resultMatrix[5] = c11 * invDet;
                    resultMatrix[6] = c21 * invDet;
                    resultMatrix[7] = c31 * invDet;
                    resultMatrix[8] = c02 * invDet;
                    resultMatrix[9] = c12 * invDet;
                    resultMatrix[10] = c22 * invDet;
                    resultMatrix[11] = c32 * invDet;
                    resultMatrix[12] = c03 * invDet;
                    resultMatrix[13] = c13 * invDet;
                    resultMatrix[14] = c23 * invDet;
                    resultMatrix[15] = c33 * invDet;
                }
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

            // 매 프레임 모델 역행렬 데이터 업로드
            const invertNodeGlobalTransformOffset = 16 + (skinInfo.joints.length * 16) + (skinInfo.joints.length * 64) + 16 + (Math.ceil(skinInfo.usedJoints.length / 4) * 16);
            gpuDevice.queue.writeBuffer(
                skinInfo.uniformBuffer,
                invertNodeGlobalTransformOffset,
                skinInfo.invertNodeGlobalTransform as BufferSource
            );

            if (skinInfo.prevGlobalVertexSSBOBuffer !== redGPUContext.globalVertexSSBO.gpuBuffer) {
                skinInfo.updateBindGroup(redGPUContext,
                    gpuDevice,
                    mesh.geometry.vertexBuffer,
                    mesh.animationInfo.weightBuffer,
                    mesh.animationInfo.jointBuffer,
                )
            }

            // Compute Pass 설정 및 Dispatch
            passEncoder.setPipeline(skinInfo.computePipeline);
            // @group(1): 스키닝 전용 바인드 그룹 연결
            passEncoder.setBindGroup(1, skinInfo.bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / skinInfo.WORK_SIZE));
        }
    });
}
export default processAnimationsAndSkinning;