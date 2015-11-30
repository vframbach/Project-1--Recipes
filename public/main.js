//class ingredient for singel ingredient in a recipe
function Ingredient(qantity, measure, id){
	this.qantity = qantity;
	this.measure = measure;
	this.id = id;
}

//class recipe for completed recipe
function Recipe(name, dinners, time, tag, image, ingredients, instructions){
	this.name = name;
	this.dinners = dinners;
	this.time = time;
	this.tag = tag;
	this.image = image;
	this.ingredients = ingredients;
	this.instructions = instructions;
}

// //validation for the form fieled
// function formValidate(recipeName, dinners, coockingTime, tag, ingredients, image, instructions){
// 	var err = false;
// 	if(recipeName===""){
// 		$("#nameOfRecipe").addClass("error");
// 		err = true;
// 	}
// 	else{
// 		$("#nameOfRecipe").removeClass("error");
// 	}
// 	if(dinners===""){
// 		$("#dinners").addClass(error);
// 		err = true;
// 	}
// 	else{
// 		$("#dinners").removeClass("error");
// 	}
// 	if(coockingTime===""){
// 		$("#time").addClass(error);
// 		err = true;
// 	}
// 	else{
// 		$("#time").removeClass("error");
// 	}
// 	if(tag==="Select meal"){
// 		$("#tag").addClass(error);
// 		err = true;
// 	}
// 	else{
// 		$("#tag").removeClass("error");
// 	}
// 	if(ingredients.length===0){
// 		$("#selectedIngredients").append("<div class='col-md-6 col-md-offset-3 text-center error errorList'><p id='noResult'>Sorry, the item was not found</p></div>");
// 		err = true;
// 	}
// 	else{
// 		$("#tag").removeClass("error");
// 		$("#selectedIngredients").remove("errorList");
// 	}
// 	if(image===""){
// 		$("#dishImage").addClass(error);
// 		err = true;
// 	}
// 	else{
// 		$("#dishImage").removeClass("error");
		
// 	}
// 	if(instructions===""){
// 		$("textarea").addClass(error);
// 		err = true;
// 	}
// 	else{
// 		$("textarea").removeClass("error");
// 	}

// 	if(err===true){
// 		("#header").append("<div><p>OOOPS</p></div>");
// 	}
// 	return err;

// }


$(document).ready(function(){
	
	var source = $("#listOfIngredients").html();
	var template = Handlebars.compile(source);

	//capitlize the first letter for the search
	function capitalizeFirstLetter(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	//search engine for ingredient
	$("#searchButton").on("click", function(event){
		event.preventDefault();

		//empty result when a new search was submitted
		$("#allTheIngredients").empty();

		searchedItem = capitalizeFirstLetter($("#searchIngredient").val());
		console.log(searchedItem);

		//add class with a background to the resut of the search
		$("#allTheIngredients").addClass("allTheIngredientsDiv");

		$.get("/api/ingredients/"+searchedItem, function(data){
			if(data.ingredient.length>0){
			var trackHtml=template({item:data.ingredient});
			$("#allTheIngredients").append(trackHtml);	
			}
			else{
				console.log("hi");
				var appended = "<div class='col-md-6 col-md-offset-3 text-center'><p id='noResult'>Sorry, the item was not found</p></div>";
				$("#allTheIngredients").append(appended);
			}	
		});
		$("#searchIngredient").val("");
	});

	//add ingredient from the search to the recipe
	$(document).on("click", ".addIngredient", function(event){
		event.preventDefault();

		//save all the values before adding the item to the recipe
		var itemId = $(this).attr("id");
		var img = $("#img"+itemId).attr("src");
		var name = $("#name"+itemId).text();
		var quantity = $("#quantity"+itemId).val();
		var measure = $("#measure"+itemId).val();
		
		//clean the search list and add the item to the recipe
		var appended = "<div class='row'><div class='col-md-12'><li class='recipeIngredientList' id=" + itemId + "><p>" + "<img class='ingredientListImg'" + "src=" + img +">&nbsp;&nbsp;" + name + "-&nbsp;&nbsp;<span id='quantityOf" + itemId + "''>" + quantity + "</span> &nbsp;&nbsp; <span id='measureOf" + itemId + "''>" + measure + "(s)" + "</p></li></div></div>";
		$("#allTheIngredients").empty();
		$("#selectedIngredients").append(appended);
		$("#allTheIngredients").removeClass("allTheIngredientsDiv");
	});

	//submit a recipe 
	$("#newRecipeForm").on("submit", function(event){
		event.preventDefault();

		
		var recipeName = $("#nameOfRecipe").val();
		var dinners = $("#dinners").val();
		var coockingTime = $("#time").val();
		var tag = $("#tag").val();
		var ingredients = [];
		var image = $("#dishImage").val();
		console.log(image);
		var instructions = $("textarea").text();
		console.log(instructions);

		//iterating on the ingredients list of ingredients
		$("#selectedIngredients .row .col-md-12 .recipeIngredientList").each(function(){
			
			
			var id = $(this).attr("id");
			var qantity = $(this).children("p").children("#quantityOf"+id).text();
			var measure = $(this).children("p").children("#measureOf"+id).text();

			//create asingle ingredient
			var singelIngredient = new Ingredient(qantity, measure, id);
			ingredients.push(singelIngredient);	
		});
	
			
				var newRecipe = new Recipe(recipeName, dinners, coockingTime, tag, image, ingredients, instructions);
				$.post("/add", newRecipe, function(){

					$("#nameOfRecipe").val("");
					$("#dinners").val("");
					$("#time").val("");
					$("#tag").val("Select meal");
					$("#dishImage").val("");
					$("#instructions").text("");
					$("#selectedIngredients").empty();		
		
					});
			
	});
});












































