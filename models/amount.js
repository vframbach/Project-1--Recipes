var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var AmountSchema = new Schema({

	quantity:{type: Number||String, required: true}, 
	measure: { type: String, required: true}, 
	item: {type: Schema.Types.ObjectId,ref:"Ingredient"}
});

var Amount = mongoose.model("Amount", AmountSchema);
module.exports = Amount;