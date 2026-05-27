import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - UUID');

redUnit.testGroup(
    'RedGPU.Util.createUUID',
    (runner) => {
        runner.defineTest('Format check (v4 regex)', (run) => {
            const uuid = RedGPU.Util.createUUID();
            const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
            run(regex.test(uuid));
        }, true);

        runner.defineTest('Uniqueness check (1000 IDs)', (run) => {
            const set = new Set();
            for (let i = 0; i < 1000; i++) set.add(RedGPU.Util.createUUID());
            run(set.size === 1000);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.InstanceIdGenerator',
    (runner) => {
        runner.defineTest('Sequential generation for TypeA', (run) => {
            class TestTypeA {}
            const id0 = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeA);
            const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeA);
            run(id0 === 0 && id1 === 1);
        }, true);

        runner.defineTest('Independent generation (TypeB vs TypeC)', (run) => {
            class TestTypeB {}
            class TestTypeC {}
            const idB = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeB);
            const idC = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeC);
            run(idB === 0 && idC === 0);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.uuidToUint',
    (runner) => {
        runner.defineTest('Basic conversion', (run) => {
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            const expected = parseInt('123e4567', 16);
            run(RedGPU.Util.uuidToUint(uuid) === expected);
        }, true);

        runner.defineTest('Case insensitivity check', (run) => {
            const lower = 'abcdef12-3456-7890-abcd-ef1234567890';
            const upper = 'ABCDEF12-3456-7890-ABCD-EF1234567890';
            run(RedGPU.Util.uuidToUint(lower) === RedGPU.Util.uuidToUint(upper));
        }, true);
    }
);