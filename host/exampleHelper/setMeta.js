const setMeta = () => {
	[
		'Aq5SYGQ4/wmH5H+FkvfSKNla9anTUSPcha0K04RTnnLIjD/wikUsWb2jVYv5gt/kzNVvhDCUa32vyx0TztVx5wkAAABleyJvcmlnaW4iOiJodHRwczovL3JlZGNhbWVsLmdpdGh1Yi5pbzo0NDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjkxNzExOTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=',
		'AqzyRNDDUH7C6OOrJRvTouUcm8m2n/t9i1LYLBWEZTKZbsflEYhQjXYFP35HhHmdaf6MWbF0nvrEiJ+ueQ7rEw4AAABJeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDMiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjkxNzExOTk5fQ=='
	].forEach(v => {
		const t0 = document.createElement('meta')
		t0.setAttribute('http-equiv', "origin-trial")
		t0.setAttribute('content', v)
		document.head.appendChild(t0)
	})
}
setMeta()
