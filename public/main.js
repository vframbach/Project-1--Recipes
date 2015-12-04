//class ingredient for singel ingredient in a recipe
function Ingredient(quantity, measure, id){
	this.quantity = quantity;
	this.measure = measure;
	this.id = id;
}

//class recipe for completed recipe
function Recipe(name, dinners, time, tag, image, ingredients, instructions){
	this.name = name;
	this.number_of_people = dinners;
	this.cooking_time = time;
	this.tag = tag;
	this.image = image;
	this.ingredients = ingredients;
	this.instructions = instructions;
}

//validation for the form fieled
function ingredientsValidate(ingredients, textarea){
	var val = true;
	if(ingredients.length===0){
		val = false;
		$("#allTheIngredients").empty();
		$("#allTheIngredients").append("<div class='col-md-6 col-md-offset-1 error errorList'><p id='resultError'>Even a scrambled egg has one ingredient :)</p></div>");
	}
	else{
		$("#allTheIngredients").remove(".errorList");
	}
	if (textarea===""){
		val = false;
		$("#instructions").addClass("error").addClass("errorText");
	}
	else{
		$("#instructions").removeClass("error");
	}
	return val;
}

//validate quantity and measure before adding an ingredient
function addValidate(quantity, measure, itemId){
	var val=true;
	if(quantity===""){
		val=false;
		$("#quantity"+itemId).addClass("error");
	}
	else{
		$("#quantity"+itemId).removeClass("error");
	}
	if(measure===""){
		val=false;
		$("#measure"+itemId).addClass("error");
	}
	else{
		$("#measure"+itemId).removeClass("error");	
	}
	return val;
}


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

		//add class with a background to the resut of the search
		$("#allTheIngredients").addClass("allTheIngredientsDiv");

		$.get("/api/ingredients/"+searchedItem, function(data){
			if(data.ingredient.length>0){
				var trackHtml=template({item:data.ingredient});
			$("#allTheIngredients").append(trackHtml);	
			}
			else{
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
		console.log(itemId, img);

		if(addValidate(quantity, measure, itemId)){
		
		//clean the search list and add the item to the recipe
		var appended = "<div class='row'><div class='col-md-12'><li class='recipeIngredientList' id=" + itemId + "><p>" + "<img class='ingredientListImg'" + "src=" + img +">&nbsp;&nbsp;" + name + "-&nbsp;&nbsp;<span id='quantityOf" + itemId + "''>" + quantity + "</span> &nbsp;&nbsp; <span id='measureOf" + itemId + "''>" + measure + "(s)" + "<button type='button' class='close' id='close" + itemId +"''>&times;</button></p></li></div></div>";
		$("#allTheIngredients").empty();
		$("#selectedIngredients").append(appended);
		$("#allTheIngredients").removeClass("allTheIngredientsDiv");
		}
	});

	$(document).on("click", ".close", function(event){
		event.preventDefault();
		$(this).parent().parent().parent().parent().remove();
	});

	$("#dishImage").on("change",function(){
		console.log("upload");
		var myFormData = new FormData();
		myFormData.append('upload', $("#dishImage").get(0).files[0]);
		$.ajax({
		  url: '/upload',
		  type: 'POST',
		  processData: false, // important
		  contentType: false, // important
		  dataType : 'json',
		  data: myFormData,
		  success: function(data){
		  	//display uploaded img
		  	console.log(data);
		  	var splitedUrl = data.path.split("/");
		  	var imgUrl = "http://localhost:3000/" + splitedUrl[2] + "/" + splitedUrl[3];
		  	$(".uploadedImg").remove();
		  	$("#imgDiv").append("<img class='uploadedImg' src='" + imgUrl +"'>");
		  }
		});
	});
	//submit a recipe 
	$("#newRecipeForm").on("submit", function(event){
		event.preventDefault();

		
		var recipeName = $("#nameOfRecipe").val();
		var dinners = $("#dinners").val();
		var coockingTime = $("#time").val();
		var tag = $("#tag").val();
		var ingredients = [];
		var image = $(".uploadedImg").attr("src");
		var instructions = $("#instructions").val();

		console.log(image);
		//default image in case that image wasn't uploaded by the user
		if (!image){
			image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzSeb_NylZz4vJOGYezXxWDAigcIFSzRkToa8yhPIApTDvnOFyBw";
		}

		//iterating on the ingredients list of ingredients
		$("#selectedIngredients .row .col-md-12 .recipeIngredientList").each(function(){
			$(".close").remove();
			var id = $(this).attr("id");
			var quantity = $(this).children("p").children("#quantityOf"+id).text();
			var measure = $(this).children("p").children("#measureOf"+id).text();

			//create a single ingredient
			var singelIngredient = new Ingredient(quantity, measure, id.toString());
			console.log("singleingredient" + singelIngredient.id);
			ingredients.push(singelIngredient);	
			console.log("ingredients arr:" + ingredients[0].object, ingredients[0].Object);
		});

	
		if(ingredientsValidate(ingredients, instructions)){

			var newRecipe = new Recipe(recipeName, dinners, coockingTime, tag, image, JSON.stringify(ingredients), instructions);
			console.log("id"+ingredients[0].id);
			console.log(ingredients[0]);
			

			$.post("/api/recipes", newRecipe, function(data){
				console.log("posted");
				$('#myModal').modal();
				$("#nameOfRecipe").val("");
				$("#dinners").val("");
				$("#time").val("");
				$("#tag").val("");
				$("#dishImage").val("");
				$("#instructions").val("");
				$("#selectedIngredients").empty();	

			});
		}
	});

	$("li").mouseover(function(){
	    $(this).css("background-color", "rgba(148, 141, 141, 0.7)");
	});
	$("li").mouseout(function(){
	        $("li").css("background", "none");
	});
});












































