import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Primitive');

redUnit.testGroup(
    'RedGPU.Primitive.Primitive (Base Class Logic)',
    (runner) => {
        runner.defineTest('Success: Geometry Caching - reuse buffers', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box1 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const box2 = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const isSame = (box1.vertexBuffer === box2.vertexBuffer);
                    redGPUContext.destroy();
                    run(isSame);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: AABB Volume check - minX', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const val = box.volume.minX;
                    redGPUContext.destroy();
                    run(val);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, -0.5);

        runner.defineTest('Success: AABB Volume check - maxX', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
                    const val = box.volume.maxX;
                    redGPUContext.destroy();
                    run(val);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 0.5);
    }
);

redUnit.testGroup(
    'RedGPU.Primitive - Shape Creation',
    (runner) => {
        const shapes = [
            { name: 'Box', class: RedGPU.Primitive.Box },
            { name: 'Sphere', class: RedGPU.Primitive.Sphere }
        ];

        shapes.forEach(shape => {
            runner.defineTest(`Success: Create ${shape.name} check vertexBuffer`, (run) => {
                const canvas = document.createElement('canvas');
                RedGPU.init(canvas, (redGPUContext) => {
                    try {
                        const instance = new shape.class(redGPUContext);
                        const isVB = instance.vertexBuffer instanceof RedGPU.Resource.VertexBuffer;
                        redGPUContext.destroy();
                        run(isVB);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(false, e);
                    }
                }, (error) => run(false, error));
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
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, false);
    }
);