const gltfAnimationLooper_transition = (
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
			animationTargetMesh.x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
			startV = pY;
			startOut = pYOut * interpolationValue;
			endV = nY;
			endIn = nYOut * interpolationValue;
			animationTargetMesh.y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
			startV = pZ;
			startOut = pZOut * interpolationValue;
			endV = nZ;
			endIn = nZOut * interpolationValue;
			animationTargetMesh.z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
		}
	} else {
		// nextTranslation
		tempIDX = nextTimeDataIDX * 3
		nX = targetAnimationDataList[tempIDX];
		nY = targetAnimationDataList[tempIDX + 1];
		nZ = targetAnimationDataList[tempIDX + 2];
		// prevTranslation
		tempIDX = previousTimeDataIDX * 3
		pX = targetAnimationDataList[tempIDX];
		pY = targetAnimationDataList[tempIDX + 1];
		pZ = targetAnimationDataList[tempIDX + 2];
		animationTargetMesh.x = pX + interpolationValue * (nX - pX);
		animationTargetMesh.y = pY + interpolationValue * (nY - pY);
		animationTargetMesh.z = pZ + interpolationValue * (nZ - pZ);
	}
}
export default gltfAnimationLooper_transition
