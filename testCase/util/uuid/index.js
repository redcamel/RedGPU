import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - UUID');

redUnit.testGroup(
	'RedGPU.Util.createUUID',
	(runner) => {
		runner.defineTest('Check UUID format (version 4)', (run) => {
			const uuid = RedGPU.Util.createUUID();
			// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
			const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
			run(regex.test(uuid));
		}, true);

		runner.defineTest('Uniqueness check (1000 IDs)', (run) => {
			const set = new Set();
			for (let i = 0; i < 1000; i++) {
				set.add(RedGPU.Util.createUUID());
			}
			run(set.size === 1000);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Util.InstanceIdGenerator',
	(runner) => {
		runner.defineTest('Sequential ID generation', (run) => {
			class TestType {}
			const id0 = RedGPU.Util.InstanceIdGenerator.getNextId(TestType);
			const id1 = RedGPU.Util.InstanceIdGenerator.getNextId(TestType);
			const id2 = RedGPU.Util.InstanceIdGenerator.getNextId(TestType);
			run(id0 === 0 && id1 === 1 && id2 === 2);
		}, true);

		runner.defineTest('Independent IDs for different types', (run) => {
			class TypeA {}
			class TypeB {}
			const idA = RedGPU.Util.InstanceIdGenerator.getNextId(TypeA);
			const idB = RedGPU.Util.InstanceIdGenerator.getNextId(TypeB);
			run(idA === 0 && idB === 0);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Util.uuidToUint',
	(runner) => {
		runner.defineTest('Standard conversion', (run) => {
			const uuid = '123e4567-e89b-12d3-a456-426614174000';
			const uint = RedGPU.Util.uuidToUint(uuid);
			// 123e4567 in hex to decimal
			const expected = parseInt('123e4567', 16);
			run(uint === expected);
		}, true);

		runner.defineTest('Case insensitivity', (run) => {
			const uuidLower = 'abcdef12-3456-7890-abcd-ef1234567890';
			const uuidUpper = 'ABCDEF12-3456-7890-ABCD-EF1234567890';
			const uintLower = RedGPU.Util.uuidToUint(uuidLower);
			const uintUpper = RedGPU.Util.uuidToUint(uuidUpper);
			run(uintLower === uintUpper && uintLower === parseInt('abcdef12', 16));
		}, true);
	}
);
