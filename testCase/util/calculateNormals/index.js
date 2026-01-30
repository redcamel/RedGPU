import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - calculateNormals');

redUnit.testGroup(
	'RedGPU.Math.calculateNormals',
	(runner) => {
		runner.defineTest('Flat plane facing +Z', (run) => {
			const vertices = [
				-1, 1, 0,  // top left
				1, 1, 0,   // top right
				-1, -1, 0, // bottom left
				1, -1, 0   // bottom right
			];
			const indices = [
				0, 2, 1,
				1, 2, 3
			];
			const normals = RedGPU.Math.calculateNormals(vertices, indices);
			
			// All normals should be [0, 0, 1] or [0, 0, -1] depending on winding.
			// cross(v2-v1, v0-v1)
			// Triangle 0: (0, 2, 1) -> v1=(1,1,0), v2=(-1,-1,0), v0=(-1,1,0)
			// v1 = p2 - p1 = (-1-1, -1-1, 0) = (-2, -2, 0)
			// v2 = p0 - p1 = (-1-1, 1-1, 0) = (-2, 0, 0)
			// cross(v1, v2) = (0, 0, (-2*0) - (-2*-2)) = (0, 0, -4) -> normalized [0, 0, -1]
			
			const expected = [0, 0, -1];
			const pass = normals.every((v, i) => Math.abs(v - expected[i % 3]) < 0.0001);
			run(pass);
		}, true);

		runner.defineTest('Automatic index generation', (run) => {
			const vertices = [
				-1, 1, 0,
				-1, -1, 0,
				1, 1, 0
			];
			// No indices provided
			const normals = RedGPU.Math.calculateNormals(vertices, []);
			run(normals.length === 9);
		}, true);
	}
);
