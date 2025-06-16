import View3D from "../../display/view/View3D";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * Represents a container class for managing a list of View3D objects in RedGPUContext.
 */
class RedGPUContextViewContainer {
	/**
	 * @name viewList
	 * @type {View3D[]}
	 * @description Represents an array of `View3D` objects.
	 *

	 */
	#viewList: View3D[] = []

	/**
	 * Creates a new instance of the Constructor class.
	 *
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * Returns the list of View3D objects owned by this instance.
	 *
	 * @return {View3D[]} The list of View3D objects.
	 */
	get viewList(): View3D[] {
		return this.#viewList;
	}

	/**
	 * Returns the number of View3D objects owned by this object.
	 *
	 * @returns {number} The number of View3D objects.
	 */
	get numViews(): number {
		return this.#viewList.length;
	}

	/**
	 * Checks if the given child View3D is contained within the current View3D.
	 * @param {View3D} child - The child View3D to check for containment.
	 * @return {boolean} - Returns true if the child View3D is contained, otherwise false.
	 */
	contains(child: View3D): boolean {
		return this.#viewList.includes(child)
	}

	/**
	 * Adds a view to the view list.
	 *
	 * @param {View3D} view - The view to be added.

	 */
	addView(view: View3D) {
		this.#checkViewInstance(view)
		this.#viewList.push(view)
	}

	/**
	 * Adds a view at a specified index in the view list.
	 *
	 * @param {View3D} view - The view to be added.
	 * @param {number} index - The index at which the view should be inserted.

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
	 * Retrieves the view at the specified index.
	 *
	 * @param {number} index - The index of the view to retrieve.
	 * @return {View3D} The view at the specified index.
	 */
	getViewAt(index: number): View3D {
		validateUintRange(index)
		return this.#viewList[index]
	}

	/**
	 * Returns the index of the specified view in the view list.
	 *
	 * @param {View3D} view - The view to search for.
	 * @return {number} - The index of the view in the view list. Returns -1 if the view is not found.
	 */
	getViewIndex(view: View3D): number {
		this.#checkViewInstance(view)
		return this.#viewList.indexOf(view)
	}

	/**
	 * Sets the view at the specified index in the viewList of the RedGPUContext instance.
	 *
	 * @param {View3D} view - The View3D instance to set at the specified index.
	 * @param {number} index - The index at which to set the view.
	 * @throws {Error} If the input view is not registered in the RedGPUContext instance.
	 * @throws {Error} If the index is out of bounds, i.e., greater than or equal to the length of viewList.
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
	 * Swaps the positions of two views in the view list of the RedGPUContext instance.
	 *
	 * @param {View3D} view1 - The first view to be swapped.
	 * @param {View3D} view2 - The second view to be swapped.
	 *
	 * @throws {Error} If either view1 or view2 is not an instance of the View3D class.
	 * @throws {Error} If either view1 or view2 is not a child of this RedGPUContext instance.
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
	 * Swaps two views at the specified indices in the view list.
	 *
	 * @param {number} index1 - The index of the first view to swap.
	 * @param {number} index2 - The index of the second view to swap.
	 * @throws {Error} - If either index1 or index2 is not a positive integer.
	 *                  If either index1 or index2 is larger than or equal to the length of the view list.
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
	 * Removes a view from the view list.
	 *
	 * @param {View3D} view - The view to be removed.

	 */
	removeView(view: View3D) {
		this.#checkViewInstance(view)
		const index = this.#viewList.indexOf(view)
		if (index > -1) this.#viewList.splice(index, 1);
		else consoleAndThrowError('View3D is not found in the view list.');
	}

	/**
	 * Removes the view at the specified index from the view list.
	 *
	 * @param {number} index - The index of the view to remove.
	 * @throws {Error} - Throws an error if the index is out of range.
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
	 * Removes all views from the view list.

	 */
	removeAllViews() {
		this.#viewList.length = 0
	}

	#checkViewInstance(view: View3D) {
		if (!(view instanceof View3D)) consoleAndThrowError('allow only View3D instance')
	}
}

export default RedGPUContextViewContainer
