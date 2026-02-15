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

        runner.defineTest('Dot-Notation Path Include (math.hash12)', function (run) {
            // [KO] 계층 구조를 가진 math.hash12 인클루드 테스트
            // [EN] Test hierarchical math.hash12 include
            const testCode = `#redgpu_include math.hash12`;
            try {
                const result = preprocessWGSL(testCode);
                const hasContent = result.defaultSource.includes('fn hash12');
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

        runner.defineTest('Invalid Include Path (Non-string member)', function (run) {
            // [KO] math는 객체(Namespace)이지 문자열이 아니므로 인클루드 실패해야 함
            // [EN] math is an object (Namespace), not a string, so include should fail
            const code = `#redgpu_include math`;
            try {
                const result = preprocessWGSL(code);
                // [KO] 결과물이 문자열이 아니면 태그를 그대로 유지해야 함
                // [EN] If the result is not a string, the tag should be preserved
                run(result.defaultSource.includes('#redgpu_include math'));
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);
