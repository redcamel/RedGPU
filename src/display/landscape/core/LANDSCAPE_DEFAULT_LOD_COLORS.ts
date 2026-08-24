export const LANDSCAPE_DEFAULT_LOD_COLORS: readonly [number, number, number, number][] = Object.freeze([
    [0.23, 0.51, 0.96, 1.0], // LOD 0 (Blue)
    [0.06, 0.72, 0.51, 1.0], // LOD 1 (Emerald Green)
    [0.92, 0.70, 0.03, 1.0], // LOD 2 (Yellow)
    [0.98, 0.45, 0.09, 1.0], // LOD 3 (Orange)
    [0.94, 0.27, 0.27, 1.0], // LOD 4 (Red)
    [0.66, 0.33, 0.97, 1.0], // LOD 5 (Purple)
    [0.93, 0.28, 0.60, 1.0], // LOD 6 (Pink)
    [0.58, 0.64, 0.72, 1.0]  // LOD 7 (Slate)
]);

export const LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS: readonly string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(c =>
        `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, 0.75)`
    )
);

export const LANDSCAPE_DEFAULT_LOD_HEX_STRINGS: readonly string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(c =>
        `#${Math.floor(c[0] * 255).toString(16).padStart(2, '0')}${Math.floor(c[1] * 255).toString(16).padStart(2, '0')}${Math.floor(c[2] * 255).toString(16).padStart(2, '0')}`
    )
);

export function formatLODColorRGBA(color: [number, number, number, number], alpha: number = 0.75): string {
    return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${alpha})`;
}

export function formatLODColorHex(color: [number, number, number, number]): string {
    const r = Math.floor(color[0] * 255).toString(16).padStart(2, '0');
    const g = Math.floor(color[1] * 255).toString(16).padStart(2, '0');
    const b = Math.floor(color[2] * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

export default LANDSCAPE_DEFAULT_LOD_COLORS;
