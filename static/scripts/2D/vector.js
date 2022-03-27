class Vector {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	static get zero() { return new Vector(0, 0); }
	static get right() { return new Vector(1, 0); }
	static get left() { return new Vector(-1, 0); }
	static get up() { return new Vector(0, 1); }
	static get down() { return new Vector(0, -1); }
	static get one() { return new Vector(1, 1); }

	get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized() {
		const mag = this.magnitude;
		return new Vector(this.x / mag, this.y / mag);
	}

	toString() { return `[object Vector(${this.x}, ${this.y})]`; }
	/**
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	static dupe(vector) { return new Vector(vector.x, vector.y); }

	/**
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {number}
	 */
	static distance(vectorA, vectorB) {
		const dx = vectorA.x - vectorB.x;
		const dy = vectorA.y - vectorB.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	/**
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {number}
	 */
	static dot(vectorA, vectorB) {
		return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
	}
	/**
	 * @param {Vector} vector 
	 * @returns 
	 */
	static perpendicular(vector) {
		if (vector.x * vector.y < 0) return new Vector(vector.y, -vector.x);
		else return new Vector(-vector.y, vector.x);
	}
	/**
	 * Linear Interpolation
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @param {number} t 
	 * @returns {Vector}
	 */
	static lerp(vectorA, vectorB, t) {
		let u = 1 - t;
		return new Vector(vectorA.x * u + vectorB.x * t, vectorA.y * u + vectorB.y * t);
	}

	/**
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {Vector}
	 */
	static add(vectorA, vectorB) {
		return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
	}
	/**
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	/**
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {Vector}
	 */
	static sub(vectorA, vectorB) {
		return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
	}
	/**
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	sub(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	/**
	 * @param {Vector} vectorA 
	 * @param {factor} factor 
	 * @returns {Vector}
	 */
	static mul(vector, factor) {
		return new Vector(vector.x * factor, vector.y * factor);
	}
	/**
	 * @param {number} factor 
	 * @returns {Vector}
	 */
	mul(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	/**
	 * @param {Vector} vector 
	 * @param {number} factor 
	 * @returns {Vector}
	 */
	static div(vector, factor) {
		return new Vector(vector.x / factor, vector.y / factor);
	}
	/**
	 * @param {number} factor 
	 * @returns {Vector}
	 */
	div(factor) {
		this.x /= factor;
		this.y /= factor;
		return this;
	}
}
export default Vector;
