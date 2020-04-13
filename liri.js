require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require('fs');
// add a switch statement to grab which command is used
var command = process.argv[2];

var nodeArgs = process.argv;
var subject = "";
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    subject = subject + "+" + nodeArgs[i];
  } else {
   subject += nodeArgs[i];
  }
}
switch (command) {
  case "concert-this":
  

    bandsInTown(subject);
    break;

  case "spotify-this-song":
    
    spotifyThis(subject);
    break;

  case "movie-this":
    
    movieThis(subject);
    break;

  case "do-what-it-says":
      doWhatItSays();
    break;

  default:
    break;
}

function bandsInTown(artist) {
  var axios = require("axios");
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function (response) {
    if (response.data.length === 0) {
      display("No Concerts Found");
    } else {
      for (i = 0; i < response.data.length; i++) {
        var dateTime = response.data[i].datetime;
        var month = dateTime.substring(5, 7);
        var year = dateTime.substring(0, 4);
        var day = dateTime.substring(8, 10);
        var date = month + "/" + day + "/" + year;

        display(`Venue: ${response.data[i].venue.name}`);
        display(
          `Location: ${response.data[i].venue.city},${response.data[i].venue.country}`
        );
        display(`Date: ${date}`);
        display("\n---------------------------------------------------\n");
      }
    }
  });
}

function spotifyThis(song) {
  spotify
    .search({ type: "track", query: song })
    .then(function (response) {
      for (var i = 0; i < 5; i++) {
        var spotifyResults =
          "--------------------------------------------------------------------" +
          "\nArtist(s): " +
          response.tracks.items[i].artists[0].name +
          "\nSong Name: " +
          response.tracks.items[i].name +
          "\nAlbum Name: " +
          response.tracks.items[i].album.name +
          "\nPreview Link: " +
          response.tracks.items[i].preview_url;

        display(spotifyResults);
      }
    })
    .catch(function (err) {
      display(err);
    });
}

function movieThis(subject) {
    if(!subject){
        subject = "Mr.Nobody";
    }
var queryUrl = "http://www.omdbapi.com/?t=" + subject + "&y=&plot=short&apikey=trilogy";

axios.get(queryUrl).then(
  function(response) {
    display("------------------------------\n");
    display("Title: " +response.data.Title);
    display("Year: "+response.data.Year);
    display("IMDB Rating: "+response.data.imdbRating);
    display("Rotten Tomatoes Rating: "+response.data.Ratings[1].Value);
    display("Country: "+response.data.Country);
    display("Language: "+response.data.Language);
    display("Plot: "+response.data.Plot);
    display("Cast: "+response.data.Actors);
    display("------------------------------\n");
  })
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      display("---------------Data---------------");
      display(error.response.data);
      display("---------------Status---------------");
      display(error.response.status);
      display("---------------Status---------------");
      display(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      display(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      display("Error", error.message);
    }
    display(error.config);
  });

}

function doWhatItSays() {

    fs.readFile('random.txt', "utf8", function(error, data){

        if (error) {
            return display(error);
          }
    
      
        var dataArr = data.split(",");
        
        if (dataArr[0] === "spotify-this-song") {
            
          var song = dataArr[1]
          spotifyThis(song);
        } 
       
        });
    
    };
    
function display(data) {

	console.log(data);

	fs.appendFile('log.txt', data + '\n', function(err) {
		
		if (err) return display('Error logging data to file: ' + err);	
	});
}

