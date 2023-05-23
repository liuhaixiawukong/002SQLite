const path = require('path');

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

//Import the SQLite:
const sqlite3 = require("sqlite3").verbose();

const db_name = path.join(__dirname, "db", "bikepump.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to 'bikepump.db'");
});

//end Groupwork for all members.

//beging FR1.1 and FR1.2. Implemented by Haixia Liu:
const QUERY1 = "SELECT * FROM `public-bike-pumps`";
const QUERY2 = "SELECT * FROM `public-bike-pumps` Where TYPE = ?";

//for read-search by type
const QUERY3 = "SELECT * FROM `public-bike-pumps` WHERE TYPE LIKE ?";


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
        db.all(QUERY1, function (err, rows, fields) {
            if (err) internalServerError(response, err);
            else{ 
              
            // console.log(rows);

            response.render("bikepumpindex", { 'rows': rows});
            }

        });
    }
    else { // QUERY2 selects matching type
        db.all(QUERY2, [request.query.type], function (err, rows, fields) {
            if (err) internalServerError(response, err);
            else {
            // console.log(rows);
            response.render("bikepumpindex", { 'rows': rows, "type": request.query.type });
          }
        });
    }
}

// read/search by bike pump type txt partial matching
function splashtypepartialmatching(request, response) {          
 // QUERY3 selects matching type
  db.all(QUERY3, ["%" + request.query.searchbytype + "%"], function (err, rows, fields) {
      if (err) internalServerError(response, err);
      else {
              // console.log(rows);
              response.render("bikepumpindex", { 'rows': rows });
      }
  });
}

// Splash page (index.html) is served by default
app.get("/", splash);
app.get("/bikepumpindex", splashbikepum);
//end FR1.1 and FR1.2. Implemented by Haixia Liu.


//begin read-search by type partial matching
app.get("/searchbikepumptxtbox", splashtypepartialmatching);
//end read-search by type

//begin map
app.get("/map.html", function (request, response) {
  var lat = request.query.lat, lon = request.query.lon;
  if (typeof request.query.type == 'undefined') {
    db.all(QUERY1, function (err, rows, fields) {
          if (err) internalServerError(response, err);
          else response.render("map", { 'rows': rows, 'lat':lat, 'lon':lon });
      });
  }
  else {
    db.all(QUERY2, [request.query.type], function (err, rows, fields) {
          if (err) internalServerError(response, err)
          else response.render("map", { 'rows': rows, "type": request.query.type, 'lat':lat, 'lon':lon });
      });
  }
});

//end map

app.listen(5000, function() {
   console.log('Node.js web server at port 5000 is running.. ');
});
