// GLB Zero-Copy ArrayBufferView -> DataView 변환 및 정적 메쉬 null 스킨 버퍼 방어 단위 테스트
import {describe, expect, it, vi} from 'vitest';
import ParsedSkinInfo_GLTF from '../../../../src/loader/gltf/cls/ParsedSkinInfo_GLTF';
import getGLTFBuffersResources from '../../../../src/loader/gltf/core/getGLTFBuffersResources';
import {GLTF} from '../../../../src/loader/gltf/GLTF';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

describe('Phase 8-3 — GLB Zero-Copy View & Static Mesh Null Skin Buffer Guard', () => {
    it('wraps Uint8Array subview buffer.uri into a Zero-Copy DataView preserving byteOffset and byteLength', async () => {
        const backingBuffer = new ArrayBuffer(64);
        const backingView = new DataView(backingBuffer);
        // GLB 헤더(12B) + JSON 청크(20B) 이후 byteOffset=32 위치에 BIN 청크(16B) 배치 시뮬레이션
        backingView.setFloat32(32, 123.5, true);
        backingView.setFloat32(36, -45.25, true);
        backingView.setUint32(40, 987654, true);
        backingView.setUint32(44, 42, true);

        const binaryChunkView = new Uint8Array(backingBuffer, 32, 16);
        const gltfData = {
            asset: {version: '2.0'},
            buffers: [
                {byteLength: 16, uri: binaryChunkView as any}
            ]
        } as unknown as GLTF;

        const resultBuffers: DataView[] = [];
        const mockLoader = {
            filePath: '',
            loadingProgressInfo: {buffers: null},
            parsingResult: {
                uris: {
                    buffers: resultBuffers
                }
            }
        } as any;

        await new Promise<void>((resolve, reject) => {
            getGLTFBuffersResources(mockLoader, gltfData, resolve, undefined, reject, undefined, resultBuffers);
        });

        expect(resultBuffers.length).toBe(1);
        const dv = resultBuffers[0];
        expect(dv).toBeInstanceOf(DataView);
        // 복사 없이 원본 backingBuffer를 그대로 공유(Zero-Copy)해야 함
        expect(dv.buffer).toBe(backingBuffer);
        expect(dv.byteOffset).toBe(32);
        expect(dv.byteLength).toBe(16);
        expect(dv.getFloat32(0, true)).toBeCloseTo(123.5);
        expect(dv.getFloat32(4, true)).toBeCloseTo(-45.25);
        expect(dv.getUint32(8, true)).toBe(987654);
        expect(dv.getUint32(12, true)).toBe(42);
    });

    it('still supports legacy ArrayBuffer buffer.uri directly', async () => {
        const rawBuffer = new ArrayBuffer(8);
        new DataView(rawBuffer).setFloat32(0, 7.75, true);

        const gltfData = {
            asset: {version: '2.0'},
            buffers: [
                {byteLength: 8, uri: rawBuffer as any}
            ]
        } as unknown as GLTF;

        const resultBuffers: DataView[] = [];
        const mockLoader = {
            filePath: '',
            loadingProgressInfo: {buffers: null},
            parsingResult: {
                uris: {
                    buffers: resultBuffers
                }
            }
        } as any;

        await new Promise<void>((resolve, reject) => {
            getGLTFBuffersResources(mockLoader, gltfData, resolve, undefined, reject, undefined, resultBuffers);
        });

        expect(resultBuffers.length).toBe(1);
        expect(resultBuffers[0].buffer).toBe(rawBuffer);
        expect(resultBuffers[0].byteOffset).toBe(0);
        expect(resultBuffers[0].getFloat32(0, true)).toBeCloseTo(7.75);
    });

    it('returns empty array safely from ParsedSkinInfo_GLTF.getUsedJointIndices when jointBuffer is null', () => {
        const skinInfo = new ParsedSkinInfo_GLTF();
        const staticMesh = {
            animationInfo: {
                weightBuffer: null,
                jointBuffer: null
            }
        } as any;

        expect(skinInfo.getUsedJointIndices(staticMesh)).toEqual([]);
    });
});
