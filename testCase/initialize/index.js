import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Initialize');

// API 구조 확인 로그
console.log('--- RedGPU API Check ---');
console.log('RedGPU.Context:', RedGPU.Context);
console.log('RedGPU.Context.RedGPUContext (Class):', RedGPU.Context.RedGPUContext);

redUnit.testGroup(
    'RedGPU.init - Success Cases',
    (runner) => {
        runner.defineTest('Check Instance via instanceof (Namespace)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    // export * as Context 에 의해 RedGPU.Context.RedGPUContext 가 클래스를 가리킵니다.
                    const isInstanceOf = redGPUContext instanceof RedGPU.Context.RedGPUContext;
                    console.log('redGPUContext instance check:', isInstanceOf);
                    
                    redGPUContext.destroy();
                    run(isInstanceOf);
                },
                (error) => run(false, error)
            );
        }, true);

        runner.defineTest('alphaMode property check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    const pass = redGPUContext.alphaMode === 'premultiplied';
                    redGPUContext.destroy();
                    run(pass);
                },
                (error) => run(false, error),
                undefined,
                'premultiplied'
            );
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.init - Failure Cases',
    (runner) => {
        runner.defineTest('null canvas failure', (run) => {
            RedGPU.init(null, () => run(false), () => run(true));
        }, true);
        
        runner.defineTest('invalid alphaMode failure', (run) => {
            const canvas = document.createElement('canvas');
            // @ts-ignore
            RedGPU.init(canvas, () => run(false), () => run(true), undefined, 'invalid-mode');
        }, true);
    }
);
