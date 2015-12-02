//require dependencies
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var hbs = require("hbs");

//require schemas
var Ingredient = require("./models/ingredient");
var Recipe = require("./models/recipe");

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
	Recipe.find({tag:"breakfast"}).populate("ingredients").exec(function(err, breakfastRecipes){
		console.log("arr:" + breakfastRecipes);
		res.render("breakfast", {breakfastRecipesData:breakfastRecipes});
	});
});

//route to lunch page
app.get("/lunch", function(req, res){
	Recipe.find({tag:"lunch"}).populate("ingredients").exec(function(err, lunchRecipes){
		res.render("lunch", {lunchRecipesData:lunchRecipes});
	});
});

//route to dinner page 
app.get("/dinner", function(req, res){
	Recipe.find({tag:"dinner"}).populate("ingredients").exec(function(err, dinnerRecipes){
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
app.post("/add", function(req, res){
	console.log(req);
	var newRecipe = new Recipe(req.body);
	newRecipe.save(function(err, savedRecipe){
		console.log("recipe:"+savedRecipe);
		res.json(savedRecipe);	
	});
});







