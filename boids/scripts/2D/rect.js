import Vector from "./vector.js";
import Circle from "./circle.js";
import Shapes from "./shapes.js";

/**
 * Class for right-side up 2D rect
 * @class
 * @requires /static/2D/vector.js
 */
class Rect {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} width 
	 * @param {number} height 
	 * @param {boolean} centered 
	 */
	constructor(x = 0, y = 0, w = 1, h = 1, centered = false) {
		if (w < 0) w = 0;
		if (h < 0) h = 0;

		if (centered) {
			this.position = new Vector(x - w / 2, y - h / 2);
		} else {
			this.position = new Vector(x, y);
		}
		this.w = w;
		this.h = h;
	}

	get x() { return this.position.x; }
	get y() { return this.position.y; }
	get xMax() { return this.position.x + this.w; }
	get yMax() { return this.position.y + this.h; }
	get psw() { return new Vector(this.x, this.y); }
	get pse() { return new Vector(this.xMax, this.y); }
	get pnw() { return new Vector(this.x, this.yMax); }
	get pne() { return new Vector(this.xMax, this.yMax); }
	get p() { return new Array(this.pnw(), this.pne(), this.psw(), this.pse()); }
	get center() {
		return new Vector(this.x + this.w / 2, this.y + this.h / 2);
	}
	// set center(vector) {
	// 	this.x = vector.x - this.w / 2;
	// 	this.y = vector.y - this.h / 2;
	// }

	toString() { return `[object Rect(${this.position.x}, ${this.position.y}, ${this.w}, ${this.h})]`; }

	/**
	 * @param {Rect} rect 
	 * @returns {Rect}
	 */
	static duplicate(rect) {
		return new Rect(rect.x, rect.y, rect.w, rect.h);
	}
	/**
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
		} else if (shape instanceof Vector) {
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
			return Shapes.rectIntersectsCircle(this, shape);
		}
		else {
			throw new TypeError(shape + ' is not supported in Rect.intersects()');
		}
	}

	distance(shape) {
		if (shape instanceof Rect) {
			throw new TypeError(shape + ' is not supported in Rect.distance()');
		} else if (shape instanceof Circle) {
			throw new TypeError(shape + ' is not supported in Rect.distance()');
		} else if (shape instanceof Vector) {
			return Shapes.vectorDistanceToRect(shape);
		} else {
			throw new TypeError(shape + ' is not supported in Rect.distance()');
		}
	}

	draw(ctx) {
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
export default Rect;
