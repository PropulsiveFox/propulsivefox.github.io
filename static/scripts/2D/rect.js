/**
 * Class for right-side up 2D rect
 * @class
 * @requires /static/2D/vector.js
 */
class Rect {
	/**
	 * Creates a Rect
	 * @param {number | Vector} x - or Vector. If x is Vector, skip y
	 * @param {number} y 
	 * @param {number} width 
	 * @param {number} height 
	 * @param {boolean} centered 
	 */
	constructor(x = 0, y = 0, w = 1, h = 1, centered = false) {
		let isXVector = false;
		if (typeof x !== 'number') {
			if (!(x instanceof Vector)) throw TypeError(x + ' is not a number nor a Vector');
			isXVector = true;
		}
		if (typeof y !== 'number') throw TypeError(y + ' is not a number');
		if (typeof w !== 'number') throw TypeError(w + ' is not a number');
		if (typeof h !== 'number') throw TypeError(h + ' is not a number');
		if (w < 0) w = 0;
		if (h < 0) h = 0;

		if (centered) {
			if (isXVector) {
				this.position = Vector.add(x, new Vector(-w / 2, -h / 2));
			}
			else {
				this.position = new Vector(x - w / 2, y - h / 2);
			}
		} else {
			if (isXVector) {
				this.position = Vector.duplicate(x);
			} else {
				this.position = new Vector(x, y);
			}
		}
		this.w = w;
		this.h = h;
	}

	get x() { return this.position.x }
	get y() { return this.position.y }
	get xMax() { return this.position.x + this.w }
	get yMax() { return this.position.y + this.h }
	get center() {
		return new Vector(this.x + this.w / 2, this.y + this.h / 2);
	}
	// set center(vector) {
	// 	if (!Vector.isVector(vector)) return new TypeError(vector + ' is not a vector');

	// 	this.x = vector.x - this.w / 2;
	// 	this.y = vector.y - this.h / 2;
	// }

	toString() { return '[object Rect]'; }

	/**
	 * Returns a TypeError "Not a Rect"
	 * @param {*} argument - anything
	 * @returns {TypeError}
	 */
	static typeError(argument) {
		return new TypeError(argument + ' is not an instanceof Rect');
	}
	/**
	 * Checks if x, y, w, h are valid
	 * @param {*} object - anything
	 * @returns {boolean}
	 */
	static isRect(object) {
		if (typeof object.x !== 'number') return false;
		if (typeof object.y !== 'number') return false;
		if (typeof object.w !== 'number') return false;
		if (typeof object.h !== 'number') return false;
		if (object.w < 0) return false;
		if (object.h < 0) return false;

		return true;
	}

	/**
	 * Duplicates a Rect for a new Rect
	 * @param {Rect} rect 
	 * @returns {Rect}
	 */
	static duplicate(rect) {
		if (!(rect instanceof Rect)) throw Rect.typeError(rect);

		return new Rect(rect.x, rect.y, rect.w, rect.h);
	}
	/**
	 * Duplicates this Rect
	 * @returns {Vector}
	 */
	duplicate() {
		return Rect.duplicate(this);
	}


	contains(shape) {
		if (shape instanceof Rect) {
			return (
				shape.x >= this.x &&
				shape.xMax <= this.xMax &&
				shape.y >= this.y &&
				shape.yMax <= this.yMax
			);
		} else if (shape instanceof Circle) {
			let x = this.x + shape.radius;
			let xMax = this.xMax - shape.radius;
			let y = this.y + shape.radius;
			let yMax = this.yMax - shape.radius;
			return (
				shape.center.x >= x &&
				shape.center.x < xMax &&
				shape.center.y >= y &&
				shape.center.y < yMax
			);
		} else if (Vector.isVector(shape)) {
			return (
				shape.x >= this.x &&
				shape.x < this.xMax &&
				shape.y >= this.y &&
				shape.y < this.yMax
			);
		}
		else {
			throw new TypeError(shape + ' is not supported in Rect.contains()');
		}
	}

	intersects(shape) {
		if (shape instanceof Rect) {
			return !(
				shape.x >= this.xMax ||
				shape.xMax < this.x ||
				shape.y >= this.yMax ||
				shape.yMax < this.y
			);
		}
		else if (shape instanceof Circle) {
			let center = this.center;
			let w = this.w / 2;
			let h = this.h / 2;
			let dx = Math.abs(shape.x - center.x);
			let dy = Math.abs(shape.y - center.y);

			if (dx > w + shape.radius) return false;
			if (dy > h + shape.radius) return false;

			if (dx <= w) return true;
			if (dy <= h) return true;

			return Vector.distance(new Vector(dx, dy), new Vector(w, h)) <= shape.radius;
		}
	}

	draw(ctx) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw new TypeError('need CanvasRenderingContext2D');
		}
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
