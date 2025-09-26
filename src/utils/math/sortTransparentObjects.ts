function sortTransparentObjects(cameraPos: {
	x: number,
	y: number,
	z: number
}, objects: GPURenderBundle[]): GPURenderBundle[] {
	const distanceCache = {};
	// 가독성과 성능을 위해 따로 변수에 저장
	const {x: cameraX, y: cameraY, z: cameraZ} = cameraPos;
	return objects.sort((a: any, b: any) => {
		a = a.mesh
		b = b.mesh
		// 거리 계산에 대한 중복을 방지하기 위해서 캐시 활용
		if (!distanceCache[a.uuid]) {
			const diffX = a.x - cameraX;
			const diffY = a.y - cameraY;
			const diffZ = a.z - cameraZ;
			distanceCache[a.uuid] = diffX * diffX + diffY * diffY + diffZ * diffZ;
		}
		if (!distanceCache[b.uuid]) {
			const diffX = b.x - cameraX;
			const diffY = b.y - cameraY;
			const diffZ = b.z - cameraZ;
			distanceCache[b.uuid] = diffX * diffX + diffY * diffY + diffZ * diffZ;
		}
		// 캐시에 저장된 거리를 비교하여 정렬
		return distanceCache[b.uuid] - distanceCache[a.uuid];
	});
}

export default sortTransparentObjects;
