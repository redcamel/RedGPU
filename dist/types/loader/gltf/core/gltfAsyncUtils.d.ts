/**
 * [KO] 표준 `AbortError` 인스턴스를 생성합니다.
 * [EN] Creates a standard `AbortError` instance.
 *
 * @param message -
 * [KO] 에러 메시지 (선택)
 * [EN] Optional error message
 * @returns
 * [KO] 생성된 `AbortError` 인스턴스
 * [EN] Created `AbortError` instance
 * @category GLTF
 */
export declare const createAbortError: (message?: string) => Error;
/**
 * [KO] 주어진 에러가 `AbortError`인지 판별합니다.
 * [EN] Checks whether the given error is an `AbortError`.
 *
 * @param error -
 * [KO] 검사할 에러 값
 * [EN] Error value to inspect
 * @returns
 * [KO] `AbortError` 여부
 * [EN] Whether the error is an `AbortError`
 * @category GLTF
 */
export declare const isAbortError: (error: unknown) => boolean;
/**
 * [KO] `AbortSignal`이 중단된 상태이면 즉시 `AbortError`를 발생시킵니다.
 * [EN] Throws an `AbortError` immediately if the provided `AbortSignal` is already aborted.
 *
 * @param signal -
 * [KO] 검사할 `AbortSignal` (선택)
 * [EN] Optional `AbortSignal` to check
 * @category GLTF
 */
export declare const throwIfAborted: (signal?: AbortSignal) => void;
/**
 * [KO] 다음 애니메이션 프레임까지 비동기로 대기하며, 대기 중 `AbortSignal`이 중단되면 즉시 취소합니다.
 * [EN] Asynchronously yields until the next animation frame, rejecting immediately if the `AbortSignal` aborts.
 *
 * @param signal -
 * [KO] 대기 취소용 `AbortSignal` (선택)
 * [EN] Optional `AbortSignal` to cancel waiting
 * @returns
 * [KO] 다음 프레임 도달 시 완료되는 `Promise<void>`
 * [EN] `Promise<void>` resolving on the next frame
 * @category GLTF
 */
export declare const nextFrame: (signal?: AbortSignal) => Promise<void>;
