import Vector from "./vector.js";

class Line {
	/**
	 * @param {numbe} x 
	 * @param {number} y 
	 * @param {number} a 
	 * @param {number} b 
	 */
	constructor(x, y, a, b) {
		this.x = x;
		this.y = y;
		this.a = a;
		this.b = b;
	}

	get start() { return new Vector(this.x, this.y); }
	get end() { return new Vector(this.x + this.a, this.y + this.b); }

	toString() { return `[object Line(${this.x}, ${this.y}, ${this.a}, ${this.b})]`; }
	/**
	 * @param {Line} line 
	 * @returns {Line}
	 */
	static dupe(line) { return new Line(line.x, line.y, line.a, line.b); }

	/**
	 * @param {Line} lineA 
	 * @param {Line} lineB 
	 * @returns {{denom: number, t: number, u: number}}
	 */
	static intersection(lineA, lineB) {
		const retObj = new Object();
		retObj.denom = lineA.a * lineB.b - lineA.b * lineB.a;
		if (retObj.denom === 0) return retObj;
		let dx = lineB.x - lineA.x;
		let dy = lineB.y - lineA.y;
		retObj.t = (dx * lineB.b - dy * lineB.a) / retObj.denom;
		retObj.u = (dx * lineA.b - dy * lineA.a) / retObj.denom;
		return retObj;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.a, this.y + this.b);
	}
}
export default Line;
