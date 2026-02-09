import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - calculateTangents');

redUnit.testGroup(
	'RedGPU.Math.calculateTangents',
	(runner) => {
		runner.defineTest('Basic tangent calculation', (run) => {
			const vertices = [
				-1, 1, 0,
				1, 1, 0,
				-1, -1, 0,
				1, -1, 0
			];
			const normals = [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1
			];
			const uvs = [
				0, 0,
				1, 0,
				0, 1,
				1, 1
			];
			const indices = [
				0, 2, 1,
				1, 2, 3
			];
			const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices);
			
			// For this setup, tangent should be along +X [1, 0, 0]
			run(tangents.length === 16 && tangents[0] === 1 && tangents[1] === 0 && tangents[2] === 0);
		}, true);

		runner.defineTest('Existing tangents reuse', (run) => {
			const vertices = [0,0,0, 1,0,0, 0,1,0];
			const normals = [0,0,1, 0,0,1, 0,0,1];
			const uvs = [0,0, 1,0, 0,1];
			const indices = [0,1,2];
			const existing = [0.707, 0.707, 0, 1, 0.707, 0.707, 0, 1, 0.707, 0.707, 0, 1];
			
			const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices, existing);
			run(Math.abs(tangents[0] - 0.707) < 0.001);
		}, true);
	}
);
