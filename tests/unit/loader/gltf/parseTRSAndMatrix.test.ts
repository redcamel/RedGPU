import {mat4, quat} from 'gl-matrix';
import {describe, expect, it, vi} from 'vitest';
import GPU_FRONT_FACE from '../../../../src/gpuConst/GPU_FRONT_FACE';
import parseTRSAndMATRIX_GLTF from '../../../../src/loader/gltf/parsers/parseTRSAndMATRIX_GLTF';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

const createMockMesh = () => ({
    x: 0,
    y: 0,
    z: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    primitiveState: {frontFace: GPU_FRONT_FACE.CCW},
    setPosition(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    },
    setScale(x: number, y: number, z: number) {
        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;
    },
    setRotation(x: number, y: number, z: number) {
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
    },
});

describe('parseTRSAndMATRIX_GLTF', () => {
    it('applies translation, rotation quaternion, and positive scale properties individually', () => {
        const mesh = createMockMesh();
        const q = [0, Math.SQRT1_2, 0, Math.SQRT1_2];

        parseTRSAndMATRIX_GLTF(mesh as any, {
            translation: [3, 4, 5],
            rotation: q,
            scale: [2, 3, 4],
        });

        expect(mesh.x).toBe(3);
        expect(mesh.y).toBe(4);
        expect(mesh.z).toBe(5);
        expect(mesh.scaleX).toBe(2);
        expect(mesh.scaleY).toBe(3);
        expect(mesh.scaleZ).toBe(4);
        expect(mesh.rotationY).toBeCloseTo(90, 4);
        expect(mesh.primitiveState.frontFace).toBe(GPU_FRONT_FACE.CCW);
    });

    it('flips frontFace to CW when any TRS scale component is negative', () => {
        const mesh = createMockMesh();
        parseTRSAndMATRIX_GLTF(mesh as any, {scale: [-1, 1, 1]});
        expect(mesh.scaleX).toBe(-1);
        expect(mesh.primitiveState.frontFace).toBe(GPU_FRONT_FACE.CW);
    });

    it('decomposes 4x4 column-major matrix into translation, scale, and Euler rotation', () => {
        const mesh = createMockMesh();
        const m = mat4.create();
        const q = quat.create();
        quat.fromEuler(q, 30, 0, 0);
        mat4.fromRotationTranslationScale(m, q, [10, -20, 30], [2, 4, 6]);

        parseTRSAndMATRIX_GLTF(mesh as any, {matrix: Array.from(m)});

        expect(mesh.x).toBeCloseTo(10, 5);
        expect(mesh.y).toBeCloseTo(-20, 5);
        expect(mesh.z).toBeCloseTo(30, 5);
        expect(mesh.scaleX).toBeCloseTo(2, 5);
        expect(mesh.scaleY).toBeCloseTo(4, 5);
        expect(mesh.scaleZ).toBeCloseTo(6, 5);
        expect(mesh.rotationX).toBeCloseTo(30, 4);
        expect(mesh.rotationY).toBeCloseTo(0, 4);
        expect(mesh.rotationZ).toBeCloseTo(0, 4);
    });
});
