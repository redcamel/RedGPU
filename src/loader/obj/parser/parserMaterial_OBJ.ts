import RedGPUContext from "../../../context/RedGPUContext";
import BitmapMaterial from "../../../material/bitmapMaterial/BitmapMaterial";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import convertRgbToHex from "../../../utils/convertColor/convertRgbToHex";
import MeshInfo_OBJ from "../cls/MeshInfo_OBJ";

const parserMaterial_OBJ = (redGPUContext: RedGPUContext, tObjInfo, mtlLoader) => {
	let k;
	let tMtlData, tMeshData: MeshInfo_OBJ;
	let cacheTexture;
	cacheTexture = {};
	for (k in tObjInfo) {
		// console.log('tObjInfo',tObjInfo)
		let tMaterial;
		let tTexture: BitmapTexture;
		tMeshData = tObjInfo[k];
		const {use, materialKey, mesh: targetMesh} = tMeshData
		const {ableLight, ableNormal} = tMeshData
		const {resultInterleave} = tMeshData
		if (use && resultInterleave.length) {
			let r, g, b;
			// // console.log(tMeshData)
			// console.log('해석할 재질키', materialKey)
			//
			tMtlData = mtlLoader.parseData[materialKey];
			// console.log('해석할 재질', tMtlData,tMtlData['map_Kd'])
			if (tMtlData) {
				if (tMtlData['map_Kd']) {
					// 비트맵 기반으로 해석
					if (cacheTexture[tMtlData['map_Kd']]) tTexture = cacheTexture[tMtlData['map_Kd']];
					else {
						tTexture = new BitmapTexture(redGPUContext, tMtlData['map_Kd']);
						cacheTexture[tMtlData['map_Kd']] = tTexture
					}
					// if (ableLight) tMaterial = StandardMaterial(redGPUContext, tTexture);
					if (ableLight) tMaterial = new BitmapMaterial(redGPUContext, tTexture);
					else tMaterial = new BitmapMaterial(redGPUContext, tTexture);
				} else if (tMtlData['Kd']) {
					// 컬러기반으로 해석
					r = tMtlData['Kd'][0] * 255;
					g = tMtlData['Kd'][1] * 255;
					b = tMtlData['Kd'][2] * 255;
					// if (ableLight) tMaterial = ColorPhongTextureMaterial(redGPUContext, convertRgbToHex(r, g, b));
					if (ableLight) tMaterial = new ColorMaterial(redGPUContext, convertRgbToHex(r, g, b));
					else {
						// if (tMeshData['ableNormal']) tMaterial = PhongMaterial(redGPUContext, convertRgbToHex(r, g, b));
						if (ableNormal) tMaterial = new ColorMaterial(redGPUContext, convertRgbToHex(r, g, b));
						else tMaterial = new ColorMaterial(redGPUContext, convertRgbToHex(r, g, b));
					}
				}
				if (tMaterial) {
					// 스페큘러텍스쳐
					if (tMtlData['map_Ns']) {
						if (cacheTexture[tMtlData['map_Ns']]) tTexture = cacheTexture[tMtlData['map_Ns']];
						else {
							tTexture = new BitmapTexture(redGPUContext, tMtlData['map_Ns']);
							cacheTexture[tMtlData['map_Ns']] = tTexture
						}
						tMaterial['specularTexture'] = tTexture //TODO 라이팅만들고 추가
					}
					if (tMtlData['map_bump']) {
						if (cacheTexture[tMtlData['map_bump']]) tTexture = cacheTexture[tMtlData['map_bump']];
						else {
							tTexture = new BitmapTexture(redGPUContext, tMtlData['map_bump']);
							cacheTexture[tMtlData['map_bump']] = tTexture
						}
						tMaterial['normalTexture'] = tTexture // TODO 라이팅만들고 추가
					}
					// shininess
					if (tMtlData['Ns'] !== undefined) tMaterial['shininess'] = tMtlData['Ns']; //TODO 라이팅만들고 추가
					// 메쉬에 재질 적용
					targetMesh.material = tMaterial
				}
			} else {
				// console.log('스킵')
			}
		}
	}
}
export default parserMaterial_OBJ
