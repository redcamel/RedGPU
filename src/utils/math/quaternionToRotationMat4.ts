const quaternionToRotationMat4 = (q, m) => {
	let x = q[0];
	let y = q[1];
	let z = q[2];
	let w = q[3];
	let x2 = x + x, y2 = y + y, z2 = z + z;
	let xx = x * x2, xy = x * y2, xz = x * z2;
	let yy = y * y2, yz = y * z2, zz = z * z2;
	let wx = w * x2, wy = w * y2, wz = w * z2;
	m[0] = 1 - (yy + zz);
	m[4] = xy - wz;
	m[8] = xz + wy;
	m[1] = xy + wz;
	m[5] = 1 - (xx + zz);
	m[9] = yz - wx;
	m[2] = xz - wy;
	m[6] = yz + wx;
	m[10] = 1 - (xx + yy);
	// last column
	m[3] = 0;
	m[7] = 0;
	m[11] = 0;
	// bottom row
	m[12] = 0;
	m[13] = 0;
	m[14] = 0;
	m[15] = 1;
	return m;
}
export default quaternionToRotationMat4
