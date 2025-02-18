import * as RedGPU from "../../../dist";

RedTest.title = 'RedGPUContextViewContainer Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);
};

const onFailureInitialization = (error) => {
	runTest(false, error);
};
// Success group
RedTest.testGroup(
	"Success Group - contains, numViews",
	function () {

		RedTest.test(`contains method test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)

					redGPUContext.addView(view)
					pass = redGPUContext.contains(view)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`numViews test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)

					pass = redGPUContext.numViews === 2
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);

// Success group
RedTest.testGroup(
	"Success Group - addView",
	function () {

		RedTest.test(`addView test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					pass = redGPUContext.getViewAt(0) === view
					pass = pass && redGPUContext.contains(view)
					pass = pass && redGPUContext.numViews === 1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`addView test - Adding multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					pass = redGPUContext.getViewAt(0) === view1 && redGPUContext.getViewAt(1) === view2
					pass = pass && redGPUContext.contains(view1)
					pass = pass && redGPUContext.contains(view2)
					pass = pass && redGPUContext.numViews === 2
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);
// Failure group
RedTest.testGroup(
	"Failure Group - addView",
	function () {

		RedTest.test(`addView failure test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view;
					redGPUContext.addView(view)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);
	}
);

// Success group
RedTest.testGroup(
	"Success Group - addViewAt",
	function () {

		RedTest.test(`addViewAt test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addViewAt(view, 0)
					pass = redGPUContext.getViewAt(0) === view
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`addViewAt test - Adding view at valid index`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view1)
					redGPUContext.addViewAt(view2, 1)
					pass = redGPUContext.getViewAt(1) === view2
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`addViewAt test - Adding view at valid index2`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view1)
					redGPUContext.addViewAt(view2, 0)
					pass = redGPUContext.getViewAt(0) === view2
					pass = pass && redGPUContext.numViews === 1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`addViewAt test - Adding view at index beyond viewList count`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					let beyondListIndex = redGPUContext.numViews + 1; // index is beyond the end of the viewList
					redGPUContext.addViewAt(view, beyondListIndex)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - addViewAt",
	function () {

		RedTest.test(`addViewAt failure test`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view;
					redGPUContext.addViewAt(view, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`addViewAt test - Adding view at invalid index`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addViewAt(view, -1)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

	}
);

// Adding test for getViewAt
RedTest.testGroup(
	"Success Group - getViewAt",
	function () {

		RedTest.test(`getViewAt test - Single view`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					pass = redGPUContext.getViewAt(0) === view
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewAt test - Multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					pass = redGPUContext.getViewAt(0) === view1 && redGPUContext.getViewAt(1) === view2
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewAt test - Index beyond the view list count`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					pass = redGPUContext.getViewAt(1) === undefined
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewAt failure test - Index out of range`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					const outOfRangeIndex = 10; // index out of range
					pass = redGPUContext.getViewAt(outOfRangeIndex) === undefined
				} catch (e) {
					pass = true
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);
RedTest.testGroup(
	"Failure Group - getViewAt",
	function () {
		RedTest.test(`getViewAt failure test - Non-Uint index (zero)`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					const nonUintIndex = 'zero'; // non-Uint index
					redGPUContext.getViewAt(nonUintIndex)
				} catch (e) {
					pass = true
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewAt failure test - Non-Uint index (2.5)`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					const nonUintIndex = 2.5; // non-Uint index
					redGPUContext.getViewAt(nonUintIndex)
				} catch (e) {
					pass = true
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);
// Success group
RedTest.testGroup(
	"Success Group - getViewIndex",
	function () {
		// Existing test case with single view added.
		RedTest.test(`getViewIndex test - Single view`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					pass = redGPUContext.getViewIndex(view) === 0
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		// Adding a new test case with multiple views.
		RedTest.test(`getViewIndex test - Multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					pass = redGPUContext.getViewIndex(view1) === 0 && redGPUContext.getViewIndex(view2) === 1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewIndex test - View not added to context`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					pass = redGPUContext.getViewIndex(view) === -1
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`getViewIndex test - View added to context but not in the view list`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					redGPUContext.removeView3D(view) // Remove the view from the view list
					pass = redGPUContext.getViewIndex(view) === -1
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - getViewIndex",
	function () {
		RedTest.test(`getViewIndex failure test - Undefined view`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view;
					redGPUContext.getViewIndex(view)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`getViewIndex failure test - not instance of View`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let notViewInstance = {}; // object that is not an instance of View3D
					redGPUContext.getViewIndex(notViewInstance)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);
	}
);

// Success group
RedTest.testGroup(
	"Success Group - setViewIndex",
	function () {
		RedTest.test(`setViewIndex test - Single view`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)

					const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view1)
					redGPUContext.setViewIndex(view1, 0)
					pass = redGPUContext.getViewAt(0) === view1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`setViewIndex test - Multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					redGPUContext.setViewIndex(view1, 1)
					pass = redGPUContext.getViewAt(0) === view2 && redGPUContext.getViewAt(1) === view1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - setViewIndex",
	function () {
		RedTest.test(`setViewIndex failure test - Undefined view`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view;
					redGPUContext.setViewIndex(view, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`setViewIndex failure test - not instance of View`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let notViewInstance = {}; // object that is not an instance of View3D
					redGPUContext.setViewIndex(notViewInstance, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`setViewIndex failure test - Index beyond the view list count`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					let beyondListIndex = redGPUContext.numViews + 1; // index is beyond the end of the viewList
					redGPUContext.setViewIndex(view, beyondListIndex)
					pass = redGPUContext.getViewAt(beyondListIndex) === view
					console.log('redGPUContext.viewList', redGPUContext.viewList)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`setViewIndex failure test - Negative index`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					let negativeIndex = -1; // negative index
					redGPUContext.setViewIndex(view, negativeIndex)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`setViewIndex failure test - Index is not a number`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					let notANumberIndex = 'not a number'; // index is not a number
					redGPUContext.setViewIndex(view, notANumberIndex)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`setViewIndex failure test - View is not added to the context`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					let index = 0;
					redGPUContext.setViewIndex(view, index)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);
	}
);

// Success group
RedTest.testGroup(
	"Success Group - swapViews",
	function () {
		RedTest.test(`swapViews test - Multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					redGPUContext.swapViews(view1, view2)
					pass = redGPUContext.getViewAt(0) === view2 && redGPUContext.getViewAt(1) === view1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - swapViews",
	function () {
		RedTest.test(`swapViews failure test - Undefined views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view1, view2;
					redGPUContext.swapViews(view1, view2)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViews failure test - One view is undefined`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera = new RedGPU.Display.Camera(redGPUContext)
				const scene = new RedGPU.Display.Scene(redGPUContext)
				const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera)
				try {
					let view2;
					redGPUContext.swapViews(view1, view2)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViews failure test - Not instances of View`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view1 = {}; // object that is not an instance of View3D
					let view2 = {}; // object that is not an instance of View3D
					redGPUContext.swapViews(view1, view2)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViews failure test - Views not added to the context`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera1 = new RedGPU.Display.Camera(redGPUContext)
				const scene1 = new RedGPU.Display.Scene(redGPUContext)
				const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

				const camera2 = new RedGPU.Display.Camera(redGPUContext)
				const scene2 = new RedGPU.Display.Scene(redGPUContext)
				const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)
				try {
					redGPUContext.swapViews(view1, view2)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

	}
);

// Success group
RedTest.testGroup(
	"Success Group - swapViewsAt",
	function () {
		RedTest.test(`swapViewsAt test - Multiple views`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					redGPUContext.swapViewsAt(0, 1)
					pass = redGPUContext.getViewAt(0) === view2 && redGPUContext.getViewAt(1) === view1
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - swapViewsAt",
	function () {
		RedTest.test(`swapViewsAt failure test - One or both indices are out of bounds (index1)`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera = new RedGPU.Display.Camera(redGPUContext)
				const scene = new RedGPU.Display.Scene(redGPUContext)
				const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
				redGPUContext.addView(view)
				try {
					redGPUContext.swapViewsAt(0, 10)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViewsAt failure test - One or both indices are out of bounds(index2)`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera = new RedGPU.Display.Camera(redGPUContext)
				const scene = new RedGPU.Display.Scene(redGPUContext)
				const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
				redGPUContext.addView(view)
				try {
					redGPUContext.swapViewsAt(10, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViewsAt failure test - Indices are not numbers`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					redGPUContext.swapViewsAt('index1', 'index2')
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViewsAt failure test - Negative index`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera = new RedGPU.Display.Camera(redGPUContext)
				const scene = new RedGPU.Display.Scene(redGPUContext)
				const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
				redGPUContext.addView(view)
				try {
					redGPUContext.swapViewsAt(-1, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`swapViewsAt failure test - Same indices`, () => {
			const canvas = document.createElement('canvas')

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				const camera = new RedGPU.Display.Camera(redGPUContext)
				const scene = new RedGPU.Display.Scene(redGPUContext)
				const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
				redGPUContext.addView(view)
				try {
					redGPUContext.swapViewsAt(0, 0)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);
	}
);

// Success group
RedTest.testGroup(
	"Success Group - removeView",
	function () {
		RedTest.test(`removeView test`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.addView(view)
					redGPUContext.removeView3D(view)
					pass = !redGPUContext.contains(view)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`removeView test - Multiple views`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					const camera1 = new RedGPU.Display.Camera(redGPUContext)
					const scene1 = new RedGPU.Display.Scene(redGPUContext)
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene1, camera1)

					const camera2 = new RedGPU.Display.Camera(redGPUContext)
					const scene2 = new RedGPU.Display.Scene(redGPUContext)
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, camera2)

					redGPUContext.addView(view1)
					redGPUContext.addView(view2)
					redGPUContext.removeView3D(view1)
					pass = redGPUContext.contains(view1) === false && redGPUContext.contains(view2) === true
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - removeView",
	function () {
		RedTest.test(`removeView failure test`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					let view;
					redGPUContext.removeView3D(view)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`removeView test - View not in the context`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext)
					const scene = new RedGPU.Display.Scene(redGPUContext)
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera)
					redGPUContext.removeView3D(view)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`removeView failure test - View is null`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					redGPUContext.removeView3D(null)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`removeView failure test - View is undefined`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					redGPUContext.removeView3D(undefined)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

		RedTest.test(`removeView failure test - View is not an instance of RedGPU.Display.View`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true
				let error
				try {
					const view = {}
					redGPUContext.removeView3D(view)
				} catch (e) {
					pass = false
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, false);

	}
);

RedTest.testGroup(
	"Success Group - removeViewAt",
	function () {
		RedTest.test(`removeViewAt  test`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					redGPUContext.removeViewAt(0);
					pass = (redGPUContext.getViewIndex(view) === -1) && !redGPUContext.contains(view)
				} catch (e) {
					error = e;
					pass = false;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, true);

	}
);

RedTest.testGroup(
	"Failure Group - removeViewAt",
	function () {
		RedTest.test(`removeViewAt failure test - Non-Uint index (zero)`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					const nonUintIndex = 'zero'; // non-Uint index
					redGPUContext.removeViewAt(nonUintIndex);
				} catch (e) {
					pass = false;
					error = e;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, false);

		RedTest.test(`removeViewAt failure test - Non-Uint index (2.5)`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					const nonUintIndex = 2.5; // non-Uint index
					redGPUContext.removeViewAt(nonUintIndex);
				} catch (e) {
					pass = false;
					error = e;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, false);

		RedTest.test(`removeViewAt failure test - Index out of range (negative)`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					const indexOutOfRange = -1; // negative index
					redGPUContext.removeViewAt(indexOutOfRange);
				} catch (e) {
					pass = false;
					error = e;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, false);

		RedTest.test(`removeViewAt failure test - Index out of range (greater than view count)`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					const indexOutOfRange = 1; // greater than view count
					redGPUContext.removeViewAt(indexOutOfRange);
				} catch (e) {
					pass = false;
					error = e;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, false);

		RedTest.test(`removeViewAt failure test - Index out of range (equal to view count)`, () => {
			const canvas = document.createElement('canvas');

			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

					redGPUContext.addView(view);
					const indexOutOfRange = 1; // equal to view count
					redGPUContext.removeViewAt(indexOutOfRange);
				} catch (e) {
					pass = false;
					error = e;
				}

				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, false);

	}
);

RedTest.testGroup(
	"Success Group - removeAllViews",
	function () {
		RedTest.test(`removeAllViews test`, () => {
			const canvas = document.createElement('canvas');
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view1 = new RedGPU.Display.View3D(redGPUContext, scene, camera);
					const view2 = new RedGPU.Display.View3D(redGPUContext, scene, camera);
					redGPUContext.addView(view1);
					redGPUContext.addView(view2);
					redGPUContext.removeAllViews();
					pass = (redGPUContext.numViews === 0);
				} catch (e) {
					error = e;
					pass = false;
				}
				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, true);

		RedTest.test(`removeAllViews test - check with numViews`, () => {
			const canvas = document.createElement('canvas');
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = true;
				let error;
				try {
					const camera = new RedGPU.Display.Camera(redGPUContext);
					const scene = new RedGPU.Display.Scene(redGPUContext);
					const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
					redGPUContext.addView(view);
					redGPUContext.removeAllViews();
					if (redGPUContext.numViews !== 0) {
						throw new Error('Did not remove all views');
					}
				} catch (e) {
					pass = false;
					error = e;
				}
				redGPUContext.destroy();
				runTest(pass, error);

			}, onFailureInitialization);
		}, true);
	}
)
