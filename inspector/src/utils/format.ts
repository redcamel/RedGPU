/**
 * [KO] 숫자를 포맷팅하여 문자열로 반환합니다. 퍼센트(%)나 픽셀(px) 문자열인 경우 해당 단위를 유지하며 소수점 2자리까지 표시합니다.
 * [EN] Formats a number and returns it as a string. If it's a percent (%) or pixel (px) string, it preserves the unit and displays up to 2 decimal places.
 */
export const formatNumber = (val: any): string => {
    const str = String(val);
    if (str.includes('%')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}%`;
    }
    if (str.includes('px')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}px`;
    }
    const num = parseFloat(str);
    return isNaN(num) ? str : num.toFixed(2);
};
