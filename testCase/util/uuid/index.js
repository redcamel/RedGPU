import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - UUID');

redUnit.testGroup(
    'RedGPU.Util.createUUID',
    (runner) => {
        runner.defineTest('Success: Uniqueness count check (100)', (run) => {
            try {
                const set = new Set();
                for (let i = 0; i < 100; i++) set.add(RedGPU.Util.createUUID());
                run(set.size);
            } catch (e) { run(e); }
        }, 100);
    }
);

redUnit.testGroup(
    'RedGPU.Util.InstanceIdGenerator',
    (runner) => {
        runner.defineTest('Success: Next ID check for unique type', (run) => {
            try {
                class UniqueType {}
                RedGPU.Util.InstanceIdGenerator.getNextId(UniqueType);
                run(RedGPU.Util.InstanceIdGenerator.getNextId(UniqueType));
            } catch (e) { run(e); }
        }, 1);
    }
);

redUnit.testGroup(
    'RedGPU.Util.uuidToUint',
    (runner) => {
        runner.defineTest('Success: Conversion value match', (run) => {
            try {
                const uuid = '123e4567-e89b-12d3-a456-426614174000';
                run(RedGPU.Util.uuidToUint(uuid));
            } catch (e) { run(e); }
        }, parseInt('123e4567', 16));
    }
);