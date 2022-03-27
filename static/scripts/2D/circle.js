import Vector from "./vector.js";

class Circle {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} radius 
	 */
	constructor(x = 0, y = 0, radius = 1) {
		this.position = new Vector(x, y);
		this.radius = radius;
	}

	get center() { return this.position; }
	get x() { return this.position.x; }
	set x(x) { this.position.x = x; }
	get y() { return this.position.y; }
	set y(y) { this.position.y = y; }

	toString() { return `[object Circle(${this.x}, ${this.y}, ${this.radius})]`; }
	/**
	 * @param {Circle} circle 
	 * @returns {Circle}
	 */
	static dupe(circle) { return new Circle(circle.x, circle.y, circle.radius); }

	/**
	 * @param {CanavsRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.position.x, this.positionn.y, this.radius, 0, 2 * Math.PI, true);
		ctx.stroke();
		ctx.fill();
	}
}
export default Circle;
