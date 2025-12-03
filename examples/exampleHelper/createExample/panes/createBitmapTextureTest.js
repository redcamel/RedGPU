/**
 * Sets up a bitmap texture test pane.
 *
 * @param {object} pane - The folder object to add the bitmap texture test pane to.
 * @param {object} testMaterial - The material object to bind the texture properties to.
 * @param {boolean} openYn - Determines if the folder should be expanded by default.
 *
 * @return {void}
 */
const createBitmapTextureTest = (pane, testMaterial, openYn = true) => {
    const folder = pane.addFolder({
        title: 'diffuseTextureSampler',
        expanded: openYn
    });
    folder.addBinding(testMaterial.diffuseTextureSampler, 'minFilter', {
        options: {
            'nearest': 'nearest',
            'linear': 'linear'
        }
    })
    folder.addBinding(testMaterial.diffuseTextureSampler, 'magFilter', {
        options: {
            'nearest': 'nearest',
            'linear': 'linear'
        }
    })
    folder.addBinding(testMaterial.diffuseTextureSampler, 'mipmapFilter', {
        options: {
            'nearest': 'nearest',
            'linear': 'linear'
        }
    })
    // folder.addBinding(testMaterial.diffuseTextureSampler,'maxAnisotropy' ,{
    // 	min: 1,
    // 	max: 16,
    // 	step:1
    // })
}
export default createBitmapTextureTest
