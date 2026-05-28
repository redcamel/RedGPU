import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util.UUID');

redUnit.testGroup(
    'createUUID()',
    (runner) => {
        runner.defineTest('Success Test Test: Length check', (run) => {
            try {
                const uuid = RedGPU.Util.createUUID();
                run(uuid.length === 36);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: Format check', (run) => {
            try {
                const uuid = RedGPU.Util.createUUID();
                const regex = /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-4[0-9a-zA-Z]{3}-[89aAbB][0-9a-zA-Z]{3}-[0-9a-zA-Z]{12}$/;
                run(regex.test(uuid));
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: Uniqueness', (run) => {
            try {
                const uuid1 = RedGPU.Util.createUUID();
                const uuid2 = RedGPU.Util.createUUID();
                run(uuid1 !== uuid2);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'InstanceIdGenerator.getNextId(type)',
    (runner) => {
        class TestClassA {}
        class TestClassB {}

        runner.defineTest('Success Test Test: Sequential IDs for same class', (run) => {
            try {
                const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(TestClassA);
                const id2 = RedGPU.Util.InstanceIdGenerator.getNextId(TestClassA);
                run(id2 - id1);
            } catch (e) {
                run(false, e);
            }
        }, 1);

        runner.defineTest('Success Test Test: Independent counters for different classes', (run) => {
            try {
                const idA = RedGPU.Util.InstanceIdGenerator.getNextId(TestClassA);
                const idB = RedGPU.Util.InstanceIdGenerator.getNextId(TestClassB);
                // idB should be 0 because it's the first time TestClassB is requested
                run(idB);
            } catch (e) {
                run(false, e);
            }
        }, 0);
        
        const invalidTypes = [null, undefined, 123, 'string', true];
        invalidTypes.forEach((invalidType, index) => {
            // Depending on how Map handles it, it might just use them as keys,
            // but for negative testing, let's see if it works or not. 
            // TS expects Function, but in JS it might just map them.
            runner.defineTest(`Success Test Test: Invalid type behavior - ${invalidType}`, (run) => {
                try {
                    const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(invalidType);
                    const id2 = RedGPU.Util.InstanceIdGenerator.getNextId(invalidType);
                    run(id2 > id1);
                } catch (e) {
                    run(false, e); // If it fails, that's unexpected for Map
                }
            }, true);
        });
    }
);

redUnit.testGroup(
    'uuidToUint(uuid)',
    (runner) => {
        runner.defineTest('Success Test Test: Normal UUID', (run) => {
            try {
                const uint = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
                run(uint);
            } catch (e) {
                run(false, e);
            }
        }, parseInt('123e4567', 16));
        
        runner.defineTest('Success Test Test: Generated UUID', (run) => {
            try {
                const uuid = RedGPU.Util.createUUID();
                const uint = RedGPU.Util.uuidToUint(uuid);
                run(!isNaN(uint) && uint >= 0);
            } catch (e) {
                run(false, e);
            }
        }, true);
        
        const invalidValues = [null, undefined, NaN, 123, {}, []];
        invalidValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Util.uuidToUint(invalidValue);
                    run(true);
                } catch (e) {
                    // String.prototype.replace will fail for non-strings (except if it has toString, but let's assume it fails)
                    run(false, e);
                }
            }, false);
        });
    }
);
