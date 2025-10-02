import { mat4 } from "gl-matrix";
import Mesh from "../Mesh";
/**
 * Object3DContainer 클래스는 Mesh 객체들을 담는 시각적 컨테이너입니다.
 *
 * Scene의 기반이 되는 구조로, View에서 렌더링할 수 있는 3D 객체들을 계층적으로 관리합니다.
 * 자식 객체의 추가, 제거, 위치 변경, 교환 등의 기능을 제공하며,
 * 각 Mesh는 이 컨테이너를 통해 부모-자식 관계를 형성합니다.
 *
 * View와 Scene이 그려낼 공간을 구성할 때, Object3DContainer는
 * 실제로 배치되는 시각적 요소들의 루트 역할을 합니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
declare class Object3DContainer {
    #private;
    /**
     * 이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.
     */
    modelMatrix: mat4;
    /**
     * Object3DContainer 생성자입니다.
     */
    constructor();
    /**
     * 현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.
     * @returns {Mesh[]} 자식 객체 배열
     */
    get children(): Mesh[];
    /**
     * 자식 객체의 개수를 반환합니다.
     * @returns {number} 자식 수
     */
    get numChildren(): number;
    /**
     * 특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.
     * @param {Mesh} child - 확인할 자식 객체
     * @returns {boolean} 포함 여부
     */
    contains(child: Mesh): boolean;
    /**
     * 자식 Mesh를 컨테이너에 추가합니다.
     * @param {Mesh} child - 추가할 자식 객체
     * @returns {Mesh} 추가된 객체 또는 실패 시 null
     */
    addChild(child: Mesh): Mesh;
    /**
     * 자식 Mesh를 특정 인덱스에 추가합니다.
     * @param {Mesh} child - 추가할 자식 객체
     * @param {number} index - 삽입 위치
     * @returns {this} 현재 컨테이너
     */
    addChildAt(child: Mesh, index: number): this;
    /**
     * 지정된 인덱스의 자식 Mesh를 반환합니다.
     * @param {number} index - 조회할 위치
     * @returns {Mesh} 해당 위치의 자식 객체 또는 undefined
     */
    getChildAt(index: number): Mesh;
    /**
     * 특정 자식 객체의 인덱스를 반환합니다.
     * @param {Mesh} child - 조회할 자식 객체
     * @returns {number} 인덱스 또는 -1
     */
    getChildIndex(child: Mesh): number;
    /**
     * 자식 객체의 위치를 변경합니다.
     * @param {Mesh} child - 대상 자식 객체
     * @param {number} index - 새 인덱스
     */
    setChildIndex(child: Mesh, index: number): void;
    /**
     * 두 자식 객체의 위치를 서로 바꿉니다.
     * @param {Mesh} child1 - 첫 번째 객체
     * @param {Mesh} child2 - 두 번째 객체
     */
    swapChildren(child1: Mesh, child2: Mesh): void;
    /**
     * 두 인덱스의 자식 객체 위치를 서로 바꿉니다.
     * @param {number} index1 - 첫 번째 인덱스
     * @param {number} index2 - 두 번째 인덱스
     */
    swapChildrenAt(index1: number, index2: number): void;
    /**
     * 특정 자식 객체를 제거합니다.
     * @param {Mesh} child - 제거할 자식 객체
     * @returns {Mesh} 제거된 객체
     */
    removeChild(child: Mesh): Mesh;
    /**
     * 지정된 인덱스의 자식 객체를 제거합니다.
     * @param {number} index - 제거할 위치
     * @returns {Mesh} 제거된 객체
     */
    removeChildAt(index: number): Mesh;
    /**
     * 모든 자식 객체를 제거합니다.
     * @returns {this} 현재 컨테이너
     */
    removeAllChildren(): this;
}
export default Object3DContainer;
