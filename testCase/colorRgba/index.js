import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist";

const redUnit = new RedUnit('RedGPU - ColorRGBA');
redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - create & getter',
	(runner) => {

		runner.defineTest('Test RedGPU.ColorRGBA creation from [255, 255, 255]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFFFF', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGB = [255, 255, 255];
			run(colorRGB.r === expectedRGB[0] && colorRGB.g === expectedRGB[1] && colorRGB.b === expectedRGB[2]);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA creation from [255, 255, 0]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FF0', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGB = [255, 255, 0];
			run(colorRGB.r === expectedRGB[0] && colorRGB.g === expectedRGB[1] && colorRGB.b === expectedRGB[2]);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA rgb getter for [255, 255, 255]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFFFF', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGB = [255, 255, 255];
			run(colorRGB.rgb[0] === expectedRGB[0] && colorRGB.rgb[1] === expectedRGB[1] && colorRGB.rgb[2] === expectedRGB[2]);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA rgb getter for [255, 255, 0]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FF0', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGB = [255, 255, 0];
			run(colorRGB.rgb[0] === expectedRGB[0] && colorRGB.rgb[1] === expectedRGB[1] && colorRGB.rgb[2] === expectedRGB[2]);
		}, true);
		runner.defineTest('Test RedGPU.ColorRGBA hex getter for #FFFFFF', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFFFF', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedHex = "#FFFFFF";
			run(colorRGB.hex === expectedHex);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA hex getter for #FFFF00', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFF00', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedHex = "#FFFF00";
			run(colorRGB.hex === expectedHex);
		}, true);
		runner.defineTest('Test RedGPU.ColorRGBA rgbNormal getter for [255, 255, 255]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFFFF', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGBNormal = [1, 1, 1];
			run(colorRGB.rgbNormal[0] === expectedRGBNormal[0] && colorRGB.rgbNormal[1] === expectedRGBNormal[1] && colorRGB.rgbNormal[2] === expectedRGBNormal[2]);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA rgbNormal getter for [255, 255, 0]', function (run) {
			const rgbArray = RedGPU.Util.convertHexToRgb('#FFFF00', true);
			const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
			const expectedRGBNormal = [1, 1, 0];
			run(colorRGB.rgbNormal[0] === expectedRGBNormal[0] && colorRGB.rgbNormal[1] === expectedRGBNormal[1] && colorRGB.rgbNormal[2] === expectedRGBNormal[2]);
		}, true);

		runner.defineTest('Test default value when RedGPU.ColorRGBA creation with undefined values', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(undefined, undefined, undefined);
				// Check if default values are set when initialized with undefined
				passYn = (colorRGB.r == 255) && (colorRGB.g == 255) && (colorRGB.b == 255);
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, true);
	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA setColorByRGB Function Tests',
	(runner) => {
		runner.defineTest('Test setColorByRGB for [255, 255, 255]', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGB(255, 255, 255);
			run(colorRGB.rgb[0] === 255 && colorRGB.rgb[1] === 255 && colorRGB.rgb[2] === 255);
		}, true);
		runner.defineTest('Test setColorByRGB for [128, 128, 128]', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGB(128, 128, 128);
			run(colorRGB.rgb[0] === 128 && colorRGB.rgb[1] === 128 && colorRGB.rgb[2] === 128);
		}, true);
		runner.defineTest('Test setColorByRGB for [255, 0, 0]', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGB(255, 0, 0);
			run(colorRGB.rgb[0] === 255 && colorRGB.rgb[1] === 0 && colorRGB.rgb[2] === 0);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.ColorRGBA setColorByHEX Function Tests',
	(runner) => {
		runner.defineTest('Test setColorByHEX for #FFFFFF', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByHEX('#FFFFFF');
			run(colorRGB.hex === '#FFFFFF');
		}, true);
		runner.defineTest('Test setColorByHEX for #808080', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByHEX('#808080');
			run(colorRGB.hex === '#808080');
		}, true);
		runner.defineTest('Test setColorByHEX for #FF0000', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByHEX('#FF0000');
			run(colorRGB.hex === '#FF0000');
		}, true);
	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA setColorByRGBString Function Tests',
	(runner) => {
		runner.defineTest('Test setColorByRGBString for "rgb(255,255,255)"', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGBString("rgb(255,255,255)");
			run(colorRGB.rgb[0] === 255 && colorRGB.rgb[1] === 255 && colorRGB.rgb[2] === 255);
		}, true);
		runner.defineTest('Test setColorByRGBString for "rgb(128,128,128)"', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGBString("rgb(128,128,128)");
			run(colorRGB.rgb[0] === 128 && colorRGB.rgb[1] === 128 && colorRGB.rgb[2] === 128);
		}, true);
		runner.defineTest('Test setColorByRGBString for "rgb(255,0,0)"', function (run) {
			const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
			colorRGB.setColorByRGBString("rgb(255,0,0)");
			run(colorRGB.rgb[0] === 255 && colorRGB.rgb[1] === 0 && colorRGB.rgb[2] === 0);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.ColorRGBA Creation Error Cases',
	(runner) => {

		runner.defineTest('Test error when RedGPU.ColorRGBA creation with negative values', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(-10, -20, -30);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for negative values

		runner.defineTest('Test error when RedGPU.ColorRGBA creation with non-integer values', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(0.1, 0.2, 0.3);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for non-integer values

		runner.defineTest('Test error when RedGPU.ColorRGBA creation with null values', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(null, null, null);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for null values

		runner.defineTest('Test error when setColorByRGB with out of range values', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByRGB(256, 256, 256);
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for out of range values

		runner.defineTest('Test error when setColorByHEX with invalid hex color code', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByHEX('#ZZZZZZ');
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for invalid hex color code

		runner.defineTest('Test error when setColorByRGBString with invalid RGB string', function (run) {
			let passYn, error;
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByRGBString("rgb(300,300,300)");
				passYn = true;
			} catch (e) {
				passYn = false;
				error = e;
			}
			run(passYn, error);
		}, false); // Should error for invalid RGB string
	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA Error Cases',
	(runner) => {
		runner.defineTest('Test error when RedGPU.ColorRGBA creation with invalid hex color code', function (run) {
			try {
				const rgbArray = RedGPU.Util.convertHexToRgb('#ZZZZZZ', true);
				const colorRGB = new RedGPU.ColorRGBA(rgbArray[0], rgbArray[1], rgbArray[2]);
				run(false); // If it reaches here, the test fails.
			} catch (err) {
				run(true, err); // If an error is caught, the test passes.
			}
		}, true);

		runner.defineTest('Test error when setColorByRGB with out of range values', function (run) {
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByRGB(256, 256, 256);
				run(false); // If it reaches here, the test fails.
			} catch (err) {
				run(true, err); // If an error is caught, the test passes.
			}
		}, true);

		runner.defineTest('Test error when setColorByHEX with invalid hex color code', function (run) {
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByHEX('#ZZZZZZ');
				run(false); // If it reaches here, the test fails.
			} catch (err) {
				run(true, err); // If an error is caught, the test passes.
			}
		}, true);

		runner.defineTest('Test error when setColorByRGBString with invalid RGB string', function (run) {
			try {
				const colorRGB = new RedGPU.ColorRGBA(0, 0, 0);
				colorRGB.setColorByRGBString("rgb(300,300,300)");
				run(false); // If it reaches here, the test fails.
			} catch (err) {
				run(true, err); // If an error is caught, the test passes.
			}
		}, true);
	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - create & getter',
	(runner) => {
		runner.defineTest('Test RedGPU.ColorRGBA creation from [255, 255, 255, 1]', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, 1);
			const expectedRGBA = [255, 255, 255, 1];
			run(
				colorRGBA.r === expectedRGBA[0]
				&& colorRGBA.g === expectedRGBA[1]
				&& colorRGBA.b === expectedRGBA[2]
				&& colorRGBA.a === expectedRGBA[3]
			);
		}, true);

		runner.defineTest('Test RedGPU.ColorRGBA alpha property for [255, 255, 255, 1]', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, 1);
			const expectedAlpha = 1;
			run(colorRGBA.a === expectedAlpha);
		}, true);
	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA Failure Test Group - Invalid alpha values',
	(runner) => {
		runner.defineTest('Test error when creating RedGPU.ColorRGBA with invalid alpha value - less than 0', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, -0.1); // Alpha value is less than 0.0
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

		runner.defineTest('Test error when creating RedGPU.ColorRGBA with invalid alpha value - greater than 1', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, 1.1); // Alpha value is greater than 1.0
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

	}
);

redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - getters',
	(runner) => {

		runner.defineTest('Test rgba getter', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, 1);
			let receivedRGBA = colorRGBA.rgba;
			let expectedRGBA = [255, 255, 255, 1];
			run(receivedRGBA.every((val, index) => val === expectedRGBA[index]));
		}, true);

		runner.defineTest('Test rgbaNormal getter', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(255, 255, 255, 1);
			let receivedRGBANormal = colorRGBA.rgbaNormal;
			let expectedRGBANormal = [1, 1, 1, 1];
			run(receivedRGBANormal.every((val, index) => val === expectedRGBANormal[index]));
		}, true);

	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - setColorByRGBAString',
	(runner) => {
		runner.defineTest('Test setColorByRGBAString with valid RGBA string', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
			colorRGBA.setColorByRGBAString("rgba(255,255,255,1)");
			let receivedRGBA = colorRGBA.rgba;
			let expectedRGBA = [255, 255, 255, 1];
			run(receivedRGBA.every((val, index) => val === expectedRGBA[index]));
		}, true);

		runner.defineTest('Test error when setColorByRGBAString with invalid RGBA string', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
				colorRGBA.setColorByRGBAString("rgba(300,300,300,1.2)");
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

	}
);
redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - setColorByRGBA (Success Group)',
	(runner) => {
		runner.defineTest('Test setColorByRGBA with valid RGB and Alpha values', function (run) {
			const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
			colorRGBA.setColorByRGBA(255, 255, 255, 1);
			let receivedRGBA = colorRGBA.rgba;
			let expectedRGBA = [255, 255, 255, 1];
			run(receivedRGBA.every((val, index) => val === expectedRGBA[index]));
		}, true);

		// Insert more success test cases here...
	}
);

redUnit.testGroup(
	'RedGPU.ColorRGBA Function Tests - setColorByRGBA (Failure Group)',
	(runner) => {
		runner.defineTest('Test error when setColorByRGBA with RGB values greater than 255', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
				colorRGBA.setColorByRGBA(256, 256, 256, 0.5); // RGB values are beyond the valid range (0-255).
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

		runner.defineTest('Test error when setColorByRGBA with Alpha value not between 0.0 and 1.0', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
				colorRGBA.setColorByRGBA(255, 255, 255, 1.2); // Alpha value is beyond the valid range (0.0-1.0).
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

		runner.defineTest('Test error when setColorByRGBA with negative RGB values', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
				colorRGBA.setColorByRGBA(-1, -1, -1, 0.5); // RGB values are negative.
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false);

		runner.defineTest('Test error when setColorByRGBA with negative Alpha value', function (run) {
			try {
				const colorRGBA = new RedGPU.ColorRGBA(0, 0, 0, 0);
				colorRGBA.setColorByRGBA(255, 255, 255, -1); // Alpha value is negative.
				run(true); // If it gets to here without throwing an error, the test fails.
			} catch (err) {
				run(false, err); // If an error is thrown, the test passes.
			}
		}, false)
	}
);
