//require dependencies
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var hbs = require("hbs");
var formidable = require('formidable');
var fs = require('fs-extra');

//require schemas
var Ingredient = require("./models/ingredient");
var Recipe = require("./models/recipe");
var Amount = require("./models/amount");

//connect database
mongoose.connect(process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || "mongodb://localhost/recipes-app");

//apply body parser package
app.use(bodyParser.urlencoded({extended:true}));

//connect public files
app.use(express.static(__dirname + "/public"));

//set view engine hbs
app.set("view engine", "hbs");

//set partials 
hbs.registerPartials(__dirname + "/views/partials");

//define server + sanity check
var server = app.listen(process.env.PORT || 3000, function(){
	console.log("listening");
});

//route to the landing page
app.get("/", function(req, res){
	res.render("index");
});

//route to add recipe page
app.get("/add", function(req, res){
	res.render("new_recipe");
});

//route to breckfast page
app.get("/breakfast", function(req, res){
	Recipe.find({tag:"breakfast"}).populate("ingredients.item").exec(function(err, breakfastRecipes){
		console.log("arr:" + breakfastRecipes);
		res.render("breakfast", {breakfastRecipesData:breakfastRecipes});
	});
});

//route to lunch page
app.get("/lunch", function(req, res){
	Recipe.find({tag:"lunch"}).populate("ingredients.item").exec(function(err, lunchRecipes){
		res.render("lunch", {lunchRecipesData:lunchRecipes});
	});
});

//route to dinner page 
app.get("/dinner", function(req, res){
	Recipe.find({tag:"dinner"}).populate("ingredients.item").exec(function(err, dinnerRecipes){
		res.render("dinner", {dinnerRecipesData: dinnerRecipes});
	});
});

//find an ingredient route
app.get("/api/ingredients/:name", function(req, res){
	var searchedItem=req.params.name;
	Ingredient.find({name:searchedItem},function(err, ingredient){
		console.log(ingredient);
		res.json({ingredient:ingredient});
	});
});

//post a new recipe
app.post("/api/recipes", function(req, res){
	// var newRecipe = new Recipe(req.body);
	var newRecipe = new Recipe({
		name: req.body.name,
		number_of_people: req.body.number_of_people,
		cooking_time: req.body.cooking_time,
		tag: req.body.tag,
		image: req.body.image,
		instructions: req.body.instructions
	});
	// console.log(req);
	// var newRecipe = new Recipe(req.body.ingredients.id);
	newRecipe.save(function(err, savedRecipe){
		console.log("ingredients:"+ req.body.ingredients);

		console.log(JSON.parse(req.body.ingredients));
		var parsedIngredients = JSON.parse(req.body.ingredients);

		for(var i=0; i<parsedIngredients.length; i++){
			console.log(parsedIngredients[i].quantity);
				var newAmount = new Amount({
					quantity: parsedIngredients[i].quantity,
					measure: parsedIngredients[i].measure,
					item: parsedIngredients[i].id
				});
				savedRecipe.ingredients.push(newAmount);
				console.log("amount"+newAmount);		
		}
		savedRecipe.save();
		res.json(savedRecipe);	
	});
});

//upload img

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req);

	form.on('end', function() {

		/* Temporary location of our uploaded file */
		var temp_path = this.openedFiles[0].path;
		var fileName = this.openedFiles[0].name;
		var ext = fileName.split(".");
		ext = ext[ext.length - 1];


		console.log(ext);
		/* The file name of the uploaded file */
		var file_name = "123." + ext;
		/* Location where we want to copy the uploaded file */
		var new_location = './public/uploads/';

		fs.copy(temp_path, new_location + file_name, function(err) {
			if (err) {
				console.error(err);
			} else {
				console.log("success!");
				res.json({
					path: new_location + file_name
				});
			}
		});
	});
});





