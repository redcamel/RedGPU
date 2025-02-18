const getMipLevelCount = (width: number, height: number): number => {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount
