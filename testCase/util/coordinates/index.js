import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Coordinates');

redUnit.testGroup(
	'RedGPU.Util.localToWorld / worldToLocal',
	(runner) => {
		runner.defineTest('Identity matrix - localToWorld', (run) => {
			const mtx = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const pos = RedGPU.Util.localToWorld(mtx, 1, 2, 3);
			run(pos[0] === 1 && pos[1] === 2 && pos[2] === 3);
		}, true);

		runner.defineTest('Translated matrix - localToWorld', (run) => {
			const mtx = [1,0,0,0, 0,1,0,0, 0,0,1,0, 10,20,30,1];
			const pos = RedGPU.Util.localToWorld(mtx, 1, 1, 1);
			run(pos[0] === 11 && pos[1] === 21 && pos[2] === 31);
		}, true);

		runner.defineTest('Identity matrix - worldToLocal', (run) => {
			const mtx = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const pos = RedGPU.Util.worldToLocal(mtx, 1, 2, 3);
			run(pos[0] === 1 && pos[1] === 2 && pos[2] === 3);
		}, true);

		runner.defineTest('Translated matrix - worldToLocal', (run) => {
			const mtx = [1,0,0,0, 0,1,0,0, 0,0,1,0, 10,20,30,1];
			const pos = RedGPU.Util.worldToLocal(mtx, 11, 21, 31);
			run(Math.abs(pos[0] - 1) < 0.0001 && Math.abs(pos[1] - 1) < 0.0001 && Math.abs(pos[2] - 1) < 0.0001);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Util.getScreenPoint',
	(runner) => {
		runner.defineTest('Mock view check', (run) => {
			const mockView = {
				constructor: { name: 'View3D' },
				noneJitterProjectionMatrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
				rawCamera: { modelMatrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1] },
				pixelRectArray: [0, 0, 100, 100]
			};
			const targetMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const point = RedGPU.Util.getScreenPoint(mockView, targetMatrix);
			
			// Center of screen [50, 50]
			run(point[0] === 50 && point[1] === 50);
		}, true);
	}
);
