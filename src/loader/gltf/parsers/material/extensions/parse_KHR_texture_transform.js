const parse_KHR_texture_transform = (currentMaterial, targetTextureKey, KHR_texture_transform) => {
    currentMaterial[`${targetTextureKey}_KHR_texture_transform_offset`] = KHR_texture_transform.offset || [0, 0];
    currentMaterial[`${targetTextureKey}_KHR_texture_transform_scale`] = KHR_texture_transform.scale || [1, 1];
    currentMaterial[`${targetTextureKey}_KHR_texture_transform_rotation`] = KHR_texture_transform.rotation || 0;
    currentMaterial[`use_${targetTextureKey}_KHR_texture_transform`] = true;
};
export default parse_KHR_texture_transform;
