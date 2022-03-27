import Vector from "./vector.js";
import Line from "./line.js";
import Rect from "./rect.js";
import Circle from "./circle.js";

class Shapes {
	/*
	priority:
	[
		Vector,
		Line(if there is),
		Rect,
		Circle
	]
	*/

	// Contains
	// Do not write anything. Impliment .contains() in each class.

	// Intersects
	/**
	 * @param {Rect} rect 
	 * @param {Circle} circle 
	 * @returns {boolean}
	 */
	static rectIntersectsCircle(rect, circle) {
		if (circle.center.x < rect.x - circle.radius) return false;
		if (circle.center.x >= rect.xMax + circle.radius) return false;
		if (circle.center.y < rect.y - circle.radius) return false;
		if (circle.center.y >= rect.yMax + circle.radius) return false;

		let center = rect.center;
		let dx = circle.x - center.x;
		let dy = circle.y - center.y;
		let w = rect.w / 2;
		let h = rect.h / 2;

		let nx = false;
		if (dx < 0) nx = true;
		let ny = false;
		if (dy < 0) ny = true;

		dx = Math.abs(dx);
		dy = Math.abs(dy);

		if (dx <= w) return true;
		if (dy <= h) return true;

		let distanceToCorner = Vector.distance(new Vector(dx, dy), new Vector(w, h));

		if (nx && ny) {
			return distanceToCorner <= circle.radius;
		}
		else return distanceToCorner < circle.radius;
	}

	// Distance
	/**
	 * @param {Vector} vector 
	 * @param {Rect} rect 
	 * @returns {number}
	 */
	static vectorDistanceToRect(vector, rect) {
		if (vector.x < rect.x) xReg = -1;
		else if (vector.x < rect.xMax) xReg = 0;
		else xReg = 1;

		if (vector.y < rect.y) {
			if (vector.x < rect.x) return vector.distance(rect.psw);
			else if (vector.x < rect.xMax) return rect.y - vector.y;
			else return vector.distance(rect.pse);
		}
		else if (vector.y < rect.yMax) {
			if (vector.x < rect.x) return rect.x - vector.x;
			else if (vector.x < rect.xMax) {
				return 0;
			}
			else return vector.x - rect.xMax;
		}
		else {
			if (vector.x < rect.x) return vector.distance(rect.pnw);
			else if (vector.x < rect.xMax) return vector.y - rect.yMax;
			else return vector.distance(rect.pne);
		}
	}
	/**
	 * @param {Vector} vector 
	 * @param {Line} line 
	 * @returns 
	 */
	static vectorDistanceToLine(vector, line) {
		return Math.abs((line.y - vector.y) * line.dir.x - (line.x - vector.x) * line.dir.y / line.dir.magnitude);
	}
	/**
	 * @param {Vector} vector 
	 * @param {Line} line 
	 * @returns 
	 */
	static vectorDistanceToLineSegment(vector, line) {
		const perpLine = new Line(vector.x, vector.y, line.dir.y, -line.dir.x);

		let denominator = line.dir.x * perpLine.dir.y - line.dir.y * perpLine.dir.x;
		if (denominator === 0) return Vector.distance(line, perpLine);
		let dx = perpLine.x - line.x;
		let dy = perpLine.y - line.y;
		let t = (dx * perpLine.dir.y - dy * perpLine.dir.x) / denominator;

		if (t >= 1) {
			return Vector.distance(vector, line.end);
		} else if (t < 0) {
			return Vector.distance(vector, line.start);
		} else {
			return Vector.distance(vector, new Vector(line.x + t * line.dir.x, line.y + t * line.dir.y));
		}
		// let u = (dx * line.dir.y - dy * line.dir.x) / denominator;
	}
	/**
	 * @param {Vector} vector 
	 * @param {Circle} circle 
	 * @returns {number}
	 */
	static vectorDistanceToCircle(vector, circle) {
		return Math.max(vector.distance(circle.center) - circle.radius, 0);
	}
	/**
	 * @param {Rect} rect 
	 * @param {Circle} circle 
	 */
	static rectDistanceToCircle(rect, circle) {
		Math.max(Shapes.vectorDistanceToRect(circle.center, rect) - circle.radius, 0);
	}
}
export default Shapes;
