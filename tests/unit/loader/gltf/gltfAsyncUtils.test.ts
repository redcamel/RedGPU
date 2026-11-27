import {describe, expect, it} from 'vitest';
import {createAbortError, nextFrame, throwIfAborted} from '../../../../src/loader/gltf/core/gltfAsyncUtils';

describe('gltfAsyncUtils (AbortSignal & nextFrame)', () => {
    it('creates a standard AbortError and throws when signal is aborted', () => {
        const err = createAbortError('custom abort');
        expect(err.name).toBe('AbortError');
        expect(err.message).toBe('custom abort');

        const controller = new AbortController();
        expect(() => throwIfAborted(controller.signal)).not.toThrow();

        controller.abort();
        expect(() => throwIfAborted(controller.signal)).toThrow();
        try {
            throwIfAborted(controller.signal);
        } catch (caught: any) {
            expect(caught.name).toBe('AbortError');
        }
    });

    it('resolves nextFrame normally when not aborted', async () => {
        const controller = new AbortController();
        await expect(nextFrame(controller.signal)).resolves.toBeUndefined();
    });

    it('rejects nextFrame immediately if signal is already aborted', async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(nextFrame(controller.signal)).rejects.toMatchObject({name: 'AbortError'});
    });

    it('cancels pending nextFrame and rejects with AbortError when aborted mid-flight', async () => {
        const controller = new AbortController();
        const pending = nextFrame(controller.signal);
        controller.abort();
        await expect(pending).rejects.toMatchObject({name: 'AbortError'});
    });
});
