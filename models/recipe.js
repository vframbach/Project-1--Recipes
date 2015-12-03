var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// var Ingredient = require("./ingredient");
var Amount = require("./amount");

var RecipeSchema = new Schema({
	
	name: {type: String, required: true},
	number_of_people: {type: String, required: true},
	cooking_time: {type: String, required: true},
	tag: {type: String, required: true},
	image: {type: String, required: true},
	ingredients:  [Amount.schema],
	instructions: {type: String, required: true}
});

var Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;