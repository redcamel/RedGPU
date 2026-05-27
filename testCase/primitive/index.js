import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Primitive');

redUnit.testGroup(
    'RedGPU.Primitive.Primitive (Base Class Logic)',
    (runner) => {
        runner.defineTest('Geometry Caching: same parameters should reuse buffers', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const box1 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                const box2 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);

                const isSameVertexBuffer = box1.vertexBuffer === box2.vertexBuffer;
                const isSameIndexBuffer = box1.indexBuffer === box2.indexBuffer;

                redGPUContext.destroy();
                run(isSameVertexBuffer && isSameIndexBuffer);
            });
        }, true);

        runner.defineTest('Geometry Caching: different parameters should create new buffers', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const box1 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                const box2 = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);

                const isDifferent = box1.vertexBuffer !== box2.vertexBuffer;

                redGPUContext.destroy();
                run(isDifferent);
            });
        }, true);

        runner.defineTest('AABB Volume calculation check (Box 1x1x1)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                const volume = box.volume;

                // min should be around -0.5, max should be around 0.5
                const checkMin = volume.minX === -0.5 && volume.minY === -0.5 && volume.minZ === -0.5;
                const checkMax = volume.maxX === 0.5 && volume.maxY === 0.5 && volume.maxZ === 0.5;

                redGPUContext.destroy();
                run(checkMin && checkMax);
            });
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
            runner.defineTest(`Create ${shape.name} with default params`, (run) => {
                const canvas = document.createElement('canvas');
                RedGPU.init(canvas, (redGPUContext) => {
                    try {
                        const instance = new shape.class(redGPUContext);
                        const hasBuffers = instance.vertexBuffer instanceof RedGPU.Resource.VertexBuffer &&
                                          instance.indexBuffer instanceof RedGPU.Resource.IndexBuffer;
                        redGPUContext.destroy();
                        run(hasBuffers);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(false, e);
                    }
                });
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
                    new RedGPU.Primitive.Torus(redGPUContext, 1, 0.4, 2); // radialSegments: 2 is invalid
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            });
        }, false);

        runner.defineTest('Failure: Torus tubularSegments < 3', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    new RedGPU.Primitive.Torus(redGPUContext, 1, 0.4, 16, 2); // tubularSegments: 2 is invalid
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            });
        }, false);
    }
);