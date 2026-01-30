import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - matToEuler');

redUnit.testGroup(
	'JavaScript matToEuler Function Test 90 degree',
	(runner) => {
		runner.defineTest('Test identity matrix', function (run) {
			const identity = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(identity));
		}, [0, 0, 0]);

		runner.defineTest('Test 90 degree rotation about Y', function (run) {
			const rotationAboutY = [
				0, 0, 1, 0,
				0, 1, 0, 0,
				-1, 0, 0, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutY));
		}, [0, -Math.PI / 2, 0]);

		runner.defineTest('Test 90 degree rotation about X', function (run) {
			const rotationAboutX = [
				1, 0, 0, 0,
				0, 0, -1, 0,
				0, 1, 0, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutX));
		}, [-Math.PI / 2, 0, 0]);

		runner.defineTest('Test 90 degree rotation about Z', function (run) {
			const rotationAboutZ = [
				0, 1, 0, 0,
				-1, 0, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutZ));
		}, [0, 0, Math.PI / 2]);

	}
)
redUnit.testGroup(
	'JavaScript matToEuler Function Test -90 degree',
	(runner) => {

		runner.defineTest('Test -90 degree rotation about Y', function (run) {
			const rotationAboutY = [
				0, 0, -1, 0,
				0, 1, 0, 0,
				1, 0, 0, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutY));
		}, [0, Math.PI / 2, 0]);

		runner.defineTest('Test -90 degree rotation about X', function (run) {
			const rotationAboutX = [
				1, 0, 0, 0,
				0, 0, 1, 0,
				0, -1, 0, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutX));
		}, [Math.PI / 2, 0, 0]);

		runner.defineTest('Test -90 degree rotation about Z', function (run) {
			const rotationAboutZ = [
				0, -1, 0, 0,
				1, 0, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutZ));
		}, [0, 0, -Math.PI / 2]);

	}
)

redUnit.testGroup(
	'JavaScript matToEuler Function Test 45 degree',
	(runner) => {

		runner.defineTest('Test 45 degree rotation about Y', function (run) {
			const rotationAboutY = [
				Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2, 0,
				0, 1, 0, 0,
				-Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2, 0,
				0, 0, 0, 1
			];
			run([
					RedGPU.Math.matToEuler(rotationAboutY)[0],
					+RedGPU.Math.matToEuler(rotationAboutY)[1].toFixed(15),
					RedGPU.Math.matToEuler(rotationAboutY)[2]
				]
			);
		}, [0, -((Math.PI / 4).toFixed(15)), 0]);

		runner.defineTest('Test 45 degree rotation about X', function (run) {
			const rotationAboutX = [
				1, 0, 0, 0,
				0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0,
				0, Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutX));
		}, [-Math.PI / 4, 0, 0]);

		runner.defineTest('Test 45 degree rotation about Z', function (run) {
			const rotationAboutZ = [
				Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0, 0,
				Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];
			run(RedGPU.Math.matToEuler(rotationAboutZ));
		}, [0, 0, -Math.PI / 4]);

	}
)
