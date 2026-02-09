import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import AGroupBase from "../display/group/core/AGroupBase";
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
declare const updateObject3DMatrix: (targetMesh: Mesh | AGroupBase, view: View3D) => void;
export default updateObject3DMatrix;
