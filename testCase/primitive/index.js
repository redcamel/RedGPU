import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Primitive');

redUnit.testGroup(
    'RedGPU.Primitive.Primitive (Base Class Logic)',
    (runner) => {
        runner.defineTest('Success: Geometry Caching - same parameters', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box1 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const box2 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const pass = (box1.vertexBuffer === box2.vertexBuffer && box1.indexBuffer === box2.indexBuffer);
                    redGPUContext.destroy();
                    if (pass) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Geometry Caching - different parameters', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box1 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const box2 = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
                    const pass = (box1.vertexBuffer !== box2.vertexBuffer);
                    redGPUContext.destroy();
                    if (pass) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: AABB Volume calculation check (Box 1x1x1)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const volume = box.volume;
                    const checkMin = volume.minX === -0.5 && volume.minY === -0.5 && volume.minZ === -0.5;
                    const checkMax = volume.maxX === 0.5 && volume.maxY === 0.5 && volume.maxZ === 0.5;
                    redGPUContext.destroy();
                    if (checkMin && checkMax) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Primitive - Shape Creation',
    (runner) => {
        const shapes = [
            { name: 'Box', class: RedGPU.Primitive.Box },
            { name: 'Sphere', class: RedGPU.Primitive.Sphere },
            { name: 'Plane', class: RedGPU.Primitive.Plane },
            { name: 'Cylinder', class: RedGPU.Primitive.Cylinder },
            { name: 'Torus', class: RedGPU.Primitive.Torus },
            { name: 'TorusKnot', class: RedGPU.Primitive.TorusKnot },
            { name: 'Capsule', class: RedGPU.Primitive.Capsule },
            { name: 'Circle', class: RedGPU.Primitive.Circle },
            { name: 'Ring', class: RedGPU.Primitive.Ring },
            { name: 'Ground', class: RedGPU.Primitive.Ground },
            { name: 'RoundedBox', class: RedGPU.Primitive.RoundedBox }
        ];

        shapes.forEach(shape => {
            runner.defineTest(`Success: Create ${shape.name} with default params`, (run) => {
                const canvas = document.createElement('canvas');
                RedGPU.init(canvas, (redGPUContext) => {
                    try {
                        const instance = new shape.class(redGPUContext);
                        const hasBuffers = instance.vertexBuffer instanceof RedGPU.Resource.VertexBuffer &&
                                          instance.indexBuffer instanceof RedGPU.Resource.IndexBuffer;
                        redGPUContext.destroy();
                        if (hasBuffers) run(true);
                        else run(false);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(e);
                    }
                }, (error) => run(error));
            }, true);
        });
    }
);

redUnit.testGroup(
    'RedGPU.Primitive - Validation',
    (runner) => {
        runner.defineTest('Failure: Torus radialSegments < 3', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    new RedGPU.Primitive.Torus(redGPUContext, 1, 0.4, 2);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            }, (error) => run(error));
        }, false);

        runner.defineTest('Failure: Torus tubularSegments < 3', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    new RedGPU.Primitive.Torus(redGPUContext, 1, 0.4, 16, 2);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            }, (error) => run(error));
        }, false);
    }
);