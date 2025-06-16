/**
 * Loads and creates a bitmap image from the given source URL.
 *
 * @param {string} src - The source URL of the image.
 * @param {ColorSpaceConversion} [colorSpaceConversion='none'] - The color space conversion option. Default is 'none'.
 * @param {PremultiplyAlpha} [premultiplyAlpha='none'] - The PremultiplyAlpha option. Default is 'none'.
 * @return {Promise<ImageBitmap>} A Promise that resolves to the created ImageBitmap.
 */
async function loadAndCreateBitmapImage(
	src: string,
	colorSpaceConversion: ColorSpaceConversion = 'none',
	premultiplyAlpha: PremultiplyAlpha = 'premultiply'
): Promise<ImageBitmap> {
	const response = await fetch(src);
	const blob = await response.blob();
	return createImageBitmap(blob, {
		colorSpaceConversion,
		premultiplyAlpha
	});
}

export default loadAndCreateBitmapImage
