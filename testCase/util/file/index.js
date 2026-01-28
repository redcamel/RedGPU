import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - file');
redUnit.testGroup(
	'JavaScript RedGPU.Util Function Tests',
	(runner) => {
		//Testing getFilePath function with various inputs
		runner.defineTest('Test getFilePath - simple path', function (run) {
			const filePath = '/home/user/project/file.txt';
			run(RedGPU.Util.getFilePath(filePath));
		}, '/home/user/project/');

		runner.defineTest('Test getFilePath - nested path', function (run) {
			const filePath = '/home/user/project/subdirectory/file.txt';
			run(RedGPU.Util.getFilePath(filePath));
		}, '/home/user/project/subdirectory/');

		//Testing getFileName function with various inputs
		runner.defineTest('Test getFileName - jpg file', function (run) {
			const filePath = '/home/user/project/image.jpg';
			run(RedGPU.Util.getFileName(filePath));
		}, 'image.jpg');

		runner.defineTest('Test getFileName - no extension', function (run) {
			const filePath = '/home/user/project/file';
			run(RedGPU.Util.getFileName(filePath));
		}, 'file');

		//Testing getFileExtension function with various inputs
		runner.defineTest('Test getFileExtension - png file', function (run) {
			const filePath = '/home/user/project/image.png';
			run(RedGPU.Util.getFileExtension(filePath));
		}, 'png');

		runner.defineTest('Test getFileExtension - no extension', function (run) {
			const filePath = '/home/user/project/file';
			run(RedGPU.Util.getFileExtension(filePath));
		}, '');
	}
);
redUnit.testGroup(
	'JavaScript RedGPU.Util Function Tests',
	(runner) => {
		// Failure case for getFilePath function
		runner.defineTest('Test getFilePath - non-string input', function (run) {
			let negativeTest, error;
			try {
				// Passing number instead of string
				RedGPU.Util.getFilePath(123);
				negativeTest = true;
			} catch (e) {
				negativeTest = false;
				error = e

			}
			run(negativeTest, error);

		}, false);

		// Failure case for getFileName function
		runner.defineTest('Test getFileName - non-string input', function (run) {
			let negativeTest, error;
			try {
				// Passing number instead of string
				RedGPU.Util.getFileName(123);
				negativeTest = true;
			} catch (e) {
				negativeTest = false;
				error = e
			}
			run(negativeTest, error);

		}, false);

		// Failure case for getFileExtension function
		runner.defineTest('Test getFileExtension - non-string input', function (run) {
			let negativeTest, error;
			try {
				// Passing number instead of string
				RedGPU.Util.getFileExtension(123);
				negativeTest = true;
			} catch (e) {
				negativeTest = false;
				error = e
			}
			run(negativeTest, error);

		}, false);
	}
);
