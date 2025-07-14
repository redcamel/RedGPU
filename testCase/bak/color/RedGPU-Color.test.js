import * as RedGPU from "../../../dist/index.js";

RedTest.title = 'ColorRGBA Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);
};

// Success group
RedTest.testGroup("Success group - RGB and Alpha Value Test", function () {
	RedTest.test(`RGB and Alpha Value Setters Test: r (125), g (80), b (45), alpha (1.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 125
		testColor.g = 80
		testColor.b = 45
		testColor.a = 1.0
		const pass = testColor.r === 125 && testColor.g === 80 && testColor.b === 45 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Get RGB Value Test`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 125
		testColor.g = 80
		testColor.b = 45
		const pass = testColor.rgb.toString() === [125, 80, 45].toString()
		runTest(pass)
	}, true);

	RedTest.test(`Get RGBA Value Test`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 125
		testColor.g = 80
		testColor.b = 45
		testColor.a = 1.0
		const pass = testColor.rgba.toString() === [125, 80, 45, 1].toString()
		runTest(pass)
	}, true);
	RedTest.test(`Get Color As HEX Test: #FF0000`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 255
		testColor.g = 0
		testColor.b = 0
		testColor.a = 1.0
		const pass = testColor.hex === '#FF0000'
		console.log(testColor)
		runTest(pass)
	}, true);

	RedTest.test(`Get Color As HEX Test: #00FF00`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 0
		testColor.g = 255
		testColor.b = 0
		testColor.a = 1.0
		const pass = testColor.hex === '#00FF00'
		console.log(testColor)
		runTest(pass)
	}, true);

	RedTest.test(`Get Color As HEX Test: #0000FF`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 0
		testColor.g = 0
		testColor.b = 255
		testColor.a = 1.0
		const pass = testColor.hex === '#0000FF'
		console.log(testColor)
		runTest(pass)
	}, true);

	RedTest.test(`Get Color As HEX Test: #FFFFFF`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.r = 255
		testColor.g = 255
		testColor.b = 255
		testColor.a = 1.0
		const pass = testColor.hex === '#FFFFFF'
		console.log(testColor)
		runTest(pass)
	}, true);
});

