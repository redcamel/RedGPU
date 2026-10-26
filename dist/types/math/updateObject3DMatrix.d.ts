import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import Group3D from "../display/group/Group3D";
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
declare const updateObject3DMatrix: (targetMesh: Mesh | Group3D, view: View3D) => void;
export default updateObject3DMatrix;
