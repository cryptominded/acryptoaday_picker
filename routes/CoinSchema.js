
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const coinSchema = new Schema({
  coins: {
    type: Array
  }
});

const CoinSchema = mongoose.model('CoinSchema', coinSchema);
export default CoinSchema;