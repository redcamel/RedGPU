import {useEffect} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {useMediaQuery} from '../../utils/useMediaQuery';

/**
 * [KO] 뷰포트 크기를 감시하고 전역 상태(isNarrow)를 동기화하는 훅입니다.
 * [EN] Hook that monitors viewport size and synchronizes global state (isNarrow).
 */
export const useViewportSync = () => {
    const setIsNarrow = useExampleHelperStore((state: ExampleHelperState) => state.setIsNarrow);
    const isNarrow = useMediaQuery(768);

    useEffect(() => {
        setIsNarrow(isNarrow);
    }, [isNarrow, setIsNarrow]);

    return isNarrow;
};
