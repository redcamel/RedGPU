import View3D from "../../display/view/View3D";
/**
 * [KO] View3D 객체들을 관리하는 컨테이너 클래스입니다.
 * [EN] Container class that manages View3D objects.
 *
 * [KO] 뷰의 추가, 제거, 순서 변경 및 조회를 담당합니다.
 * [EN] Handles adding, removing, reordering, and retrieving views.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // RedGPUContext extends RedGPUContextViewContainer
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * redGPUContext.addView(view);
 * ```
 *
 * @category Context
 */
declare class RedGPUContextViewContainer {
    #private;
    /**
     * [KO] RedGPUContextViewContainer 생성자
     * [EN] RedGPUContextViewContainer constructor
     */
    constructor();
    /**
     * [KO] 이 인스턴스가 소유한 View3D 목록을 반환합니다.
     * [EN] Returns the list of View3D objects owned by this instance.
     */
    get viewList(): View3D[];
    /**
     * [KO] 소유한 View3D 객체의 개수를 반환합니다.
     * [EN] Returns the number of View3D objects owned.
     */
    get numViews(): number;
    /**
     * [KO] 주어진 자식 View3D가 현재 컨테이너에 포함되어 있는지 확인합니다.
     * [EN] Checks if the given child View3D is contained in the current container.
     * @param child -
     * [KO] 확인할 자식 View3D
     * [EN] Child View3D to check
     * @returns
     * [KO] 포함 여부
     * [EN] Containment status
     */
    contains(child: View3D): boolean;
    /**
     * [KO] 뷰 리스트에 뷰를 추가합니다.
     * [EN] Adds a view to the view list.
     * @param view -
     * [KO] 추가할 View3D 객체
     * [EN] View3D object to add
     * @throws
     * [KO] view가 View3D 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws error if view is not an instance of View3D
     */
    addView(view: View3D): void;
    /**
     * [KO] 뷰 리스트의 지정된 인덱스에 뷰를 추가합니다.
     * [EN] Adds a view at the specified index in the view list.
     * @param view -
     * [KO] 추가할 View3D 객체
     * [EN] View3D object to add
     * @param index -
     * [KO] 삽입할 인덱스
     * [EN] Index to insert at
     * @throws
     * [KO] view가 View3D 인스턴스가 아니거나 index가 올바른 uint 범위가 아닐 경우 에러 발생
     * [EN] Throws error if view is not an instance of View3D or index is not a valid uint
     */
    addViewAt(view: View3D, index: number): void;
    /**
     * [KO] 지정된 인덱스의 뷰를 반환합니다.
     * [EN] Retrieves the view at the specified index.
     * @param index -
     * [KO] 조회할 뷰의 인덱스
     * [EN] Index of the view to retrieve
     * @returns
     * [KO] 해당 인덱스의 View3D 객체
     * [EN] View3D object at the specified index
     * @throws
     * [KO] index가 올바른 uint 범위가 아닐 경우 에러 발생
     * [EN] Throws error if index is not a valid uint
     */
    getViewAt(index: number): View3D;
    /**
     * [KO] 지정된 뷰의 인덱스를 반환합니다.
     * [EN] Returns the index of the specified view.
     * @param view -
     * [KO] 검색할 View3D 객체
     * [EN] View3D object to search for
     * @returns
     * [KO] 뷰의 인덱스 (찾지 못하면 -1)
     * [EN] Index of the view (or -1 if not found)
     * @throws
     * [KO] view가 View3D 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws error if view is not an instance of View3D
     */
    getViewIndex(view: View3D): number;
    /**
     * [KO] 지정된 뷰를 뷰 리스트의 특정 인덱스로 이동시킵니다.
     * [EN] Moves the specified view to a specific index in the view list.
     * @param view -
     * [KO] 이동할 View3D 객체
     * [EN] View3D object to move
     * @param index -
     * [KO] 이동할 인덱스
     * [EN] Index to move to
     * @throws
     * [KO] 뷰가 등록되지 않았거나 인덱스가 범위를 벗어난 경우 에러 발생
     * [EN] Throws error if view is not registered or index is out of bounds
     */
    setViewIndex(view: View3D, index: number): void;
    /**
     * [KO] 뷰 리스트에서 두 뷰의 위치를 교환합니다.
     * [EN] Swaps the positions of two views in the view list.
     * @param view1 -
     * [KO] 교환할 첫 번째 View3D
     * [EN] First View3D to swap
     * @param view2 -
     * [KO] 교환할 두 번째 View3D
     * [EN] Second View3D to swap
     * @throws
     * [KO] 뷰가 이 컨텍스트의 자식이 아닐 경우 에러 발생
     * [EN] Throws error if view is not a child of this context
     */
    swapViews(view1: View3D, view2: View3D): void;
    /**
     * [KO] 지정된 인덱스에 있는 두 뷰의 위치를 교환합니다.
     * [EN] Swaps the positions of two views at the specified indices.
     * @param index1 -
     * [KO] 첫 번째 인덱스
     * [EN] First index
     * @param index2 -
     * [KO] 두 번째 인덱스
     * [EN] Second index
     * @throws
     * [KO] 인덱스가 범위를 벗어나거나 두 인덱스가 같은 경우 에러 발생
     * [EN] Throws error if indices are out of bounds or identical
     */
    swapViewsAt(index1: number, index2: number): void;
    /**
     * [KO] 뷰 리스트에서 지정된 뷰를 제거합니다.
     * [EN] Removes the specified view from the view list.
     * @param view -
     * [KO] 제거할 View3D 객체
     * [EN] View3D object to remove
     * @throws
     * [KO] 뷰가 등록되어 있지 않은 경우 에러 발생
     * [EN] Throws error if view is not found in the view list
     */
    removeView(view: View3D): void;
    /**
     * [KO] 뷰 리스트에서 지정된 인덱스의 뷰를 제거합니다.
     * [EN] Removes the view at the specified index from the view list.
     * @param index -
     * [KO] 제거할 뷰의 인덱스
     * [EN] Index of the view to remove
     * @throws
     * [KO] 인덱스가 범위를 벗어난 경우 에러 발생
     * [EN] Throws error if index is out of range
     */
    removeViewAt(index: number): void;
    /**
     * [KO] 뷰 리스트의 모든 뷰를 제거합니다.
     * [EN] Removes all views from the view list.
     */
    removeAllViews(): void;
}
export default RedGPUContextViewContainer;
