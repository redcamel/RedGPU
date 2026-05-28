import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        runner.defineTest('Success Test: Valid string formats (#prefix)', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor('#fff') && 
                RedGPU.RuntimeChecker.isHexColor('#ffffff') &&
                RedGPU.RuntimeChecker.isHexColor('#ABCDEF'));
        }, true);

        runner.defineTest('Success Test: Valid numeric formats', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor(0xfff) && 
                RedGPU.RuntimeChecker.isHexColor(0xffffff) &&
                RedGPU.RuntimeChecker.isHexColor(0x00FF00) &&
                RedGPU.RuntimeChecker.isHexColor(0));
        }, true);

        runner.defineTest('Failure Test: Invalid string prefix or no prefix', (run) => {
            // Strings with 0x are now failures. Strings must start with #.
            run(RedGPU.RuntimeChecker.isHexColor('0xfff') || 
                RedGPU.RuntimeChecker.isHexColor('0xffffff') || 
                RedGPU.RuntimeChecker.isHexColor('ffffff') || 
                RedGPU.RuntimeChecker.isHexColor('fff'));
        }, false);

        runner.defineTest('Failure Test: Invalid string characters or length', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor('#gggggg') || 
                RedGPU.RuntimeChecker.isHexColor('#12345') || 
                RedGPU.RuntimeChecker.isHexColor('#1234567') || 
                RedGPU.RuntimeChecker.isHexColor(''));
        }, false);

        runner.defineTest('Failure Test: Invalid numeric ranges or types', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor(-1) || 
                RedGPU.RuntimeChecker.isHexColor(0xFFFFFF + 1) || 
                RedGPU.RuntimeChecker.isHexColor(127.5) ||
                RedGPU.RuntimeChecker.isHexColor(NaN) ||
                RedGPU.RuntimeChecker.isHexColor(Infinity));
        }, false);

        runner.defineTest('Failure Test: Wrong types (null, undefined, etc.)', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor(null) || 
                RedGPU.RuntimeChecker.isHexColor(undefined) || 
                RedGPU.RuntimeChecker.isHexColor({}) || 
                RedGPU.RuntimeChecker.isHexColor([]));
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isUint',
    (runner) => {
        runner.defineTest('Success Test: Valid uints', (run) => {
            run(RedGPU.RuntimeChecker.isUint(0) && RedGPU.RuntimeChecker.isUint(100) && RedGPU.RuntimeChecker.isUint(4294967295));
        }, true);

        runner.defineTest('Failure Test: Negative or Float', (run) => {
            run(RedGPU.RuntimeChecker.isUint(-1) || RedGPU.RuntimeChecker.isUint(0.5) || RedGPU.RuntimeChecker.isUint(-0.1));
        }, false);

        runner.defineTest('Failure Test: NaN/Infinity', (run) => {
            run(RedGPU.RuntimeChecker.isUint(NaN) || RedGPU.RuntimeChecker.isUint(Infinity) || RedGPU.RuntimeChecker.isUint(-Infinity));
        }, false);

        runner.defineTest('Failure Test: Non-numbers', (run) => {
            run(RedGPU.RuntimeChecker.isUint("10") || RedGPU.RuntimeChecker.isUint(null) || RedGPU.RuntimeChecker.isUint(undefined) || RedGPU.RuntimeChecker.isUint({}));
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success Test: 123', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(123); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: 0 and negative', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(0); RedGPU.RuntimeChecker.validateNumber(-123); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: NaN', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: string "123"', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber("123"); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: null/undefined', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumberRange',
    (runner) => {
        runner.defineTest('Success Test: 50 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Boundary 0 and 100', (run) => {
            try { 
                RedGPU.RuntimeChecker.validateNumberRange(0, 0, 100); 
                RedGPU.RuntimeChecker.validateNumberRange(100, 0, 100); 
                run(true); 
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: 101 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(101, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: NaN input', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange(NaN, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: Wrong type (string)', (run) => {
            try { RedGPU.RuntimeChecker.validateNumberRange("50", 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validatePositiveNumberRange',
    (runner) => {
        runner.defineTest('Success Test: 10 in [5, 20]', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 5, 20); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: 0 at boundary', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(0, 0, 10); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: -1', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(-1, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: NaN', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(NaN, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateUintRange',
    (runner) => {
        runner.defineTest('Success Test: 10 in [0, 100]', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(10, 0, 100); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: 10.5 (float)', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(10.5, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: Out of range (101)', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(101, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: Negative (-1)', (run) => {
            try { RedGPU.RuntimeChecker.validateUintRange(-1, 0, 100); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateRedGPUContext',
    (runner) => {
        runner.defineTest('Success Test: Valid context', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const pass = RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
                    redGPUContext.destroy();
                    run(pass);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure Test: Plain object', (run) => {
            try { RedGPU.RuntimeChecker.validateRedGPUContext({}); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: null/undefined', (run) => {
            try { RedGPU.RuntimeChecker.validateRedGPUContext(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
