import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist";

const redUnit = new RedUnit('RedGPU - Object3DContainer');

RedGPU.init(document.createElement('canvas'), (redGPUContext) => {

	redUnit.testGroup('Object3DContainer - addChild Tests', (runner) => {
		runner.defineTest('Object3DContainer - addChild', function (run) {
			console.log(RedGPU)
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);
			object3DContainer.addChild(child);
			run(object3DContainer.children.includes(child));
		}, true);
		runner.defineTest('object3DContainer - addChild', function (run) {
			console.log(RedGPU)
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1
			object3DContainer.addChild(child1);

			// Test if child1 has been added
			const test1 = object3DContainer.children.includes(child1);

			// Add child2
			object3DContainer.addChild(child2);

			// Test if child2 has been added, and child1 is still present
			const test2 = object3DContainer.children.includes(child1) && object3DContainer.children.includes(child2);

			// Fail the test if either test1 or test2 failed
			run(test1 && test2);
		}, true);

		runner.defineTest('Object3DContainer - addChild order', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Check if children are added in correct order
			const index1 = object3DContainer.children.indexOf(child1);
			const index2 = object3DContainer.children.indexOf(child2);

			// Confirm that child1 comes before child2
			const testOrder = index1 < index2;

			run(testOrder);
		}, true);

		runner.defineTest('Object3DContainer - addChild parent', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child
			object3DContainer.addChild(child);

			// Check if parent of the child is set correctly
			const parentIsSetCorrectly = child.parent === object3DContainer;

			run(parentIsSetCorrectly);
		}, true);

		runner.defineTest('Object3DContainer - addChild moves child', function (run) {
			const firstParent = new RedGPU.Display.Object3DContainer();
			const secondParent = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add the child to the first parent
			firstParent.addChild(child);

			// Now add it to the second parent
			secondParent.addChild(child);

			// The child should now be associated with the second parent, and no longer with the first
			const childRemovedFromFirstParent = !firstParent.children.includes(child);
			const childAddedToSecondParent = secondParent.children.includes(child);

			run(childRemovedFromFirstParent && childAddedToSecondParent);
		}, true);

		runner.defineTest('Object3DContainer - addChild prevents duplication', function (run) {
			const parent = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add the child multiple times
			parent.addChild(child);
			parent.addChild(child);

			// Ensure the child was not added twice
			const childrenCountIsCorrect = parent.children.length === 1;

			run(childrenCountIsCorrect);
		}, true);
		runner.defineTest('Object3DContainer - addChild maintains hierarchy', function (run) {
			const grandParent = new RedGPU.Display.Object3DContainer();
			const parent = new RedGPU.Display.Mesh(redGPUContext);
			const child = new RedGPU.Display.Mesh(redGPUContext);

			grandParent.addChild(parent);
			parent.addChild(child);

			// Check if grandParent's child is parent and parent's child is child
			const hierarchyIsCorrect = grandParent.children[0] === parent && parent.children[0] === child;

			run(hierarchyIsCorrect);
		}, true);
		runner.defineTest('Object3DContainer - addChild maintains hierarchy', function (run) {
			const grandParent = new RedGPU.Display.Object3DContainer();
			const parent = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			grandParent.addChild(parent);
			parent.addChild(child);

			// Check if grandParent's child is parent and parent's child is child
			const hierarchyIsCorrect = grandParent.children[0] === parent && parent.children[0] === child;

			run(hierarchyIsCorrect);
		}, true);
		runner.defineTest('Object3DContainer - removeChild clears parent', function (run) {
			const parent = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add and remove the child
			parent.addChild(child);
			parent.removeChild(child);

			// Check if child's parent property is null
			const parentIsCleared = child.parent === null;

			run(parentIsCleared);
		}, true);
	});

	redUnit.testGroup('Object3DContainer - addChildAt Tests', (runner) => {
		runner.defineTest('Object3DContainer - addChildAt correct order', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);
			const child3 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1
			object3DContainer.addChild(child1);
			// Add child2
			object3DContainer.addChild(child2);
			// Add child3 at position 1
			object3DContainer.addChildAt(child3, 1);

			// Check if children are added in correct order
			const index1 = object3DContainer.children.indexOf(child1);
			const index2 = object3DContainer.children.indexOf(child2);
			const index3 = object3DContainer.children.indexOf(child3);

			// Confirm that child1 comes before child3 and child3 comes before child2
			const isCorrectOrder = index1 < index3 && index3 < index2;

			run(isCorrectOrder);
		}, true);

		runner.defineTest('Object3DContainer - addChildAt at zero index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1
			object3DContainer.addChild(child1);

			// Add child2 at position 0
			object3DContainer.addChildAt(child2, 0);

			// Check if child2 is now the first child
			const isFirstChild = object3DContainer.children[0] === child2;

			run(isFirstChild);
		}, true);

		runner.defineTest('Object3DContainer - addChildAt with same child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Expect an error when adding same child
			try {
				object3DContainer.addChildAt(child, 0);
				object3DContainer.addChildAt(child, 1);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, true);

		runner.defineTest('Object3DContainer - addChildAt with same child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);
			object3DContainer.addChildAt(child, 0);
			object3DContainer.addChildAt(child, 1);
			console.log('object3DContainer', object3DContainer.children)
			run(object3DContainer.numChildren === 1)
		}, true);

		runner.defineTest('Object3DContainer - addChildAt with index larger than children count', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1
			object3DContainer.addChild(child1);

			// Try adding child2 at position that is out of range
			object3DContainer.addChildAt(child2, 999); // assuming the children count is less than 999

			// Check if child2 is the last child
			const isLastChild = object3DContainer.children[object3DContainer.children.length - 1] === child2;

			run(isLastChild);
		}, true);
		runner.defineTest('Object3DContainer - addChildAt with index larger than children count', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1
			object3DContainer.addChild(child1);

			// Try adding child2 at position that is out of range
			object3DContainer.addChildAt(child2, 999); // assuming the children count is less than 999

			run(object3DContainer.children.length === 2);
		}, true);

		runner.defineTest('Object3DContainer - addChildAt and removeChild', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child
			object3DContainer.addChildAt(child, 0);
			// Remove child
			object3DContainer.removeChild(child);

			// Check if child is correctly removed
			const isChildRemoved = !object3DContainer.children.includes(child);

			run(isChildRemoved);
		}, true);

		runner.defineTest('Object3DContainer - multiple addChildAt operations', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);
			const child3 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1 at position 0
			object3DContainer.addChildAt(child1, 0);

			// Add child2 at position 0
			object3DContainer.addChildAt(child2, 0);

			// Add child3 at position 1
			object3DContainer.addChildAt(child3, 1);

			// Check if children are in expected positions
			const isCorrectOrder = object3DContainer.children[0] === child2 &&
				object3DContainer.children[1] === child3 &&
				object3DContainer.children[2] === child1;

			run(isCorrectOrder);
		}, true);
	});

	redUnit.testGroup('Object3DContainer - addChildAt Tests - Failure Cases', (runner) => {

		runner.defineTest('Object3DContainer - addChildAt negative index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Expect an error when adding a child at a negative index
			try {
				object3DContainer.addChildAt(child, -1);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('Object3DContainer - addChildAt with non-Mesh/Container', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const notChild = {};

			try {
				object3DContainer.addChildAt(notChild, 0);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);
	});

	redUnit.testGroup('Object3DContainer - getChildAt Tests', (runner) => {
		runner.defineTest('Object3DContainer - getChildAt valid index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child at index 0
			object3DContainer.addChild(child);
			// Get child at index 0
			const getChild = object3DContainer.getChildAt(0);

			run(getChild === child);
		}, true);
		runner.defineTest('getChildAt return value - multiple children', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Get children
			const getChild1 = object3DContainer.getChildAt(0);
			const getChild2 = object3DContainer.getChildAt(1);

			run(getChild1 === child1 && getChild2 === child2); // Test if the children retrieved are as per the order they were added.
		}, true);
		runner.defineTest('getChildAt invalid index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child at index 0
			object3DContainer.addChild(child);

			// Check if getting child at an invalid index returns null
			const result = object3DContainer.getChildAt(2);
			run(result === undefined); // Test passes if result is null
		}, true);
	});

	redUnit.testGroup('Object3DContainer - getChildAt Failure Cases', (runner) => {
		// The following test sets are meant to check cases where getChildAt is supposed to fail.

		runner.defineTest('getChildAt - undefined index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add a child
			object3DContainer.addChild(child);

			// Expect an error when getting child at an undefined index
			try {
				object3DContainer.getChildAt(undefined);
				run(true);
			} catch (error) {
				run(false, error); // If an error is thrown, the test passes
			}
		}, false);

		runner.defineTest('getChildAt - negative index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add a child
			object3DContainer.addChild(child);

			// Expect an error when getting child at an negative index
			try {
				object3DContainer.getChildAt(-1);
				run(true);
			} catch (error) {
				run(false, error); // If an error is thrown, the test passes
			}
		}, false);

		runner.defineTest('getChildAt - string index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add a child
			object3DContainer.addChild(child);

			// Expect an error when getting child at a string index
			try {
				object3DContainer.getChildAt('0');
				run(true);
			} catch (error) {
				run(false, error); // If an error is thrown, the test passes
			}
		}, false);
	});

	redUnit.testGroup('Object3DContainer - getChildIndex Success Cases', (runner) => {
		runner.defineTest('getChildIndex - valid child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add the child
			object3DContainer.addChild(child);

			// Get the index of the child
			const index = object3DContainer.getChildIndex(child);

			run(index === 0); // Test if the index of the child is 0
		}, true);

		runner.defineTest('getChildIndex - multiple children', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add multiple children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Get the indexes of the children
			const index1 = object3DContainer.getChildIndex(child1);
			const index2 = object3DContainer.getChildIndex(child2);

			run(index1 === 0 && index2 === 1); // Test if the indexes are correct
		}, true);

		runner.defineTest('getChildIndex - after removeChild', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add multiple children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Remove the first child
			object3DContainer.removeChild(child1);

			// Get the index of the second child
			const index = object3DContainer.getChildIndex(child2);

			run(index === 0); // Test if the index is correct after removing a child
		}, true);

		runner.defineTest('getChildIndex - not added child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Do not add the child

			// Expect -1 when getting the index of a child not added
			const index = object3DContainer.getChildIndex(child);

			run(index); // Test if the index is -1
		}, -1);

		runner.defineTest('getChildIndex - child not in this container', function (run) {
			const object3DContainer1 = new RedGPU.Display.Object3DContainer();
			const object3DContainer2 = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child to the first container
			object3DContainer1.addChild(child);

			const index = object3DContainer2.getChildIndex(child);

			run(index);
		}, -1);
	});

	redUnit.testGroup('Object3DContainer - getChildIndex Failure Cases', (runner) => {

		runner.defineTest('getChildIndex - null child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();

			// Expect an error when getting the index of null
			try {
				object3DContainer.getChildIndex(null);
				run(true);
			} catch (error) {
				run(false, error); // If an error is thrown, the test passes
			}
		}, false);

		runner.defineTest('getChildIndex - undefined child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();

			// Expect an error when getting the index of undefined
			try {
				object3DContainer.getChildIndex(undefined);
				run(true);
			} catch (error) {
				run(false, error); // If an error is thrown, the test passes
			}
		}, false);

	});

	redUnit.testGroup('Object3DContainer - setChildIndex Success Cases', (runner) => {

		runner.defineTest('setChildIndex - move first child to the end', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add two children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Move the first child to the end
			object3DContainer.setChildIndex(child1, 1);

			const index1 = object3DContainer.getChildIndex(child1);
			const index2 = object3DContainer.getChildIndex(child2);

			run(index1 === 1 && index2 === 0); // Test if the child has been moved to the end correctly
		}, true);

		runner.defineTest('setChildIndex - move last child to the beginning', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add two children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Move the last child to the beginning
			object3DContainer.setChildIndex(child2, 0);

			const index1 = object3DContainer.getChildIndex(child1);
			const index2 = object3DContainer.getChildIndex(child2);

			run(index1 === 1 && index2 === 0); // Test if the child has been moved to the beginning correctly
		}, true);
		runner.defineTest('setChildIndex - change index of added child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add the child and change its index
			object3DContainer.addChild(child);
			object3DContainer.setChildIndex(child, 0);  // Setting the index to 0

			const index = object3DContainer.getChildIndex(child);

			run(index === 0); // Test if the index has been changed correctly
		}, true);

		runner.defineTest('setChildIndex - setting index 0 does not move child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);

			// Add a child
			object3DContainer.addChild(child1);

			// Set the index of the child to 0 (same as the current index)
			object3DContainer.setChildIndex(child1, 0);

			const index = object3DContainer.getChildIndex(child1);

			run(index === 0); // Check if the child remains at the same index
		}, true);
	});

	redUnit.testGroup('Object3DContainer - setChildIndex Failure Cases', (runner) => {

		runner.defineTest('setChildIndex - set index out of range', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add the child
			object3DContainer.addChild(child);

			// Attempt to set an out-of-range index
			try {
				object3DContainer.setChildIndex(child, 2);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error);  // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('setChildIndex - set index for not added child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Attempt to set an index for a child not added
			try {
				object3DContainer.setChildIndex(child, 0);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error);  // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('setChildIndex - set negative index', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child);

			// Attempt to set a negative index
			try {
				object3DContainer.setChildIndex(child, -1);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error);  // The test should pass if an error is thrown
			}
		}, false);

	});

	redUnit.testGroup('Object3DContainer - swapChildren Success Cases', (runner) => {

		runner.defineTest('swapChildren - swap two children successfully', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add two children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Swap two children
			object3DContainer.swapChildren(child1, child2);

			const index1 = object3DContainer.getChildIndex(child1);
			const index2 = object3DContainer.getChildIndex(child2);

			run(index1 === 1 && index2 === 0); // Test if the children have been swapped correctly
		}, true);

	});
	redUnit.testGroup('Object3DContainer - swapChildren Failure Cases', (runner) => {

		runner.defineTest('swapChildren - swap a not added child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add only one child
			object3DContainer.addChild(child1);

			// Attempt to swap a not added child
			try {
				object3DContainer.swapChildren(child1, child2);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('swapChildren - swap the same child', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add a child
			object3DContainer.addChild(child);

			// Attempt to swap the same child
			try {
				object3DContainer.swapChildren(child, child);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);
		runner.defineTest('swapChildren - first child not added', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child2);

			try {
				object3DContainer.swapChildren(child1, child2);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('swapChildren - second child not added', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child1);

			try {
				object3DContainer.swapChildren(child1, child2);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('swapChildren - both children not added', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			try {
				object3DContainer.swapChildren(child1, child2);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);
	});

	redUnit.testGroup('Object3DContainer - swapChildrenAt Success Cases', (runner) => {

		runner.defineTest('swapChildrenAt - Swap first child with the last', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add two children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			// Swap the first child with the last
			object3DContainer.swapChildrenAt(0, 1);

			const index1 = object3DContainer.getChildIndex(child1);
			const index2 = object3DContainer.getChildIndex(child2);

			run(index1 === 1 && index2 === 0); // Test if the children have been swapped correctly
		}, true);

		runner.defineTest('swapChildrenAt - Swap two children in the middle', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);
			const child3 = new RedGPU.Display.Mesh(redGPUContext);
			const child4 = new RedGPU.Display.Mesh(redGPUContext);

			// Add four children
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);
			object3DContainer.addChild(child3);
			object3DContainer.addChild(child4);

			// Swap the second child with the third
			object3DContainer.swapChildrenAt(1, 2);

			const index2 = object3DContainer.getChildIndex(child2);
			const index3 = object3DContainer.getChildIndex(child3);

			run(index2 === 2 && index3 === 1); // Test if the children have been swapped correctly
		}, true);

	});
	redUnit.testGroup('Object3DContainer - swapChildrenAt Failure Cases', (runner) => {

		runner.defineTest('swapChildrenAt - invalid index provided', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child);

			try {
				object3DContainer.swapChildrenAt(1, -1); // Negative index is not allowed
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('swapChildrenAt - same index passed twice', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);

			try {
				object3DContainer.swapChildrenAt(1, 1); // Attempting to swap the child with itself
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);

		runner.defineTest('swapChildrenAt - index out of bounds', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child);

			try {
				object3DContainer.swapChildrenAt(1, 2); // There is no child at index 2
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);
	});
	redUnit.testGroup('Object3DContainer - removeChild Success Cases', (runner) => {

		runner.defineTest('removeChild - child successfully removed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child);
			try {
				object3DContainer.removeChild(child);
				const hasChild = object3DContainer.contains(child);
				if (!hasChild) {
					run(true); // The test should pass if the child has been successfully removed
				} else {
					run(false, "Error: Child was not removed from container");
				}

			} catch (error) {
				run(false, error);
			}
		}, true);
	});

	redUnit.testGroup('Object3DContainer - removeChild Failure Cases', (runner) => {

		runner.defineTest('removeChild - non-child object passed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);
			const notAChild = new RedGPU.Display.Mesh(redGPUContext);

			object3DContainer.addChild(child);
			try {
				object3DContainer.removeChild(notAChild);
				run(true); // The test should fail if no error is thrown
			} catch (error) {
				run(false, error); // The test should pass if an error is thrown
			}
		}, false);
	});

	redUnit.testGroup('Object3DContainer - removeChildAt Success Cases', (runner) => {

		runner.defineTest('removeChildAt - child successfully removed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child to container
			object3DContainer.addChild(child);
			try {
				// Remove child at index 0
				const removedChild = object3DContainer.removeChildAt(0);
				// Assert the returned child is equal to the original child
				// And the container does not contain the child anymore
				if (removedChild === child && !object3DContainer.contains(child)) {
					run(true);
				} else {
					run(false, "Error: Child was not correctly removed from container");
				}

			} catch (error) {
				run(false, error);
			}
		}, true);
	});

	redUnit.testGroup('Object3DContainer - removeChildAt Failure Cases', (runner) => {

		runner.defineTest('removeChildAt - invalid index passed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child = new RedGPU.Display.Mesh(redGPUContext);

			// Add child to container
			object3DContainer.addChild(child);
			try {
				// Remove child at non-existent index 1
				object3DContainer.removeChildAt(1);
				run(true); // The test should fail if no error is thrown

			} catch (error) {
				// The test should pass if an error is thrown, as expected
				run(false, 'Error: No child found at provided index: 1');
			}
		}, false);
	});

	redUnit.testGroup('Object3DContainer - removeAllChildren Success Cases', (runner) => {

		runner.defineTest('removeAllChildren - all children successfully removed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1 and child2 to container
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);
			try {
				// Remove all children
				object3DContainer.removeAllChildren();
				// Assert the container does not contain child1 and child2 anymore
				if (!object3DContainer.contains(child1) && !object3DContainer.contains(child2)) {
					run(true);
				} else {
					run(false, "Error: Not all children were removed from container");
				}

			} catch (error) {
				run(false, error);
			}
		}, true);

		runner.defineTest('removeAllChildren - all children successfully removed', function (run) {
			const object3DContainer = new RedGPU.Display.Object3DContainer();
			const child1 = new RedGPU.Display.Mesh(redGPUContext);
			const child2 = new RedGPU.Display.Mesh(redGPUContext);

			// Add child1 and child2 to container
			object3DContainer.addChild(child1);
			object3DContainer.addChild(child2);
			object3DContainer.removeAllChildren()
			run(object3DContainer.numChildren)

			redGPUContext.destroy()
		}, 0);
	});
})

