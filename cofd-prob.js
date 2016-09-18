const _ = require('lodash');
const DicePool = require('./dice-pool');
const ProbabilityTest = require('./probability-test');

const maxDiceCount = 10;
const rollCount = Math.pow(10, 6);
const runCount = 6;

function getDicePools(rerollThreshold, rote) {
	return _.range(1, maxDiceCount + 1)
		.map((d) => new DicePool(d, rerollThreshold, rote));
}

let test = new ProbabilityTest(rollCount, runCount);
let pools = [
	...getDicePools(10), // 10-again
	...getDicePools(9),  // 9-again
	...getDicePools(8),  // 8-again
	...getDicePools(),   // no 10-again
	...getDicePools(10, true), // 10-again, rote
	...getDicePools(9, true),  // 9-again, rote
	...getDicePools(8, true),  // 8-again, rote
	...getDicePools(undefined, true),   // no 10-again, rote
];

for (let pool of pools) {
	console.log(pool.getDescription());
	console.log('---------------------------');

	let results = test.measureProbabilities(pool);
	_.forOwn(results, ({ probability, error }, successCount) => {
		console.log(`${successCount}: ${probability} \xB1 ${error}`);
	});

	console.log('===========================');
}
