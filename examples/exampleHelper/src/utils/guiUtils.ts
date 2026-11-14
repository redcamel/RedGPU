import {hdrImages} from '../data/hdrList';

/**
 * [KO] Tweakpane GUI 구성을 위한 유틸리티 함수들입니다.
 * [EN] Utility functions for Tweakpane GUI configuration.
 */

export const hdrOptions = Object.fromEntries(hdrImages.map(item => [item.name, item.name]));

export const createSourcePathMonitor = (pathInfo: { finalPath: string }) => {
    let sourceBinding: any;
    return {
        updatePathInfo: (src: string | string[]) => {
            const getFileName = (path: string) => path.split('/').pop() || path;
            pathInfo.finalPath = Array.isArray(src) ? src.map(getFileName).join('\n') : getFileName(src);
            if (sourceBinding) sourceBinding.refresh();
        },
        bindSourcePath: (folder: any) => {
            sourceBinding = folder.addBinding(pathInfo, 'finalPath', {
                readonly: true,
                label: 'source',
                multiline: true,
                rows: 2
            });
        }
    };
};

export const bindLuminance = (folder: any, getTarget: () => any) => {
    folder.addBinding({
        get luminance() {
            const target = getTarget();
            return target ? target.luminance : 0;
        },
        set luminance(v: number) {
            const target = getTarget();
            if (target) target.luminance = v;
        },
    }, 'luminance', {min: 0, max: 100000, step: 100});
};

export const bindSizeDimensions = (
    folder: any,
    target: any,
    keys: readonly string[],
    useExplicitUnitLabel: boolean = false
) => {
    const sizeData: Record<string, any> = {};
    keys.forEach((key) => {
        const parsed = parseSize(target[key]);
        sizeData[key] = parsed.value;
        sizeData[`${key}Unit`] = parsed.unit;
    });

    const updateDim = (key: string) => {
        const value = sizeData[key];
        const unit = sizeData[`${key}Unit`];
        target[key] = unit === 'number' ? value : `${value}${unit}`;
    };

    keys.forEach((key) => {
        const unitKey = `${key}Unit`;
        folder.addBinding(sizeData, key, {
            min: 0,
            max: sizeData[unitKey] === '%' ? 200 : 4096,
            step: 0.01
        }).on('change', () => updateDim(key));

        folder.addBinding(sizeData, unitKey, {
            ...(useExplicitUnitLabel ? {label: `${key} Unit`} : {}),
            options: {'%': '%', 'px': 'px', 'number': 'number'}
        }).on('change', () => updateDim(key));
    });
};

/**
 * [KO] 컬러와 알파 입력을 컨테이너에 추가합니다.
 * [EN] Adds color and alpha inputs to the container.
 * @param container - Tweakpane Folder or Page
 * @param colorObject - RedGPU Color object (e.g., scene.backgroundColor)
 * @param labelPrefix - Label prefix for the inputs
 */
export const addColorAlphaInputs = (container: any, colorObject: any, labelPrefix: string = 'BG') => {
    const hasAlpha = 'a' in colorObject;

    // [KO] 6자리 HEX 문자열을 위한 프록시 객체 (상단 텍스트 필드에 6자리만 표기됨)
    // [EN] Proxy object for 6-digit HEX string (only 6 digits displayed in top text field)
    const colorProxy = {
        get color() {
            return colorObject.hex;
        },
        set color(v: string) {
            colorObject.setColorByHEX(v);
        }
    };

    // [KO] 6자리 HEX 컬러 픽커 추가
    // [EN] Add 6-digit HEX color picker
    container.addBinding(colorProxy, 'color', {
        label: `${labelPrefix} Color`,
        picker: 'inline',
        expanded: true,
    });

    // [KO] 알파 슬라이더 별도 추가 (6자리 HEX 유지를 위해 분리)
    // [EN] Add separate Alpha slider (separated to maintain 6-digit HEX)
    if (hasAlpha) {
        container.addBinding(colorObject, 'a', {
            min: 0,
            max: 1,
            step: 0.01,
            label: `${labelPrefix} Alpha`
        });
    }
};

/**
 * [KO] 현재 예제 위치를 기준으로 상대 경로 접두사(../../ 등)를 반환합니다.
 */
export const getRelativePrefix = () => {
    const pathSegments = window.location.pathname.split('/');
    const examplesIndex = pathSegments.indexOf('examples');
    const currentDepth = Math.max(0, pathSegments.length - examplesIndex - 2);
    return '../'.repeat(currentDepth);
};

/**
 * [KO] 현재 예제 위치를 기준으로 주어진 소스 경로(들)를 해결합니다.
 */
export const resolveExamplePath = (src: string | string[]) => {
    const prefix = getRelativePrefix();
    const resolve = (p: string) => prefix + p;
    return Array.isArray(src) ? src.map(resolve) : resolve(src);
};

/**
 * [KO] 문자열 또는 숫자 형식의 사이즈를 값과 단위로 분리합니다.
 * [EN] Separates size in string or number format into value and unit.
 * @param value
 */
export const parseSize = (value: string | number) => {
    if (typeof value === 'number') return {value, unit: 'number'};
    const strValue = String(value);
    if (strValue.endsWith('%')) return {value: parseFloat(strValue), unit: '%'};
    if (strValue.endsWith('px')) return {value: parseFloat(strValue), unit: 'px'};
    return {value: parseFloat(strValue), unit: 'px'};
};
