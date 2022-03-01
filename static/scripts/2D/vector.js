/**
 * Class for 2D vector
 * @class
 */
class Vector {
	/**
	 * Create a Point
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x = 0, y = 0) {
		if (typeof x !== 'number') {
			throw new TypeError(x + 'is not a number');
		}
		if (typeof y !== 'number') {
			throw new TypeError(y + 'is not a number');
		}

		this.x = x;
		this.y = y;
	}

	get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized() {
		let mag = this.magnitude;
		return new Vector(this.x / mag, this.y / mag);
	}
	static get zero() { return new Vector(0, 0) };


	toString() { return `[object Vector(${this.x}, ${this.y})]`; }
	/**
	 * Returns a TypeError "Not a Vector"
	 * @param {*} argument - anything
	 * @returns {TypeError}
	 */
	static typeError(argument) {
		return new TypeError(argument + ' is not an instanceof Vector');
	}
	/**
	 * Checks if x and y are valid
	 * @param {*} object - anything
	 * @returns {boolean}
	 */
	static isVector (object) {
		if (typeof object.x !== 'number') return false;
		if (typeof object.y !== 'number') return false;

		return true;
	}

	/**
	 * Duplicates a Vector for a new Vector
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	static duplicate(vector) {
		if (!(vector instanceof Vector)) throw Vector.typeError(vector);

		return new Vector(vector.x, vector.y);
	}
	/**
	 * Duplicates this Vector
	 * @returns {Vector}
	 */
	duplicate() {
		return Vector.duplicate(this);
	}

	/**
	 * Returns distance between two Vectors
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {number}
	 */
	static distance(vectorA, vectorB) {
		if (!Vector.isVector(vectorA)) throw Vector.typeError(vectorA);
		if (!Vector.isVector(vectorB)) throw Vector.typeError(vectorB);

		let dx = vectorA.x - vectorB.x;
		let dy = vectorA.y - vectorB.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Adds two Vectors
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {Vector}
	 */
	static add(vectorA, vectorB) {
		if (!(vectorA instanceof Vector)) throw Vector.typeError(vectorA);
		if (!(vectorB instanceof Vector)) throw Vector.typeError(vectorB);

		return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
	}
	/**
	 * Adds values of a Vector
	 * @param {Vector} vector 
	 */
	add(vector) {
		if (!(vector instanceof Vector)) throw Vector.typeError(vector);
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	/**
	 * Subtracts VectorB from VectorA
	 * @param {Vector} vectorA 
	 * @param {Vector} vectorB 
	 * @returns {Vector}
	 */
	static subtract(vectorA, vectorB) {
		if (!(vectorA instanceof Vector)) throw Vector.typeError(vectorA);
		if (!(vectorB instanceof Vector)) throw Vector.typeError(vectorB);

		return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
	}
	/**
	 * Subtracts values of a Vector
	 * @param {Vector} vector 
	 */
	subtract(vector) {
		if (!(vector instanceof Vector)) throw Vector.typeError(vector);
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}


	/**
	 * Multiplies number to a Vector
	 * @param {number} factor 
	 * @param {Vector} vector 
	 * @returns {Vector}
	 */
	static multiply(factor, vector) {
		if (typeof factor !== 'number') throw new TypeError(factor + ' is not a number');
		if (!(vector instanceof Vector)) throw Vector.typeError(vector);

		return new Vector(factor * vector.x, factor * vector.y);
	}
	/**
	 * Multiplies number
	 * @param {number} factor 
	 */
	multiply(factor) {
		if (typeof factor !== 'number') throw new TypeError(factor + ' is not a number');
		this.x *= factor;
		this.y *= factor;
		return this;
	}
}
