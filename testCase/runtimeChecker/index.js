import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        runner.defineTest('Valid: #ff0000', (run) => run(RedGPU.RuntimeChecker.isHexColor('#ff0000')), true);
        runner.defineTest('Valid: 0xff0000', (run) => run(RedGPU.RuntimeChecker.isHexColor('0xff0000')), true);
        runner.defineTest('Valid: #f00', (run) => run(RedGPU.RuntimeChecker.isHexColor('#f00')), true);
        runner.defineTest('Invalid: ff0000 (no prefix)', (run) => run(RedGPU.RuntimeChecker.isHexColor('ff0000')), false);
        runner.defineTest('Invalid: #GG0000 (invalid hex chars)', (run) => run(RedGPU.RuntimeChecker.isHexColor('#GG0000')), false);
        runner.defineTest('Invalid: #abcd (4 digits)', (run) => run(RedGPU.RuntimeChecker.isHexColor('#abcd')), false);
        runner.defineTest('Invalid Type: number 123', (run) => {
            try { RedGPU.RuntimeChecker.isHexColor(123); run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Invalid Type: null', (run) => {
            try { RedGPU.RuntimeChecker.isHexColor(null); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isUint',
    (runner) => {
        runner.defineTest('Positive integer (10)', (run) => run(RedGPU.RuntimeChecker.isUint(10)), true);
        runner.defineTest('Zero (0)', (run) => run(RedGPU.RuntimeChecker.isUint(0)), true);
        runner.defineTest('Negative integer (-1)', (run) => run(RedGPU.RuntimeChecker.isUint(-1)), false);
        runner.defineTest('Float (10.5)', (run) => run(RedGPU.RuntimeChecker.isUint(10.5)), false);
        runner.defineTest('NaN', (run) => run(RedGPU.RuntimeChecker.isUint(NaN)), false);
        runner.defineTest('Infinity', (run) => run(RedGPU.RuntimeChecker.isUint(Infinity)), false);
        runner.defineTest('String ("10")', (run) => run(RedGPU.RuntimeChecker.isUint("10")), false);
        runner.defineTest('Empty string ("")', (run) => run(RedGPU.RuntimeChecker.isUint("")), false);
        runner.defineTest('Boolean (true)', (run) => run(RedGPU.RuntimeChecker.isUint(true)), false);
        runner.defineTest('Null', (run) => run(RedGPU.RuntimeChecker.isUint(null)), false);
        runner.defineTest('Undefined', (run) => run(RedGPU.RuntimeChecker.isUint(undefined)), false);
        runner.defineTest('Object ({})', (run) => run(RedGPU.RuntimeChecker.isUint({})), false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success: 123', (run) => {
            try { run(RedGPU.RuntimeChecker.validateNumber(123)); } catch (e) { run(false); }
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
            try { run(RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100)); } catch (e) { run(false); }
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
            try { run(RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 5, 20)); } catch (e) { run(false); }
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
            try { run(RedGPU.RuntimeChecker.validateUintRange(10, 0, 100)); } catch (e) { run(false); }
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
                    const pass = RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
                    redGPUContext.destroy();
                    run(pass);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            });
        }, true);

        runner.defineTest('Failure: plain object', (run) => {
            try { RedGPU.RuntimeChecker.validateRedGPUContext({}); run(true); } catch (e) { run(false); }
        }, false);
    }
);