import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');
redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.isHexColor Success Cases',
	(runner) => {
		runner.defineTest('isHexColor - Valid hex color', function (run) {
			const color = '#FF5733';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, true);

		runner.defineTest('isHexColor - Valid 0x hex color', function (run) {
			const color = '0x112233';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, true);

		runner.defineTest('isHexColor - Valid white 0x hex color', function (run) {
			const color = '0xFFFFFF';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, true);
		runner.defineTest('isHexColor - Valid short hex color', function (run) {
			const color = '#abc';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, true);
		runner.defineTest('isHexColor - Valid short hex color', function (run) {
			const color = '0xabc';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, true);
	}
);
redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.isHexColor Failure Cases',
	(runner) => {
		runner.defineTest('isHexColor - invalid hex color', function (run) {
			const color = '#XYZ123';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, false);
		runner.defineTest('isHexColor - invalid short hex color', function (run) {
			const color = '#gha';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, false);
		runner.defineTest('isHexColor - invalid short hex color', function (run) {
			const color = '0xgha';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, false);
		runner.defineTest('isHexColor - invalid short hex color', function (run) {
			const color = '#11';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, false);
		runner.defineTest('isHexColor - invalid short hex color', function (run) {
			const color = '0x11';
			const result = RedGPU.RuntimeChecker.isHexColor(color);
			run(result);
		}, false);
	}
);

redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.isUint Success Cases',
	(runner) => {
		runner.defineTest('isUint - Valid uint', function (run) {
			const number = 5;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, true);

		runner.defineTest('isUint - Valid uint zero', function (run) {
			const number = 0;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, true);
	}
);
redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.isUint Failure Cases',
	(runner) => {
		runner.defineTest('isUint - negative integer', function (run) {
			const number = -5;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - non-integer number', function (run) {
			const number = 2.5;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - non-numeric value', function (run) {
			const number = 'abc';
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);
		runner.defineTest('isUint - null value', function (run) {
			const number = null;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - undefined value', function (run) {
			const number = undefined;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - boolean value', function (run) {
			const number = true;
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - object value', function (run) {
			const number = {};
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - array value', function (run) {
			const number = [];
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);

		runner.defineTest('isUint - function value', function (run) {
			const number = function () {};
			const result = RedGPU.RuntimeChecker.isUint(number);
			run(result);
		}, false);
	}
);

redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.validateNumber Success Cases',
	(runner) => {
		runner.defineTest('validateNumber - Valid number', function (run) {
			const number = 5;
			const result = RedGPU.RuntimeChecker.validateNumber(number);
			run(result);
		}, true);

		runner.defineTest('validateNumber - Valid negative number', function (run) {
			const number = -5;
			const result = RedGPU.RuntimeChecker.validateNumber(number);
			run(result);
		}, true);

		runner.defineTest('validateNumber - Valid decimal number', function (run) {
			const number = 2.5;
			const result = RedGPU.RuntimeChecker.validateNumber(number);
			run(result);
		}, true);
	}
);
redUnit.testGroup(
	'JavaScript RedGPU.RuntimeChecker.validateNumber Failure Cases',
	(runner) => {
		runner.defineTest('validateNumber - String', function (run) {
			const number = '5';
			try {
				RedGPU.RuntimeChecker.validateNumber(number);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumber - Boolean', function (run) {
			const number = true;

			try {
				RedGPU.RuntimeChecker.validateNumber(number);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumber - Object', function (run) {
			const number = {};

			try {
				RedGPU.RuntimeChecker.validateNumber(number);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumber - Null', function (run) {
			const number = null;

			try {
				RedGPU.RuntimeChecker.validateNumber(number);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validateNumberRange Success Cases',
	(runner) => {
		runner.defineTest('validateNumberRange - Valid range', function (run) {
			const number = 5;
			const min = 1;
			const max = 10;
			const result = RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
			run(result);
		}, true);

		runner.defineTest('validateNumberRange - Valid range with negative number', function (run) {
			const number = -5;
			const min = -10;
			const max = 0;
			const result = RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
			run(result);
		}, true);

		runner.defineTest('validateNumberRange - Valid range with decimal number', function (run) {
			const number = 2.5;
			const min = 0;
			const max = 5;
			const result = RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
			run(result);
		}, true);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validateNumberRange Failure Cases',
	(runner) => {
		runner.defineTest('validateNumberRange - Number out of range', function (run) {
			const number = 15;
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumberRange - Range bounds as string', function (run) {
			const number = 5;
			const min = '1';
			const max = '10';
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumberRange - Null as range bounds', function (run) {
			const number = 5;
			const min = null;
			const max = null;
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumberRange - Number is string', function (run) {
			const number = '5';
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumberRange - Boolean as input', function (run) {
			const number = true;
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateNumberRange - Object as input', function (run) {
			const number = {};
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validatePositiveNumberRange Success Cases',
	(runner) => {
		runner.defineTest('validatePositiveNumberRange - Valid range', function (run) {
			const number = 5;
			const min = 1;
			const max = 10;
			const result = RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
			run(result);
		}, true);

		runner.defineTest('validatePositiveNumberRange - Valid range with decimal number', function (run) {
			const number = 2.5;
			const min = 0;
			const max = 5;
			const result = RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
			run(result);
		}, true);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validatePositiveNumberRange Failure Cases',
	(runner) => {
		runner.defineTest('validatePositiveNumberRange - Number out of range', function (run) {
			const number = 15;
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Negative numbers', function (run) {
			const number = -5;
			const min = -10;
			const max = 0;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Range bounds as string', function (run) {
			const number = 5;
			const min = '1';
			const max = '10';
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Null as range bounds', function (run) {
			const number = 5;
			const min = null;
			const max = null;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Number is string', function (run) {
			const number = '5';
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Boolean as input', function (run) {
			const number = true;
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validatePositiveNumberRange - Object as input', function (run) {
			const number = {};
			const min = 1;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validatePositiveNumberRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validateUintRange Success Cases',
	(runner) => {
		runner.defineTest('validateUintRange - Valid range', function (run) {
			const number = 5;
			const min = 0;
			const max = 10;
			const result = RedGPU.RuntimeChecker.validateUintRange(number, min, max);
			run(result);
		}, true);

		runner.defineTest('validateUintRange - Valid max limit', function (run) {
			const number = 10;
			const min = 0;
			const max = 10;
			const result = RedGPU.RuntimeChecker.validateUintRange(number, min, max);
			run(result);
		}, true);

		runner.defineTest('validateUintRange - Valid min limit', function (run) {
			const number = 0;
			const min = 0;
			const max = 10;
			const result = RedGPU.RuntimeChecker.validateUintRange(number, min, max);
			run(result);
		}, true);
	}
);

redUnit.testGroup(
	'TypeScript RedGPU.RuntimeChecker.validateUintRange Failure Cases',
	(runner) => {
		runner.defineTest('validateUintRange - Number out of range', function (run) {
			const number = 15;
			const min = 0;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateUintRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateUintRange - Negative numbers', function (run) {
			const number = -5;
			const min = 0;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateUintRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateUintRange - Decimal numbers', function (run) {
			const number = 5.5;
			const min = 0;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateUintRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateUintRange - Input type not Number', function (run) {
			const number = "5";
			const min = 0;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateUintRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);

		runner.defineTest('validateUintRange - Null as input', function (run) {
			const number = null;
			const min = 0;
			const max = 10;
			try {
				RedGPU.RuntimeChecker.validateUintRange(number, min, max);
				run(true);
			} catch (error) {
				run(false, error);
			}
		}, false);
	}
);
