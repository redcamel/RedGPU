import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist";

const redUnit = new RedUnit('RedGPU - convertColor');

redUnit.testGroup(
	'RedGPU.Util Function Tests - convertHexToRgb',
	(runner) => {
		runner.defineTest('Test convertHexToRgb - standard hex', function (run) {
			const hexValue = '#FFFFFF';
			run(RedGPU.Util.convertHexToRgb(hexValue, true));
		}, [255, 255, 255]); // Expected output for '#FFFFFF'

		runner.defineTest('Test convertHexToRgb - short hex', function (run) {
			const hexValue = '#FF0';
			run(RedGPU.Util.convertHexToRgb(hexValue, true));
		}, [255, 255, 0]); // Expected output for '#FF0'
	}
);

redUnit.testGroup(
	'RedGPU.Util Function Tests - convertHexToRgb - Error Cases',
	(runner) => {
		runner.defineTest('Test convertHexToRgb - without hash symbol', function (run) {
			let passYn, error;
			try {
				const hexValue = 'FF0000';
				// raised exception means test success
				RedGPU.Util.convertHexToRgb(hexValue);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - invalid hex', function (run) {
			let passYn, error;
			try {
				const invalidHex = '#ZXY123';
				// raised exception means test success
				RedGPU.Util.convertHexToRgb(invalidHex);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - non-string input', function (run) {
			let passYn, error;
			try {
				// Passing number instead of string
				RedGPU.Util.convertHexToRgb(123);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - empty string', function (run) {
			let passYn, error;
			try {
				const emptyString = '';
				RedGPU.Util.convertHexToRgb(emptyString);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - long string', function (run) {
			let passYn, error;
			try {
				const longString = '#FFFFFFF';
				RedGPU.Util.convertHexToRgb(longString);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - string with special characters', function (run) {
			let passYn, error;
			try {
				const specialChars = '#FFF@FF';
				RedGPU.Util.convertHexToRgb(specialChars);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);

		runner.defineTest('Test convertHexToRgb - invalid hash symbol', function (run) {
			let passYn, error;
			try {
				const invalidHash = '$FFFFFF';
				RedGPU.Util.convertHexToRgb(invalidHash);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false);
	}
);
redUnit.testGroup(
	'RedGPU.Util Function Tests - convertRgbToHex',
	(runner) => {
		runner.defineTest('Test convertRgbToHex - standard RGB', function (run) {
			const rgbValue = [255, 255, 255];
			run(RedGPU.Util.convertRgbToHex(...rgbValue));
		}, '#FFFFFF'); // Expected output for [255, 255, 255]

		runner.defineTest('Test convertRgbToHex - zero RGB', function (run) {
			const rgbValue = [0, 0, 0];
			run(RedGPU.Util.convertRgbToHex(...rgbValue));
		}, '#000000'); // Expected output for [0, 0, 0]
	}
);

redUnit.testGroup(
	'RedGPU.Util Function Tests - convertRgbToHex - Error Cases',
	(runner) => {
		runner.defineTest('Test convertRgbToHex - RGB out of range', function (run) {
			let passYn, error;
			try {
				const rgbValue = [256, 255, 255];
				RedGPU.Util.convertRgbToHex(...rgbValue);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for RGB values out of range

		runner.defineTest('Test convertRgbToHex - non-numeric RGB values', function (run) {
			let passYn, error;
			try {
				const rgbValue = [NaN, 255, 255];
				RedGPU.Util.convertRgbToHex(...rgbValue);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for non-numeric RGB values

		runner.defineTest('Test convertRgbToHex - non-integer RGB values', function (run) {
			let passYn, error;
			try {
				const rgbValue = [0.5, 255, 255];
				RedGPU.Util.convertRgbToHex(...rgbValue);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for non-integer RGB values
	}
);
