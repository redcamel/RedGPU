/**
 * [KO] 대규모 지형 스캐터 시스템(Foliage / Grass)을 위한 순수 공간 수학, 2D 그리드 키 해싱, Zero-GC 제자리 퀵 정렬 및 Float16 패킹 공통 유틸리티 모듈입니다.
 * [EN] Common utility module for pure spatial mathematics, 2D grid key hashing, Zero-GC in-place quicksort, and Float16 packing for large-scale terrain scatter systems (Foliage / Grass).
 * @packageDocumentation
 */

const tempFloat32 = new Float32Array(2);
const tempUint32 = new Uint32Array(tempFloat32.buffer);

/**
 * [KO] 서브셀 또는 지형 청크의 정수 2D 좌표를 단일 32비트 정수 키로 패킹합니다.
 * [EN] Packs integer 2D coordinates of a subcell or terrain chunk into a single 32-bit integer key.
 *
 * @param scX - 2D 그리드 정수 X 좌표
 * @param scZ - 2D 그리드 정수 Z 좌표
 * @returns 32비트 고유 정수 키
 */
export function packSubCellKey(scX: number, scZ: number): number {
    return ((scZ << 16) | (scX & 0xFFFF)) | 0;
}

/**
 * [KO] 32비트 정수 키에서 2D 그리드 정수 X 좌표를 복원합니다. (16비트 부호 복원)
 * [EN] Unpacks 2D grid integer X coordinate from a 32-bit integer key. (16-bit sign preserved)
 *
 * @param key - 32비트 고유 정수 키
 * @returns 정수 X 좌표
 */
export function unpackSubCellKeyX(key: number): number {
    return (key << 16) >> 16;
}

/**
 * [KO] 32비트 정수 키에서 2D 그리드 정수 Z 좌표를 복원합니다. (상위 16비트 부호 복원)
 * [EN] Unpacks 2D grid integer Z coordinate from a 32-bit integer key. (High 16-bit sign preserved)
 *
 * @param key - 32비트 고유 정수 키
 * @returns 정수 Z 좌표
 */
export function unpackSubCellKeyZ(key: number): number {
    return key >> 16;
}

/**
 * [KO] 그리드 정수 좌표와 식생/잔디 타입 이름 해시로부터 결정론적(Deterministic) 32비트 의사난수 시드를 산출합니다.
 * [EN] Computes a deterministic 32-bit PRNG seed from integer grid coordinates and scatter type name hash.
 *
 * @param gridX - 그리드 정수 X 좌표
 * @param gridZ - 그리드 정수 Z 좌표
 * @param nameHash - 타입 고유 정수 해시
 * @returns 0이 아닌 유효한 32비트 부호 없는 정수 시드
 */
