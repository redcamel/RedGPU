/**
 * [KO] Tweakpane GUI 구성을 위한 유틸리티 함수들입니다.
 * [EN] Utility functions for Tweakpane GUI configuration.
 */

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
 * [KO] 문자열 또는 숫자 형식의 사이즈를 값과 단위로 분리합니다.
 * [EN] Separates size in string or number format into value and unit.
 * @param value
 */
export const parseSize = (value: string | number) => {
    if (typeof value === 'number') return { value, unit: 'number' };
    const strValue = String(value);
    if (strValue.endsWith('%')) return { value: parseFloat(strValue), unit: '%' };
    if (strValue.endsWith('px')) return { value: parseFloat(strValue), unit: 'px' };
    return { value: parseFloat(strValue), unit: 'px' };
};
