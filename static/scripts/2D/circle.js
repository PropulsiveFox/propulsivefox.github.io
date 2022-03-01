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
	constructor(center, radius) {
		if (!(center instanceof Vector)) throw Vector.typeError(center);
		if (typeof radius !== 'number') throw new TypeError(radius + 'is not a number');
		this.center = Vector.duplicate(center);
		this.radius = radius;
	}

	get x() { return this.center.x; }
	set x(x) { this.center.x = x; }
	get y() { return this.center.y; }
	set y(y) { this.center.y = y; }

	toString() { return '[object Circle]'; }

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
		} else if (Vector.isVector(shape)) {
			return Vector.distance(this.center, shape) <= this.radius;
		} else {
			throw new TypeError(shape + ' is not supported in Circle.contains()');
		}
	}

	draw(ctx) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw TypeError('need CanvasRenderingcontext2D');
		}

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, true);
		ctx.stroke();
		ctx.fill();
	}
}