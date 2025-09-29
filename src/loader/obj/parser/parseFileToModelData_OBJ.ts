import RedGPUContext from "../../../context/RedGPUContext";
import createUUID from "../../../utils/uuid/createUUID";
import MeshInfo_OBJ from "../cls/MeshInfo_OBJ";
import TotalPointInfo_OBJ from "../cls/TotalPointInfo_OBJ";
import OBJLoader from "../OBJLoader";
import OBJMTLLoader from "../OBJMTLLoader";
import parserMaterial_OBJ from "./parserMaterial_OBJ";

const regMtllib = /^(mtllib )/;
const regUseMtl = /^(usemtl )/;
const regObject = /^o /;
const regGroup = /^g /;
const regVertex = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
const regNormal = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
const redUV = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
const regIndex = /f\s+(([\d]{1,}[\s]?){3,})+/;
const regIndex2 = /f\s+((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
const regIndex3 = /f\s+((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
const regIndex4 = /f\s+((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/;
let targetMeshInfo: MeshInfo_OBJ;
// 현재 그룹이름
let targetGroupName;
const parseFileToModelData_OBJ = (redGPUContext: RedGPUContext, objLoader: OBJLoader, lineList) => {
	let info; // 단편 구조로 정보구성
	let infoHierarchy; // 하이라키 구조로 정보구성
	// 현재 바라볼 메쉬정보
	// 재질로더
	let mtlLoader: OBJMTLLoader;
	// 전체 삼각형 구성정보.
	const totalPointInfo: TotalPointInfo_OBJ = new TotalPointInfo_OBJ();
	const {points, normalPoints, uvPoints} = totalPointInfo
	const {position, normal, uv} = totalPointInfo
	infoHierarchy = {};
	info = {};
	let i;
	let hasObjectName;
	const len = lineList.length;
	i = 0
	for (i; i < len; i++) {
		if (regObject.test(lineList[i])) {
			hasObjectName = true;
			break
		}
	}
	if (!hasObjectName) {
		const tName = 'objModel' + createUUID()
		infoHierarchy[tName] = targetMeshInfo = new MeshInfo_OBJ(tName, tName);
		info[tName] = targetMeshInfo;
		targetGroupName = tName
	}
	let i3 = 0
	const len3 = lineList.length
	// console.log('총라인수', len3)
	for (let i3 = 0; i3 < len3; i3++) {
		// Get the current line
		const line = lineList[i3]
		// If the line starts with 'mtllib ', process material library
		if (line.startsWith('mtllib ')) {
			processMaterialLibrary(line, objLoader, redGPUContext, info, mtlLoader);
		}

		// If the line starts with 'usemtl ', process material usage
		else if (line.startsWith('usemtl ')) {
			processMaterialUsage(line, info, targetGroupName);
		}

		// If the line starts with 'g ', process a new group
		else if (line.startsWith('g ')) {
			processGroup(line, infoHierarchy, targetGroupName, info);
		}

		// If the line starts with 'o ', process a new object
		else if (line.startsWith('o ')) {
			processNewObject(line, infoHierarchy, info);
		}

		// If the line starts with 'vn ', process vertex normals
		else if (line.startsWith('vn ')) {
			processVertexNormals(line, normal, normalPoints);
		}

		// If the line starts with 'vt ', process texture coordinates
		else if (line.startsWith('vt ')) {
			processTextureCoordinates(line, uv, uvPoints);
		}

		// If the line is vertex data, process the vertex
		else if (regVertex.test(line)) {
			processVertex(line, position, points);
		}

		// If line is face with vertex and normal indices, process the face
		else if (regIndex4.test(line)) {
			processFaceVertexNormal(line, position, normal, points, normalPoints);
		}

		// If line is face with vertex, texture, and normal indices, process the face
		else if (regIndex3.test(line)) {
			processFaceVertexTextureNormal(line, position, normal, uv, points, normalPoints, uvPoints);
		}

		// If line is face with vertex and texture indices, process the face
		else if (regIndex2.test(line)) {
			processFaceVertexTexture(line, position, uv, points, uvPoints);
		}

		// If line is face with vertex index, process the face
		else if (regIndex.test(line)) {
			processFaceVertex(line, position);
		}
	}
	return {
		info: info,
		infoHierarchy: infoHierarchy
	}
}
export default parseFileToModelData_OBJ

// Process material library
function processMaterialLibrary(line, objLoader: OBJLoader, redGPUContext: RedGPUContext, info, mtlLoader) {
	mtlLoader = new OBJMTLLoader(redGPUContext, `${objLoader.path}${line.split(' ')[1]}`, (v) => {
		objLoader.mtlLoader = v;
		if (objLoader.modelParsingComplete) {
			parserMaterial_OBJ(redGPUContext, info, mtlLoader);
			if (objLoader.callback) objLoader.callback(objLoader.result)
			else console.log('OBJLoader 콜백없음')
		} else {
			console.log('재질에서 - 파싱 진행중 & 재질 파싱 종료')
		}
	});
	objLoader.mtlLoader = mtlLoader;
}

// Process material usage
function processMaterialUsage(line, info, targetGroupName) {
	info[targetGroupName].materialKey = line.split(' ').slice(1).join('').trim();
}

// Process a new group
function processGroup(line, infoHierarchy, targetGroupName, info) {
	const tName = line.split(' ').slice(1).join('').trim();
	infoHierarchy[targetGroupName].use = false;
	const tInfo = new MeshInfo_OBJ(tName, targetGroupName)
	tInfo.groupName = targetGroupName
	tInfo.materialKey = tName.replace(`${targetGroupName}_`, '')
	tInfo.position = targetMeshInfo.position
	info[tName] = targetMeshInfo = tInfo;
	infoHierarchy[targetGroupName].childrenInfo[tName] = targetMeshInfo
}

// Process a new object
function processNewObject(line, infoHierarchy, info) {
	const tName = line.split(' ').slice(1).join('').trim();
	const tInfo = new MeshInfo_OBJ(tName, tName)
	tInfo.groupName = tName
	tInfo.materialKey = tName
	infoHierarchy[tName] = targetMeshInfo = tInfo;
	info[tName] = targetMeshInfo;
	targetGroupName = tName;
}

// Process vertex normals
function processVertexNormals(line, normal, normalPoints) {
	const tNormal = line.split(' ');
	normal.push(+tNormal[1], +tNormal[2], +tNormal[3]);
	normalPoints[normalPoints.length] = [+tNormal[1], +tNormal[2], +tNormal[3]];
}

// Process texture coordinates
function processTextureCoordinates(line, uv, uvPoints) {
	const tUV = line.split(' ');
	uv.push(+tUV[1], 1 - tUV[2]);
	uvPoints[uvPoints.length] = [+tUV[1], 1 - tUV[2]];
}

// Process the vertex
function processVertex(line, position, points) {
	const tPosition = line.split(' ');
	position.push(+tPosition[1], +tPosition[2], +tPosition[3]);
	targetMeshInfo.position.push(+tPosition[1], +tPosition[2], +tPosition[3]);
	points[points.length] = [+tPosition[1], +tPosition[2], +tPosition[3]];
}

// Process the face data with vertex and normal indices
function processFaceVertexNormal(line, position, normal, points, normalPoints) {
	const max = (position.length + normal.length) * 3;
	line.split(' ').slice(1, 4).forEach((v) => {
		const [tIndex, , tNIndex] = v.split('/').map(n => Number(n) - 1);
		const tPoint = points[tIndex];
		const tNormalPoint = normalPoints[tNIndex];
		const {index, resultInterleave} = targetMeshInfo
		const {resultPosition, resultNormal, resultUV} = targetMeshInfo
		index.push(resultInterleave.length / max);
		resultPosition.push(...tPoint);
		resultNormal.push(...tNormalPoint);
		resultInterleave.push(...tPoint, ...tNormalPoint);
	});
}

// Process the face data with vertex, texture, and normal indices
function processFaceVertexTextureNormal(line, position, normal, uv, points, normalPoints, uvPoints) {
	let faceData = line.split(' ').slice(1, 5);
	// Check if face data has 4 values (meaning it's a quad) and rearrange data for triangles
	if (faceData.length === 4) {
		let temp = faceData[3];
		faceData[3] = faceData[0];
		faceData[4] = faceData[2];
		faceData[5] = temp;
	}
	faceData.forEach(vertexData => {
		const [vertexIndex, uvIndex, normalIndex] = vertexData.split('/').map(Number).map(n => n - 1);
		const vertexPoint = points[vertexIndex];
		const uvPoint = uvPoints[uvIndex];
		const normalPoint = normalPoints[normalIndex];
		const stride = (position.length ? 3 : 0) + (normal.length ? 3 : 0) + (uv.length ? 2 : 0);
		const {index, resultInterleave} = targetMeshInfo
		const {resultPosition, resultNormal, resultUV} = targetMeshInfo
		index.push(resultInterleave.length / stride);
		if (position.length) {
			resultPosition.push(...vertexPoint);
			resultInterleave.push(...vertexPoint)
		}
		if (normal.length) {
			resultNormal.push(...normalPoint);
			resultInterleave.push(...normalPoint);
		}
		if (uv.length) {
			resultUV.push(...uvPoint);
			resultInterleave.push(...uvPoint)
		}
	});
}

// Process the face data with vertex and texture indices
function processFaceVertexTexture(line, position, uv, points, uvPoints) {
	let tData = line.split(' ').slice(1, 4);
	tData.forEach((v) => {
		const [tIndex, tUVIndex] = v.split('/').map(Number).map(n => n - 1);
		const tPoint = points[tIndex];
		let tUVPoints;
		if (uvPoints.length !== 0) {
			tUVPoints = uvPoints[tUVIndex];
		}
		const max = (position.length ? 3 : 0) + (uv.length ? 2 : 0);
		targetMeshInfo.index.push(targetMeshInfo.resultInterleave.length / max);
		if (position.length) {
			targetMeshInfo.resultPosition.push(...tPoint);
			targetMeshInfo.resultInterleave.push(...tPoint)
		}
		if (uv.length) {
			targetMeshInfo.resultUV.push(...tUVPoints);
			targetMeshInfo.resultInterleave.push(...tUVPoints)
		}
	});
}

// Process the face data with vertex index
function processFaceVertex(line, position) {
	let tIndex = line.split(' ');
	targetMeshInfo.resultInterleave = targetMeshInfo.resultPosition = targetMeshInfo.position;
	targetMeshInfo.index.push(+tIndex[1] - 1, +tIndex[2] - 1, +tIndex[3] - 1);
	targetMeshInfo.index.push(+tIndex[1] - 1, +tIndex[3] - 1, +tIndex[4] - 1);
}
