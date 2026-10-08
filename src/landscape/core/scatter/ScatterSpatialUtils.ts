/**
 * [KO] 대규모 지형 스캐터 시스템(Foliage / Grass)을 위한 결정론적 의사난수(PRNG) 시드 생성 및 고속 Half-Float(Float16) 패킹 공통 유틸리티 모듈입니다.
 * [EN] Common utility module for deterministic PRNG seed generation and fast Half-Float (Float16) packing for large-scale terrain scatter systems (Foliage / Grass).
 * @packageDocumentation
 */

const tempFloat32 = new Float32Array(2);
const tempUint32 = new Uint32Array(tempFloat32.buffer);

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
function fastFloatToHalf(val: number): number {
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