RedTest.testGroup("Failure group - RGB and Alpha Values Out-of-range Tests", function () {
	RedTest.test(`Test Out-of-Range Value (1.2) for Red Channel Assignment`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.r = 1.2
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Green Channel Assignment Failure Test: g (1.2)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.g = 1.2
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Blue Channel Assignment Failure Test: b (1.2)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.b = 1.2
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Alpha Channel Assignment Failure Test: alpha (2.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.a = 2.0
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
});

RedTest.testGroup("Success group - HEX Value Tests", function () {
	RedTest.test(`Set Color by HEX Value Test: #FF0000`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX('#FF0000')
		const pass = testColor.r === 255 && testColor.g === 0 && testColor.b === 0 && testColor.a === 1.0
		runTest(pass)
	}, true);

	RedTest.test(`Set Color by HEX Value Test: #00FF00`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX('#00FF00')
		const pass = testColor.r === 0 && testColor.g === 255 && testColor.b === 0 && testColor.a === 1.0
		runTest(pass)
	}, true);

	RedTest.test(`Set Color by HEX Value Test: #0000FF`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX('#0000FF')
		const pass = testColor.r === 0 && testColor.g === 0 && testColor.b === 255 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Set Color by HEX Value Test: #FFF`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX('#FFF')
		const pass = testColor.r === 255 && testColor.g === 255 && testColor.b === 255 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Set Color by HEX Value Test: 0xFF0000`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX(0xFF0000)
		const pass = testColor.r === 255 && testColor.g === 0 && testColor.b === 0 && testColor.a === 1.0

		runTest(pass)
	}, true);
	RedTest.test(`Set Color by HEX Value Test: 0xFF0`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByHEX(0xFF0)
		const pass = testColor.r === 255 && testColor.g === 255 && testColor.b === 0 && testColor.a === 1.0
		console.log('testColor', testColor)
		runTest(pass)
	}, true);
});
//Failure group - HEX Value Tests
RedTest.testGroup("Failure group - HEX Value Tests", function () {
	RedTest.test(`Set Color by HEX Value Test: 1`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass = true
		let error
		try {
			testColor.setColorByHEX(1)
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
	RedTest.test(`Set Color by HEX Value Test: #ff`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass = true
		let error
		try {
			testColor.setColorByHEX('#ff')
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
})

//success group for setColorByRGB tests
RedTest.testGroup("Success Group - setColorByRGB tests", function () {
	RedTest.test(`Use setColorByRGB to set color: r(125), g(80), b(45)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGB(125, 80, 45)
		const pass = testColor.r === 125 && testColor.g === 80 && testColor.b === 45 && testColor.a === 1.0
		runTest(pass)
	}, true);

	RedTest.test(`Use setColorByRGB to set color: r(0), g(0), b(0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGB(0, 0, 0)
		const pass = testColor.r === 0 && testColor.g === 0 && testColor.b === 0 && testColor.a === 1.0
		runTest(pass)
	}, true);

	RedTest.test(`Use setColorByRGB to set color: r(255), g(255), b(255)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGB(255, 255, 255)
		const pass = testColor.r === 255 && testColor.g === 255 && testColor.b === 255 && testColor.a === 1.0
		runTest(pass)
	}, true);

});
// Failure Group for setColorByRGB tests
RedTest.testGroup("Failure Group - setColorByRGB tests", function () {
	RedTest.test(`Red Channel Assignment Failure Test: r (300)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(300, 0, 0)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Green Channel Assignment Failure Test: g (300)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(0, 300, 0)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Blue Channel Assignment Failure Test: b (300)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(0, 0, 300)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Red Channel Assignment Failure Test: r (-1)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(-1, 0, 0)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Green Channel Assignment Failure Test: g (-1)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(0, -1, 0)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Blue Channel Assignment Failure Test: b (1.1)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGB(0, 0, 1.1)
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Alpha Channel Assignment Failure Test: alpha (1.5)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.a = 1.5
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

});

// Success Group for setColorByRGBString tests
RedTest.testGroup("Success Group - setColorByRGBString tests", function () {
	RedTest.test(`Use setColorByRGBString to set color: rgb(125, 80, 45)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBString('rgb(125, 80, 45)')
		const pass = testColor.r === 125 && testColor.g === 80 && testColor.b === 45 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Use setColorByRGBString to set color: rgb(125,80,45 )`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBString('rgb(125,80,45 )')
		const pass = testColor.r === 125 && testColor.g === 80 && testColor.b === 45 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Use setColorByRGBString to set color: rgb(255, 255, 255)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBString('rgb(255, 255, 255)')
		const pass = testColor.r === 255 && testColor.g === 255 && testColor.b === 255 && testColor.a === 1.0
		runTest(pass)
	}, true);

	RedTest.test(`Use setColorByRGBString to set color: rgb(0, 0, 0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBString('rgb(0, 0, 0)')
		const pass = testColor.r === 0 && testColor.g === 0 && testColor.b === 0 && testColor.a === 1.0
		runTest(pass)
	}, true);

});
// Failure Group for setColorByRGBString tests
RedTest.testGroup("Failure Group - setColorByRGBString tests", function () {
	RedTest.test(`Red Channel Assignment Failure Test: rgb(300, 0, 0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(300, 0, 0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Green Channel Assignment Failure Test: rgb(0, 300, 0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(0, 300, 0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Blue Channel Assignment Failure Test: rgb(0, 0, 300)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(0, 0, 300)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Red Channel Assignment Failure Test: rgb(-1, 0, 0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(-1, 0, 0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Green Channel Assignment Failure Test: rgb(0, -1, 0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(0, -1, 0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);

	RedTest.test(`Blue Channel Assignment Failure Test: rgb(0, 0, 1.1)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBString('rgb(0, 0, 1.1)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
});
// Additional Success Group for setColorByRGBAString tests
RedTest.testGroup("Additional Success Group - setColorByRGBAString tests", function () {
	RedTest.test(`Use setColorByRGBAString to set color: rgba(255, 255, 255, 1.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBAString('rgba(255, 255, 255, 1.0)')
		const pass = testColor.r === 255 && testColor.g === 255 && testColor.b === 255 && testColor.a === 1.0
		runTest(pass)
	}, true);
	RedTest.test(`Use setColorByRGBAString to set color: rgba(0, 0, 0, 0.5)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBAString('rgba(0, 0, 0, 0.5)')
		const pass = testColor.r === 0 && testColor.g === 0 && testColor.b === 0 && testColor.a === 0.5
		runTest(pass)
	}, true);
	RedTest.test(`Use setColorByRGBAString to set color: rgba(125, 80, 45, 0.8)`, () => {
		const testColor = new RedGPU.ColorRGB()
		testColor.setColorByRGBAString('rgba(125, 80, 45, 0.8)')
		const pass = testColor.r === 125 && testColor.g === 80 && testColor.b === 45 && testColor.a === 0.8
		runTest(pass)
	}, true);
});

// Additional Failure Group for setColorByRGBAString tests
RedTest.testGroup("Additional Failure Group - setColorByRGBAString tests", function () {
	RedTest.test(`Alpha Channel Assignment Failure Test: rgba(100, 100, 100, -0.5)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBAString('rgba(100, 100, 100, -0.5)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
	RedTest.test(`Alpha Channel Assignment Failure Test: rgba(100, 100, 100, 2.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBAString('rgba(100, 100, 100, 2.0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
	RedTest.test(`Red Channel Assignment Failure Test: rgba(260, 0, 0, 1.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBAString('rgba(260, 0, 0, 1.0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
	RedTest.test(`Green Channel Assignment Failure Test: rgba(0, 260, 0, 1.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBAString('rgba(0, 260, 0, 1.0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
	RedTest.test(`Blue Channel Assignment Failure Test: rgba(0, 0, 260, 1.0)`, () => {
		const testColor = new RedGPU.ColorRGB()
		let pass, error
		try {
			testColor.setColorByRGBAString('rgba(0, 0, 260, 1.0)')
			pass = true
		} catch (e) {
			pass = false
			error = e
		}
		runTest(pass, error)
	}, false);
});
