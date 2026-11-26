import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('GPU Buffer Lifecycle & Readback', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // UniformBuffer / StorageBuffer 생성, cacheKey 공유, updateAllData() 후 GPU 메모리 Readback 및 destroy() VRAM 반환 검증
    test('UniformBuffer and StorageBuffer cache sharing, GPU readback after update, and VRAM release on destroy', async () => {
        const res = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const rm = ctx.resourceManager;

            const readbackFloat32 = async (gpuBuffer: GPUBuffer, byteLength: number): Promise<number[]> => {
                const staging = ctx.gpuDevice.createBuffer({
                    size: byteLength,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                });
                await ctx.commandEncoderManager.immediateSubmit('BufferReadback', (enc: GPUCommandEncoder) => {
                    enc.copyBufferToBuffer(gpuBuffer, 0, staging, 0, byteLength);
                });
                await staging.mapAsync(GPUMapMode.READ);
                const out = Array.from(new Float32Array(staging.getMappedRange().slice(0)));
                staging.unmap();
                staging.destroy();
                return out;
            };

            const uKey = 'E2E_UNIFORM_CACHE_KEY';
            const uMemBefore = rm.managedUniformBufferState.videoMemory;
            const uData = new Float32Array([1.5, 2.5, 3.5, 4.5]);
            const uBuf1 = new RedGPU.Resource.UniformBuffer(ctx, uData.buffer.slice(0), 'E2E_U', uKey);
            const uBuf2 = new RedGPU.Resource.UniformBuffer(ctx, uData.buffer.slice(0), 'E2E_U', uKey);
            const uMemAfterCreate = rm.managedUniformBufferState.videoMemory;
            const uShared = uBuf1 === uBuf2;
            const uInitialRead = await readbackFloat32(uBuf1.gpuBuffer, 16);

            // 데이터 갱신 후 GPU 실제 메모리 반영 확인
            uBuf1.writeOnlyBuffer({uniformOffset: 0, View: Float32Array}, [10.0, 20.0, 30.0, 40.0]);
            const uUpdatedRead = await readbackFloat32(uBuf1.gpuBuffer, 16);

            uBuf1.destroy();
            const uMemAfterDestroy = rm.managedUniformBufferState.videoMemory;
            const uRemovedFromTable = !rm.managedUniformBufferState.table.has(uKey);

            // StorageBuffer 검증
            const sKey = 'E2E_STORAGE_CACHE_KEY';
            const sMemBefore = rm.managedStorageBufferState.videoMemory;
            const sData = new Float32Array([-1.25, 0.0, 5.75, 99.0]);
            const sBuf1 = new RedGPU.Resource.StorageBuffer(ctx, sData.buffer.slice(0), 'E2E_S', sKey);
            const sBuf2 = new RedGPU.Resource.StorageBuffer(ctx, sData.buffer.slice(0), 'E2E_S', sKey);
            const sMemAfterCreate = rm.managedStorageBufferState.videoMemory;
            const sShared = sBuf1 === sBuf2;
            const sInitialRead = await readbackFloat32(sBuf1.gpuBuffer, 16);

            sBuf1.dataViewF32.set([42.0, -42.0, 0.5, 1.0]);
            ctx.gpuDevice.queue.writeBuffer(sBuf1.gpuBuffer, 0, sBuf1.data);
            const sUpdatedRead = await readbackFloat32(sBuf1.gpuBuffer, 16);

            sBuf1.destroy();
            const sMemAfterDestroy = rm.managedStorageBufferState.videoMemory;
            const sRemovedFromTable = !rm.managedStorageBufferState.table.has(sKey);

            return {
                uShared,
                uMemIncreased: uMemAfterCreate > uMemBefore,
                uMemReleased: uMemAfterDestroy === uMemBefore,
                uRemovedFromTable,
                uInitialRead,
                uUpdatedRead,
                sShared,
                sMemIncreased: sMemAfterCreate > sMemBefore,
                sMemReleased: sMemAfterDestroy === sMemBefore,
                sRemovedFromTable,
                sInitialRead,
                sUpdatedRead
            };
        });

        expect(res.uShared).toBe(true);
        expect(res.uMemIncreased).toBe(true);
        expect(res.uMemReleased).toBe(true);
        expect(res.uRemovedFromTable).toBe(true);
        expect(res.uInitialRead).toEqual([1.5, 2.5, 3.5, 4.5]);
        expect(res.uUpdatedRead).toEqual([10.0, 20.0, 30.0, 40.0]);

        expect(res.sShared).toBe(true);
        expect(res.sMemIncreased).toBe(true);
        expect(res.sMemReleased).toBe(true);
        expect(res.sRemovedFromTable).toBe(true);
        expect(res.sInitialRead).toEqual([-1.25, 0.0, 5.75, 99.0]);
        expect(res.sUpdatedRead).toEqual([42.0, -42.0, 0.5, 1.0]);
    });

    // VertexBuffer & IndexBuffer cacheKey 공유, 정점/인덱스 수량 계산 및 destroy() 시 ResourceManager 정리 검증
    test('VertexBuffer and IndexBuffer track vertex/index counts, share by cacheKey, and release VRAM on destroy', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const rm = ctx.resourceManager;

            const vKey = 'E2E_VB_CACHE_KEY';
            const vMemBefore = rm.managedVertexBufferState.videoMemory;
            const struct = new RedGPU.Resource.VertexInterleavedStruct({
                aVertexPosition: RedGPU.Resource.VertexInterleaveType.float32x3
            });
            const vData = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
            const vb1 = new RedGPU.Resource.VertexBuffer(ctx, vData, struct, undefined, vKey);
            const vb2 = new RedGPU.Resource.VertexBuffer(ctx, vData, struct, undefined, vKey);
            const vMemAfterCreate = rm.managedVertexBufferState.videoMemory;
            const vertexCount = vb1.vertexCount;
            const triangleCount = vb1.triangleCount;
            const vShared = vb1 === vb2;

            // 런타임 changeData() 크기 변경 후에도 videoMemory 정합성 유지 확인
            const vDataLarger = new Float32Array(18);
            vb1.changeData(vDataLarger, struct);
            const vMemAfterResize = rm.managedVertexBufferState.videoMemory;

            vb1.destroy();
            const vMemAfterDestroy = rm.managedVertexBufferState.videoMemory;
            const vRemoved = !rm.managedVertexBufferState.table.has(vKey);

            const iKey = 'E2E_IB_CACHE_KEY';
            const iMemBefore = rm.managedIndexBufferState.videoMemory;
            const iData = new Uint32Array([0, 1, 2, 2, 1, 0]);
            const ib1 = new RedGPU.Resource.IndexBuffer(ctx, iData, undefined, iKey);
            const ib2 = new RedGPU.Resource.IndexBuffer(ctx, iData, undefined, iKey);
            const iMemAfterCreate = rm.managedIndexBufferState.videoMemory;
            const indexCount = ib1.indexCount;
            const iShared = ib1 === ib2;

            const iDataLarger = new Uint32Array([0, 1, 2, 2, 1, 0, 0, 2, 1]);
            ib1.changeData(iDataLarger);
            const iMemAfterResize = rm.managedIndexBufferState.videoMemory;

            ib1.destroy();
            const iMemAfterDestroy = rm.managedIndexBufferState.videoMemory;
            const iRemoved = !rm.managedIndexBufferState.table.has(iKey);

            return {
                vShared,
                vertexCount,
                triangleCount,
                vMemExactCreate: vMemAfterCreate === vMemBefore + vData.byteLength,
                vMemExactResize: vMemAfterResize === vMemBefore + vDataLarger.byteLength,
                vMemExactRelease: vMemAfterDestroy === vMemBefore,
                vRemoved,
                iShared,
                indexCount,
                iMemExactCreate: iMemAfterCreate === iMemBefore + iData.byteLength,
                iMemExactResize: iMemAfterResize === iMemBefore + iDataLarger.byteLength,
                iMemExactRelease: iMemAfterDestroy === iMemBefore,
                iRemoved
            };
        });

        expect(res).toEqual({
            vShared: true,
            vertexCount: 3,
            triangleCount: 1,
            vMemExactCreate: true,
            vMemExactResize: true,
            vMemExactRelease: true,
            vRemoved: true,
            iShared: true,
            indexCount: 6,
            iMemExactCreate: true,
            iMemExactResize: true,
            iMemExactRelease: true,
            iRemoved: true
        });
    });
});
