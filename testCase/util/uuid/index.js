import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - UUID');

redUnit.testGroup(
    'RedGPU.Util.createUUID',
    (runner) => {
        runner.defineTest('Success: Uniqueness check (100 IDs)', (run) => {
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
        runner.defineTest('Success: Sequential generation TypeX', (run) => {
            try {
                class TestTypeX {}
                RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeX);
                const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeX);
                run(id1);
            } catch (e) { run(e); }
        }, 1);
    }
);

redUnit.testGroup(
    'RedGPU.Util.uuidToUint',
    (runner) => {
        runner.defineTest('Success: Basic conversion value', (run) => {
            try {
                const uuid = '123e4567-e89b-12d3-a456-426614174000';
                const expected = parseInt('123e4567', 16);
                run(RedGPU.Util.uuidToUint(uuid));
            } catch (e) { run(e); }
        }, parseInt('123e4567', 16));
    }
);