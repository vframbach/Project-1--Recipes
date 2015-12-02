var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Ingredient = require("./ingredient");

var RecipeSchema = new Schema({
	name: {type: String, required: true},
	number_of_people: {type: Number||String, required: true},
	cooking_time: {type: Number||String, required: true},
	tag: {type: String, required: true},
	image: {type: String, required: true},
	ingredients:  [{qantity:{type: Number||String, required: true}, measure: { type: String, required: true}, item: {type: Schema.Types.ObjectId,ref:"Ingredient"}}],
	instructions: {type: String, required: true}
});

var Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;