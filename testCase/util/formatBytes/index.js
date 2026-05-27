import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - formatBytes');

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Success Cases',
    (runner) => {
        runner.defineTest('Success: 0 Bytes', (run) => {
            try { if (RedGPU.Util.formatBytes(0) === '0 Bytes') run(true); else run(false); } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: KB threshold', (run) => {
            try { if (RedGPU.Util.formatBytes(1024) === '1 KB') run(true); else run(false); } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Decimal precision', (run) => {
            try { if (RedGPU.Util.formatBytes(1234567, 4) === '1.1774 MB') run(true); else run(false); } catch (e) { run(e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Failure Cases',
    (runner) => {
        runner.defineTest('Failure: Negative value', (run) => {
            try { RedGPU.Util.formatBytes(-1); run(true); } catch (e) { run(false); }
        }, false);

        runner.defineTest('Failure: Float value', (run) => {
            try { RedGPU.Util.formatBytes(1024.5); run(true); } catch (e) { run(false); }
        }, false);

        runner.defineTest('Failure: NaN input', (run) => {
            try { RedGPU.Util.formatBytes(NaN); run(true); } catch (e) { run(false); }
        }, false);

        runner.defineTest('Failure: String input', (run) => {
            try { RedGPU.Util.formatBytes("1024"); run(true); } catch (e) { run(false); }
        }, false);
    }
);