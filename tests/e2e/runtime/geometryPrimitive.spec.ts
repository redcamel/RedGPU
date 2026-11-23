import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Geometry & Primitive (Box, Sphere, Plane)', () => {
    // Box, Sphere, Plane GPU 정점/인덱스 버퍼 생성, volume(AABB) 치수 정합성 및 캐시 공유 검증
    test('builds valid GPU buffers, accurate AABB volumes, and caches identical primitives', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            // 1. Box(2, 4, 6) 정점/인덱스 버퍼 및 AABB 크기 정합성 검증
                            const box = new RedGPU.Primitive.Box(ctx, 2, 4, 6);
                            const boxVol = box.volume;
                            const boxOk =
                                box.vertexBuffer instanceof RedGPU.Resource.VertexBuffer &&
                                box.indexBuffer instanceof RedGPU.Resource.IndexBuffer &&
                                box.vertexBuffer.vertexCount > 0 &&
                                box.indexBuffer.indexCount > 0 &&
                                Math.abs(boxVol.xSize - 2) < 1e-4 &&
                                Math.abs(boxVol.ySize - 4) < 1e-4 &&
                                Math.abs(boxVol.zSize - 6) < 1e-4;

                            // 동일 파라미터 Box 재생성 시 ResourceManager 캐시를 통해 동일 GPU 버퍼 재사용 검증
                            const boxCached = new RedGPU.Primitive.Box(ctx, 2, 4, 6);
                            const cacheReuseOk =
                                boxCached.vertexBuffer === box.vertexBuffer &&
                                boxCached.indexBuffer === box.indexBuffer;

                            // 2. Sphere(radius = 3) AABB 지름(6) 정합성 검증
                            const sphere = new RedGPU.Primitive.Sphere(ctx, 3, 16, 16);
                            const sphereVol = sphere.volume;
                            const sphereOk =
                                sphere.vertexBuffer.vertexCount > 0 &&
                                sphere.indexBuffer.indexCount > 0 &&
                                Math.abs(sphereVol.xSize - 6) < 1e-3 &&
                                Math.abs(sphereVol.ySize - 6) < 1e-3 &&
                                Math.abs(sphereVol.zSize - 6) < 1e-3;

                            // 3. Plane(5, 7) XY 평면 크기(xSize=5, ySize=7, zSize=0) 정합성 검증
                            const plane = new RedGPU.Primitive.Plane(ctx, 5, 7);
                            const planeVol = plane.volume;
                            const planeOk =
                                plane.vertexBuffer.vertexCount > 0 &&
                                plane.indexBuffer.indexCount > 0 &&
                                Math.abs(planeVol.xSize - 5) < 1e-4 &&
                                Math.abs(planeVol.ySize - 7) < 1e-4 &&
                                Math.abs(planeVol.zSize) < 1e-4;

                            ctx.destroy();
                            resolve({boxOk, cacheReuseOk, sphereOk, planeOk});
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(result).toEqual({
            boxOk: true,
            cacheReuseOk: true,
            sphereOk: true,
            planeOk: true
        });
    });
});
