var lettersArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "@", "#", "$", "%", "&", "*"];
var tableDefaultSize = 4;
var gameArray = [];
var verificationArray = [];
var option1 = null;
var option2 = null;
var cell1 = [];
var pairsFound = 0;
var size = 0;
var attempts = 0;

function newGame() {

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
       	if((size > 8) || (size < 2)) throw "Please select an even number between 2 and 8";
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

			if (option1 == option2){

				console.log("Congratulations, you found a pair")
				verificationArray[cell1[0]][cell1[1]] = 1;
				verificationArray[row][column] = 1;
				pairsFound++;
				drawTable(gameArray, size);
				if (pairsFound == ((size*size)/2) ) {
					console.log("Congrats. You finished the game")
					confirm("Congratulations. You finished the game in " + attempts + " attempts")
				}
			}
			else {	
				setTimeout('drawTable(gameArray, size)', 1500);
			}
			option1 = null;
			option2 = null;
			cell1 = [];
			attempts++;
			document.getElementById("attempts").innerHTML = attempts;
		}
	}
	return success;
}

function drawTable(array,size) {

	var section1 = '<table border="1">';
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

var newGameArray = function(size) {

	var currentGameArray = [];
	
	var lettersGame = (size * size)/2;
	for (var i = 0; i < lettersGame; i++) {

		currentGameArray.push(lettersArray[i]);
		currentGameArray.push(lettersArray[i]);
	}
	
	return currentGameArray;
};

var shuffleArray = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

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