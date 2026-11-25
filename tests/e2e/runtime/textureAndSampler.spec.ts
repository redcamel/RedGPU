import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('BitmapTexture & Sampler GPU Lifecycle', () => {
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

    // BitmapTexture의 useMipMap=true/false별 실제 GPUTexture.mipLevelCount, cacheKey 공유, destroy() VRAM 반환 검증
    test('BitmapTexture creates expected mipLevelCount, shares by cacheKey, and releases VRAM on destroy', async () => {
        const res = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const rm = ctx.resourceManager;

            const makeDataUrl = (size: number, color: string) => {
                const c = document.createElement('canvas');
                c.width = size;
                c.height = size;
                const g = c.getContext('2d')!;
                g.fillStyle = color;
                g.fillRect(0, 0, size, size);
                return c.toDataURL('image/png');
            };

            const url64 = makeDataUrl(64, '#ff8800');
            const loadTex = (srcInfo: any, useMipMap: boolean) =>
                new Promise<any>((resolve, reject) => {
                    new RedGPU.Resource.BitmapTexture(
                        ctx,
                        srcInfo,
                        useMipMap,
                        (tex: any) => resolve(tex),
                        (err: any) => reject(err)
                    );
                });

            const memBefore = rm.managedBitmapTextureState.videoMemory;
            const texMip1 = await loadTex({src: url64, cacheKey: 'E2E_TEX_MIP_64'}, true);
            const texMip2 = await loadTex({src: url64, cacheKey: 'E2E_TEX_MIP_64'}, true);
            const texNoMip = await loadTex({src: url64, cacheKey: 'E2E_TEX_NOMIP_64'}, false);
            const memAfterLoad = rm.managedBitmapTextureState.videoMemory;

            const snapshot = {
                sharedByCacheKey: texMip1 === texMip2,
                mipTexWidth: texMip1.gpuTexture.width,
                mipTexHeight: texMip1.gpuTexture.height,
                mipTexLevels: texMip1.gpuTexture.mipLevelCount,
                noMipTexLevels: texNoMip.gpuTexture.mipLevelCount,
                memIncreased: memAfterLoad > memBefore
            };

            texMip1.destroy();
            texNoMip.destroy();

            return {
                ...snapshot,
                memReleased: rm.managedBitmapTextureState.videoMemory === memBefore,
                tablesCleared:
                    !rm.managedBitmapTextureState.table.has('E2E_TEX_MIP_64') &&
                    !rm.managedBitmapTextureState.table.has('E2E_TEX_NOMIP_64')
            };
        });

        // 64x64 밉맵 체인: 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1 = 7레벨
        expect(res).toEqual({
            sharedByCacheKey: true,
            mipTexWidth: 64,
            mipTexHeight: 64,
            mipTexLevels: 7,
            noMipTexLevels: 1,
            memIncreased: true,
            memReleased: true,
            tablesCleared: true
        });
    });

    // Sampler 필터/어드레스 모드/이방성 옵션 갱신 시 GPUSampler 교체 및 잘못된 값 예외 검증
    test('Sampler updates GPUSampler on filter/address/anisotropy changes and rejects invalid values', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            const sampler = new RedGPU.Resource.Sampler(ctx, {
                magFilter: 'linear',
                minFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat'
            });
            const initialGpuSampler = sampler.gpuSampler;

            sampler.magFilter = 'nearest';
            const afterMagChange = sampler.gpuSampler;
            // WebGPU 스펙상 nearest 필터에서는 maxAnisotropy가 1로 안전 클램핑됨
            sampler.maxAnisotropy = 4;
            const clampedAnisotropy = sampler.maxAnisotropy;

            // linear 필터로 복원 시 maxAnisotropy = 4 정상 반영
            sampler.magFilter = 'linear';
            sampler.addressModeU = 'mirror-repeat';
            sampler.addressModeV = 'clamp-to-edge';
            sampler.maxAnisotropy = 4;
            const afterAnisoChange = sampler.gpuSampler;

            let invalidFilterThrew = false;
            try {
                sampler.magFilter = 'invalid-filter';
            } catch {
                invalidFilterThrew = true;
            }

            let invalidAddressThrew = false;
            try {
                sampler.addressModeU = 'invalid-address';
            } catch {
                invalidAddressThrew = true;
            }

            return {
                hasInitialSampler: Boolean(initialGpuSampler),
                changedOnMagFilter: afterMagChange !== initialGpuSampler,
                changedOnAnisotropy: afterAnisoChange !== afterMagChange,
                clampedAnisotropy,
                magFilter: sampler.magFilter,
                addressModeU: sampler.addressModeU,
                addressModeV: sampler.addressModeV,
                maxAnisotropy: sampler.maxAnisotropy,
                invalidFilterThrew,
                invalidAddressThrew
            };
        });

        expect(res).toEqual({
            hasInitialSampler: true,
            changedOnMagFilter: true,
            changedOnAnisotropy: true,
            clampedAnisotropy: 1,
            magFilter: 'linear',
            addressModeU: 'mirror-repeat',
            addressModeV: 'clamp-to-edge',
            maxAnisotropy: 4,
            invalidFilterThrew: true,
            invalidAddressThrew: true
        });
    });
});
