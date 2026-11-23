import {describe, expect, it} from 'vitest';
import {calculateTextureByteSize, getMipLevelCount} from '../../../src/utils/texture';

describe('Util.texture (non-GPU)', () => {
    // getMipLevelCount 밉맵 레벨 수 계산 및 NaN 입력 차단 검증
    it('calculates mip level count and rejects NaN dimensions', () => {
        expect(getMipLevelCount(1024, 1024)).toBe(11);
        expect(getMipLevelCount(1, 1)).toBe(1);
        expect(() => getMipLevelCount(NaN, 1024)).toThrow();
    });

    // calculateTextureByteSize에 null 전달 시 예외 발생 검증
    it('throws when calculateTextureByteSize receives null', () => {
        // 실제 GPUTexture 바이트 크기 계산은 E2E textureUtil.spec.ts에서 검증
        expect(() => calculateTextureByteSize(null as unknown as GPUTexture)).toThrow();
    });
});
