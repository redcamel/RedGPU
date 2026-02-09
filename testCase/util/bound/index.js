import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Bound Utils');

redUnit.testGroup(
	'RedGPU.Bound.AABB',
	(runner) => {
		runner.defineTest('Constructor and getters', (run) => {
			const aabb = new RedGPU.Bound.AABB(-1, 1, -2, 2, -3, 3);
			run(
				aabb.minX === -1 && aabb.maxX === 1 &&
				aabb.minY === -2 && aabb.maxY === 2 &&
				aabb.minZ === -3 && aabb.maxZ === 3 &&
				aabb.centerX === 0 && aabb.centerY === 0 && aabb.centerZ === 0 &&
				aabb.xSize === 2 && aabb.ySize === 4 && aabb.zSize === 6
			);
		}, true);

		runner.defineTest('intersects', (run) => {
			const aabb1 = new RedGPU.Bound.AABB(0, 10, 0, 10, 0, 10);
			const aabb2 = new RedGPU.Bound.AABB(5, 15, 5, 15, 5, 15);
			const aabb3 = new RedGPU.Bound.AABB(11, 20, 11, 20, 11, 20);
			
			run(aabb1.intersects(aabb2) === true && aabb1.intersects(aabb3) === false);
		}, true);

		runner.defineTest('contains', (run) => {
			const aabb = new RedGPU.Bound.AABB(0, 10, 0, 10, 0, 10);
			run(aabb.contains(5, 5, 5) === true && aabb.contains(15, 5, 5) === false);
		}, true);

		runner.defineTest('clone', (run) => {
			const aabb = new RedGPU.Bound.AABB(0, 10, 0, 10, 0, 10);
			const cloned = aabb.clone();
			run(cloned !== aabb && cloned.minX === 0 && cloned.maxX === 10);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Bound.calculateGeometryAABB',
	(runner) => {
		runner.defineTest('Simple triangle', (run) => {
			const vertexBuffer = {
				data: [
					-1, -1, 0,
					1, -1, 0,
					0, 1, 0
				],
				vertexCount: 3,
				stride: 3
			};
			const aabb = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
			run(aabb.minX === -1 && aabb.maxX === 1 && aabb.minY === -1 && aabb.maxY === 1 && aabb.minZ === 0 && aabb.maxZ === 0);
		}, true);

		runner.defineTest('Empty buffer', (run) => {
			const aabb = RedGPU.Bound.calculateGeometryAABB(null);
			run(aabb.minX === 0 && aabb.maxX === 0);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Bound.OBB',
	(runner) => {
		runner.defineTest('Constructor and basic check', (run) => {
			const center = [0, 0, 0];
			const halfExtents = [1, 1, 1];
			const orientation = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const obb = new RedGPU.Bound.OBB(center, halfExtents, orientation);
			
			run(obb.centerX === 0 && obb.halfExtentX === 1);
		}, true);

		runner.defineTest('contains', (run) => {
			const center = [0, 0, 0];
			const halfExtents = [1, 1, 1];
			const orientation = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const obb = new RedGPU.Bound.OBB(center, halfExtents, orientation);
			
			run(obb.contains(0.5, 0.5, 0.5) === true && obb.contains(1.5, 0, 0) === false);
		}, true);

		runner.defineTest('intersects', (run) => {
			const orientation = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
			const obb1 = new RedGPU.Bound.OBB([0,0,0], [1,1,1], orientation);
			const obb2 = new RedGPU.Bound.OBB([1.5,0,0], [1,1,1], orientation);
			const obb3 = new RedGPU.Bound.OBB([3,0,0], [1,1,1], orientation);
			
			run(obb1.intersects(obb2) === true && obb1.intersects(obb3) === false);
		}, true);
	}
);

redUnit.testGroup(
	'RedGPU.Bound.calculateMeshAABB',
	(runner) => {
		runner.defineTest('Basic mesh AABB', (run) => {
			const mockMesh = {
				_geometry: {
					volume: new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1)
				},
				modelMatrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 10,20,30,1]
			};
			const aabb = RedGPU.Bound.calculateMeshAABB(mockMesh);
			
			// Min should be [10-1, 20-1, 30-1] = [9, 19, 29]
			// Max should be [10+1, 20+1, 30+1] = [11, 21, 31]
			run(aabb.minX === 9 && aabb.maxX === 11 && aabb.minY === 19 && aabb.maxY === 21 && aabb.minZ === 29 && aabb.maxZ === 31);
		}, true);
	}
);
