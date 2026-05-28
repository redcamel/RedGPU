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

        runner.defineTest('Success Test Test: uuid generation', (run) => {
            try {
                const obj = new TestBaseObject();
                run(typeof obj.uuid === 'string' && obj.uuid.length > 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: default name generation', (run) => {
            try {
                const obj = new TestBaseObject();
                run(obj.name.includes('TestBaseObject Instance'));
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: set name', (run) => {
            try {
                const obj = new TestBaseObject();
                obj.name = 'Custom Name';
                run(obj.name);
            } catch (e) {
                run(false, e);
            }
        }, 'Custom Name');

        runner.defineTest('Success Test Test: instance ID increment', (run) => {
            try {
                const obj1 = new TestBaseObject();
                const obj2 = new TestBaseObject();
                const id1 = parseInt(obj1.name.split('Instance ')[1]);
                const id2 = parseInt(obj2.name.split('Instance ')[1]);
                run(id2 - id1);
            } catch (e) {
                run(false, e);
            }
        }, 1);
        
        // Edge cases for set name
        runner.defineTest('Success Test Test: set name to empty string', (run) => {
            try {
                const obj = new TestBaseObject();
                obj.name = '';
                // Since #name is empty string, the getter should return the generated string.
                run(obj.name.includes('TestBaseObject Instance'));
            } catch (e) {
                run(false, e);
            }
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

        runner.defineTest('Success Test Test: Getters access', (run) => {
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

        // Negative Testing
        const invalidValues = [null, undefined, NaN, 123, 'string', {}, []];
        invalidValues.forEach(invalidValue => {
            runner.defineTest(`Failure Test Test: Invalid context - ${invalidValue}`, (run) => {
                try {
                    new TestRedGPUObject(invalidValue);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });
    }
);
