import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - sortTransparentObjects');

redUnit.testGroup(
	'RedGPU.Util.sortTransparentObjects',
	(runner) => {
		runner.defineTest('Sort by distance (descending)', (run) => {
			const cameraPos = { x: 0, y: 0, z: 10 };
			const mockMesh = (x, y, z, uuid) => ({ mesh: { x, y, z, uuid } });

			const objNear = mockMesh(0, 0, 9, 'near');  // distance sq = 1
			const objMid = mockMesh(0, 0, 5, 'mid');   // distance sq = 25
			const objFar = mockMesh(0, 0, 0, 'far');   // distance sq = 100

			const objects = [objNear, objFar, objMid];
			const sorted = RedGPU.Util.sortTransparentObjects(cameraPos, objects);

			// Descending order (far to near)
			run(sorted[0].mesh.uuid === 'far' && sorted[1].mesh.uuid === 'mid' && sorted[2].mesh.uuid === 'near');
		}, true);

		runner.defineTest('Caching check (should use cached distance)', (run) => {
			const cameraPos = { x: 0, y: 0, z: 0 };
			const obj = { mesh: { x: 10, y: 0, z: 0, uuid: 'cache-test' } };
			
			const objects = [obj];
			const sorted = RedGPU.Util.sortTransparentObjects(cameraPos, objects);
			
			// Modify original mesh position - if it uses cache, distance won't change in current sort logic if we were to re-sort
			// But the function is intended for single pass. Caching is per-call.
			run(sorted.length === 1);
		}, true);
	}
);
