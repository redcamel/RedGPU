async function loadImageToImageBitmap(
    src: string,
    colorSpaceConversion: ColorSpaceConversion = 'none',
    premultiplyAlpha: PremultiplyAlpha = 'premultiply'
): Promise<ImageBitmap> {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`[loadImageToImageBitmap ❌] Failed to fetch image from ${src}: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return await createImageBitmap(blob, {
        colorSpaceConversion,
        premultiplyAlpha
    });
}

export default loadImageToImageBitmap;
