import * as RedGPU from "../../dist/index.js";

RedTest.title = 'ResourceBase Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);
};

const onSuccessInitialization = (redGPUContext) => {

	try {
		new RedGPU.RedGPUContextBase(redGPUContext)
		redGPUContext.destroy()
		runTest(true);
	} catch (error) {
		runTest(false, error);
	}

}

const onSuccessInitializationForFailTest = (testValue) => {

	try {
		new RedGPU.RedGPUContextBase(testValue)
		runTest(true);
	} catch (error) {
		runTest(false, error);
	}

}

const onFailureInitialization = (error) => {
	runTest(false, error);
};

// Success group
RedTest.testGroup(
	"Success Group ",
	function () {
		const canvas = document.createElement("canvas");
		RedTest.test(
			`test`,
			() => RedGPU.init(canvas, onSuccessInitialization, onFailureInitialization),
			true
		);
	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - When redGPUContext input is not a RedGPuContext Instance",
	function () {
		const canvas = document.createElement("canvas");

		const testList = [
			['redGPUContext input is null', () => onSuccessInitializationForFailTest(null)],
			['redGPUContext input is undefined', () => onSuccessInitializationForFailTest(undefined)],
			['redGPUContext input is empty string', () => onSuccessInitializationForFailTest('')],
			['redGPUContext input is a string "test"', () => onSuccessInitializationForFailTest('test')],
			['redGPUContext input is a number 123', () => onSuccessInitializationForFailTest(123)],
			['redGPUContext input is a boolean true', () => onSuccessInitializationForFailTest(true)],
		]
		RedGPU.init(canvas, () => {
			testList.forEach(v => {
				RedTest.test(
					...v,
					false
				);
			})

		}, onFailureInitialization)

	}
);
