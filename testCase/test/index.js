import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'

const redUnit = new RedUnit('Test PageTitle')

redUnit.testGroup(
	'JavaScript Default Values Test Group',
	(runner) => {
		runner.defineTest('Test undefined', function (run) {
			let undefinedTest = typeof undefinedVariable === "undefined";
			run(undefinedTest);
		}, true);

		runner.defineTest('Test null', function (run) {
			let nullTest = null === null;
			run(nullTest);
		}, true);

		runner.defineTest('Test 0', function (run) {
			let zeroTest = 0 === 0;
			run(zeroTest);
		}, true);

		runner.defineTest('Test ""', function (run) {
			let emptyStringTest = "" === "";
			run(emptyStringTest);
		}, true);

		runner.defineTest('Test NaN', function (run) {
			let NaNTest = isNaN(NaN);
			run(NaNTest);
		}, true);

		runner.defineTest('Test false', function (run) {
			let falseTest = false === false;
			run(falseTest);
		}, true);
	}
);
