import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'
import * as RedGPU from "../../dist";

const redUnit = new RedUnit('RedGPU - formatBytes')

redUnit.testGroup(
	'JavaScript FormatBytes Function Test Group',
	(runner) => {
		runner.defineTest('Test 0 bytes', function (run) {
			run(RedGPU.Util.formatBytes(0));
		}, "0 Bytes");

		runner.defineTest('Test 1024 bytes', function (run) {
			run(RedGPU.Util.formatBytes(1024));
		}, "1 KB");

		runner.defineTest('Test 1048576 bytes', function (run) {
			run(RedGPU.Util.formatBytes(1048576));
		}, "1 MB");

		runner.defineTest('Test 1073741824 bytes', function (run) {
			run(RedGPU.Util.formatBytes(1073741824));
		}, "1 GB");

		runner.defineTest('Test negative input', function (run) {
			let negativeTest;
			try {
				RedGPU.Util.formatBytes(-1024);
				negativeTest = true;
				run(negativeTest);
			} catch (e) {
				negativeTest = false;
				run(negativeTest, e);
			}

		}, false);
		runner.defineTest('Test floating point input', function (run) {
			let negativeTest;
			try {
				RedGPU.Util.formatBytes(1024.1);
				negativeTest = true;
				run(negativeTest);
			} catch (e) {
				negativeTest = false;
				run(negativeTest, e);
			}

		}, false);
		runner.defineTest('Test string input', function (run) {
			let stringTest;
			try {
				RedGPU.Util.formatBytes("1024");
				stringTest = true;
				run(stringTest);
			} catch (e) {
				stringTest = false;
				run(stringTest, e);
			}

		}, false);
	}
);
