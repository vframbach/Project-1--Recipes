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
		var appended = "<div class='row'><div class='col-md-12'><li class='recipeIngredientList' id='itemId'><p>" + "<img class='ingredientListImg'" + "src=" + img +">&nbsp;&nbsp;" + name + "-&nbsp;&nbsp;" + quantity + "&nbsp;&nbsp;" + measure + "(s)" + "</p></li></div></div>";
		$("#allTheIngredients").empty();
		$("#selectedIngredients").append(appended);

		$("#allTheIngredients").removeClass("allTheIngredientsDiv");
	});

});