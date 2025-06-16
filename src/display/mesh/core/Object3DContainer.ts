import {mat4} from "gl-matrix";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Mesh from "../Mesh";
import MeshBase from "../MeshBase";

/**
 * A container that holds multiple objects of type Mesh.
 */
class Object3DContainer {
	modelMatrix: mat4 = mat4.create()
	/**
	 * An array of Mesh elements representing the children of a parent object.
	 *
	 * @type {Mesh[]}
	 */
	#children: Mesh[] = []

	/**
	 * Creates a new instance of the Constructor.
	 *
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * Retrieve the array of child objects attached to this object.
	 *
	 * @return {Mesh[]} The array of child objects.
	 */
	get children(): Mesh[] {
		return this.#children;
	}

	/**
	 * Returns the number of children of the object.
	 *
	 * @returns {number} The number of children.
	 */
	get numChildren(): number {
		return this.#children.length;
	}

	/**
	 * Checks if the given child Mesh is contained within the current object.
	 *
	 * @param {Mesh} child - The child Mesh to be checked.
	 * @returns {boolean} - Returns true if the child Mesh is contained, otherwise returns false.
	 */
	contains(child: Mesh): boolean {
		this.#checkObject3DInstance(child)
		return this.#children.includes(child)
	}

	/**
	 * Adds a child Mesh to the current Mesh instance.
	 *
	 * @param {Mesh} child - The child Mesh to be added.
	 * @return {Mesh} - The added child Mesh if successful, null otherwise.
	 */
	addChild(child: Mesh): Mesh {
		// Check if `child` is an instance of Mesh
		this.#checkObject3DInstance(child);
		if (this.#assignChild(child)) {
			this.#children.push(child);
			child.dirtyTransform = true
			return child;
		} else {
			console.log(`Failed to assign child. The child could not be removed from its previous parent.`);
			return null;
		}
	}

