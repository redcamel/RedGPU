import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - copyGPUBuffer');

redUnit.testGroup(
	'RedGPU.Util.copyGPUBuffer',
	(runner) => {
		runner.defineTest('Mock call check', (run) => {
			let copyBufferToBufferCalled = false;
			let submitCalled = false;

			const mockCommandEncoder = {
				copyBufferToBuffer: () => { copyBufferToBufferCalled = true; },
				finish: () => ({})
			};

			const mockBufferSrc = { size: 100 };
			const mockBufferDst = { size: 100 };

			RedGPU.Util.copyGPUBuffer(mockCommandEncoder, mockBufferSrc, mockBufferDst);

			run(copyBufferToBufferCalled);
		}, true);
	}
);
