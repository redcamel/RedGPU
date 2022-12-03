const setMeta = () => {
	[
		'AuT39+Duz+ZRtx1SlkTa2EJAL3fE4ffZq72D+4KnjZkx0XC9g6GL+kteswN1p9S6Kd4NJUlAwMWB1VWwr3lCqAgAAABleyJvcmlnaW4iOiJodHRwczovL3JlZGNhbWVsLmdpdGh1Yi5pbzo0NDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjc1MjA5NTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=',
		'AoObp2NQ8sEb9+TWvbU/cWFBaNRNGXZtCp6yZSrjuqlH+JDRV9cP+abD9k2ydtE92JpehZbovmhZ2pKiG8obLAYAAABJeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjc1MjA5NTk5fQ=='
	].forEach(v => {
		const t0 = document.createElement('meta')
		t0.setAttribute('http-equiv', "origin-trial")
		t0.setAttribute('content', v)
		document.head.appendChild(t0)
	})
}
setMeta()