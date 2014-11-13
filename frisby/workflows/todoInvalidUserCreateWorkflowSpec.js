var frisby = require('frisby');

frisby.globalSetup({
	request: {
		headers: {},
	json: true
	//inspectOnFailure: true

	}
})

frisby.create('Verify Invalid Email message when trying to create an account')
	.post('https://todo.ly/api/user.json', {
	    "Email": "wrongemail.com",
	    "FullName": "Test User",
	    "Password": "pASswoRd"
	  })
	.expectStatus(200)
	.expectJSON({ 
		ErrorMessage: 'Invalid Email Address',
  		ErrorCode: 307 
  	})

.toss()

frisby.create('Verify empty Username')
	.post('https://todo.ly/api/user.json', {
		"Email": "correct@email.com",
	    "FullName": "",
	    "Password": "pASswoRd"
	})
	.expectStatus(200)
	.expectJSON({ 
		ErrorMessage: 'Invalid FullName',
  		ErrorCode: 306 
  	})

.toss()

frisby.create('Verify empty Username')
	.post('https://todo.ly/api/user.json', {
		"Email": "correct@email.com",
	    "FullName": "Test User",
	    "Password": ""
	})
	.expectStatus(200)
	.expectJSON({ 
		ErrorMessage: 'Password too short',
  		ErrorCode: 202 
  	})

.toss()