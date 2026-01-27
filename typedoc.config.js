module.exports = {
	// 문서 생성을 위한 시작점(진입점) 파일 경로입니다.
	entryPoints: ["src/indexDoc.ts"],

	// 문서가 저장될 출력 경로입니다.
	// DOC_LANG 환경 변수가 있으면 해당 값을 사용하고, 없으면 기본값으로 'ko'(한국어) 폴더에 생성합니다.
	out: `manual/${process.env.DOC_LANG || 'ko'}/api`,

	// Markdown 파일 형태로 문서를 생성하기 위해 필요한 외부 플러그인을 로드합니다.
	plugin: ["typedoc-plugin-markdown"],

	// 문서 하단에 "Generated using TypeDoc"이라는 문구를 표시하지 않도록 설정합니다.
	hideGenerator: true,

	// 생성된 문서의 메인 타이틀을 "RedGPU API"로 설정합니다.
	name: "RedGPU API",

	// package.json에 정의된 프로젝트 버전 정보를 문서에 포함합니다.
	includeVersion: true,

	// 별도의 README 파일을 메인 페이지로 사용하지 않고 바로 API 목록을 보여줍니다.
	readme: "none",

	// 함수의 매개변수(Parameters) 정보를 리스트 대신 표(Table) 형식으로 출력합니다.
	parametersFormat: 'table',

	// 객체 리터럴이나 인터페이스 등의 타입 선언 구조를 표(Table) 형식으로 상세히 출력합니다.
	typeDeclarationFormat: 'table',

	// 소스 코드의 위치(GitHub 링크 등)를 문서에 표시합니다. (false이므로 숨기지 않음)
	disableSources: false,

	// 열거형(Enum)의 멤버 목록을 표(Table) 형식으로 출력합니다.
	enumMembersFormat: 'table',
};