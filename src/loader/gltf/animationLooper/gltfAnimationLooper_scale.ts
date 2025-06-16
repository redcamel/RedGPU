const gltfAnimationLooper_scale = (
	interpolation,
	animationTargetMesh,
	targetAnimationDataList,
	targetTimeDataListLength,
	interpolationValue,
	previousTimeDataIDX,
	nextTimeDataIDX,
	s0?: number, s1?: number, s2?: number, s3?: number
) => {
	let nX, nY, nZ, nXOut, nYOut, nZOut;
	let pX, pY, pZ, pXOut, pYOut, pZOut;
	let startV, startOut, endV, endIn;
	let tempIDX
	if (interpolation == 'CUBICSPLINE') {
		if (previousTimeDataIDX != targetTimeDataListLength - 1) {
			tempIDX = previousTimeDataIDX * 9
			nX = targetAnimationDataList[tempIDX + 3];
			nY = targetAnimationDataList[tempIDX + 4];
			nZ = targetAnimationDataList[tempIDX + 5];
			pXOut = targetAnimationDataList[tempIDX + 6];
			pYOut = targetAnimationDataList[tempIDX + 7];
			pZOut = targetAnimationDataList[tempIDX + 8];
			tempIDX = nextTimeDataIDX * 9
			nXOut = targetAnimationDataList[tempIDX + 0];
			nYOut = targetAnimationDataList[tempIDX + 1];
			nZOut = targetAnimationDataList[tempIDX + 2];
			pX = targetAnimationDataList[tempIDX + 3];
			pY = targetAnimationDataList[tempIDX + 4];
			pZ = targetAnimationDataList[tempIDX + 5];
			//
			startV = pX;
			startOut = pXOut * interpolationValue;
			endV = nX;
			endIn = nXOut * interpolationValue;
			animationTargetMesh.scaleX = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
			startV = pY;
			startOut = pYOut * interpolationValue;
			endV = nY;
			endIn = nYOut * interpolationValue;
			animationTargetMesh.scaleY = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
			startV = pZ;
			startOut = pZOut * interpolationValue;
			endV = nZ;
			endIn = nZOut * interpolationValue;
			animationTargetMesh.scaleZ = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
		}
	} else {
		// nextScale
		tempIDX = nextTimeDataIDX * 3
		nX = targetAnimationDataList[tempIDX];
		nY = targetAnimationDataList[tempIDX + 1];
		nZ = targetAnimationDataList[tempIDX + 2];
		// prevScale
		tempIDX = previousTimeDataIDX * 3
		pX = targetAnimationDataList[tempIDX];
		pY = targetAnimationDataList[tempIDX + 1];
		pZ = targetAnimationDataList[tempIDX + 2];
		animationTargetMesh.scaleX = pX + interpolationValue * (nX - pX);
		animationTargetMesh.scaleY = pY + interpolationValue * (nY - pY);
		animationTargetMesh.scaleZ = pZ + interpolationValue * (nZ - pZ);
	}
}
export default gltfAnimationLooper_scale
