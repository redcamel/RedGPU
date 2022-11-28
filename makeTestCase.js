const fs = require('fs')

const makeTestList = function (done) {
	console.log('-------------------------------------------');
	//
	const extenstion = /\.test\./

	function getFiles(dir, files_) {
		files_ = files_ || [];
		let files = fs.readdirSync(dir);
		for (let i in files) {
			const fileName = files[i]
			const fullName = dir + '/' + fileName;
			const isTestFile = extenstion.test(fileName)
			if (fs.statSync(fullName).isDirectory()) getFiles(fullName, files_);
			else {
				if (isTestFile) {
					const originDir = dir + '/'
					files_.push({
						originDir,
						dir: originDir.replace('src/', ''),
						fileName: fileName,
						isTestFile
					});
				}
			}
		}
		return files_;
	}

	return getFiles('src')
}
const makeTestFiles = (list) => {
	const testRootDir = 'testCase'
	const baseMeta = `
	<meta charset="UTF-8">
	<meta name="keywords" content="RedGPU,webgl,testCase">
	<script src="https://redcamel.github.io/RedTest/core/RedTest.js"></script>
	<link href="https://redcamel.github.io/RedTest/core/RedTest.css" rel="stylesheet"/>
	<link href="https://redcamel.github.io/RedTest/core/prism.css" rel="stylesheet"/>

	<meta http-equiv="origin-trial" content="Ao8jST271x470LFlNSGr39ki/5eTV+eIte3YDSgSdsNvVrw25zKJypNoSRxzSdFnyyq46LaQXE5knZbCnQ7wNgEAAABleyJvcmlnaW4iOiJodHRwczovL3JlZGNhbWVsLmdpdGh1Yi5pbzo0NDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjYzNzE4Mzk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=">
	<meta http-equiv="origin-trial" content="AhikjZCn3LjpxZgPEUAaj0Hi95/9QX6bB4jg9xCGP2u7s54+1K/4IdlFrV3fTh13gEAnrj+xpxZj1iEVlY2yaAQAAABJeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjYzNzE4Mzk5fQ==">
	`
	const makeTestCaseHtml = (data) => {
		const {originDir, dir, fileName} = data
		return `<!DOCTYPE html>
			<html lang="ko">
				<head>
					<title>RedGPU TestCase - ${fileName.replace('.test.ts', '').split('/').at(-1)}</title>
					${baseMeta}
				</head>
				<body>
				<script src="${fileName}" type="module"></script>
				</body>
			</html>`
	}
	const makeFile = (htmlPathFileName, source, testSourceURL, testDestinationURL) => {
		fs.open(htmlPathFileName, 'w', function (err, fd) {
			if (err) throw err;
			fs.writeFile(htmlPathFileName, source, 'utf8', function (err) {
				if (err) throw err;
				console.log(`생성완료 : ${htmlPathFileName}`, `${this.performance.nodeTiming.duration}ms`);
			});
		});
		if (testSourceURL) {
			fs.copyFile(testSourceURL, testDestinationURL, fs.constants.COPYFILE_FICLONE, function (err) {
				if (err) throw err;
				console.log(`생성완료 : ${testDestinationURL}`, `${this.performance.nodeTiming.duration}ms`);
			});
		}
	}
	const checkDir = (targetDir) => {
		// 디렉토리 생성
		const isExists = fs.existsSync(targetDir);
		if (!isExists) {
			fs.mkdirSync(targetDir, {recursive: true});
		}
	}
	const parser = async (v) => {
		const targetDir = `${testRootDir}/${v['dir']}`
		const testFileURL = `${v['originDir']}${v['fileName']}`
		const htmlFileName = v['fileName'].replace('.test.js', '.html')
		const htmlPathFileName = `${targetDir}${htmlFileName}`;
		fs.readFile(testFileURL, 'utf8', (err, data) => {
			if (err) throw err;
			const source = makeTestCaseHtml(v)
			checkDir(targetDir)

			{
				// index file 생성
				makeFile(htmlPathFileName, source, testFileURL, `${targetDir}${v['fileName']}`)
			}
		});


	}
	list.forEach(v => parser(v))
	{
		// index생성
		const str = `<!DOCTYPE html>
	<html lang="ko">
		<head>
			<title>RedGPU TestCase</title>
			${baseMeta}
		</head>
		<body>
		<script>
			RedTest.initIndex(
			'RedGPU Test',
				[${list.map(v => `"${v['dir']}${v['fileName'].replace('.test.js', '.html')}"`)}]
			);
		</script>
		</body>
	</html>`
		checkDir(testRootDir)
		makeFile(`${testRootDir}/index.html`, str)

	}
}
fs.rm('testCase', {recursive: true}, (err) => {
	const list = makeTestList()
	console.log('생성대상', list)
	makeTestFiles(list)

})
