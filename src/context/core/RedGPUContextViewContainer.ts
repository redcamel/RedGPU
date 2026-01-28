import View3D from "../../display/view/View3D";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] View3D 객체들을 관리하는 컨테이너 클래스입니다.
 * [EN] Container class that manages View3D objects.
 *
 * [KO] 뷰의 추가, 제거, 순서 변경 및 조회를 담당합니다.
 * [EN] Handles adding, removing, reordering, and retrieving views.
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
class RedGPUContextViewContainer {
    /**
     * [KO] View3D 객체 배열
     * [EN] Array of View3D objects
     */
    #viewList: View3D[] = []

    /**
     * [KO] RedGPUContextViewContainer 생성자
     * [EN] RedGPUContextViewContainer constructor
     */
    constructor() {
    }

    /**
     * [KO] 이 인스턴스가 소유한 View3D 목록을 반환합니다.
     * [EN] Returns the list of View3D objects owned by this instance.
     */
    get viewList(): View3D[] {
        return this.#viewList;
    }

    /**
     * [KO] 소유한 View3D 객체의 개수를 반환합니다.
     * [EN] Returns the number of View3D objects owned.
     */
    get numViews(): number {
        return this.#viewList.length;
    }

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
    contains(child: View3D): boolean {
        return this.#viewList.includes(child)
    }

    /**
     * [KO] 뷰 리스트에 뷰를 추가합니다.
     * [EN] Adds a view to the view list.
     * @param view -
     * [KO] 추가할 View3D 객체
     * [EN] View3D object to add
     */
    addView(view: View3D) {
        this.#checkViewInstance(view)
        this.#viewList.push(view)
    }

    /**
     * [KO] 뷰 리스트의 지정된 인덱스에 뷰를 추가합니다.
     * [EN] Adds a view at the specified index in the view list.
     * @param view -
     * [KO] 추가할 View3D 객체
     * [EN] View3D object to add
     * @param index -
     * [KO] 삽입할 인덱스
     * [EN] Index to insert at
     */
    addViewAt(view: View3D, index: number) {
        this.#checkViewInstance(view);
        validateUintRange(index);
        const length = this.#viewList.length;
        const indexIsOutOfBounds = length < index;
        if (indexIsOutOfBounds) index = length;
        this.#viewList[index] = view
    }

    /**
     * [KO] 지정된 인덱스의 뷰를 반환합니다.
     * [EN] Retrieves the view at the specified index.
     * @param index -
     * [KO] 조회할 뷰의 인덱스
     * [EN] Index of the view to retrieve
     */
    getViewAt(index: number): View3D {
        validateUintRange(index)
        return this.#viewList[index]
    }

    /**
     * [KO] 지정된 뷰의 인덱스를 반환합니다.
     * [EN] Returns the index of the specified view.
     * @param view -
     * [KO] 검색할 View3D 객체
     * [EN] View3D object to search for
     */
    getViewIndex(view: View3D): number {
        this.#checkViewInstance(view)
        return this.#viewList.indexOf(view)
    }

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
    setViewIndex(view: View3D, index: number) {
        this.#checkViewInstance(view)
        validateUintRange(index)
        const len = this.#viewList.length
        const indexIsOutOfBounds = index >= len;
        const viewIndex = this.#viewList.indexOf(view)
        if (viewIndex === -1) consoleAndThrowError(`입력하신 View 는 RedGPUContext instance 에 등록되지 않은 View 입니다.`)
        if (indexIsOutOfBounds) consoleAndThrowError(`index must be smaller than the viewList length. / index : ${index} / this.#viewList.length : ${len}`)
        // Remove the child from its current position
        this.#viewList.splice(viewIndex, 1);
        // Insert the child at the new position
        this.#viewList.splice(index, 0, view);
    }

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
    swapViews(view1: View3D, view2: View3D) {
        this.#checkViewInstance(view1)
        this.#checkViewInstance(view2)
        const index1 = this.#viewList.indexOf(view1)
        const index2 = this.#viewList.indexOf(view2)
        if (index1 === -1 || index2 === -1) consoleAndThrowError(`${index1 === -1 ? 'view1' : 'view2'} is not child of this RedGPUContext instance.`)
        this.swapViewsAt(index1, index2)
    }

    /**
     * [KO] 지정된 인덱스에 있는 두 뷰의 위치를 교환합니다.
     * [EN] Swaps the positions of two views at the specified indices.
     * @param index1 -
     * [KO] 첫 번째 인덱스
     * [EN] First index
     * @param index2 -
     * [KO] 두 번째 인덱스
     * [EN] Second index
     */
    swapViewsAt(index1: number, index2: number) {
        if (index1 === index2) consoleAndThrowError('The indices to swap cannot be the same.');
        validateUintRange(index1);
        validateUintRange(index2);
        const len = this.#viewList.length;
        if (index1 >= len || index2 >= len) consoleAndThrowError(`index1, index2 must be smaller than the viewList length. / index1 : ${index1} / index2 : ${index2} / this.#viewList.length : ${len}`);
        const t1: View3D = this.#viewList[index1];
        this.#viewList[index1] = this.#viewList[index2];
        this.#viewList[index2] = t1;
    }

    /**
     * [KO] 뷰 리스트에서 지정된 뷰를 제거합니다.
     * [EN] Removes the specified view from the view list.
     * @param view -
     * [KO] 제거할 View3D 객체
     * [EN] View3D object to remove
     */
    removeView(view: View3D) {
        this.#checkViewInstance(view)
        const index = this.#viewList.indexOf(view)
        if (index > -1) this.#viewList.splice(index, 1);
        else consoleAndThrowError('View3D is not found in the view list.');
    }

    /**
     * [KO] 뷰 리스트에서 지정된 인덱스의 뷰를 제거합니다.
     * [EN] Removes the view at the specified index from the view list.
     * @param index -
     * [KO] 제거할 뷰의 인덱스
     * [EN] Index of the view to remove
     */
    removeViewAt(index: number) {
        validateUintRange(index)
        const len = this.#viewList.length;
        if (index < len) {
            this.#viewList.splice(index, 1);
        } else {
            consoleAndThrowError(`Index ${index} is out of range. View list length is ${len}.`);
        }
    }

    /**
     * [KO] 뷰 리스트의 모든 뷰를 제거합니다.
     * [EN] Removes all views from the view list.
     */
    removeAllViews() {
        this.#viewList.length = 0
    }

    /**
     * [KO] View3D 인스턴스인지 확인합니다. (내부용)
     * [EN] Checks if it is a View3D instance. (Internal use)
     */
    #checkViewInstance(view: View3D) {
        if (!(view instanceof View3D)) consoleAndThrowError('allow only View3D instance')
    }
}

export default RedGPUContextViewContainer