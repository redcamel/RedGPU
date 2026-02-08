import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import {mat4} from "gl-matrix";
import AGroupBase from "../display/group/core/AGroupBase";

const CONVERT_RADIAN = Math.PI / 180;
/**
 * [KO] Object3D(Mesh, AGroupBase)의 로컬 행렬과 모델 행렬을 업데이트합니다.
 * [EN] Updates the local matrix and model matrix of Object3D (Mesh, AGroupBase).
 *
 * [KO] 이 함수는 객체의 위치, 회전, 크기, 피벗 정보를 바탕으로 로컬 행렬을 계산하고, 부모의 모델 행렬이 있을 경우 이를 합성하여 최종 모델 행렬을 구합니다.
 * [EN] This function calculates the local matrix based on the object's position, rotation, scale, and pivot information, and calculates the final model matrix by multiplying it with the parent's model matrix if it exists.
 *
 * * ### Example
 * ```typescript
 * // 시스템 내부에서 주로 호출됩니다. (Mainly called internally by the system.)
 * RedGPU.math.updateObject3DMatrix(mesh, view);
 * ```
 *
 * @param targetMesh -
 * [KO] 행렬을 업데이트할 대상 객체 (Mesh 또는 AGroupBase)
 * [EN] The target object to update the matrix for (Mesh or AGroupBase)
 * @param view -
 * [KO] 현재 렌더링 중인 View3D 인스턴스 (크기 계산 등에 사용)
 * [EN] The View3D instance currently being rendered (used for size calculations, etc.)
 * @category Math
 */
const updateObject3DMatrix = (targetMesh:Mesh|AGroupBase,view:View3D)=>{

    const {pixelRectObject} = view;
    const parent = targetMesh.parent;
    const tLocalMatrix = targetMesh.localMatrix;
    // 초기화
    mat4.identity(tLocalMatrix);
    // Position 설정 (translate)
    mat4.translate(tLocalMatrix, tLocalMatrix, [
        targetMesh.x,
        targetMesh.y,
        targetMesh.z,
    ]);
    // Rotation 설정 (rotate)
    mat4.rotateX(tLocalMatrix, tLocalMatrix, targetMesh.rotationX * CONVERT_RADIAN); // X축 회전
    mat4.rotateY(tLocalMatrix, tLocalMatrix, targetMesh.rotationY * CONVERT_RADIAN); // Y축 회전
    mat4.rotateZ(tLocalMatrix, tLocalMatrix, targetMesh.rotationZ * CONVERT_RADIAN); // Z축 회전
    // Scale 설정 (scale)
    let scaleVec = [targetMesh.scaleX, targetMesh.scaleY, targetMesh.scaleZ];
    // @ts-ignore
    if (targetMesh.renderTextureWidth) {
        // @ts-ignore
        scaleVec[0] *= targetMesh.renderTextureWidth / pixelRectObject.height;
        // @ts-ignore
        scaleVec[1] *= targetMesh.renderTextureHeight / pixelRectObject.height;
    }
    // @ts-ignore
    mat4.scale(tLocalMatrix, tLocalMatrix, scaleVec);
    // Pivot 처리를 위한 번역 (pivot 적용)
    if (targetMesh.pivotX || targetMesh.pivotY || targetMesh.pivotZ) {
        const pivotTranslation = [-targetMesh.pivotX, -targetMesh.pivotY, -targetMesh.pivotZ];
        // @ts-ignore
        mat4.translate(tLocalMatrix, tLocalMatrix, pivotTranslation);
    }
    // 부모 매트릭스와 합성 (modelMatrix 계산)
    if (parent?.modelMatrix) {
        mat4.multiply(targetMesh.modelMatrix, parent.modelMatrix, targetMesh.localMatrix);
    } else {
        mat4.copy(targetMesh.modelMatrix, targetMesh.localMatrix);
    }
}
export default updateObject3DMatrix