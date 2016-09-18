const _ = require('lodash');

class DicePool {
	constructor(diceCount, rerollThreshold, rote = false) {
		this.diceCount = diceCount;
		this.rerollThreshold = rerollThreshold;
		this.rote = rote;
	}

	getDescription() {
		let noun = (this.diceCount === 1) ? 'die' : 'dice';
		let threshold = this.rerollThreshold || 'no 10';
		let roteLabel = (this.rote) ? ', rote' : '';

		return `${this.diceCount} ${noun}, ${threshold}-again${roteLabel}`;
	}

	roll() {
		return rollDice(this.diceCount, this.rerollThreshold, this.rote);
	}
}

function rollDice(diceCount, rerollThreshold, rote) {
	let successCount = 0;

	// Roll each die once.
	_.times(diceCount, () => {
		// Get a random result between 1 and 10.
		let result = Math.floor(Math.random() * 10) + 1;
		let isSuccess = result >= 8;

		// If the die is a success, increment the succces count.
		if (isSuccess) successCount += 1;

		// Re-roll if the die exceeds the reroll threshold, or if it failed
		// and the pool has the rote quality.
		if (result >= rerollThreshold || (!isSuccess && rote)) {
			successCount += rollDice(1, rerollThreshold, false);
		}
	})

	return successCount;
}

module.exports = DicePool;
