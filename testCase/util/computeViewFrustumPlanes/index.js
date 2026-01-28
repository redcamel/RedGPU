import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - computeViewFrustumPlanes');

redUnit.testGroup(
	'RedGPU.Util.computeViewFrustumPlanes',
	(runner) => {
		runner.defineTest('Identity matrices', (run) => {
			const projectionMTX = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const cameraMTX = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const planes = RedGPU.Util.computeViewFrustumPlanes(projectionMTX, cameraMTX);
			
			// Should return 6 planes
			run(planes.length === 6);
		}, true);

		runner.defineTest('Normalization check', (run) => {
			const projectionMTX = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const cameraMTX = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const planes = RedGPU.Util.computeViewFrustumPlanes(projectionMTX, cameraMTX);
			
			// Norm of (A, B, C) should be 1
			const allNormalized = planes.every(p => {
				const norm = Math.sqrt(p[0]*p[0] + p[1]*p[1] + p[2]*p[2]);
				return Math.abs(norm - 1) < 0.0001;
			});
			run(allNormalized);
		}, true);
	}
);
