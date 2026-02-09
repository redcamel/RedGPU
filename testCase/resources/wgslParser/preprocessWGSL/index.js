import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - preprocessWGSL');

const preprocessWGSL = RedGPU.Resource?.CoreWGSLParser?.preprocessWGSL;

if (!preprocessWGSL) {
    console.error("CRITICAL: preprocessWGSL function not found.");
}

redUnit.testGroup(
    'preprocessWGSL - Core Functionality',
    (runner) => {
        runner.defineTest('Include Logic (#redgpu_include)', function (run) {
            const testKey = 'FragmentOutput';
            const expected = RedGPU.SystemCode[testKey];
            if (!expected) {
                run(false, 'FragmentOutput not found in SystemCode');
                return;
            }
            const testCode = `#redgpu_include ${testKey}`;

            try {
                const result = preprocessWGSL(testCode);
                const hasContent = result.defaultSource.includes('struct FragmentOutput');
                const tagRemoved = !result.defaultSource.includes('#redgpu_include');
                run(hasContent && tagRemoved);
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

        runner.defineTest('Conditional Logic (#redgpu_if) - Basic', function (run) {
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

        runner.defineTest('Default Source - All disabled by default', function (run) {
            const code = `
                #redgpu_if A
                let a = 1;
                #redgpu_else
                let a = 0;
                #redgpu_endIf
                #redgpu_if B
                let b = 1;
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const hasA0 = result.defaultSource.includes('let a = 0;');
                const hasA1 = result.defaultSource.includes('let a = 1;');
                const hasB1 = result.defaultSource.includes('let b = 1;');
                
                run(hasA0 && !hasA1 && !hasB1);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'preprocessWGSL - Nested and Complex Scenarios',
    (runner) => {
        runner.defineTest('Nested #redgpu_if - Basic', function (run) {
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
                const srcNone = gen.getVariant('none');

                const checkBoth = srcBoth.includes('let nested = 1;');
                const checkOuterOnly = srcOuterOnly.includes('let nested = 0;');
                const checkNone = !srcNone.includes('let nested');

                run(checkBoth && checkOuterOnly && checkNone);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Nested #redgpu_if - Iridescence Example', function (run) {
            const code = `
                #redgpu_if useKHR_materials_iridescence
                    #redgpu_if useKHR_iridescenceTexture
                        let iridescenceTextureSample: vec4<f32> = vec4<f32>(1.0);
                        iridescenceParameter *= iridescenceTextureSample.r;
                    #redgpu_endIf
                    #redgpu_if useKHR_iridescenceThicknessTexture
                        let iridescenceThicknessTextureSample: vec4<f32> = vec4<f32>(1.0);
                        iridescenceThickness = mix(0.0, 1.0, iridescenceThicknessTextureSample.g);
                    #redgpu_endIf
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const gen = result.shaderSourceVariant;

                const srcAll = gen.getVariant('useKHR_materials_iridescence+useKHR_iridescenceTexture+useKHR_iridescenceThicknessTexture');
                const srcThicknessOnly = gen.getVariant('useKHR_materials_iridescence+useKHR_iridescenceThicknessTexture');
                const srcTextureOnly = gen.getVariant('useKHR_materials_iridescence+useKHR_iridescenceTexture');
                const srcOuterOnly = gen.getVariant('useKHR_materials_iridescence');
                const srcNone = gen.getVariant('none');

                const checkAll = srcAll.includes('iridescenceParameter *=') && srcAll.includes('iridescenceThickness =');
                const checkThicknessOnly = !srcThicknessOnly.includes('iridescenceParameter *=') && srcThicknessOnly.includes('iridescenceThickness =');
                const checkTextureOnly = srcTextureOnly.includes('iridescenceParameter *=') && !srcTextureOnly.includes('iridescenceThickness =');
                const checkOuterOnly = !srcOuterOnly.includes('iridescenceParameter *=') && !srcOuterOnly.includes('iridescenceThickness =');
                const checkNone = !srcNone.includes('iridescenceParameter *=') && !srcNone.includes('iridescenceThickness =');

                run(checkAll && checkThicknessOnly && checkTextureOnly && checkOuterOnly && checkNone);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Deeply Nested #redgpu_if', function (run) {
            const code = `
                #redgpu_if LEVEL1
                    #redgpu_if LEVEL2
                        #redgpu_if LEVEL3
                            let value = 3;
                        #redgpu_else
                            let value = 2;
                        #redgpu_endIf
                    #redgpu_else
                        let value = 1;
                    #redgpu_endIf
                #redgpu_else
                    let value = 0;
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const gen = result.shaderSourceVariant;

                const srcL123 = gen.getVariant('LEVEL1+LEVEL2+LEVEL3');
                const srcL12 = gen.getVariant('LEVEL1+LEVEL2');
                const srcL1 = gen.getVariant('LEVEL1');
                const srcNone = gen.getVariant('none');

                const checkL123 = srcL123.includes('let value = 3;');
                const checkL12 = srcL12.includes('let value = 2;');
                const checkL1 = srcL1.includes('let value = 1;');
                const checkNone = srcNone.includes('let value = 0;');

                run(checkL123 && checkL12 && checkL1 && checkNone);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Multiple same key in nested blocks', function (run) {
            const code = `
                #redgpu_if TEST
                    #redgpu_if TEST
                        let nested = 1;
                    #redgpu_endIf
                #redgpu_endIf
            `;
            try {
                const result = preprocessWGSL(code);
                const gen = result.shaderSourceVariant;

                const srcTrue = gen.getVariant('TEST');
                const srcFalse = gen.getVariant('none');

                run(srcTrue.includes('let nested = 1;') && !srcFalse.includes('let nested'));
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

        runner.defineTest('Unclosed #redgpu_if', function (run) {
            const code = `
                #redgpu_if TEST
                let x = 1;
            `;
            try {
                preprocessWGSL(code);
                run(false, 'Should have thrown an error for unclosed if');
            } catch (e) {
                run(e.message.includes('Unclosed #redgpu_if'));
            }
        }, true);

        runner.defineTest('Mismatched #redgpu_else', function (run) {
            const code = `
                #redgpu_else
            `;
            try {
                preprocessWGSL(code);
                run(false, 'Should have thrown an error for mismatched else');
            } catch (e) {
                run(e.message.includes('Mismatched #redgpu_else'));
            }
        }, true);
    }
);