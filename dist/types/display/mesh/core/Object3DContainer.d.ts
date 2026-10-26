import { mat4 } from "gl-matrix";
import Mesh from "../Mesh";
import BaseObject from "../../../base/BaseObject";
/**
 * [KO] 3D 객체들을 계층적으로 관리하는 컨테이너 클래스입니다.
 * [EN] Container class that hierarchically manages 3D objects.
 *
 * [KO] 자식 객체의 추가, 제거, 인덱스 변경 및 정렬 기능을 제공합니다.
 * [EN] Provides functions for adding, removing, reindexing, and sorting child objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare class Object3DContainer extends BaseObject {
    #private;
    /**
     * [KO] 객체의 월드 변환을 나타내는 모델 행렬입니다.
     * [EN] Model matrix representing the world transformation of the object.
     */
    modelMatrix: mat4;
    /**
     * [KO] Object3DContainer 인스턴스를 생성합니다.
     * [EN] Creates an Object3DContainer instance.
     */
    constructor();
    /**
     * [KO] 자식 객체 배열을 반환합니다.
     * [EN] Returns the array of child objects.
     *
     * @returns
     * [KO] 자식 Mesh 배열 (`Mesh[]`)
     * [EN] Array of child Meshes (`Mesh[]`)
     */
    get children(): Mesh[];
    /**
     * [KO] 등록된 자식 객체의 개수를 반환합니다.
     * [EN] Returns the number of registered child objects.
     *
     * @returns
     * [KO] 자식 객체 개수
     * [EN] Number of child objects
     */
    get numChildren(): number;
    /**
     * [KO] 지정한 객체가 현재 컨테이너의 자식인지 확인합니다.
     * [EN] Checks whether the specified object is a child of this container.
     *
     * @param child -
     * [KO] 확인할 자식 객체
     * [EN] Child object to check
     * @returns
     * [KO] 포함 여부
     * [EN] Whether the child is contained
     */
    contains(child: Mesh): boolean;
    /**
     * [KO] 자식 객체를 컨테이너 끝에 추가합니다.
     * [EN] Appends a child object to the end of the container.
     *
     * @param child -
     * [KO] 추가할 자식 객체
     * [EN] Child object to add
     * @returns
     * [KO] 추가된 자식 객체 (실패 시 `null`)
     * [EN] Added child object (`null` on failure)
     */
    addChild(child: Mesh): Mesh;
    /**
     * [KO] 지정한 인덱스 위치에 자식 객체를 추가합니다.
     * [EN] Inserts a child object at the specified index position.
     *
     * @param child -
     * [KO] 추가할 자식 객체
     * [EN] Child object to add
     * @param index -
     * [KO] 삽입할 인덱스 위치
     * [EN] Index position to insert at
     * @returns
     * [KO] 현재 컨테이너 인스턴스
     * [EN] Current container instance
     */
    addChildAt(child: Mesh, index: number): this;
    /**
     * [KO] 지정한 인덱스에 위치한 자식 객체를 반환합니다.
     * [EN] Returns the child object at the specified index.
     *
     * @param index -
     * [KO] 조회할 인덱스 위치
     * [EN] Index position to retrieve
     * @returns
     * [KO] 해당 위치의 자식 객체 (범위 초과 시 `undefined`)
     * [EN] Child object at the index (`undefined` if out of bounds)
     */
    getChildAt(index: number): Mesh;
    /**
     * [KO] 지정한 자식 객체의 인덱스를 반환합니다.
     * [EN] Returns the index of the specified child object.
     *
     * @param child -
     * [KO] 인덱스를 조회할 자식 객체
     * [EN] Child object to find the index of
     * @returns
     * [KO] 자식 객체의 인덱스 (존재하지 않으면 `-1`)
     * [EN] Index of the child object (`-1` if not found)
     */
    getChildIndex(child: Mesh): number;
    /**
     * [KO] 자식 객체의 인덱스 위치를 변경합니다.
     * [EN] Changes the index position of a child object.
     *
     * @param child -
     * [KO] 위치를 변경할 자식 객체
     * [EN] Child object to reposition
     * @param index -
     * [KO] 새로 지정할 인덱스
     * [EN] New index to assign
     */
    setChildIndex(child: Mesh, index: number): void;
    /**
     * [KO] 두 자식 객체의 배열 내 순서(인덱스)를 서로 맞바꿉니다.
     * [EN] Swaps the order (indices) of two child objects within the container.
     *
     * @param child1 -
     * [KO] 첫 번째 자식 객체
     * [EN] First child object
     * @param child2 -
     * [KO] 두 번째 자식 객체
     * [EN] Second child object
     */
    swapChildren(child1: Mesh, child2: Mesh): void;
    /**
     * [KO] 지정된 두 인덱스에 있는 자식 객체들의 위치를 서로 맞바꿉니다.
     * [EN] Swaps the child objects at the two specified indices.
     *
     * @param index1 -
     * [KO] 첫 번째 인덱스
     * [EN] First index
     * @param index2 -
     * [KO] 두 번째 인덱스
     * [EN] Second index
     */
    swapChildrenAt(index1: number, index2: number): void;
    /**
     * [KO] 지정한 자식 객체를 컨테이너에서 제거합니다.
     * [EN] Removes the specified child object from the container.
     *
     * @param child -
     * [KO] 제거할 자식 객체
     * [EN] Child object to remove
     * @returns
     * [KO] 제거된 자식 객체
     * [EN] Removed child object
     */
    removeChild(child: Mesh): Mesh;
    /**
     * [KO] 지정한 인덱스의 자식 객체를 컨테이너에서 제거합니다.
     * [EN] Removes the child object at the specified index from the container.
     *
     * @param index -
     * [KO] 제거할 자식 객체의 인덱스
     * [EN] Index of the child object to remove
     * @returns
     * [KO] 제거된 자식 객체
     * [EN] Removed child object
     * @throws
     * [KO] 해당 인덱스에 자식 객체가 존재하지 않을 경우 Error 발생
     * [EN] Throws Error if no child exists at the provided index
     */
    removeChildAt(index: number): Mesh;
    /**
     * [KO] 컨테이너의 모든 자식 객체를 제거합니다.
     * [EN] Removes all child objects from the container.
     *
     * @returns
     * [KO] 현재 컨테이너 인스턴스
     * [EN] Current container instance
     */
    removeAllChildren(): this;
    /**
     * [KO] 컨테이너 내 모든 자식 객체를 파괴하고 컨테이너에서 제거합니다.
     * [EN] Destroys all child objects in the container and removes them.
     */
    destroy(): void;
}
export default Object3DContainer;
