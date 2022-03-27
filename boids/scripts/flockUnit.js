import Vector from "./2D/vector.js";
import Line from "./2D/line.js";
import Circle from "./2D/circle.js";
import Rect from "./2D/rect.js";

import QuadTree from "./2D/quadTree.js";

/**
 * Class for flock unit
 * @class
 * @requires /static/2D/vector.js
 */
class FlockUnit extends Vector {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} vx 
	 * @param {number} vy 
	 */
	constructor(x, y, vx, vy) {
		super(x, y);

		this.velocity = new Vector(vx, vy);
		this.targetVelocity = new Vector(vx, vy);

		this.maxSpeed = 200;
		this.acceleration = 200;

		this.reactionTime = 70;

		// detection
		this.detectionRange = 50;
		this.detectionThreshold = 10;
		this.rangeSpeed = 20;
		this.maxRange = 200;

		this.separationRange = 25;

		this.envRange = 20;

		// Weights
		this.cohesionWeight = 1.6;
		this.alignmentWeight = 1.1;
		this.separationWeight = 3;
		this.environmentWeight = 3;
	}

	get position() { return this; }

	cohesionVector(units) {
		let cohesionVector = new Vector();
		var i = 0;
		units.forEach(unit => {
			if (unit !== this) {
				let diffVector = Vector.subtract(unit.position, this.position);
				cohesionVector.add(diffVector);
				i++;
			}
		});
		if (i > 0) return cohesionVector.multiply(1 / i);
		else return Vector.zero;
	}
	alignmentVector(units) {
		let alignmentVector = new Vector();
		var i = 0;
		units.forEach(unit => {
			if (unit !== this) {
				alignmentVector.add(unit.velocity);
				i++;
			}
		});
		if (i > 0) return alignmentVector.multiply(1 / i);
		else return this.velocity;
	}
	separationVector(units) {
		let separationVector = new Vector();
		units.forEach(unit => {
			if (unit !== this) {
				let diffVector = Vector.subtract(this.position, unit.position);
				let diffMag = diffVector.magnitude;
				separationVector.add(diffVector.multiply(this.separationRange / diffMag / diffMag * (this.separationRange - diffMag)));
			}
		});
		return separationVector;
	}
	/**
	 * @param {Rect} outerBoundary 
	 * @param {Pillars} obstacles
	 * @returns {Vector}
	 */
	environmentVector(outerBoundary, obstacles) {
		let pred = Vector.multiply(this.velocity, 0.54 * this.velocity.magnitude / this.acceleration);
		let predLine = new Line(this.x, this.y, pred.x, pred.y);
		pred.add(this);
		let eRange = Math.min(outerBoundary.w, outerBoundary.h, 2 * this.envRange) / 2;

		let result = new Vector();
		let dn = Math.min(outerBoundary.yMax - pred.y, outerBoundary.yMax - this.y);
		let de = Math.min(outerBoundary.xMax - pred.x, outerBoundary.xMax - this.x);
		let ds = Math.min(pred.y - outerBoundary.y, this.y - outerBoundary.y);
		let dw = Math.min(pred.x - outerBoundary.x, this.x - outerBoundary.x);

		if (dn < eRange) {
			let factor;
			if(dn <= 0) factor = Number.MAX_SAFE_INTEGER;
			else factor = eRange * (eRange / dn - 1);
			result.add(Vector.south.multiply(factor));
		}
		if (de < eRange) {
			let factor;
			if(de <= 0) factor = Number.MAX_SAFE_INTEGER;
			else factor = eRange * (eRange / de - 1);
			result.add(Vector.west.multiply(factor));
		}
		if (ds < eRange) {
			let factor;
			if(ds <= 0) factor = Number.MAX_SAFE_INTEGER;
			else factor = eRange * (eRange / ds - 1);
			result.add(Vector.north.multiply(factor));
		}
		if (dw < eRange) {
			let factor;
			if(dw <= 0) factor = Number.MAX_SAFE_INTEGER;
			else factor = eRange * (eRange / dw - 1);
			result.add(Vector.east.multiply(factor));
		}

		obstacles.forEach(pillar => {
			const perpLine = new Line(pillar.circle.x, pillar.circle.y, predLine.dir.y, -predLine.dir.x);

			let denominator = predLine.dir.x * perpLine.dir.y - predLine.dir.y * perpLine.dir.x;
			if (denominator === 0) return Vector.distance(predLine, perpLine);
			let dx = perpLine.x - predLine.x;
			let dy = perpLine.y - predLine.y;
			let t = (dx * perpLine.dir.y - dy * perpLine.dir.x) / denominator;
	
			let predPoint;
			if (t >= 1) {
				predPoint = predLine.end;
			} else if (t < 0) {
				predPoint = predLine.start;
			} else {
				predPoint = new Vector(predLine.x + t * predLine.dir.x, predLine.y + t * predLine.dir.y);
			}

			let predDis = pillar.circle.distance(predPoint);
			if (predDis < eRange) {
				let factor;
				if (predDis <= 0) factor = Number.MAX_SAFE_INTEGER;
				else factor = eRange * (eRange / predDis - 1);
				result.add(Vector.subtract(predPoint, pillar.circle.position).normalized.multiply(factor));
			}
		});

		return result;
	}

	accelerateToTargetVelocity(deltaTime) {
		let diffVector = Vector.subtract(this.targetVelocity, this.velocity);

		let diffVectorMag = diffVector.magnitude;
		if (diffVectorMag < this.acceleration * deltaTime) {
			this.velocity = this.targetVelocity.duplicate();
		}
		else {
			diffVector.multiply(this.acceleration * deltaTime / diffVectorMag);
			this.velocity.add(diffVector);
		}

		let velocityMag = this.velocity.magnitude;
		if (velocityMag > this.maxSpeed) this.velocity.multiply(this.maxSpeed / velocityMag);
	}
	move(deltaTime) {
		this.add(Vector.multiply(this.velocity, deltaTime));
	}

	/**
	 * FlockUnit behavior tick; based on quadTree object
	 * @param {QuadTree} quadTree 
	 * @param {Pillars} obstacles 
	 * @param {number} deltaTime 
	 */
	updateFromQuadTree(quadTree, obstacles, deltaTime) {
		// range and query
		let detectionRange = new Circle(this, this.detectionRange);
		let detectionResult = quadTree.query(detectionRange);
		let separationRange = new Circle(this, this.separationRange);
		let separationResult = quadTree.query(separationRange);

		// detectionRange adjustment
		if (detectionResult.length > this.detectionThreshold) {
			this.detectionRange -= this.rangeSpeed * deltaTime;
		} else if (detectionResult.length < this.detectionThreshold) {
			this.detectionRange += this.rangeSpeed * deltaTime;
		}
		if (this.detectionRange > this.maxRange) this.detectionRange = this.maxRange;
		if (this.detectionRange < 0) this.detectionRange = 0;

		// each behavior vectors
		let cohesionVector = this.cohesionVector(detectionResult);
		let alignmentVector = this.alignmentVector(detectionResult);
		let separationVector = this.separationVector(separationResult);
		let environmentVector = this.environmentVector(quadTree.boundary, obstacles);

		// behavior weight
		this.targetVelocity =
			Vector.multiply(cohesionVector, this.cohesionWeight).add(
			Vector.multiply(alignmentVector, this.alignmentWeight).add(
			Vector.multiply(separationVector, this.separationWeight).add(
			Vector.multiply(environmentVector, this.environmentWeight)
			)));
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		// 0.81 * 5 = 4.05
		// 0.62 * 5 = 3.1
		let facing = this.velocity.normalized.multiply(5);
		let perp = new Vector(facing.y, -facing.x).multiply(0.62);

		ctx.save();
		ctx.fillStyle = "#3fbfff";
		ctx.beginPath();
		ctx.moveTo(this.x + facing.x, this.y + facing.y);
		ctx.lineTo(this.x + perp.x, this.y + perp.y);
		let rearFacing = Vector.multiply(facing, -1.62);
		ctx.lineTo(this.x + rearFacing.x, this.y + rearFacing.y);
		ctx.lineTo(this.x - perp.x, this.y - perp.y);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}
export default FlockUnit;
