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
mongoose.connect("mongodb://localhost/recipes-app", process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || 'mongodb://localhost/recipes-app'
);

//apply body parser package
app.use(bodyParser.urlencoded({extended:true}));

//connect public files
app.use(express.static(__dirname + "/public"));

//set view engine hbs
app.set("view engine", "hbs");

//set partials 
hbs.registerPartials(__dirname + "/views/partials");

//define server + sanity check
var server = app.listen(process.env.Port || 3000, function(){
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
	res.render("breakfast");
});

//route to lunch page
app.get("/lunch", function(req, res){
	res.render("lunch");
});

//route to dinner page 
app.get("/dinner", function(req, res){
	res.render("dinner");
});

//find an ingredient route
app.get("/api/ingredients/:id", function(req, res){
	var searchedItem=req.params.id;
	console.log(searchedItem);
	Ingredient.find({name:searchedItem},function(err, ingredient){
		res.json({ingredient:ingredient});
	});
});

//post a new recipe
app.post("/add", function(req, res){
	var newRecipe = new Recipe(req.body);
	newRecipe.save(function(err, savedRecipe){
		res.json(savedRecipe);
		
	});

});




