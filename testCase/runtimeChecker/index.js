import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        runner.defineTest('Success: Valid #ff0000', (run) => {
            try { if (RedGPU.RuntimeChecker.isHexColor('#ff0000')) run(true); else run(false); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Success: Valid 0xff0000', (run) => {
            try { if (RedGPU.RuntimeChecker.isHexColor('0xff0000')) run(true); else run(false); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: ff0000 (no prefix)', (run) => {
            try { if (RedGPU.RuntimeChecker.isHexColor('ff0000')) run(true); else run(false); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: invalid chars', (run) => {
            try { if (RedGPU.RuntimeChecker.isHexColor('#GG0000')) run(true); else run(false); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: invalid Type - number', (run) => {
            try { RedGPU.RuntimeChecker.isHexColor(123); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isUint',
    (runner) => {
        runner.defineTest('Success: Positive integer (10)', (run) => {
            try { if (RedGPU.RuntimeChecker.isUint(10)) run(true); else run(false); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: Float (10.5)', (run) => {
            try { if (RedGPU.RuntimeChecker.isUint(10.5)) run(true); else run(false); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: string ("10")', (run) => {
            try { if (RedGPU.RuntimeChecker.isUint("10")) run(true); else run(false); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: NaN', (run) => {
            try { if (RedGPU.RuntimeChecker.isUint(NaN)) run(true); else run(false); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success: 123', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(123); run(true); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: "123"', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber("123"); run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: NaN', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(NaN); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumberRange',
    (runner) => {
        runner.defineTest('Success: 50 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100); run(true); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: 150 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(150, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: value is NaN', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(NaN, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validatePositiveNumberRange',
    (runner) => {
        runner.defineTest('Success: 10 in [5, 20]', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 5, 20); run(true); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: -1', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(-1, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: value is NaN', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(NaN, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateUintRange',
    (runner) => {
        runner.defineTest('Success: 10 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(10, 0, 100); run(true); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: 10.5 (not uint)', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(10.5, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: value is NaN', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(NaN, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateRedGPUContext',
    (runner) => {
        runner.defineTest('Success: valid context', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Failure: plain object', (run) => {
            try { RedGPU.RuntimeChecker.validateRedGPUContext({}); run(true); } catch (e) { run(false); }
        }, false);
    }
);