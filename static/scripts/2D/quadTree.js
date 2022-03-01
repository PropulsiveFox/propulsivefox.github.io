class QuadTree {
	constructor(boundary, capacity) {
		this.boundary = boundary;
		this.capacity = capacity;
		this.points = new Array();
	}

	subdivide() {
		let x = this.boundary.x;
		let y = this.boundary.y;
		let w = this.boundary.w / 2;
		let h = this.boundary.h / 2;

		let ne = new Rect(x + w, y + h, w, h);
		let nw = new Rect(x, y + h, w, h);
		let se = new Rect(x + w, y, w, h);
		let sw = new Rect(x, y, w, h);

		this.northeast = new QuadTree(ne, this.capacity);
		this.northwest = new QuadTree(nw, this.capacity);
		this.southeast = new QuadTree(se, this.capacity);
		this.southwest = new QuadTree(sw, this.capacity);

		this.points.forEach(point => {
			this.northeast.insert(point);
			this.northwest.insert(point);
			this.southeast.insert(point);
			this.southwest.insert(point);
		});
		this.points = new Array();
	}

	insert(point) {
		if (!this.boundary.contains(point)) {
			return;
		}

		if (this.points.length < this.capacity && !this.hasOwnProperty('northeast')) {
			this.points.push(point);
		} else {
			if (!this.hasOwnProperty('northeast')) {
				this.subdivide();
			}

			this.northeast.insert(point);
			this.northwest.insert(point);
			this.southeast.insert(point);
			this.southwest.insert(point);
		}
	}

	dump() {
		var include = new Array();
		if (this.hasOwnProperty('northeast')) {
			this.northeast.dump().forEach(point => include.push(point));
			this.northwest.dump().forEach(point => include.push(point));
			this.southeast.dump().forEach(point => include.push(point));
			this.southwest.dump().forEach(point => include.push(point));
		}
		else {
			this.points.forEach(point => include.push(point));
		}
		return include;
	}
	/**
	 * 
	 * @param {Rect | Circle} range 
	 * @returns {Array}
	 */
	query(range) {
		var found = new Array();
		if (!this.boundary.intersects(range)) {
			// return found
		} else if (range.contains(this.boundary)) {
			this.dump().forEach(point => found.push(point));
		} else if (this.hasOwnProperty('northeast')) {
			this.northeast.query(range).forEach(point => found.push(point));
			this.northwest.query(range).forEach(point => found.push(point));
			this.southeast.query(range).forEach(point => found.push(point));
			this.southwest.query(range).forEach(point => found.push(point));
			// return found
		} else {
			this.points.forEach(point => {
				if (range.contains(point)) {
					found.push(point);
				}
			});
			// return found
		}
		return found;
	}

	draw(ctx) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw TypeError('need CanvasRenderingcontext2D');
		}

		this.boundary.draw(ctx);

		if (this.hasOwnProperty('northwest')) {
			this.northeast.draw(ctx);
			this.northwest.draw(ctx);
			this.southeast.draw(ctx);
			this.southwest.draw(ctx);
		}
	}
}
