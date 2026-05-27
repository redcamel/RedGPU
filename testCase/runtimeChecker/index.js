import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        runner.defineTest('Success: Valid #ff0000', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor('#ff0000')); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Success: Valid 0xff0000', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor('0xff0000')); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: ff0000 (no prefix)', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor('ff0000')); } catch (e) { run(e); }
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
            try { run(RedGPU.RuntimeChecker.isUint(10)); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: Float (10.5)', (run) => {
            try { run(RedGPU.RuntimeChecker.isUint(10.5)); } catch (e) { run(e); }
        }, false);
        runner.defineTest('Failure: NaN', (run) => {
            try { run(RedGPU.RuntimeChecker.isUint(NaN)); } catch (e) { run(e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success: 123', (run) => {
            try { run(RedGPU.RuntimeChecker.validateNumber(123)); } catch (e) { run(e); }
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
            try { run(RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100)); } catch (e) { run(e); }
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
            try { run(RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 5, 20)); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: -1', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(-1, 0, 100); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateUintRange',
    (runner) => {
        runner.defineTest('Success: 10 in [0, 100]', (run) => {
            try { run(RedGPU.RuntimeChecker.validateUintRange(10, 0, 100)); } catch (e) { run(e); }
        }, true);
        runner.defineTest('Failure: 10.5 (not uint)', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(10.5, 0, 100); run(true); } catch (e) { run(false); }
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
                    const pass = RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
                    redGPUContext.destroy();
                    run(pass);
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