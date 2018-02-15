import mongo from "mongodb";
import fetch from "node-fetch";
import CoinSchema from './CoinSchema';

export default async (req, response) => {
	const pageNumber = 4;
	const promisesCall = [];

	for (let start = 0; start < pageNumber * 100; start += 100) {
		promisesCall.push(new Promise(async function(resolve, reject) {
			const res = await fetch(`https://api.coinmarketcap.com/v1/ticker/?convert=EUR&start=${start}`);
			const CoinArray = await res.json();
			resolve(CoinArray);
		}));
	};

	const res = await Promise.all(promisesCall);
	let coinArray = [];
	res.forEach(coins => {
		coinArray = coinArray.concat(coins);
	})
	coinArray = coinArray.slice(0, 365);
	console.log(coinArray.length);
	const selection = coinArray[Math.floor(Math.random()*coinArray.length)];

	let PreviousCoins = await CoinSchema.findOne({});
	if (!PreviousCoins) {
		PreviousCoins = new CoinSchema({
			coins: [{date: Date.now(), coin: selection}]
		});
		await PreviousCoins.save();
	} else {
		PreviousCoins.coins.push({date: Date.now(), coin: selection});
		await PreviousCoins.save();
	}
	response.send(PreviousCoins);
}