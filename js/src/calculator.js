var number1 = null;
var result = null;
operation = "";

var clickKey = function(value) {

	number = parseFloat(value);
	
	if (isNaN(number) && (value != ".")) {
		
		if (value == "C") {
			number1 = null;
			result = null;
			operation = "";
			document.getElementById("screen").value = "";
		}
		else {
			screenNumber = parseFloat(document.getElementById("screen").value);
			document.getElementById("screen").value = "";
			
			if (number1 == null) {
				number1 = screenNumber;
				operation = value;
			}
			else {
				switch(operation) {
				    case "+":
				        result = number1 + screenNumber;
				        break;
				    case "-":
				        result = number1 - screenNumber;
				        break;
				    case "*":
				        result = number1 * screenNumber;
				        break;
				    case "/":
				        result = number1 / screenNumber;
				        break;			    
				}
				
				if (value == "=") {
					operation = "";
					number1 = null;
					document.getElementById("screen").value=result;
				}
				else {
					operation = value;
					number1 = result;
					document.getElementById("screen").value = "";
				}
			}
		}
	}
	else {
	document.getElementById("screen").value += value;	
	}
}

var pressKey = function(e) {

	var keynum;

            if(window.event){ // IE					
            	keynum = e.keyCode;
            }
            else
                if(e.which){ // Netscape/Firefox/Opera					
            		keynum = e.which;
                 }
            clickKey(String.fromCharCode(keynum));
}