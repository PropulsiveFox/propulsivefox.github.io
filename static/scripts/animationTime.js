class AnimationTime {
	#currentTime;
	#prevTime;
	#deltaTime;
	#maxDeltaTime;
	#reset;
	constructor(maxDeltaTime = 0.05) {
		this.#currentTime = 0;
		this.#prevTime = 0;
		this.#deltaTime = 0;
		this.#maxDeltaTime = maxDeltaTime;
		this.#reset = false;
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

	update(timestamp) {
		if (this.#reset) {
			this.#prevTime = timestamp;
			this.#reset = false;
		}
		else this.#prevTime = this.#currentTime;
		this.#currentTime = timestamp;
		this.#deltaTime = Math.min(this.#maxDeltaTime, (this.#currentTime - this.#prevTime) / 1000);
	}
	resume() {
		this.#reset = true;
	}
}
export default AnimationTime;
