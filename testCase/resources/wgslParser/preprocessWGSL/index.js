import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - preprocessWGSL');

const preprocessWGSL = RedGPU.Resource?.CoreWGSLParser?.preprocessWGSL;

if (!preprocessWGSL) {
    console.error("CRITICAL: preprocessWGSL function not found.");
}

redUnit.testGroup(
    'preprocessWGSL - Core Functionality (SystemCodeManager)',
    (runner) => {
        runner.defineTest('Flat Path Include (SYSTEM_UNIFORM)', function (run) {
            // [KO] 최상위 레벨의 SYSTEM_UNIFORM 인클루드 테스트
            // [EN] Test top-level SYSTEM_UNIFORM include
            const testCode = `#redgpu_include SYSTEM_UNIFORM`;
            try {
                const result = preprocessWGSL(testCode);
                const hasContent = result.defaultSource.includes('struct SystemUniform');
                const tagRemoved = !result.defaultSource.includes('#redgpu_include');
                run(hasContent && tagRemoved);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Dot-Notation Path Include (math.getHash1D)', function (run) {
            // [KO] 계층 구조를 가진 math.getHash1D 인클루드 테스트
            // [EN] Test hierarchical math.getHash1D include
            const testCode = `#redgpu_include math.getHash1D`;
            try {
                const result = preprocessWGSL(testCode);
                const hasContent = result.defaultSource.includes('fn getHash1D');
                const tagRemoved = !result.defaultSource.includes('#redgpu_include');
                run(hasContent && tagRemoved);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Dot-Notation Path Include (color.get_luminance)', function (run) {
            // [KO] 계층 구조를 가진 color.get_luminance 인클루드 테스트
            // [EN] Test hierarchical color.get_luminance include
            const testCode = `#redgpu_include color.get_luminance`;
            try {
                const result = preprocessWGSL(testCode);
                const hasContent = result.defaultSource.includes('fn get_luminance');
                run(hasContent);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Define Logic (REDGPU_DEFINE_*)', function (run) {
            const code = `let x = REDGPU_DEFINE_TILE_COUNT_X;`;
            try {
                const result = preprocessWGSL(code);
                const pass = !result.defaultSource.includes('REDGPU_DEFINE_TILE_COUNT_X') && result.defaultSource.includes('let x = ');
                run(pass);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Duplicate Include Prevention (Include Once)', function (run) {
            // [KO] 동일한 모듈을 두 번 인클루드했을 때 한 번만 처리되는지 테스트
            // [EN] Test if duplicate includes are handled correctly (only once)
            const testCode = `#redgpu_include math.PI\n#redgpu_include math.PI`;
            try {
                // [KO] 식별 이름을 함께 전달하여 테스트
                const result = preprocessWGSL(testCode, 'TEST_DUPLICATE_INCLUDE');
                
                // [KO] PI 정의 패턴을 찾습니다. (공백 무시)
                const piPattern = /const\s+PI\s*:\s*f32\s*=\s*3\.141592653589793\s*;/g;
                const matches = result.defaultSource.match(piPattern);
                
                // [KO] 매칭된 결과가 정확히 1개여야 함
                const pass = matches && matches.length === 1;
                run(pass);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'preprocessWGSL - Conditional Logic',
    (runner) => {
        runner.defineTest('Basic #redgpu_if/else', function (run) {
            const code = `
                #redgpu_if USE_TEST
                let testValue = 1;
                #redgpu_else
                let testValue = 0;
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const gen = result.shaderSourceVariant;

                const srcTrue = gen.getVariant('USE_TEST');
                const srcFalse = gen.getVariant('none');

                const checkTrue = srcTrue.includes('let testValue = 1;') && !srcTrue.includes('let testValue = 0;');
                const checkFalse = !srcFalse.includes('let testValue = 1;') && srcFalse.includes('let testValue = 0;');

                run(checkTrue && checkFalse);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Nested #redgpu_if', function (run) {
            const code = `
                #redgpu_if OUTER
                    #redgpu_if INNER
                    let nested = 1;
                    #redgpu_else
                    let nested = 0;
                    #redgpu_endIf
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const gen = result.shaderSourceVariant;

                const srcBoth = gen.getVariant('OUTER+INNER');
                const srcOuterOnly = gen.getVariant('OUTER');

                const checkBoth = srcBoth.includes('let nested = 1;');
                const checkOuterOnly = srcOuterOnly.includes('let nested = 0;');

                run(checkBoth && checkOuterOnly);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'preprocessWGSL - Error Handling',
    (runner) => {
        runner.defineTest('Mismatched #redgpu_endIf', function (run) {
            const code = `
                #redgpu_if TEST
                let x = 1;
                #redgpu_endIf
                #redgpu_endIf
            `;
            try {
                preprocessWGSL(code);
                run(false, 'Should have thrown an error for mismatched endIf');
            } catch (e) {
                run(e.message.includes('Mismatched #redgpu_endIf'));
            }
        }, true);

        runner.defineTest('Invalid Include Path (Non-existent member)', function (run) {
            // [KO] 존재하지 않는 경로 인클루드 시 에러 발생 테스트
            const code = `#redgpu_include non.existent.path`;
            try {
                preprocessWGSL(code, 'TEST_INVALID_PATH');
                run(false, 'Should have thrown an error for non-existent path');
            } catch (e) {
                run(e.message.includes('Path not found'));
            }
        }, true);

        runner.defineTest('Invalid Include Target (Non-string member)', function (run) {
            // [KO] math는 객체(Namespace)이지 문자열이 아니므로 인클루드 에러 발생해야 함
            // [EN] math is an object (Namespace), not a string, so include should throw an error
            const code = `#redgpu_include math`;
            try {
                preprocessWGSL(code, 'TEST_INVALID_TARGET');
                run(false, 'Should have thrown an error for non-string target');
            } catch (e) {
                run(e.message.includes('Target is not a WGSL string'));
            }
        }, true);
    }
);
