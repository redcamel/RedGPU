
var gulp = require('gulp');
var fs = require('fs');

gulp.task('make-sitemap', function (done) {
	console.log('-------------------------------------------');
	console.log('시작!');

	const str = fs.readFileSync('examples/exampleList.js', 'utf-8')
	const t0 = eval(str.replace('export default exampleList','').replace('const exampleList = ',''))
	console.log(t0)
	let listStr = ''
	const parseList = (v)=>{
		v['list'].forEach(v2 => {
			listStr += `
				<url>
					<loc>https://redcamel.github.io/RedGPU/examples/${v2['href']}</loc>
					<changefreq>weekly</changefreq>
					<priority>0.5</priority>
				</url>
				`
		})
	}
	t0.forEach(v => {
		if(v['list']) parseList(v)
		v['list'].forEach(v2 => {
			listStr += `
				<url>
					<loc>https://redcamel.github.io/RedGPU/examples/${v2['href']}</loc>
					<changefreq>weekly</changefreq>
					<priority>0.5</priority>
				</url>
				`
		})
	})
	const result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${listStr}
</urlset>`
	var file = 'sitemap.xml';
	fs.open(file, 'w', function (err, fd) {
		if (err) throw err;
		console.log('file open complete');
		fs.writeFile('sitemap.xml', result, 'utf8', function (err) {
			if (err) throw err;
			console.log('write end');
			done();
		});
	});
	console.log(t0)
	console.log(result)
	console.log('종료!');
	console.log('-------------------------------------------');
});
gulp.task('default', gulp.series('make-sitemap', function (done) {
	console.log('-------------------------------------------');
	console.log('성공!');
	console.log('-------------------------------------------');
	done();
}));
