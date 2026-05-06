/**
 * [KO] 숫자를 포맷팅하여 문자열로 반환합니다.
 * 천 단위 콤마(,)를 포함하며, 퍼센트(%)나 픽셀(px) 문자열인 경우 해당 단위를 유지합니다.
 * [EN] Formats a number and returns it as a string.
 * Includes thousand-separator commas, and preserves units like percent (%) or pixel (px).
 */
export const formatNumber = (val: any, decimals: number = 2): string => {
    if (val === undefined || val === null) return '';
    const str = String(val);

    // Check for units
    if (str.includes('%')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}%`;
    }
    if (str.includes('px')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}px`;
    }

    const num = parseFloat(str);
    if (isNaN(num)) return str;

    // For integers, don't show decimals unless requested
    if (Number.isInteger(num)) {
        return num.toLocaleString();
    }

    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

/**
 * [KO] 텍스처 사용처 플래그를 읽기 쉬운 문자열로 변환합니다.
 */
export const formatTextureUsage = (usage: number): string => {
    const labels: string[] = [];
    if (usage & 0x01) labels.push('COPY_SRC');
    if (usage & 0x02) labels.push('COPY_DST');
    if (usage & 0x04) labels.push('TEXTURE');
    if (usage & 0x08) labels.push('STORAGE');
    if (usage & 0x10) labels.push('ATTACHMENT');
    return labels.join(', ');
};

/**
 * [KO] 버퍼 사용처 플래그를 읽기 쉬운 문자열로 변환합니다.
 */
export const formatBufferUsage = (usage: number): string => {
    const labels: string[] = [];
    if (usage & 0x01) labels.push('MAP_READ');
    if (usage & 0x02) labels.push('MAP_WRITE');
    if (usage & 0x04) labels.push('COPY_SRC');
    if (usage & 0x08) labels.push('COPY_DST');
    if (usage & 0x10) labels.push('INDEX');
    if (usage & 0x20) labels.push('VERTEX');
    if (usage & 0x40) labels.push('UNIFORM');
    if (usage & 0x80) labels.push('STORAGE');
    if (usage & 0x100) labels.push('INDIRECT');
    if (usage & 0x200) labels.push('QUERY_RESOLVE');
    return labels.join(', ');
};
