import {useEffect, useState} from 'react';

/**
 * [KO] 브라우저 너비를 감시하여 특정 중단점 이하인지 여부를 반환하는 훅입니다.
 * [EN] A hook that monitors the browser width and returns whether it is below a specific breakpoint.
 * @param width - [KO] 중단점 너비 [EN] Breakpoint width
 * @returns [KO] 중단점 이하 여부 [EN] Whether it is below the breakpoint
 */
export const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = useState(false);

    useEffect(() => {
        const updateTarget = (e: MediaQueryListEvent) => {
            if (e.matches) setTargetReached(true);
            else setTargetReached(false);
        };

        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addEventListener('change', updateTarget);

        // Check initial state
        if (media.matches) setTargetReached(true);

        return () => media.removeEventListener('change', updateTarget);
    }, [width]);

    return targetReached;
};
