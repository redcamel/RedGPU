import RedGPUContext from "../../../context/RedGPUContext";
import OBJLoader from "../OBJLoader";
import parseFileToModelData_OBJ from "./parseFileToModelData_OBJ";
import parserMesh_OBJ from "./parserMesh_OBJ";

const parserOBJ = (redGPUContext: RedGPUContext, objLoader: OBJLoader, rawData: string) => {
	rawData = rawData.replace(/^\#[\s\S]+?\n/g, '');
	const filteredData = rawData.split("\n");
	const parsedData = parseFileToModelData_OBJ(redGPUContext, objLoader, filteredData);
	const parsedHierarchyInfo = parsedData.infoHierarchy;
	parserMesh_OBJ(redGPUContext, objLoader.resultMesh, parsedHierarchyInfo);
	return {
		...objLoader,
		...parsedData,
		parseInfoMaterial: objLoader.mtlLoader
	};
};
export default parserOBJ
