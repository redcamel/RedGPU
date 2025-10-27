import View3D from "../../display/view/View3D";
/**
 * `RedGPUContextViewContainer` 클래스는 RedGPUContext의 뷰(View3D) 관리를 담당합니다.
 * - 뷰 추가, 제거, 조회 및 순서 변경 등의 기능을 제공합니다.
 * - 각 뷰는 RedGPUContext에 종속되며, 뷰 리스트를 통해 관리됩니다.
 */
declare class RedGPUContextViewContainer {
    #private;
    /**
     * Creates a new instance of the Constructor class.
     *
     * @constructor
     */
    constructor();
    /**
     * Returns the list of View3D objects owned by this instance.
     *
     * @return {View3D[]} The list of View3D objects.
     */
    get viewList(): View3D[];
    /**
     * Returns the number of View3D objects owned by this object.
     *
     * @returns {number} The number of View3D objects.
     */
    get numViews(): number;
    /**
     * Checks if the given child View3D is contained within the current View3D.
     * @param {View3D} child - The child View3D to check for containment.
     * @return {boolean} - Returns true if the child View3D is contained, otherwise false.
     */
    contains(child: View3D): boolean;
    /**
     * Adds a view to the view list.
     *
     * @param {View3D} view - The view to be added.

     */
    addView(view: View3D): void;
    /**
     * Adds a view at a specified index in the view list.
     *
     * @param {View3D} view - The view to be added.
     * @param {number} index - The index at which the view should be inserted.

     */
    addViewAt(view: View3D, index: number): void;
    /**
     * Retrieves the view at the specified index.
     *
     * @param {number} index - The index of the view to retrieve.
     * @return {View3D} The view at the specified index.
     */
    getViewAt(index: number): View3D;
    /**
     * Returns the index of the specified view in the view list.
     *
     * @param {View3D} view - The view to search for.
     * @return {number} - The index of the view in the view list. Returns -1 if the view is not found.
     */
    getViewIndex(view: View3D): number;
    /**
     * Sets the view at the specified index in the viewList of the RedGPUContext instance.
     *
     * @param {View3D} view - The View3D instance to set at the specified index.
     * @param {number} index - The index at which to set the view.
     * @throws {Error} If the input view is not registered in the RedGPUContext instance.
     * @throws {Error} If the index is out of bounds, i.e., greater than or equal to the length of viewList.
     */
    setViewIndex(view: View3D, index: number): void;
    /**
     * Swaps the positions of two views in the view list of the RedGPUContext instance.
     *
     * @param {View3D} view1 - The first view to be swapped.
     * @param {View3D} view2 - The second view to be swapped.
     *
     * @throws {Error} If either view1 or view2 is not an instance of the View3D class.
     * @throws {Error} If either view1 or view2 is not a child of this RedGPUContext instance.
     */
    swapViews(view1: View3D, view2: View3D): void;
    /**
     * Swaps two views at the specified indices in the view list.
     *
     * @param {number} index1 - The index of the first view to swap.
     * @param {number} index2 - The index of the second view to swap.
     * @throws {Error} - If either index1 or index2 is not a positive integer.
     *                  If either index1 or index2 is larger than or equal to the length of the view list.
     */
    swapViewsAt(index1: number, index2: number): void;
    /**
     * Removes a view from the view list.
     *
     * @param {View3D} view - The view to be removed.

     */
    removeView(view: View3D): void;
    /**
     * Removes the view at the specified index from the view list.
     *
     * @param {number} index - The index of the view to remove.
     * @throws {Error} - Throws an error if the index is out of range.
     */
    removeViewAt(index: number): void;
    /**
     * Removes all views from the view list.

     */
    removeAllViews(): void;
}
export default RedGPUContextViewContainer;
