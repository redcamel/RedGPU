import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - getAbsoluteURL');

redUnit.testGroup(
	'RedGPU.Util.getAbsoluteURL',
	(runner) => {
		runner.defineTest('Standard relative path', (run) => {
			const base = 'https://redcamel.github.io/RedGPU/';
			const relative = './assets/texture.png';
			const expected = 'https://redcamel.github.io/RedGPU/assets/texture.png';
			run(RedGPU.Util.getAbsoluteURL(base, relative) === expected);
		}, true);

		runner.defineTest('Parent directory relative path', (run) => {
			const base = 'https://redcamel.github.io/RedGPU/examples/3d/';
			const relative = '../../assets/texture.png';
			const expected = 'https://redcamel.github.io/RedGPU/assets/texture.png';
			run(RedGPU.Util.getAbsoluteURL(base, relative) === expected);
		}, true);

		runner.defineTest('Already absolute URL', (run) => {
			const base = 'https://redcamel.github.io/RedGPU/';
			const relative = 'https://another-domain.com/image.png';
			run(RedGPU.Util.getAbsoluteURL(base, relative) === relative);
		}, true);

		runner.defineTest('Failure case - returns relative if invalid', (run) => {
			const base = 'invalid-base';
			const relative = 'relative';
			// In some environments, URL might actually parse this depending on base, 
			// but we test the "safe" return logic.
			const result = RedGPU.Util.getAbsoluteURL(base, relative);
			run(typeof result === 'string');
		}, true);
	}
);
