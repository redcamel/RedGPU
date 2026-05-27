import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - formatBytes');

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Success Cases',
    (runner) => {
        runner.defineTest('Success: 0 Bytes', (run) => {
            try { run(RedGPU.Util.formatBytes(0)); } catch (e) { run(null, e); }
        }, '0 Bytes');

        runner.defineTest('Success: KB threshold check', (run) => {
            try { run(RedGPU.Util.formatBytes(1024)); } catch (e) { run(null, e); }
        }, '1 KB');

        runner.defineTest('Success: Decimal precision (4)', (run) => {
            try { run(RedGPU.Util.formatBytes(1234567, 4)); } catch (e) { run(null, e); }
        }, '1.1774 MB');
    }
);

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Failure Cases',
    (runner) => {
        runner.defineTest('Failure: Negative value', (run) => {
            try { RedGPU.Util.formatBytes(-1); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: NaN input', (run) => {
            try { RedGPU.Util.formatBytes(NaN); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);