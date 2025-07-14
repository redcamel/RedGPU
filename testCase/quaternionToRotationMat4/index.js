import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - quaternionToRotationMat4');
redUnit.testGroup('JavaScript quaternionToRotationMat4 Function Test', (runner) => {
	runner.defineTest('Test 0 degree rotation', function (run) {
		var identityQuaternion = [0, 0, 0, 1];
		run(RedGPU.Util.quaternionToRotationMat4(identityQuaternion, []));
	}, [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
	runner.defineTest('Test 90 degree rotation about Y', function (run) {
		var rotationQuaternionAboutY90 = [0, Math.sin(Math.PI / 2), 0, Math.cos(Math.PI / 2)];
		run(RedGPU.Util.quaternionToRotationMat4(rotationQuaternionAboutY90, []));
	}, [
		-1, 0, -1.2246467991473532e-16, 0,
		0, 1, 0, 0,
		1.2246467991473532e-16, 0, -1, 0,
		0, 0, 0, 1
	]);

	runner.defineTest('Test 180 degree rotation about Y', function (run) {
		var rotationQuaternionAboutY = [0, Math.sin(Math.PI), 0, Math.cos(Math.PI)];
		run(RedGPU.Util.quaternionToRotationMat4(rotationQuaternionAboutY, []));
	}, [
		1, 0, 2.4492935982947064e-16, 0,
		0, 1, 0, 0,
		-2.4492935982947064e-16, 0, 1, 0,
		0, 0, 0, 1
	]);
});