export function computeScatterGridSeed(gridX: number, gridZ: number, nameHash: number): number {
    let seed = ((gridX * 73856093) ^ (gridZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
    return seed === 0 ? 0x9e3779b9 : seed;
}

/**
 * [KO] 32비트 단정밀도 부동소수점을 16비트 반정밀도(Half-Float / IEEE 754-2008) 비트 패턴으로 고속 변환합니다.
 * [EN] Fast-converts a 32-bit single-precision float to a 16-bit half-precision float bit pattern.
 *
 * @param val - 변환할 부동소수점 값
 * @returns 16비트 uint 값
 */
export function fastFloatToHalf(val: number): number {
    tempFloat32[0] = val;
    const f = tempUint32[0];
    const sign = (f >> 16) & 0x8000;
    let exp = ((f >> 23) & 0xFF) - 127 + 15;
    let mant = (f >> 13) & 0x03FF;
    if (exp <= 0) return sign;
    if (exp >= 31) return sign | 0x7C00;
    return sign | (exp << 10) | mant;
}

/**
 * [KO] 두 개의 단정밀도 부동소수점(X, Z 스케일 등)을 2개의 16비트 반정밀도로 변환하여 단일 32비트 uint로 패킹합니다.
 * [EN] Packs two 32-bit floats (X, Z scales) into two 16-bit half-floats inside a single 32-bit uint.
 *
 * @param x - 첫 번째 부동소수점 (하위 16비트)
 * @param y - 두 번째 부동소수점 (상위 16비트)
 * @returns 32비트 패킹된 uint 값
 */
export function fastPack2x16float(x: number, y: number): number {
    tempFloat32[0] = x;
    tempFloat32[1] = y;

    const f0 = tempUint32[0];
    const sign0 = (f0 >> 16) & 0x8000;
    let exp0 = ((f0 >> 23) & 0xFF) - 127 + 15;
    let mant0 = (f0 >> 13) & 0x03FF;
    const hx = sign0 | (exp0 <= 0 ? 0 : (exp0 >= 31 ? 0x7C00 : (exp0 << 10) | mant0));

    const f1 = tempUint32[1];
    const sign1 = (f1 >> 16) & 0x8000;
    let exp1 = ((f1 >> 23) & 0xFF) - 127 + 15;
    let mant1 = (f1 >> 13) & 0x03FF;
    const hy = sign1 | (exp1 <= 0 ? 0 : (exp1 >= 31 ? 0x7C00 : (exp1 << 10) | mant1));

    return ((hx & 0xFFFF) | ((hy & 0xFFFF) << 16)) >>> 0;
}

/**
 * [KO] 단일 균일(Uniform) 스케일 값을 상위/하위 16비트에 복제 패킹합니다.
 * [EN] Duplicates and packs a single uniform scale value into high/low 16-bit half-floats.
 *
 * @param scale - 스케일 부동소수점 값
 * @returns 32비트 패킹된 uint 값
 */
export function fastPackUniformScale(scale: number): number {
    const h = fastFloatToHalf(scale) & 0xFFFF;
    return (h | (h << 16)) >>> 0;
}

/**
 * [KO] 중심 좌표(`centerX`, `centerZ`)를 갖는 서브셀 객체 배열을 카메라 기준 거리 제곱값 오름차순으로 제자리 퀵 정렬합니다. (Zero-GC & 거리 단 1회 계산)
 * [EN] In-place quick-sorts subcell object arrays having `centerX` and `centerZ` in ascending order of squared distance to camera. (Zero-GC & single distance evaluation)
 *
 * @param subCells - 정렬할 서브셀 객체 배열
 * @param dists - 사전 할당된 거리 버퍼 (최소 subCells.length 이상의 Float32Array)
 * @param camX - 카메라 월드 X 좌표
 * @param camZ - 카메라 월드 Z 좌표
 * @param count - 정렬할 서브셀 개수
 */
export function sortSubCellsByDistance<T extends { centerX: number; centerZ: number }>(
    subCells: T[],
    dists: Float32Array,
    camX: number,
    camZ: number,
    count: number
): void {
    if (count <= 1) return;

    // 1. 거리 계산 1회 일괄 수행 ($N$회 연산으로 최소화)
    for (let i = 0; i < count; i++) {
        const c = subCells[i];
        const dx = c.centerX - camX;
        const dz = c.centerZ - camZ;
        dists[i] = dx * dx + dz * dz;
    }

    // 2. 동반 제자리 퀵 정렬 수행
    quickSortSubCells(subCells, dists, 0, count - 1);
}

function quickSortSubCells<T>(
    subCells: T[],
    dists: Float32Array,
    left: number,
    right: number
): void {
    if (left >= right) return;
    const pivotVal = dists[(left + right) >> 1];
    let i = left;
    let j = right;
    while (i <= j) {
        while (dists[i] < pivotVal) i++;
        while (dists[j] > pivotVal) j--;
        if (i <= j) {
            const tempSubCell = subCells[i];
            subCells[i] = subCells[j];
            subCells[j] = tempSubCell;

            const tempDist = dists[i];
            dists[i] = dists[j];
            dists[j] = tempDist;

            i++;
            j--;
        }
    }
    if (left < j) quickSortSubCells(subCells, dists, left, j);
    if (i < right) quickSortSubCells(subCells, dists, i, right);
}
