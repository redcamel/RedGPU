import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Texture Utils');

redUnit.testGroup(
	'RedGPU.Util.getMipLevelCount',
	(runner) => {
		runner.defineTest('1024x1024', (run) => {
			run(RedGPU.Util.getMipLevelCount(1024, 1024) === 11);
		}, true);

		runner.defineTest('1x1', (run) => {
			run(RedGPU.Util.getMipLevelCount(1, 1) === 1);
		}, true);

		runner.defineTest('512x256', (run) => {
			run(RedGPU.Util.getMipLevelCount(512, 256) === 10);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Util.calculateTextureByteSize',
	(runner) => {
		runner.defineTest('rgba8unorm 1024x1024', (run) => {
			const mockTexture = {
				width: 1024,
				height: 1024,
				depthOrArrayLayers: 1,
				format: 'rgba8unorm',
				sampleCount: 1,
				usage: 0
			};
			const size = RedGPU.Util.calculateTextureByteSize(mockTexture);
			// 1024 * 1024 * 4 = 4194304
			run(size === 4194304);
		}, true);

		runner.defineTest('r8unorm 512x512', (run) => {
			const mockTexture = {
				width: 512,
				height: 512,
				depthOrArrayLayers: 1,
				format: 'r8unorm',
				sampleCount: 1,
				usage: 0
			};
			const size = RedGPU.Util.calculateTextureByteSize(mockTexture);
			// 512 * 512 * 1 = 262144
			run(size === 262144);
		}, true);
	}
);
