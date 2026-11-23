import {describe, expect, it} from 'vitest';
import ColorRGB from '../../src/color/ColorRGB';

describe('Vitest Infrastructure Smoke Test', () => {
    it('loads TypeScript source modules directly without Rollup bundling', () => {
        const color = new ColorRGB(10, 20, 30);
        expect(color.r).toBe(10);
        expect(color.g).toBe(20);
        expect(color.b).toBe(30);
    });
});
