class ResourceStateBitmapTexture {
    texture;
    src;
    cacheKey;
    useNum = 0;
    uuid;
    constructor(texture) {
        this.texture = texture;
        this.src = texture.src;
        this.cacheKey = texture.cacheKey;
        this.useNum = 0;
        this.uuid = texture.uuid;
    }
}
export default ResourceStateBitmapTexture;
