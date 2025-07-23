function getAbsoluteURL(base: string, relative: string): string {
	try {
		return new URL(relative, base).href;
	} catch (e) {
		return relative;
	}
}

export default getAbsoluteURL
