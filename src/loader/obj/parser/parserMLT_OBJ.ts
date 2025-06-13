import OBJMTLLoader from '../OBJMTLLoader';

const parserMLT_OBJ = function (mtlLoader: OBJMTLLoader, dataStr: string) {
	let currentMaterialInfo;
	const info = {};
	// 검사할 목록들을 그룹화
	const groupPatterns = {
		single: ["newmtl", "Ns", "Ni", "d", "illum"],
		multi: ["Ka", "Kd", "Ks"],
		maps: ["map_Kd", "map_Ns", "map_bump"],
	};
	dataStr = dataStr.replace(/^\#[\s\S]+?\n/g, '');
	const lines = dataStr.split("\n");
	lines.forEach((line) => {
		for (const group in groupPatterns) {
			for (const pattern of groupPatterns[group]) {
				// 패턴이 일치하면 해당 조건으로 분기
				if (new RegExp(`^(${pattern} )`).test(line)) {
					switch (group) {
						case 'single':
							// 싱글 값 처리
							if (pattern === 'newmtl') {
								const tName = line.replace('newmtl ', '').trim();
								currentMaterialInfo = {name: tName};
								info[tName] = currentMaterialInfo;
							} else {
								currentMaterialInfo[pattern] = +line.replace(`${pattern} `, '').trim();
							}
							break;
						case 'multi':
							// 멀티 값 처리
							currentMaterialInfo[pattern] = line.replace(`${pattern} `, '').split(' ');
							break;
						case 'maps':
							// 맵 처리
							currentMaterialInfo[pattern] = mtlLoader['path'] + line.replace(`${pattern} `, '').trim();
							break;
					}
				}
			}
		}
	});
	return info;
};
export default parserMLT_OBJ;
