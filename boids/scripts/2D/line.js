import Vector from "./vector.js";
import Shapes from "./shapes.js";

class Line extends Vector {
	constructor(x, y, a, b) {
		super(x, y);
		this.dir = new Vector(a, b);
	}

	get start() { return this; }
	get end() { return new Vector(this.x + this.dir.x, this.y + this.dir.y); }
	set end(vector) { 
		this.dir.x = vector.x - this.x;
		this.dir.y = vector.y - this.y;
	}

	toString() { return `[object Line(${this.x}, ${this.y}, ${this.dir.x}, ${this.dir.y}]`; }

	/**
	 * 
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.dir.x, this.y + this.dir.y);
	}
}
export default Line;
