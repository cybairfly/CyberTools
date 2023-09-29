class SpaceInput {
	#content;

	#options;

	constructor(input, options) {
		this.#content = input;
		this.#options = options;
	}

	get content() {
		return this.#content;
	}

	get options() {
		return this.#options;
	}
}

export { SpaceInput };
