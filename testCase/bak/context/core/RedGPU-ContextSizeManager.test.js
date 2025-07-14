import * as RedGPU from "../../../dist/index.js";

RedTest.title = 'ContextSizeManager Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);
};

const onFailureInitialization = (error) => {
	runTest(false, error);
};

// Success group
RedTest.testGroup(
	"Success Group - width, height setter",
	function () {
		const canvas = document.createElement('canvas')
		RedTest.test(`width setter test (uint)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = 128
					pass = redGPUContext.width === 128
				} catch (e) {
					error = e
				}
				console.log('UContext.width', redGPUContext.width, redGPUContext.sizeManager)
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`width setter test (%)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '50%'
					pass = redGPUContext.width === '50%'
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`width setter test (px)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '50%'
					pass = redGPUContext.width === '50%'
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`height setter test (uint)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = 128
					pass = redGPUContext.height === 128
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`height setter test (%)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '50%'
					pass = redGPUContext.height === '50%'
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`height setter test (px)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '50%'
					pass = redGPUContext.height === '50%'
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`width, height setter test together (uint,uint)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = 128
					redGPUContext.height = 200
					pass = redGPUContext.width === 128 && redGPUContext.height === 200
					console.log('testtestet', redGPUContext)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`width, height setter test together (%,%)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = "50%"
					redGPUContext.height = "60%"
					pass = redGPUContext.width === "50%" && redGPUContext.height === "60%"
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`width, height setter test together (px,px)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = "50px"
					redGPUContext.height = "100px"
					pass = redGPUContext.width === "50px" && redGPUContext.height === "100px"
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
	"Success Group - width, height setter with sizeManager.pixelRectArray",
	function () {
		RedTest.test(`width setter test & sizeManager.pixelRectArray (uint)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = 128
					pass = Math.floor(devicePixelRatio * redGPUContext.width) === redGPUContext.sizeManager.pixelRectArray[2]
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		RedTest.test(`width setter test & sizeManager.pixelRectArray (%)`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:200px;height:10px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '50%'
					pass = redGPUContext.sizeManager.pixelRectArray[2] === Math.floor(devicePixelRatio * 100)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`width setter test & sizeManager.pixelRectArray (%) with various size`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:300px;height:10px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '33%'
					pass = redGPUContext.sizeManager.pixelRectArray[2] === Math.floor(devicePixelRatio * 99)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

		RedTest.test(`height setter test & sizeManager.pixelRectArray (uint)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = 128
					pass = Math.floor(devicePixelRatio * redGPUContext.height) === redGPUContext.sizeManager.pixelRectArray[3]
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		RedTest.test(`height setter test & sizeManager.pixelRectArray (%)`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:200px;height:500px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '50%'
					pass = redGPUContext.sizeManager.pixelRectArray[3] === Math.floor(devicePixelRatio * 250)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		RedTest.test(`height setter test & sizeManager.pixelRectArray (%) with various size`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:300px;height:300px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '33%'
					pass = redGPUContext.sizeManager.pixelRectArray[3] === Math.floor(devicePixelRatio * 99)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)
		RedTest.test(`width setter test & sizeManager.pixelRectArray (px)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '200px'
					pass = redGPUContext.sizeManager.pixelRectArray[2] === Math.floor(devicePixelRatio * 200)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		RedTest.test(`height setter test & sizeManager.pixelRectArray (px)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '333px'
					pass = redGPUContext.sizeManager.pixelRectArray[3] === Math.floor(devicePixelRatio * 333)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)
	}
)

RedTest.testGroup(
	"Success Group - width, height setter with sizeManager.pixelRectObject",
	function () {
		// Test case - width setter test & sizeManager.pixelRectObject (uint)
		RedTest.test(`width setter test & sizeManager.pixelRectObject (uint)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = 128
					pass = Math.floor(devicePixelRatio * redGPUContext.width) === redGPUContext.sizeManager.pixelRectObject.width
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		// Test case - width setter test & sizeManager.pixelRectObject (%)
		RedTest.test(`width setter test & sizeManager.pixelRectObject (%) with various size`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:300px;height:10px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '33%'
					pass = redGPUContext.sizeManager.pixelRectObject.width === Math.floor(devicePixelRatio * 99)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		// Test case - width setter test & sizeManager.pixelRectObject (px)
		RedTest.test(`width setter test & sizeManager.pixelRectObject (px)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.width = '200px'
					pass = redGPUContext.sizeManager.pixelRectObject.width === Math.floor(devicePixelRatio * 200)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		// Test case - height setter test & sizeManager.pixelRectObject (uint)
		RedTest.test(`height setter test & sizeManager.pixelRectObject (uint)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = 128
					pass = Math.floor(devicePixelRatio * redGPUContext.height) === redGPUContext.sizeManager.pixelRectObject.height
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		// Test case - height setter test & sizeManager.pixelRectObject (%)
		RedTest.test(`height setter test & sizeManager.pixelRectObject (%) with various size`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:300px;height:300px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '33%'
					pass = redGPUContext.sizeManager.pixelRectObject.height === Math.floor(devicePixelRatio * 99)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)

		// Test case - height setter test & sizeManager.pixelRectObject (px)
		RedTest.test(`height setter test & sizeManager.pixelRectObject (px)`, () => {
			const canvas = document.createElement('canvas')
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.height = '333px'
					pass = redGPUContext.sizeManager.pixelRectObject.height === Math.floor(devicePixelRatio * 333)
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true)
	}
)

// Success Group
RedTest.testGroup(
	"Success Group - setSize test",
	function () {
		const canvas = document.createElement('canvas')
		RedTest.test(`setSize test (uint, uint)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.setSize(200, 100)
					pass = redGPUContext.width === 200 && redGPUContext.height === 100 &&
						redGPUContext.width === redGPUContext.sizeManager.width &&
						redGPUContext.height === redGPUContext.sizeManager.height &&
						Math.floor(devicePixelRatio * redGPUContext.width) === redGPUContext.sizeManager.pixelRectArray[2] &&
						Math.floor(devicePixelRatio * redGPUContext.height) === redGPUContext.sizeManager.pixelRectArray[3] &&
						Math.floor(devicePixelRatio * redGPUContext.width) === redGPUContext.sizeManager.pixelRectObject.width &&
						Math.floor(devicePixelRatio * redGPUContext.height) === redGPUContext.sizeManager.pixelRectObject.height
				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`setSize test (px, px)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.setSize('200px', '100px')
					pass = redGPUContext.width === '200px' && redGPUContext.height === '100px' &&
						redGPUContext.width === redGPUContext.sizeManager.width &&
						redGPUContext.height === redGPUContext.sizeManager.height &&
						redGPUContext.sizeManager.pixelRectArray[2] === Math.floor(devicePixelRatio * 200) &&
						redGPUContext.sizeManager.pixelRectArray[3] === Math.floor(devicePixelRatio * 100) &&
						redGPUContext.sizeManager.pixelRectObject.width === Math.floor(devicePixelRatio * 200) &&
						redGPUContext.sizeManager.pixelRectObject.height === Math.floor(devicePixelRatio * 100)

				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`setSize test (%, %)`, () => {
			const canvasParent = document.createElement('div')
			canvasParent.style.cssText = 'width:300px;height:222px;'
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvasParent)
			canvasParent.appendChild(canvas)
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.setSize('50%', '50%')
					// adjust below comparisons as per maths calculations if needed
					pass = redGPUContext.width === '50%' && redGPUContext.height === '50%' &&
						redGPUContext.width === redGPUContext.sizeManager.width &&
						redGPUContext.height === redGPUContext.sizeManager.height &&
						redGPUContext.sizeManager.pixelRectArray[2] === Math.floor(devicePixelRatio * 150) &&
						redGPUContext.sizeManager.pixelRectArray[3] === Math.floor(devicePixelRatio * 111) &&
						redGPUContext.sizeManager.pixelRectObject.width === Math.floor(devicePixelRatio * 150) &&
						redGPUContext.sizeManager.pixelRectObject.height === Math.floor(devicePixelRatio * 111)

				} catch (e) {
					error = e
				}
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);

// Failure Group
RedTest.testGroup(
	"Failure Group - setSize test",
	function () {
		const canvas = document.createElement('canvas')
		RedTest.test(`setSize test (invalid types)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.setSize('300#', 200) // Mixed types
					pass = false
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
	"Success Group - renderScale setter",
	function () {
		const canvas = document.createElement('canvas')
		RedTest.test(`renderScale setter test (uint)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.renderScale = 2
					pass = redGPUContext.renderScale === 2
				} catch (e) {
					error = e
				}
				console.log('redGPUContext.renderScale', redGPUContext.renderScale)
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
		RedTest.test(`renderScale setter test (negative number auto convert to 0.01)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.renderScale = -2
					pass = redGPUContext.renderScale === 0.01
				} catch (e) {
					pass = true
					error = e
				}
				console.log('redGPUContext.renderScale', redGPUContext.renderScale)
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - renderScale setter",
	function () {
		const canvas = document.createElement('canvas')
		RedTest.test(`renderScale setter test (string)`, () => {
			RedGPU.init(canvas, (redGPUContext) => {
				let pass = false
				let error
				try {
					redGPUContext.renderScale = "2"
					pass = false
				} catch (e) {
					pass = true
					error = e
				}
				console.log('redGPUContext.renderScale', redGPUContext.renderScale)
				redGPUContext.destroy();
				runTest(pass, error);
			}, onFailureInitialization)
		}, true);

	}
);


