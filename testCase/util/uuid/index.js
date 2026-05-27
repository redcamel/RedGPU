import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - UUID');

redUnit.testGroup(
    'RedGPU.Util.createUUID',
    (runner) => {
        runner.defineTest('Success: Format check (v4 regex)', (run) => {
            try {
                const uuid = RedGPU.Util.createUUID();
                const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
                if (regex.test(uuid)) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Uniqueness check (1000 IDs)', (run) => {
            try {
                const set = new Set();
                for (let i = 0; i < 1000; i++) set.add(RedGPU.Util.createUUID());
                if (set.size === 1000) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.InstanceIdGenerator',
    (runner) => {
        runner.defineTest('Success: Sequential generation', (run) => {
            try {
                class TestTypeA {}
                const id0 = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeA);
                const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeA);
                if (id0 === 0 && id1 === 1) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Independent generation', (run) => {
            try {
                class TestTypeB {}
                class TestTypeC {}
                const idB = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeB);
                const idC = RedGPU.Util.InstanceIdGenerator.getNextId(TestTypeC);
                if (idB === 0 && idC === 0) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.uuidToUint',
    (runner) => {
        runner.defineTest('Success: Basic conversion', (run) => {
            try {
                const uuid = '123e4567-e89b-12d3-a456-426614174000';
                const expected = parseInt('123e4567', 16);
                if (RedGPU.Util.uuidToUint(uuid) === expected) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Case insensitivity check', (run) => {
            try {
                const lower = 'abcdef12-3456-7890-abcd-ef1234567890';
                const upper = 'ABCDEF12-3456-7890-ABCD-EF1234567890';
                if (RedGPU.Util.uuidToUint(lower) === RedGPU.Util.uuidToUint(upper)) run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);
    }
);