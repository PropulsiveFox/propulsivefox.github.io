/**
 * Class for flock unit
 * @class
 * @requires /static/2D/vector.js
 */
class FlockUnit {
	constructor(pos = Vector.zero, vel = Vector.zero) {
		if (!(pos instanceof Vector)) throw Vector.typeError(pos);
		if (!(vel instanceof Vector)) throw Vector.typeError(vel);

		this.position = pos.duplicate();
		this.velocity = vel.duplicate();
		this.targetVelocity = vel.duplicate();

		this.maxSpeed = 100;
		this.acceleration = 140;

		// detection
		this.detectionRange = 50;
		this.detectionThreshold = 10;
		this.rangeSpeed = 60;
		this.maxRange = 120;

		this.separationRange = 25;

		// Weights
		this.cohesionWeight = 4;
		this.alignmentWeight = 3;
		this.separationWeight = 6;
		this.targetWeight = 0.01;
	}

	get x() {
		return this.position.x;
	}
	get y() {
		return this.position.y;
	}

	setTargetVelocity(vel) {
		if (!(vel instanceof Vector)) throw Vector.typeError(vel);

		this.velocity = vel.duplicate();
	}

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
		if (i > 0) cohesionVector.multiply(1 / i);
		return cohesionVector;
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
		if (i > 0) alignmentVector.multiply(1 / i);
		return alignmentVector;
	}
	separationVector(units) {
		let separationVector = new Vector();
		units.forEach(unit => {
			if (unit !== this) {
				let diffVector = Vector.subtract(this.position, unit.position);
				let diffMag = diffVector.magnitude;
				separationVector.add(Vector.multiply(this.separationRange / diffMag / diffMag * (this.separationRange - diffMag), diffVector));
			}
		});
		return separationVector;
	}
	targetVector(vector) {
		if (!(vector instanceof Vector)) throw Vector.typeError(vector);

		return Vector.subtract(vector, this.position);
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
		this.position.add(Vector.multiply(deltaTime, this.velocity));
	}

	/**
	 * FlockUnit behavior tick; based on queryable object
	 * @param {QuadTree} queryable 
	 * @param {number} deltaTime 
	 */
	updateFromQueryable(queryable, deltaTime) {
		if (!(queryable instanceof QuadTree)) throw new typeError(queryable + ' is not supported');

		// range and query
		let detectionRange = new Circle(this.position, this.detectionRange);
		let detectionResult = queryable.query(detectionRange);
		let separationRange = new Circle(this.position, this.separationRange);
		let separationResult = queryable.query(separationRange);

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
		let targetVector = this.targetVector(queryable.boundary.center);

		// behavior weight
		this.targetVelocity =
			Vector.multiply(this.cohesionWeight, cohesionVector).add(
			Vector.multiply(this.alignmentWeight, alignmentVector).add(
			Vector.multiply(this.separationWeight, separationVector).add(
			Vector.multiply(this.targetWeight, targetVector)
			)));
	}
}
