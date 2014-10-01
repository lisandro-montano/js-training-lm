var max = 0;
var min = 99999999999;
var sum = 0;
var avg = 0;
var numbers = [];

  	function addNumber(){
 		var message;
   	var number = document.getElementById("txtNumber").value;
   	message = document.getElementById("message");
   	message.innerHTML = ""; 

   	try { 
       	if(number == "") throw "is Empty";
       	if(isNaN(number)) throw "not a number";
    }
    catch(err) {
        message.innerHTML = "Input " + err;
        document.getElementById("txtNumber").value = "";
        return false;
   	}

 		numbers.push(number);
 		var cell = document.getElementById("numTable").insertRow("1");
 		cell.innerHTML = number;
 		document.getElementById("txtNumber").value = "";
  		
 	};

 	function clearNumbers(){
 		numbers=[];
 		document.getElementById("txtNumber").value = "";
 		document.getElementById("numTable").innerHTML = ""; 
 		var title = document.getElementById("numTable").insertRow("0");
 		title.innerHTML = "<th>Numbers</th>";
 		document.getElementById("statistics").innerHTML = ""; 
 		var title2 = document.getElementById("statistics").insertRow("0");
 		title2.innerHTML = "<th>Statistics</th>";
 	};

	function doOperations() {

		max = 0;
		min = 99999999999;
		sum = 0;
		avg = 0;

		var message;
	    message = document.getElementById("message");
	   	message.innerHTML = ""; 

	   	try { 
	       	if(numbers.length == 0) throw "No number was introduced yet";
	    }
	    catch(err) {
	        message.innerHTML = err;
	        document.getElementById("txtNumber").value = "";
	        return false;
	   	}

		var index = numbers.length - 1;
		var total = numbers.length;	
		
		var getMax = function(nums, index){		
			var currentNumber = Number(nums[index]);
			
			if (currentNumber > max)
				max = currentNumber;
			
			if (index == 0){
				return max;
			}
			
			return getMax(nums, index - 1);
		};

		var getMin = function(nums, index){		
			var currentNumber = Number(nums[index]);
			
			if (currentNumber < min)
				min = currentNumber;
			
			if (index == 0){
				return min;
			}
			
			return getMin(nums, index - 1);
		};

		var getSum = function(nums, index){		
			var currentNumber = Number(nums[index]);
			
			sum = sum + currentNumber;
			
			if (index == 0){
				return sum;
			}
			
			return getSum(nums, index - 1);
		};

		var getAvg = function(sum, total){		
			avg = sum/total;
			return avg;
		};

		getMax(numbers, index);
		getMin(numbers, index);	
		getSum(numbers, index);
		getAvg(sum, total);	

		document.getElementById("statistics").innerHTML = ""; 
  		var title = document.getElementById("statistics").insertRow("0");
  		title.innerHTML = "<th>Statistics</th>";

		var cell = document.getElementById("statistics").insertRow("1");
  		cell.innerHTML = "Average is : " + avg.toFixed(2);

  		var cell = document.getElementById("statistics").insertRow("1");
  		cell.innerHTML = "Sum is : " + sum.toFixed(2);
  		
  		var cell = document.getElementById("statistics").insertRow("1");
  		cell.innerHTML = "Lower number is : " + min;
  		
  		var cell = document.getElementById("statistics").insertRow("1");
  		cell.innerHTML = "Higher number is : " + max;
	}