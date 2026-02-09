import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - consoleAndThrowError');

redUnit.testGroup(
	'RedGPU.Util.consoleAndThrowError',
	(runner) => {
		runner.defineTest('Throws error with combined message', (run) => {
			try {
				RedGPU.Util.consoleAndThrowError('Test', 'Error', 123);
				run(false);
			} catch (e) {
				run(e.message === 'Test Error 123');
			}
		}, true);
	}
);
