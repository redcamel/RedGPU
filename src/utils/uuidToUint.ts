const uuidToUint = (uuid: string): number => {
	// Remove hyphens and get the first 8 characters of the UUID
	const shortUuid = uuid.replace(/-/g, '').substring(0, 8);
	// Convert to a number using hexadecimal base
	return parseInt(shortUuid, 16);
}
export default uuidToUint
