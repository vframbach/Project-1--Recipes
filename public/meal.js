$(document).ready(function(){

	//open and close the recipe details
	$(".recipeFront").on("click", function(event){
		var itemId=$(this).attr("id");
		$("#desciption"+itemId).toggle();

		//add +/-
		$(this).find("span").toggleClass("glyphicon glyphicon-plus, glyphicon glyphicon-minus");
	
	});

});