import Vector from "./vector.js";

class Rect {
	constructor(x = 0, y = 0, w = 1, h = 1) {
		if (w < 0) w = 0;
		if (h < 0) h = 0;

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	get center() { return new Vector(this.x + this.w / 2, this.y + this.h / 2); }

	toString() { return `[object Rect(${this.x}, ${this.y}, ${this.w}, ${this.h})]`; }
	/**
	 * @param {Rect} rect 
	 * @returns {Rect}
	 */
	static dupe(rect) { return new Rect(rect.x, rect.y, rect.w, rect.h); }

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
export default Rect;
