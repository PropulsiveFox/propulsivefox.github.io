/**
 * Class for 2D vector
 * @class
 */
class Vector {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized() {
		let mag = this.magnitude;
		return new Vector(this.x / mag, this.y / mag);
	}
	static get zero() { return new Vector(0, 0); }
	static get east() { return new Vector(1, 0); }
	static get west() { return new Vector(-1, 0); }
	static get north() { return new Vector(0, 1); }
	static get south() { return new Vector(0, -1); }


	toString() { return `[object Vector(${this.x}, ${this.y})]`; }

	/**
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	static duplicate(vector) {
		return new Vector(vector.x, vector.y);
	}
	/**
	 * @returns {Vector}
	 */
	duplicate() {
		return Vector.duplicate(this);
	}

	/**
	 * 
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {number}
	 */
	static distance(vectorA, vectorB) {
		let dx = vectorA.x - vectorB.x;
		let dy = vectorA.y - vectorB.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	/**
	 * @param {Vector} vector
	 * @return {number} 
	 */
	distance(vector) {
		let dx = this.x - vector.x;
		let dy = this.y - vector.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * 
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {Vector}
	 */
	static add(vectorA, vectorB) {
		return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
	}
	/**
	 * @param {Vector} vector 
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
	static subtract(vectorA, vectorB) {
		return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
	}
	/**
	 * @param {Vector} vector 
	 */
	subtract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}


	/**
	 * @param {Vector} vector 
	 * @param {number} factor 
	 * @returns {Vector}
	 */
	static multiply(vector, factor) {
		return new Vector(factor * vector.x, factor * vector.y);
	}
	/**
	 * @param {number} factor 
	 */
	multiply(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}
}
export default Vector;