	/**
	 * Add a child to the parent at a specific index.
	 *
	 * @param {Mesh} child - The child to be added to the parent.
	 * @param {number} index - The index at which the child should be added.
	 * @return {this} - The parent object.
	 */
	addChildAt(child: Mesh, index: number) {
		validateUintRange(index)
		if (this.#children.length < index) index = this.#children.length;
		// Check if index is within the range [0, children.length]
		if (index < 0 || index > this.#children.length) {
			console.log(`Invalid index. Index should be within 0 and ${this.#children.length}.`);
			return;
		}
		if (this.#assignChild(child)) {
			this.#children.splice(index, 0, child)
		} else {
			console.log(`Failed to assign child. The child could not be removed from its previous parent.`);
			return;
		}
		child.dirtyTransform = true
		return this
	}

	/**
	 * Retrieves the child object at the specified index.
	 *
	 * @param {number} index - The index of the child object to retrieve.
	 * @returns {Mesh} - The child object at the specified index, or null if the index is invalid.
	 */
	getChildAt(index: number): Mesh {
		validateUintRange(index)
		if (index >= this.#children.length || index < 0) {
			console.log(`Invalid index. Index should be within 0 and ${this.#children.length - 1}.`);
			return undefined;
		}
		return this.#children[index]
	}

	/**
	 * Returns the index of a child object within the container.
	 *
	 * @param {Mesh} child - The child object to find the index of.
	 *
	 * @return {number} - The index of the child object within the container. If the child is not found, -1 is returned.
	 */
	getChildIndex(child: Mesh): number {
		this.#checkObject3DInstance(child)
		const index = this.#children.indexOf(child);
		if (index === -1) {
			console.log(`Given object is not a child of this container: ${child}`);
			return -1;
		}
		return index;
	}

	/**
	 * Sets the index of a child object within the object's children array.
	 *
	 * @param {Mesh} child - The child object whose index will be set.
	 * @param {number} index - The new index position for the child object.
	 * @return {void} - This method does not return anything.
	 */
	setChildIndex(child: Mesh, index: number) {
		this.#checkObject3DInstance(child)
		validateUintRange(index)
		const len = this.#children.length
		const indexIsOutOfBounds = index >= len;
		const childIndex = this.#children.indexOf(child)
		if (childIndex === -1) {
			consoleAndThrowError(`The provided is not a child of the Object3DContainer.: ${child}`);
			return
		}
		if (indexIsOutOfBounds) {
			consoleAndThrowError(`Invalid index. Index ${index} is out of bounds. Index should be between 0 and ${len - 1}.`);
			return
		}
		// Remove the child from its current position
		this.#children.splice(childIndex, 1);
		// Insert the child at the new position
		this.#children.splice(index, 0, child);
	}

	/**
	 * Swaps the positions of two children within the Object3DContainer.
	 *
	 * @param {Mesh} child1 - The first child to swap.
	 * @param {Mesh} child2 - The second child to swap.
	 * @throws {Error} If either child is not a child of this Object3DContainer.
	 */
	swapChildren(child1: Mesh, child2: Mesh) {
		this.#checkObject3DInstance(child1)
		this.#checkObject3DInstance(child2)
		if (child1 === child2) {
			consoleAndThrowError("Error: child1 and child2 are the same. Cannot swap a child with itself.");
			return;
		}
		const index1 = this.#children.indexOf(child1)
		const index2 = this.#children.indexOf(child2)
		if (index1 === -1 || index2 === -1) {
			consoleAndThrowError(`Error: ${index1 === -1 ? 'child1' : 'child2'} is not a child of this Object3DContainer.`);
		}
		this.swapChildrenAt(index1, index2)
	}

	/**
	 * Swaps the position of two child objects at the specified indices.
	 *
	 * @param {number} index1 - The index of the first child object.
	 * @param {number} index2 - The index of the second child object.
	 * @throws {Error} - If either index1 or index2 is out of range.
	 */
	swapChildrenAt(index1: number, index2: number) {
		validateUintRange(index1)
		validateUintRange(index2)
		if (index1 === index2) {
			consoleAndThrowError("Error: index1 and index2 are identical. Cannot swap a child with itself.");
		}
		const len = this.#children.length
		if (index1 >= len || index2 >= len) consoleAndThrowError(`Error: Both index1 and index2 should be less than the number of children. Provided index1: ${index1}, index2: ${index2}, number of children: ${len}`);
		let temp: Mesh = this.#children[index1];
		this.#children[index1] = this.#children[index2];
		this.#children[index2] = temp;
	}

	/**
	 * Removes the specified child from the list of children.
	 *
	 * @param {Mesh} child - The child object to be removed.
	 * @return {Mesh} - The removed child object, or null if the child was not found.
	 */
	removeChild(child: Mesh) {
		this.#checkObject3DInstance(child);
		const index = this.#children.indexOf(child);
		if (index > -1) {
			child.parent = null;
			return this.#children.splice(index, 1)[0];
		} else {
			consoleAndThrowError("Error: Child not found within parent.");
		}
	}

	/**
	 * Removes a child at the specified index from the object's children array.
	 * @param {number} index - The index of the child to be removed.
	 * @returns {Mesh } Returns the removed child object, or null if the index is out of range or the child does not exist.
	 */
	removeChildAt(index: number): Mesh {
		validateUintRange(index);
		const child = this.#children[index];
		if (child) {
			child.parent = null;
			return this.#children.splice(index, 1)[0];
		} else {
			throw new Error(`Error: No child found at provided index: ${index}.`);
		}
	}

	/**
	 * Remove all children from the current parent.
	 *
	 * @returns {Object} - The current parent object.
	 */
	removeAllChildren() {
		let i = this.#children.length
		while (i--) {
			this.#children[i].parent = null
		}
		this.#children.length = 0
		return this
	}

	#checkObject3DInstance(target: MeshBase) {
		if (!(target instanceof Object3DContainer)) consoleAndThrowError('allow only Object3DContainer instance.')
	}

	/**
	 * Assigns the given child object to the current object as its parent.
	 *
	 * @param {Mesh} child - The child object to assign.
	 * @returns {boolean} - Returns `true` if the child was successfully assigned, `false` otherwise.
	 */
	#assignChild = (child: Mesh): boolean => {
		this.#checkObject3DInstance(child)
		if (child.parent) {
			if (child.parent?.removeChild(child)) {
				child.parent = this
				return true
			} else {
				return false
			}
		} else {
			child.parent = this
			return true
		}
	}
}

export default Object3DContainer
