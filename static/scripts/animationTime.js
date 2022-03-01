class AnimationTime {
	#currentTime;
	#prevTime;
	#deltaTime;
	constructor() {
		this.#currentTime = Date.now();
		this.#prevTime = Date.now();
		this.#deltaTime = 0;
	}

	get currentTime() {
		return this.#currentTime;
	}
	get prevTime() {
		return this.#prevTime;
	}
	get deltaTime() {
		return this.#deltaTime;
	}

	update() {
		this.#prevTime = this.#currentTime;
		this.#currentTime = Date.now();
		this.#deltaTime = (this.#currentTime - this.#prevTime) / 1000;
	}
}