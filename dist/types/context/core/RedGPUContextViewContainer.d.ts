import View3D from "../../display/view/View3D";
/**
 * [KO] `View3D` 인스턴스들의 추가, 제거, 순서 변경 및 조회를 관리하는 컨테이너 클래스입니다.
 * [EN] Container class that manages adding, removing, reordering, and querying `View3D` instances.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * redGPUContext.addView(view);
 * ```
 *
 * @category Context
 */
declare class RedGPUContextViewContainer {
    #private;
    /**
     * [KO] RedGPUContextViewContainer 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextViewContainer instance.
     */
    constructor();
    /**
     * [KO] 등록된 `View3D` 목록을 반환합니다.
     * [EN] Returns the list of registered `View3D` instances.
     *
     * @returns
     * [KO] `View3D` 배열
     * [EN] Array of `View3D` instances
     */
    get viewList(): View3D[];
    /**
     * [KO] 등록된 `View3D`의 총 개수를 반환합니다.
     * [EN] Returns the total number of registered `View3D` instances.
     *
     * @returns
     * [KO] 등록된 뷰 개수
     * [EN] Number of registered views
     */
    get numViews(): number;
    /**
     * [KO] 지정된 `View3D`가 현재 컨테이너에 포함되어 있는지 확인합니다.
     * [EN] Checks whether the specified `View3D` is contained in the current container.
     *
     * @param child -
     * [KO] 포함 여부를 확인할 `View3D` 인스턴스
     * [EN] `View3D` instance to check
     * @returns
     * [KO] 포함 여부
     * [EN] Whether the view is contained
     */
    contains(child: View3D): boolean;
    /**
     * [KO] 뷰 리스트의 끝에 `View3D`를 추가합니다.
     * [EN] Appends a `View3D` to the end of the view list.
     *
     * @param view -
     * [KO] 추가할 `View3D` 인스턴스
     * [EN] `View3D` instance to add
     * @throws
     * [KO] `view`가 `View3D` 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws an error if `view` is not a `View3D` instance
     */
    addView(view: View3D): void;
    /**
     * [KO] 뷰 리스트의 지정된 인덱스에 `View3D`를 배치합니다.
     * [EN] Places a `View3D` at the specified index in the view list.
     *
     * @param view -
     * [KO] 추가할 `View3D` 인스턴스
     * [EN] `View3D` instance to add
     * @param index -
     * [KO] 배치할 위치 인덱스 (양의 정수)
     * [EN] Target index (unsigned integer)
     * @throws
     * [KO] `view`가 `View3D` 인스턴스가 아니거나 `index`가 유효한 uint 범위가 아닐 경우 에러 발생
     * [EN] Throws an error if `view` is not a `View3D` instance or `index` is not a valid uint
     */
    addViewAt(view: View3D, index: number): void;
    /**
     * [KO] 지정된 인덱스에 위치한 `View3D`를 반환합니다.
     * [EN] Returns the `View3D` at the specified index.
     *
     * @param index -
     * [KO] 조회할 뷰의 인덱스
     * [EN] Index of the view to retrieve
     * @returns
     * [KO] 해당 인덱스의 `View3D` 인스턴스
     * [EN] `View3D` instance at the specified index
     * @throws
     * [KO] `index`가 유효한 uint 범위가 아닐 경우 에러 발생
     * [EN] Throws an error if `index` is not a valid uint
     */
    getViewAt(index: number): View3D;
    /**
     * [KO] 지정된 `View3D`의 인덱스를 반환합니다.
     * [EN] Returns the index of the specified `View3D`.
     *
     * @param view -
     * [KO] 검색할 `View3D` 인스턴스
     * [EN] `View3D` instance to find
     * @returns
     * [KO] 뷰의 인덱스 (존재하지 않으면 `-1`)
     * [EN] Index of the view (`-1` if not found)
     * @throws
     * [KO] `view`가 `View3D` 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws an error if `view` is not a `View3D` instance
     */
    getViewIndex(view: View3D): number;
    /**
     * [KO] 등록된 `View3D`를 뷰 리스트의 지정된 인덱스로 이동합니다.
     * [EN] Moves a registered `View3D` to the specified index in the view list.
     *
     * @param view -
     * [KO] 이동할 `View3D` 인스턴스
     * [EN] `View3D` instance to move
     * @param index -
     * [KO] 이동할 목표 인덱스
     * [EN] Target index to move to
     * @throws
     * [KO] 뷰가 등록되어 있지 않거나 `index`가 리스트 범위를 벗어난 경우 에러 발생
     * [EN] Throws an error if the view is not registered or `index` is out of bounds
     */
    setViewIndex(view: View3D, index: number): void;
    /**
     * [KO] 뷰 리스트에 등록된 두 `View3D`의 순서를 서로 교환합니다.
     * [EN] Swaps the positions of two registered `View3D` instances in the view list.
     *
     * @param view1 -
     * [KO] 교환할 첫 번째 `View3D` 인스턴스
     * [EN] First `View3D` instance to swap
     * @param view2 -
     * [KO] 교환할 두 번째 `View3D` 인스턴스
     * [EN] Second `View3D` instance to swap
     * @throws
     * [KO] 두 뷰 중 하나라도 현재 컨테이너에 등록되어 있지 않은 경우 에러 발생
     * [EN] Throws an error if either view is not registered in this container
     */
    swapViews(view1: View3D, view2: View3D): void;
    /**
     * [KO] 지정된 두 인덱스에 위치한 `View3D`들의 순서를 서로 교환합니다.
     * [EN] Swaps the `View3D` instances at the two specified indices.
     *
     * @param index1 -
     * [KO] 첫 번째 뷰 인덱스
     * [EN] First view index
     * @param index2 -
     * [KO] 두 번째 뷰 인덱스
     * [EN] Second view index
     * @throws
     * [KO] 두 인덱스가 동일하거나 리스트 범위를 벗어난 경우 에러 발생
     * [EN] Throws an error if the indices are identical or out of bounds
     */
    swapViewsAt(index1: number, index2: number): void;
    /**
     * [KO] 뷰 리스트에서 지정된 `View3D`를 제거합니다.
     * [EN] Removes the specified `View3D` from the view list.
     *
     * @param view -
     * [KO] 제거할 `View3D` 인스턴스
     * [EN] `View3D` instance to remove
     * @throws
     * [KO] 해당 뷰가 리스트에 존재하지 않을 경우 에러 발생
     * [EN] Throws an error if the view is not found in the view list
     */
    removeView(view: View3D): void;
    /**
     * [KO] 뷰 리스트에서 지정된 인덱스의 `View3D`를 제거합니다.
     * [EN] Removes the `View3D` at the specified index from the view list.
     *
     * @param index -
     * [KO] 제거할 뷰의 인덱스
     * [EN] Index of the view to remove
     * @throws
     * [KO] `index`가 리스트 범위를 벗어난 경우 에러 발생
     * [EN] Throws an error if `index` is out of range
     */
    removeViewAt(index: number): void;
    /**
     * [KO] 뷰 리스트에 등록된 모든 `View3D`를 제거합니다.
     * [EN] Removes all registered `View3D` instances from the view list.
     */
    removeAllViews(): void;
}
export default RedGPUContextViewContainer;
