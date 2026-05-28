import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RuntimeChecker');

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isHexColor',
    (runner) => {
        runner.defineTest('Success Test: Valid formats', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor('#fff') && 
                RedGPU.RuntimeChecker.isHexColor('#ffffff') && 
                RedGPU.RuntimeChecker.isHexColor('0xffffff'));
        }, true);

        runner.defineTest('Failure Test: Invalid string', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor('ffffff') || 
                RedGPU.RuntimeChecker.isHexColor('#gggggg') || 
                RedGPU.RuntimeChecker.isHexColor(''));
        }, false);

        runner.defineTest('Failure Test: Wrong types', (run) => {
            run(RedGPU.RuntimeChecker.isHexColor(123) || 
                RedGPU.RuntimeChecker.isHexColor(null) || 
                RedGPU.RuntimeChecker.isHexColor(undefined));
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.isUint',
    (runner) => {
        runner.defineTest('Success Test: Valid uints', (run) => {
            run(RedGPU.RuntimeChecker.isUint(0) && RedGPU.RuntimeChecker.isUint(100));
        }, true);

        runner.defineTest('Failure Test: Negative or Float', (run) => {
            run(RedGPU.RuntimeChecker.isUint(-1) || RedGPU.RuntimeChecker.isUint(0.5));
        }, false);

        runner.defineTest('Failure Test: NaN/Infinity', (run) => {
            run(RedGPU.RuntimeChecker.isUint(NaN) || RedGPU.RuntimeChecker.isUint(Infinity));
        }, false);

        runner.defineTest('Failure Test: Non-numbers', (run) => {
            run(RedGPU.RuntimeChecker.isUint("10") || RedGPU.RuntimeChecker.isUint(null));
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validateNumber',
    (runner) => {
        runner.defineTest('Success Test: 123', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(123); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: NaN', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber(NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: string "123"', (run) => {
            try { RedGPU.RuntimeChecker.validateNumber("123"); run(true); } catch (e) { run(false, e); }
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
    }
);

redUnit.testGroup(
    'RedGPU.RuntimeChecker.validatePositiveNumberRange',
    (runner) => {
        runner.defineTest('Success Test: 10 in [5, 20]', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 5, 20); run(true); } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: -1', (run) => {
            try { RedGPU.RuntimeChecker.validatePositiveNumberRange(-1, 0, 100); run(true); } catch (e) { run(false, e); }
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

        runner.defineTest('Failure Test: null', (run) => {
            try { RedGPU.RuntimeChecker.validateRedGPUContext(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
