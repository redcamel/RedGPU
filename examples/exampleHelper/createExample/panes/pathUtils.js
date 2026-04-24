/**
 * [KO] 현재 예제 위치를 기준으로 상대 경로 접두사(../../ 등)를 반환합니다.
 * [EN] Returns the relative path prefix (e.g., ../../) based on the current example location.
 * @returns {string}
 */
export const getRelativePrefix = () => {
    const pathSegments = window.location.pathname.split('/');
    const examplesIndex = pathSegments.indexOf('examples');
    const currentDepth = Math.max(0, pathSegments.length - examplesIndex - 2);
    return '../'.repeat(currentDepth);
};

/**
 * [KO] 현재 예제 위치를 기준으로 주어진 소스 경로(들)를 해결합니다.
 * [EN] Resolves the given source path(s) based on the current example location.
 * @param {string|string[]} src
 * @returns {string|string[]}
 */
export const resolveExamplePath = (src) => {
    const prefix = getRelativePrefix();
    const resolve = (p) => prefix + p;
    return Array.isArray(src) ? src.map(resolve) : resolve(src);
};
