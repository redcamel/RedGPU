/**
 * [KO] 표준 `AbortError` 인스턴스를 생성합니다.
 * [EN] Creates a standard `AbortError` instance.
 */
export const createAbortError = (message: string = 'GLTF loading was aborted.'): Error => {
    if (typeof DOMException === 'function') {
        return new DOMException(message, 'AbortError');
    }
    const err = new Error(message);
    err.name = 'AbortError';
    return err;
};

/**
 * [KO] `AbortSignal`이 이미 중단된 상태이면 즉시 `AbortError`를 발생시킵니다.
 * [EN] Throws an `AbortError` immediately if the provided `AbortSignal` is already aborted.
 */
export const throwIfAborted = (signal?: AbortSignal): void => {
    if (signal?.aborted) {
        throw createAbortError();
    }
};

/**
 * [KO] 다음 애니메이션 프레임까지 비동기로 대기하며, 대기 중 `AbortSignal`이 중단되면 즉시 취소합니다.
 * [EN] Asynchronously yields until the next animation frame, rejecting immediately if the `AbortSignal` aborts.
 */
export const nextFrame = (signal?: AbortSignal): Promise<void> => {
    if (signal?.aborted) {
        return Promise.reject(createAbortError());
    }
    return new Promise<void>((resolve, reject) => {
        let timerId: number | ReturnType<typeof setTimeout> | null = null;
        const useRAF = typeof requestAnimationFrame === 'function';

        const cleanup = () => {
            if (signal) {
                signal.removeEventListener('abort', onAbort);
            }
        };

        const onAbort = () => {
            if (timerId !== null) {
                if (useRAF && typeof cancelAnimationFrame === 'function') {
                    cancelAnimationFrame(timerId as number);
                } else {
                    clearTimeout(timerId as ReturnType<typeof setTimeout>);
                }
                timerId = null;
            }
            cleanup();
            reject(createAbortError());
        };

        const onTick = () => {
            timerId = null;
            cleanup();
            if (signal?.aborted) {
                reject(createAbortError());
            } else {
                resolve();
            }
        };

        if (signal) {
            signal.addEventListener('abort', onAbort, {once: true});
        }

        timerId = useRAF ? requestAnimationFrame(onTick) : setTimeout(onTick, 0);
    });
};
