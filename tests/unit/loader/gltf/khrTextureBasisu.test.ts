// KHR_texture_basisu 텍스처 소스 우선순위 해석 및 KTX2 12바이트 매직 넘버 판별 단위 테스트
import {describe, expect, it} from 'vitest';
import {resolveTextureSourceId} from '../../../../src/loader/gltf/parsers/material/parseMaterialTexture';
import {isKtx2Magic} from '../../../../src/resources/texture/BitmapTexture';

describe('KHR_texture_basisu — resolveTextureSourceId', () => {
    it('prioritizes KHR_texture_basisu over EXT_texture_webp and fallback source', () => {
        // KHR_texture_basisu > EXT_texture_webp > 기본 source 우선순위 검증
        expect(resolveTextureSourceId({
            source: 1,
            extensions: {
                EXT_texture_webp: {source: 2},
                KHR_texture_basisu: {source: 3}
            }
        })).toBe(3);

        expect(resolveTextureSourceId({
            source: 1,
            extensions: {
                EXT_texture_webp: {source: 2}
            }
        })).toBe(2);

        expect(resolveTextureSourceId({source: 1})).toBe(1);
    });

    it('preserves index 0 without falling back to lower-priority sources', () => {
        // source 인덱스가 0일 때 falsy 폴백으로 덮어쓰이지 않는지 검증
        expect(resolveTextureSourceId({
            source: 5,
            extensions: {
                EXT_texture_webp: {source: 4},
                KHR_texture_basisu: {source: 0}
            }
        })).toBe(0);

        expect(resolveTextureSourceId({
            source: 5,
            extensions: {
                EXT_texture_webp: {source: 0}
            }
        })).toBe(0);

        expect(resolveTextureSourceId({source: 0})).toBe(0);
    });

    it('returns undefined for missing or empty texture definitions', () => {
        // 비어 있거나 누락된 텍스처 정의에 대한 방어 검증
        expect(resolveTextureSourceId(null)).toBeUndefined();
        expect(resolveTextureSourceId(undefined)).toBeUndefined();
        expect(resolveTextureSourceId({})).toBeUndefined();
    });
});

describe('KHR_texture_basisu — isKtx2Magic', () => {
    it('accepts valid 12-byte KTX2 magic identifier', () => {
        // KTX2 공식 12바이트 매직 넘버(«KTX 20»\r\n\x1A\n) 정상 판별 검증
        const validKtx2 = new Uint8Array([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x32, 0x30, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
        expect(isKtx2Magic(validKtx2)).toBe(true);
    });

    it('rejects KTX1, PNG, truncated buffers, and corrupted magic headers', () => {
        // KTX1 헤더, PNG 헤더, 12바이트 미만 버퍼, 손상된 매직 헤더 거부 검증
        const ktx1Header = new Uint8Array([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A]);
        const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
        const shortBuf = new Uint8Array([0xAB, 0x4B, 0x54, 0x58]);

        expect(isKtx2Magic(ktx1Header)).toBe(false);
        expect(isKtx2Magic(pngHeader)).toBe(false);
        expect(isKtx2Magic(shortBuf)).toBe(false);
        expect(isKtx2Magic(new Uint8Array(0))).toBe(false);
    });
});
