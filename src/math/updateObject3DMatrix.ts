import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import {mat4} from "gl-matrix";
import Group3D from "../display/group/Group3D";


const CONVERT_RADIAN = Math.PI / 180;
/**
 * [KO] 대상 3D 객체(`Mesh` 또는 `Group3D`)의 위치, 회전(도 단위), 스케일, 피벗 및 부모 행렬을 반영하여 `localMatrix`와 `modelMatrix`를 갱신합니다.
 * [EN] Updates the `localMatrix` and `modelMatrix` of a target 3D object (`Mesh` or `Group3D`) using its position, rotation (in degrees), scale, pivot, and parent matrix.
 *
 * ### Example
 * ```typescript
 * RedGPU.Math.updateObject3DMatrix(mesh, view);
 * ```
 *
 * @param targetMesh -
 * [KO] 행렬을 갱신할 대상 객체 (`Mesh` 또는 `Group3D`)
 * [EN] Target object whose matrices will be updated (`Mesh` or `Group3D`)
 * @param view -
 * [KO] 현재 렌더링 중인 `View3D` 인스턴스
 * [EN] Currently rendering `View3D` instance
 * @category Math
 */
const updateObject3DMatrix = (targetMesh: Mesh | Group3D, view: View3D) => {

    const {pixelRectObject} = view;
    const parent = targetMesh.parent;
    const tLocalMatrix = targetMesh.localMatrix;
    mat4.identity(tLocalMatrix);
    mat4.translate(tLocalMatrix, tLocalMatrix, [
        targetMesh.x,
        targetMesh.y,
        targetMesh.z,
    ]);
    mat4.rotateX(tLocalMatrix, tLocalMatrix, targetMesh.rotationX * CONVERT_RADIAN);
    mat4.rotateY(tLocalMatrix, tLocalMatrix, targetMesh.rotationY * CONVERT_RADIAN);
    mat4.rotateZ(tLocalMatrix, tLocalMatrix, targetMesh.rotationZ * CONVERT_RADIAN);
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
    if (targetMesh.pivotX || targetMesh.pivotY || targetMesh.pivotZ) {
        const pivotTranslation = [-targetMesh.pivotX, -targetMesh.pivotY, -targetMesh.pivotZ];
        // @ts-ignore
        mat4.translate(tLocalMatrix, tLocalMatrix, pivotTranslation);
    }
    if (parent?.modelMatrix) {
        mat4.multiply(targetMesh.modelMatrix, parent.modelMatrix, targetMesh.localMatrix);
    } else {
        mat4.copy(targetMesh.modelMatrix, targetMesh.localMatrix);
    }
}
export default updateObject3DMatrix