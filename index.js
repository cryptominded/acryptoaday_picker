import dotenv from "dotenv";
dotenv.config();
import express from "express";
import getNewCoin from "./routes/coins";
import mongoose from 'mongoose';
import CoinSchema from './routes/CoinSchema';
const server = express();

const port = process.env.PORT || 3000;

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/myappdatabase`);  
  await server.listen(port);
  console.log(`Server listening on port ${port}!`);
};

server.get('/', (req, res) => {
  res.send('Hello');
});

server.get('/getnewcoin', getNewCoin);

function sameDay(d1, d2){
	console.log(d1, d2);
  return d1.getUTCFullYear() == d2.getUTCFullYear() &&
		d1.getUTCMonth() == d2.getUTCMonth() &&
		d1.getUTCDate() == d2.getUTCDate();
}

server.get('/coinlist', async (req, res) => {
	const coinList = await CoinSchema.findOne({});
	if (sameDay(new Date(coinList.coins[coinList.coins.length - 1].date), new Date)) {
		res.send(coinList);		
	} else {
		getNewCoin(req, res);
	}
})

init();
