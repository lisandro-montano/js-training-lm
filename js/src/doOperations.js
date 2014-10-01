var max = 0;
var min = 100000000;

var doOperations = function() {

	var max = 0;
	
	var numbers = arguments;
	
	var getMax = function(nums, index){
	
		var currentNumber = nums[index];
		
		if (currentNumber > max)
			max = currentNumber;
		
		if (index == 0)
			return max;
		
		return getMax(nums, index - 1);
	};
	
	console.log('Max is: ', getMax(numbers, numbers.lenght - 1));
	
}