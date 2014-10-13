/*

Define variables that will be used in the game:

- tableDefaultSize will be the game default size if not selected. Default value will be 4
- gameArray and verificationArray will be used for each game that is created
- option1 and option2 will hold each selection the user does
- cell1 will hold the location of option1
- size will hold the table size for the game
- pairsFound and attempts are counters that will hold the statistics of each game

*/

var tableDefaultSize = 4;
var gameArray = [];
var verificationArray = [];
var option1 = null;
var option2 = null;
var cell1 = [];
var pairsFound = 0;
var size = 0;
var attempts = 0;

// function newGame() will reset all variables and create a new matrix for the game. If no value is selected, it'll use default one

var newGame = function() {

	size = parseInt(document.getElementById("tableSize").value);
	var message;
	option1 = null;
	option2 = null;
	pairsFound = 0;
	attempts = 0;
	document.getElementById("attempts").innerHTML = attempts;

	message = document.getElementById("message");
   	message.innerHTML = ""; 

	if (isNaN(size))
		size = tableDefaultSize;

	try { 
       	if((size % 2) !=0) throw "Please select an even number";
       	if((size > 10) || (size < 2)) throw "Please select an even number between 2 and 10";
    }
    catch(err) {
        message.innerHTML = err;
        document.getElementById("tableSize").value = "";
        return false;
   	}

	gameArray = newGameArray(size);
	gameArray = shuffleArray(gameArray);
	gameArray = convertArray(gameArray,size);
	drawTable(gameArray, size);
	document.getElementById("tableSize").value = "";
	return gameArray;

};

// select function will handle all user selections and will compare selected values. It also handles the counters specific to each game

var select = function(row,column){

	var selectedCell = gameArray[row][column];
	var success = false;
	var id = row + "" + column;

	document.getElementById(id).innerHTML = selectedCell;

	if (verificationArray[row][column] != 1) {

		if (option1 == null) {

			option1 = selectedCell;
			cell1 = [row,column];
			success = true;
			console.log("You selected: " + option1);
		}
		else if ((option2 == null) && !(cell1[0] == row && cell1[1] == column))  {

			option2 = selectedCell;
			success = true;
			console.log("You selected: " + option2);
		}
		else console.log ("You already selected two cells or already selected that cell");

		if ((option1 != null) && (option2!=null)){

			attempts++;
			document.getElementById("attempts").innerHTML = attempts;
			if (option1 == option2){

				console.log("Congratulations, you found a pair")
				verificationArray[cell1[0]][cell1[1]] = 1;
				verificationArray[row][column] = 1;
				pairsFound++;
				drawTable(gameArray, size);
				if (pairsFound == ((size*size)/2) ) {
					console.log("Congrats. You finished the game")
					alert("Congratulations. You finished the game in " + attempts + " attempts")
				}
			}
			else {	
				setTimeout('drawTable(gameArray, size)', 1500);
			}
			option1 = null;
			option2 = null;
			cell1 = [];
		}
	}
	return success;
}

// drawTable will create the html object to display it in the page

function drawTable(array,size) {

	var section1 = "<table>";
	var section3 = "</table>";
	var section2 = "";
	var content = "?";

	for(i = 0; i < size; i++){

   		section2 = section2 + "<tr>"
   		for (j = 0; j < size; j++) {

   			if (verificationArray[i][j] == 0)
      			section2 = section2 + "<td id =" + i + j + " align='center' onclick='select(" + i + "," + j +");'>" + content + "</td>";
      		else
      			section2 = section2 + "<td id =" + i + j + " align='center'>" + gameArray[i][j] + "</td>";
   		}
    section2 = section2 + "</tr>"
	}

	var game = section1 + section2 + section3

	var gameDraw = document.getElementById('game')
	gameDraw.innerHTML = game
};

// newGameArray will create a simple array with all the options depending on the size selected

var newGameArray = function(size) {

	var currentGameArray = [];
	
	var lettersGame = (size * size)/2;
	for (var i = 65; i < (65 + lettersGame); i++) {

		currentGameArray.push(String.fromCharCode(i));
		currentGameArray.push(String.fromCharCode(i));
	}
	
	return currentGameArray;
};

// suffleArray will mix all options from newGameArray

var shuffleArray = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// convertArray will convert the simple arrray in a two dimension array in order to match the table that will be drawn

var convertArray = function(array, size) {

	var multiArray = [];
	verificationArray = [];
	var location = 0;

  	// Creates all lines:
  	for(var i=0; i < size; i++){

  		// Creates an empty line
 	    multiArray.push([]);
 	    verificationArray.push([]);

	    // Adds cols to the empty line:
    	multiArray[i].push( new Array(size));
    	verificationArray[i].push( new Array(size));

      	for(var j=0; j < size; j++){
        	// Initializes:
        	multiArray[i][j] = array[location];
        	verificationArray[i][j] = 0;
        	location++;
      	}
  	}

	return multiArray;
}