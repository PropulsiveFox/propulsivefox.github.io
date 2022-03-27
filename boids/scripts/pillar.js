import Circle from "./2D/circle.js";
import Vector from "./2D/vector.js";

class Pillars {
	constructor() {
		this.start = null;
		this.end = null;
	}

	/**
	 * @param {function} callback 
	 */
	forEach(callback) {
		let head = this.start;
		while (head !== null) {
			callback(head);
			head = head.next;
		}
		return;
	}

	pushPillar(x, y, radius = 20) {
		let pillar = new Pillar(x, y, radius);
		if (this.end !== null) this.end.next = pillar;
		pillar.prev = this.end;
		pillar.next = null;

		if (this.start === null) this.start = pillar;
		this.end = pillar;
	}

	/**
	 * @param {Pillar} pillar 
	 */
	popPillar(pillar) {
		if (this.start === pillar) this.start = pillar.next;
		if (this.end === pillar) this.end = pillar.prev;
		if (pillar.prev !== null) pillar.prev.next = pillar.next;
		if (pillar.next !== null) pillar.next.prev = pillar.prev;
	}

	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @returns 
	 */
	findPillar(x, y) {
		let head = this.start;
		while (head !== null) {
			if (head.circle.contains(new Vector(x, y))) return head;
			else head = head.next;
		}
		return undefined;
	}
}

class Pillar {
	constructor(x, y, radius) {
		this.circle = new Circle(new Vector(x, y), radius);
	}

	toString() {
		return `[object Pillar(${this.circle}, ${this.prev}, ${this.next})]`;
	}
}

export default Pillars;
