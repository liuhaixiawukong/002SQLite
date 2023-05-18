var express = require('express');
var app = express();


function internalServerError(response, err) {
  response.status(500);
  response.send(err);    
}

// configure Express to use embedded JavaScript
app.set("view engine", "ejs");

// serve static content from 'static' folder
app.use(express.static('static'));

//Groupwork of all members:
//Import the MySQL module:
const mysql = require('mysql');

//Create a connection object with the database credentials​
var connection = mysql.createConnection({
   "host"     : "localhost",
   "user"     : "root",
   "password" : "password",
   "database" : "isd"
});
connection.connect(function(err){
	if (err) {
    	console.error("Connection error: ", err.message);    
	} else {
    	console.log("Connected as: ", connection.threadId);    
	}
});
//end Groupwork for all members.

//beging FR1.1 and FR1.2. Implemented by Haixia Liu:
const QUERY1 = "SELECT * FROM `public-bike-pumps`";
const QUERY2 = "SELECT * FROM `public-bike-pumps` Where Type = ?";

// callback function for the splash page request handler
function splash(request, response) {
    // first we just want to show the empty home page:
    if (Object.keys(request.query).length === 0) {
        // The request.query object is empty
        response.render("_home");
      }      
}

// callback function for the splashbikepum page request handler
function splashbikepum(request, response) {          
    // if no type is specified use QUERY1
    if (typeof request.query.type == 'undefined') {
        connection.query(QUERY1, function (err, rows, fields) {
            if (err) internalServerError(response, err);
            else response.render("bikepumpindex", { 'rows': rows});
        });
    }
    else { // QUERY2 selects matching type
        connection.query(QUERY2, [request.query.type], function (err, rows, fields) {
            if (err) internalServerError(response, err);
            else response.render("bikepumpindex", { 'rows': rows, "type": request.query.type });
        });
    }
}

// Splash page (index.html) is served by default
app.get("/", splash);
app.get("/bikepumpindex", splashbikepum);
//end FR1.1 and FR1.2. Implemented by Haixia Liu.

app.listen(5000, function() {
   console.log('Node.js web server at port 5000 is running.. ');
});
