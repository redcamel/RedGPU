import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

// Helper to check if a validation function correctly throws an error for an invalid input
const checkThrow = (fn, ...args) => {
    try {
        fn(...args);
        return false;
    } catch (e) {
        return true;
    }
};

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        // Valid Strings
        runner.defineTest('Valid: #ffffff', (run) => run(RedGPU.RuntimeChecker.isHexColor('#ffffff')), true);
        runner.defineTest('Valid: 0xffffff', (run) => run(RedGPU.RuntimeChecker.isHexColor('0xffffff')), true);
        runner.defineTest('Valid: #f00', (run) => run(RedGPU.RuntimeChecker.isHexColor('#f00')), true);
        
        // Invalid Strings
        runner.defineTest('Invalid: ffffff (no prefix)', (run) => run(RedGPU.RuntimeChecker.isHexColor('ffffff')), false);
        runner.defineTest('Invalid: #gggggg', (run) => run(RedGPU.RuntimeChecker.isHexColor('#gggggg')), false);
        runner.defineTest('Invalid: #abcd (4 digits)', (run) => run(RedGPU.RuntimeChecker.isHexColor('#abcd')), false);
        runner.defineTest('Invalid: empty string', (run) => run(RedGPU.RuntimeChecker.isHexColor('')), false);
        
        // Invalid Types
        runner.defineTest('Invalid Type: number (123)', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor(123)); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Invalid Type: boolean (true)', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor(true)); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Invalid Type: null', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor(null)); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Invalid Type: undefined', (run) => {
            try { run(RedGPU.RuntimeChecker.isHexColor(undefined)); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isUint',
    (runner) => {
        runner.defineTest('Valid: 10', (run) => run(RedGPU.RuntimeChecker.isUint(10)), true);
        runner.defineTest('Valid: 0', (run) => run(RedGPU.RuntimeChecker.isUint(0)), true);
        runner.defineTest('Invalid: -1', (run) => run(RedGPU.RuntimeChecker.isUint(-1)), false);
        runner.defineTest('Invalid: 10.5 (float)', (run) => run(RedGPU.RuntimeChecker.isUint(10.5)), false);
        runner.defineTest('Invalid: NaN', (run) => run(RedGPU.RuntimeChecker.isUint(NaN)), false);
        runner.defineTest('Invalid: Infinity', (run) => run(RedGPU.RuntimeChecker.isUint(Infinity)), false);
        runner.defineTest('Invalid Type: string ("10")', (run) => run(RedGPU.RuntimeChecker.isUint("10")), false);
        runner.defineTest('Invalid Type: null', (run) => run(RedGPU.RuntimeChecker.isUint(null)), false);
        runner.defineTest('Invalid Type: object ({})', (run) => run(RedGPU.RuntimeChecker.isUint({})), false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success: 123', (run) => run(!checkThrow(RedGPU.RuntimeChecker.validateNumber, 123)), true);
        runner.defineTest('Failure: string ("123")', (run) => run(checkThrow(RedGPU.RuntimeChecker.validateNumber, "123")), true);
        runner.defineTest('Failure: NaN', (run) => run(checkThrow(RedGPU.RuntimeChecker.validateNumber, NaN)), true);
        runner.defineTest('Failure: null', (run) => run(checkThrow(RedGPU.RuntimeChecker.validateNumber, null)), true);
        runner.defineTest('Failure: undefined', (run) => run(checkThrow(RedGPU.RuntimeChecker.validateNumber, undefined)), true);
        runner.defineTest('Failure: object', (run) => run(checkThrow(RedGPU.RuntimeChecker.validateNumber, {})), true);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumberRange',
    (runner) => {
        const v = RedGPU.RuntimeChecker.validateNumberRange;
        runner.defineTest('Success: 50 in [0, 100]', (run) => run(!checkThrow(v, 50, 0, 100)), true);
        runner.defineTest('Success: Boundary 0', (run) => run(!checkThrow(v, 0, 0, 100)), true);
        runner.defineTest('Success: Boundary 100', (run) => run(!checkThrow(v, 100, 0, 100)), true);
        runner.defineTest('Failure: Out of range (101)', (run) => run(checkThrow(v, 101, 0, 100)), true);
        runner.defineTest('Failure: value is NaN', (run) => run(checkThrow(v, NaN, 0, 100)), true);
        runner.defineTest('Failure: minRange is NaN', (run) => run(checkThrow(v, 50, NaN, 100)), true);
        runner.defineTest('Failure: maxRange is NaN', (run) => run(checkThrow(v, 50, 0, NaN)), true);
        runner.defineTest('Failure: string value', (run) => run(checkThrow(v, "50", 0, 100)), true);
        runner.defineTest('Failure: string minRange', (run) => run(checkThrow(v, 50, "0", 100)), true);
        runner.defineTest('Failure: null value', (run) => run(checkThrow(v, null, 0, 100)), true);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validatePositiveNumberRange',
    (runner) => {
        const v = RedGPU.RuntimeChecker.validatePositiveNumberRange;
        runner.defineTest('Success: 10 in [0, 100]', (run) => run(!checkThrow(v, 10, 0, 100)), true);
        runner.defineTest('Failure: Negative value (-1)', (run) => run(checkThrow(v, -1, 0, 100)), true);
        runner.defineTest('Failure: Negative minRange (-5)', (run) => run(checkThrow(v, 10, -5, 100)), true);
        runner.defineTest('Failure: value is NaN', (run) => run(checkThrow(v, NaN, 0, 100)), true);
        runner.defineTest('Failure: minRange is NaN', (run) => run(checkThrow(v, 10, NaN, 100)), true);
        runner.defineTest('Failure: maxRange is NaN', (run) => run(checkThrow(v, 10, 0, NaN)), true);
        runner.defineTest('Failure: string', (run) => run(checkThrow(v, "10", 0, 100)), true);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateUintRange',
    (runner) => {
        const v = RedGPU.RuntimeChecker.validateUintRange;
        runner.defineTest('Success: 10 in [0, 100]', (run) => run(!checkThrow(v, 10, 0, 100)), true);
        runner.defineTest('Failure: Float (10.5)', (run) => run(checkThrow(v, 10.5, 0, 100)), true);
        runner.defineTest('Failure: Negative (-1)', (run) => run(checkThrow(v, -1, 0, 100)), true);
        runner.defineTest('Failure: value is NaN', (run) => run(checkThrow(v, NaN, 0, 100)), true);
        runner.defineTest('Failure: min is NaN', (run) => run(checkThrow(v, 10, NaN, 100)), true);
        runner.defineTest('Failure: max is NaN', (run) => run(checkThrow(v, 10, 0, NaN)), true);
        runner.defineTest('Failure: Min > Max (10 in [100, 0])', (run) => run(checkThrow(v, 10, 100, 0)), true);
        runner.defineTest('Failure: string', (run) => run(checkThrow(v, "10", 0, 100)), true);
        runner.defineTest('Failure: null', (run) => run(checkThrow(v, null, 0, 100)), true);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateRedGPUContext',
    (runner) => {
        const v = RedGPU.RuntimeChecker.validateRedGPUContext;
        runner.defineTest('Success: valid context', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const pass = !checkThrow(v, redGPUContext);
                redGPUContext.destroy();
                run(pass);
            });
        }, true);

        runner.defineTest('Failure: plain object', (run) => run(checkThrow(v, {})), true);
        runner.defineTest('Failure: null', (run) => run(checkThrow(v, null)), true);
        runner.defineTest('Failure: undefined', (run) => run(checkThrow(v, undefined)), true);
        runner.defineTest('Failure: Other instance (Date)', (run) => run(checkThrow(v, new Date())), true);
        runner.defineTest('Failure: string', (run) => run(checkThrow(v, "context")), true);
    }
);