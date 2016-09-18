const _ = require('lodash');
const { mean, stdev } = require('stats-lite');

class ProbabilityTest {
	constructor(rollCount, runCount) {
		this.rollCount = rollCount;
		this.runCount = runCount;
	}

	run(dicePool) {
		let resultCounts = {};

		// Roll the dice the specified number of times, tracking how often each
		// success count is met.
		_.times(this.rollCount, () => {
			let successCount = dicePool.roll();

			// Increment the number of results for this success count,
			// as well as all lower success counts (minimum 1).
			for (let i = 1; i <= successCount; i += 1) {
				if (!resultCounts[i]) {
					resultCounts[i] = 1;
				} else {
					resultCounts[i] += 1;
				}
			}
		});

		// Calculate probabilities by dividing the number of times each success
		// count was met by the total number of rolls in the run.
		return _.mapValues(resultCounts, (r) => r / this.rollCount);
	}

	runAll(dicePool) {
		// Perform the first run, storing its reuslts in new arrays to be
		// further populated and/or deleted by subequent runs.
		let results = _.mapValues(this.run(dicePool), (r) => [ r ]);

		// Perform subsequent runs.
		_.times(this.runCount - 1, () => {
			let runResults = this.run(dicePool);
			for (let successCount of Object.keys(results)) {
				let runResult = runResults[successCount];
				if (runResult) {
					// Add this run's result to the appropriate array.
					results[successCount].push(runResult);
				} else {
					// Any success count that does not occur at least once in
					// every run is not statistically significant and should
					// be ignored from this point forward.
					delete results[successCount];
				}
			}
		});

		return results;
	}

	measureProbabilities(dicePool) {
		return _.mapValues(this.runAll(dicePool), (results) => ({
			probability: mean(results),
			error: stdev(results)
		}));
	}
}

module.exports = ProbabilityTest;
