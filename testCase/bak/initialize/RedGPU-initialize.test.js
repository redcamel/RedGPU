import * as RedGPU from "../../../dist";

RedTest.title = 'Initialize Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);
};

const onSuccessInitialization = (redGPUContext) => {
	redGPUContext.destroy()
	runTest(true);
};

const onFailureInitialization = (error) => {
	runTest(false, error);
};

// Success group
RedTest.testGroup(
	"Success Group - When canvas input is a canvas element",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(`Canvas input is a canvas element`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization), true);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - When canvas input is not a canvas element",
	function () {
		const testList = [
			[`Canvas input is null`, () => RedGPU.init(null, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is a number`, () => RedGPU.init(123, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is a string`, () => RedGPU.init("string", onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is an object that is not an instance of HTMLCanvasElement`, () => RedGPU.init({}, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is an instance of HTMLCanvasElement but does not have a getContext method`, () => RedGPU.init(function () {
				const canvas = document.createElement("canvas");
				canvas.getContext = null;
				return canvas;
			}, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is undefined`, () => RedGPU.init(undefined, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is a boolean`, () => RedGPU.init(true, onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is an array`, () => RedGPU.init([], onSuccessInitialization, onFailureInitialization), false],
			[`Canvas input is a function`, () => RedGPU.init(function () {}, onSuccessInitialization, onFailureInitialization), false],
		]
		testList.forEach(v => {
			RedTest.test(...v);
		})
	}
);

// Success Group - onWebGPUInitialized
RedTest.testGroup(
	"Success Group - onWebGPUInitialized",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(`onWebGPUInitialized input Function`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization), true);
	}
);

RedTest.testGroup(
	"Failure Group - onWebGPUInitialized",
	function () {
		const canvas = document.createElement("canvas");
		const testList = [
			[`onWebGPUInitialized input is a null string`, () => RedGPU.init(canvas, 'null', onFailureInitialization), false],
			[`onWebGPUInitialized input is a number`, () => RedGPU.init(canvas, 123, onFailureInitialization), false],
			[`onWebGPUInitialized input is a boolean`, () => RedGPU.init(canvas, true, onFailureInitialization), false],
			[`onWebGPUInitialized input is an array`, () => RedGPU.init(canvas, [], onFailureInitialization), false],
			[`Canvas input is null`, () => RedGPU.init(canvas, 'not a function', onFailureInitialization), false],
		]
		testList.forEach(v => {
			RedTest.test(...v);
		})
	}
);
// Add test group for alphaMode
RedTest.testGroup(
	"Success Group - AlphaMode",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(`alphaMode is 'opaque'`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'opaque'), true);
		RedTest.test(`alphaMode is 'premultiply'`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied'), true);
	}
);

RedTest.testGroup(
	"Failure Group - AlphaMode",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(`alphaMode is an incorrect string`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'transparent'), false);
		RedTest.test(`alphaMode is a number`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 1), false);
		RedTest.test(`alphaMode is a function`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, () => {}), false);
		RedTest.test(`alphaMode is an object`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, {}), false);
		RedTest.test(`AlphaMode is an array`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, []), false);
		RedTest.test(`AlphaMode is null`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, null), false);
		RedTest.test(`AlphaMode is an empty string`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, ''), false);
	}
);

// Add test group for requestAdapterOptions
RedTest.testGroup(
	"Success Group - requestAdapterOptions",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(`requestAdapterOptions is an object with powerPreference as 'low-power'`, () => {
			RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {powerPreference: 'low-power'})
		}, true);
		RedTest.test(`requestAdapterOptions is an object with powerPreference as 'high-performance'`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {powerPreference: 'high-performance'}), true);

	}
);

RedTest.testGroup(
	"Failure Group - requestAdapterOptions",
	function () {
		const canvas = document.createElement("canvas");
		const testList = [
			[`not allow value`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {powerPreference: 2}), false],
			[`requestAdapterOptions is a number`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', 123), false],
			[`requestAdapterOptions is a boolean`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', true), false],
			[`requestAdapterOptions is a string`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', 'string'), false],
			[`RequestAdapterOptions has additional properties`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {
				powerPreference: 'low-power',
				extraProp: 'value'
			}), true],
			[`PowerPreference is empty`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {powerPreference: ''}), false],
			[`PowerPreference is null`, () => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization, null, 'premultiplied', {powerPreference: null}), false]
		]
		testList.forEach(v => {
			RedTest.test(...v);
		});

	}
);
