import Vector from "./vector.js";
import Rect from "./rect.js";
import Shapes from "./shapes.js";

/**
 * Class for 2D circle
 * @class
 * @requires /static/2D/vector.js
 */
class Circle {
	/**
	 * Create a Circle
	 * @param {Vector} center 
	 * @param {number} radius 
	 */
	constructor(position, radius) {
		this.position = Vector.duplicate(position);
		this.radius = radius;
	}

	get center() { return this.position; }
	get x() { return this.center.x; }
	set x(x) { this.center.x = x; }
	get y() { return this.center.y; }
	set y(y) { this.center.y = y; }

	toString() { return '[object Circle]'; }

	distance(shape) {
		return Shapes.vectorDistanceToCircle(shape, this);
	}

	contains(shape) {
		if (shape instanceof Circle) {
			if (Vector.distance(this.center, shape.center) <= this.radius - shape.radius) {
				return true;
			} else return false;
		} else if (shape instanceof Rect) {
			let dots = [
				new Vector(shape.x, shape.y),
				new Vector(shape.x, shape.yMax),
				new Vector(shape.xMax, shape.y),
				new Vector(shape.xMax, shape.yMax)
			];
			return dots.every(dot => Vector.distance(this.center, dot) <= this.radius);
		} else if (shape instanceof Vector) {
			return Vector.distance(this.center, shape) <= this.radius;
		} else {
			throw new TypeError(shape + ' is not supported in Circle.contains()');
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, true);
		ctx.stroke();
		ctx.fill();
	}
}
export default Circle;
