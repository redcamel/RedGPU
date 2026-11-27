import {describe, expect, it, vi} from 'vitest';
import GLTFCacheManager from '../../../../src/loader/gltf/core/GLTFCacheManager';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));
vi.mock('../../../../src/runtimeChecker/validateFunc/validateRedGPUContext', () => ({
    default: () => {
    }
}));

describe('GLTFCacheManager', () => {
    it('isolates gltfCache, glbCache, and bufferCache and clears all maps on destroy()', () => {
        const manager = new GLTFCacheManager({} as any);

        const sampleGltf = {asset: {version: '2.0'}} as any;
        const sampleGlb = new ArrayBuffer(16);
        const sampleBin = new ArrayBuffer(32);

        manager.gltfCache.cache.set('a.gltf', sampleGltf);
        manager.gltfCache.pending.set('a.gltf', Promise.resolve(sampleGltf));
        manager.glbCache.cache.set('b.glb', sampleGlb);
        manager.glbCache.pending.set('b.glb', Promise.resolve(sampleGlb));
        manager.bufferCache.cache.set('c.bin', sampleBin);
        manager.bufferCache.pending.set('c.bin', Promise.resolve(sampleBin));

        expect(manager.gltfCache.cache.get('a.gltf')).toBe(sampleGltf);
        expect(manager.glbCache.cache.get('b.glb')).toBe(sampleGlb);
        expect(manager.bufferCache.cache.get('c.bin')).toBe(sampleBin);

        manager.destroy();

        expect(manager.gltfCache.cache.size).toBe(0);
        expect(manager.gltfCache.pending.size).toBe(0);
        expect(manager.glbCache.cache.size).toBe(0);
        expect(manager.glbCache.pending.size).toBe(0);
        expect(manager.bufferCache.cache.size).toBe(0);
        expect(manager.bufferCache.pending.size).toBe(0);
    });
});
