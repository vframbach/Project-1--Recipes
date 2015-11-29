var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Ingredient = require("./ingredient");

var RecipeSchema = new Schema({
	name: String,
	number_of_people: Number,
	cooking_time: String,
	tag: String,
	image: String,
	ingredients: [{type: Schema.Types.ObjectId, ref:"Ingredient"}]
});

var Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;