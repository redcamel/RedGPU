import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Base');

redUnit.testGroup(
    'RedGPU.BaseObject.BaseObject',
    (runner) => {
        class TestBaseObject extends RedGPU.BaseObject.BaseObject {
            constructor() {
                super();
            }
        }

        runner.defineTest('Success: UUID generation', (run) => {
            const obj1 = new TestBaseObject();
            const obj2 = new TestBaseObject();
            const check = obj1.uuid !== obj2.uuid && typeof obj1.uuid === 'string' && obj1.uuid.length > 0;
            run(check);
        }, true);

        runner.defineTest('Success: Name property', (run) => {
            const obj = new TestBaseObject();
            const defaultName = obj.name;
            obj.name = 'Custom Name';
            const customName = obj.name;
            const check = defaultName.includes('TestBaseObject Instance') && customName === 'Custom Name';
            run(check);
        }, true);

        runner.defineTest('Success: Instance ID increment', (run) => {
            const obj1 = new TestBaseObject();
            const obj2 = new TestBaseObject();
            const name1 = obj1.name;
            const name2 = obj2.name;
            const id1 = parseInt(name1.split('Instance ')[1]);
            const id2 = parseInt(name2.split('Instance ')[1]);
            run(id2 === id1 + 1);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.BaseObject.RedGPUObject',
    (runner) => {
        class TestRedGPUObject extends RedGPU.BaseObject.RedGPUObject {
            constructor(redGPUContext) {
                super(redGPUContext);
            }
        }

        runner.defineTest('Success: Context and managers access', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const obj = new TestRedGPUObject(redGPUContext);
                    const checkContext = obj.redGPUContext === redGPUContext;
                    const checkDevice = obj.gpuDevice === redGPUContext.gpuDevice;
                    const checkResourceManager = obj.resourceManager === redGPUContext.resourceManager;
                    const checkAntialiasingManager = obj.antialiasingManager === redGPUContext.antialiasingManager;
                    const checkCommandEncoderManager = obj.commandEncoderManager === redGPUContext.commandEncoderManager;
                    
                    redGPUContext.destroy();
                    run(checkContext && checkDevice && checkResourceManager && checkAntialiasingManager && checkCommandEncoderManager);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure: Invalid context', (run) => {
            try {
                new TestRedGPUObject(null);
                run(true);
            } catch (e) {
                run(false,e);
            }
        }, false);
    }
);
