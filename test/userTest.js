var request = require("request");
var expect = require("chai").expect;
var baseUrl = "https://cooking-app.herokuapp.com";

describe("App test", function(){

	it("should load home page on base baseUrl", function(done){
		request(baseUrl, function(error, response, body){
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it("should load add recipe page on /add", function(done){
		request(baseUrl + "/add", function(error, response, body){
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it("should load breakfast page on /breakfast", function(done){
		request(baseUrl + "/breakfast", function(error, response, body){
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it("should load lunch page on /lunch", function(done){
		request(baseUrl + "/lunch", function(error, response, body){
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it("should load dinner page on /dinner", function(done){
		request(baseUrl + "/dinner", function(error, response, body){
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it("should get avocado on /api/ingredients/Avocado", function(done){
		request(baseUrl + "/api/ingredients/Avocado", function(error, response, body){
			var parsedBody=JSON.parse(response.body);
			console.log(parsedBody.ingredient[0].name);
			expect(parsedBody.ingredient[0].name).to.equal("Avocado");
			done();
		});
	});
});